import { db } from '../config/database';
import { getPagination, paginateData } from '../utils/pagination';

export class CampaignService {
  static async getCampaigns(userId: string, queryParams: any) {
    const { page, limit, offset } = getPagination(queryParams.page, queryParams.limit);
    const search = queryParams.search ? `%${queryParams.search}%` : null;

    let sql = 'SELECT * FROM campaigns WHERE user_id = ?';
    const params: any[] = [userId];

    if (search) {
      sql += ' AND (name LIKE ? OR subject_line LIKE ?)';
      params.push(search, search);
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const totalRow: any = db.get(countSql, params);
    const total = totalRow ? totalRow.total : 0;

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const campaigns: any[] = db.query(sql, params);

    // Attach performance metrics to each campaign
    const enrichedCampaigns = campaigns.map((c) => {
      const stats: any = db.get(
        `SELECT 
           COUNT(cl.id) as total_leads,
           SUM(CASE WHEN cl.status IN ('Sent', 'Opened', 'Clicked', 'Replied') THEN 1 ELSE 0 END) as sent_count,
           SUM(CASE WHEN cl.status IN ('Opened', 'Clicked', 'Replied') THEN 1 ELSE 0 END) as open_count,
           SUM(CASE WHEN cl.status IN ('Clicked', 'Replied') THEN 1 ELSE 0 END) as click_count,
           SUM(CASE WHEN cl.status = 'Replied' THEN 1 ELSE 0 END) as reply_count
         FROM campaign_leads cl
         WHERE cl.campaign_id = ?`,
        [c.id]
      );

      const sequenceCount: any = db.get('SELECT COUNT(*) as total FROM email_sequences WHERE campaign_id = ?', [c.id]);

      return {
        ...c,
        sequenceStepsCount: sequenceCount ? sequenceCount.total : 0,
        metrics: {
          totalLeads: stats?.total_leads || 0,
          sent: stats?.sent_count || 0,
          opened: stats?.open_count || 0,
          clicked: stats?.click_count || 0,
          replied: stats?.reply_count || 0,
          openRate: stats?.sent_count ? Math.round((stats.open_count / stats.sent_count) * 100) : 0,
          clickRate: stats?.sent_count ? Math.round((stats.click_count / stats.sent_count) * 100) : 0,
          replyRate: stats?.sent_count ? Math.round((stats.reply_count / stats.sent_count) * 100) : 0
        }
      };
    });

    return paginateData(enrichedCampaigns, total, { page, limit, offset });
  }

  static async getCampaignById(userId: string, campaignId: string) {
    const campaign: any = db.get('SELECT * FROM campaigns WHERE id = ? AND user_id = ?', [campaignId, userId]);
    if (!campaign) throw new Error('Campaign not found');

    // Sequences
    const sequences = db.query('SELECT * FROM email_sequences WHERE campaign_id = ? ORDER BY step_number ASC', [campaignId]);

    // Campaign Leads
    const leads = db.query(
      `SELECT cl.id as campaign_lead_id, cl.status as campaign_lead_status, cl.sent_at, l.*
       FROM campaign_leads cl
       JOIN leads l ON cl.lead_id = l.id
       WHERE cl.campaign_id = ?`,
      [campaignId]
    );

    // Metric Summary
    const stats: any = db.get(
      `SELECT 
         COUNT(cl.id) as total_leads,
         SUM(CASE WHEN cl.status IN ('Sent', 'Opened', 'Clicked', 'Replied') THEN 1 ELSE 0 END) as sent_count,
         SUM(CASE WHEN cl.status IN ('Opened', 'Clicked', 'Replied') THEN 1 ELSE 0 END) as open_count,
         SUM(CASE WHEN cl.status IN ('Clicked', 'Replied') THEN 1 ELSE 0 END) as click_count,
         SUM(CASE WHEN cl.status = 'Replied' THEN 1 ELSE 0 END) as reply_count
       FROM campaign_leads cl
       WHERE cl.campaign_id = ?`,
      [campaignId]
    );

    const metrics = {
      totalLeads: stats?.total_leads || 0,
      sent: stats?.sent_count || 0,
      opened: stats?.open_count || 0,
      clicked: stats?.click_count || 0,
      replied: stats?.reply_count || 0,
      openRate: stats?.sent_count ? Math.round((stats.open_count / stats.sent_count) * 100) : 0,
      clickRate: stats?.sent_count ? Math.round((stats.click_count / stats.sent_count) * 100) : 0,
      replyRate: stats?.sent_count ? Math.round((stats.reply_count / stats.sent_count) * 100) : 0
    };

    return { ...campaign, sequences, leads, metrics };
  }

  static async createCampaign(userId: string, data: any) {
    const campaignId = 'c-' + Math.random().toString(36).substr(2, 9);
    const status = data.status || 'Active';

    db.run(
      'INSERT INTO campaigns (id, user_id, name, subject_line, status) VALUES (?, ?, ?, ?, ?)',
      [campaignId, userId, data.name, data.subject_line, status]
    );

    // Attach sequence steps
    if (Array.isArray(data.sequences)) {
      data.sequences.forEach((seq: any, index: number) => {
        const seqId = 'seq-' + Math.random().toString(36).substr(2, 9);
        db.run(
          'INSERT INTO email_sequences (id, campaign_id, step_number, delay_days, subject, body) VALUES (?, ?, ?, ?, ?, ?)',
          [seqId, campaignId, index + 1, seq.delay_days || 0, seq.subject || data.subject_line, seq.body || '']
        );
      });
    }

    // Attach target lead IDs
    if (Array.isArray(data.leadIds)) {
      data.leadIds.forEach((leadId: string) => {
        const clId = 'cl-' + Math.random().toString(36).substr(2, 9);
        db.run(
          'INSERT INTO campaign_leads (id, campaign_id, lead_id, status, sent_at) VALUES (?, ?, ?, ?, ?)',
          [clId, campaignId, leadId, 'Pending', null]
        );
      });
    }

    return this.getCampaignById(userId, campaignId);
  }

  static async updateCampaignStatus(userId: string, campaignId: string, status: string) {
    const campaign: any = db.get('SELECT * FROM campaigns WHERE id = ? AND user_id = ?', [campaignId, userId]);
    if (!campaign) throw new Error('Campaign not found');

    db.run('UPDATE campaigns SET status = ? WHERE id = ?', [status, campaignId]);
    return { success: true, status };
  }

  static async deleteCampaign(userId: string, campaignId: string) {
    const campaign: any = db.get('SELECT * FROM campaigns WHERE id = ? AND user_id = ?', [campaignId, userId]);
    if (!campaign) throw new Error('Campaign not found');

    db.run('DELETE FROM campaigns WHERE id = ?', [campaignId]);
    return { success: true, message: 'Campaign deleted' };
  }
}
