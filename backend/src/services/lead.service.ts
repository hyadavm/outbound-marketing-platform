import { db } from '../config/database';
import { getPagination, paginateData } from '../utils/pagination';

export class LeadService {
  static async getLeads(userId: string, queryParams: any) {
    const { page, limit, offset } = getPagination(queryParams.page, queryParams.limit);
    const search = queryParams.search ? `%${queryParams.search}%` : null;
    const status = queryParams.status || null;

    let sql = 'SELECT * FROM leads WHERE user_id = ?';
    const params: any[] = [userId];

    if (search) {
      sql += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)';
      params.push(search, search, search, search);
    }

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    // Count total matching
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const totalRow: any = db.get(countSql, params);
    const total = totalRow ? totalRow.total : 0;

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const leads = db.query(sql, params);
    return paginateData(leads, total, { page, limit, offset });
  }

  static async getLeadById(userId: string, leadId: string) {
    const lead: any = db.get('SELECT * FROM leads WHERE id = ? AND user_id = ?', [leadId, userId]);
    if (!lead) throw new Error('Lead not found');

    // Get lead campaign history & email events
    const campaignHistory = db.query(
      `SELECT cl.*, c.name as campaign_name, c.subject_line 
       FROM campaign_leads cl 
       JOIN campaigns c ON cl.campaign_id = c.id 
       WHERE cl.lead_id = ?`,
      [leadId]
    );

    const emailHistory = db.query(
      `SELECT e.*, es.subject, es.step_number
       FROM emails e
       JOIN email_sequences es ON e.sequence_id = es.id
       WHERE e.lead_id = ?
       ORDER BY e.sent_at DESC`,
      [leadId]
    );

    return { ...lead, campaignHistory, emailHistory };
  }

  static async createLead(userId: string, data: any) {
    const leadId = 'l-' + Math.random().toString(36).substr(2, 9);
    const score = data.score !== undefined ? data.score : 50;
    const status = data.status || 'New';

    db.run(
      `INSERT INTO leads (id, user_id, first_name, last_name, email, company, title, phone, status, score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        leadId,
        userId,
        data.first_name,
        data.last_name,
        data.email,
        data.company || '',
        data.title || '',
        data.phone || '',
        status,
        score
      ]
    );

    return db.get('SELECT * FROM leads WHERE id = ?', [leadId]);
  }

  static async updateLead(userId: string, leadId: string, data: any) {
    const existing: any = db.get('SELECT * FROM leads WHERE id = ? AND user_id = ?', [leadId, userId]);
    if (!existing) throw new Error('Lead not found');

    db.run(
      `UPDATE leads SET 
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        company = COALESCE(?, company),
        title = COALESCE(?, title),
        phone = COALESCE(?, phone),
        status = COALESCE(?, status),
        score = COALESCE(?, score)
       WHERE id = ? AND user_id = ?`,
      [
        data.first_name,
        data.last_name,
        data.email,
        data.company,
        data.title,
        data.phone,
        data.status,
        data.score,
        leadId,
        userId
      ]
    );

    return db.get('SELECT * FROM leads WHERE id = ?', [leadId]);
  }

  static async deleteLead(userId: string, leadId: string) {
    const existing: any = db.get('SELECT * FROM leads WHERE id = ? AND user_id = ?', [leadId, userId]);
    if (!existing) throw new Error('Lead not found');

    db.run('DELETE FROM leads WHERE id = ?', [leadId]);
    return { success: true, message: 'Lead deleted successfully' };
  }
}
