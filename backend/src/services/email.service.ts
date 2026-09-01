import { db } from '../config/database';

export class EmailService {
  static async getSequencesByCampaign(campaignId: string) {
    return db.query('SELECT * FROM email_sequences WHERE campaign_id = ? ORDER BY step_number ASC', [campaignId]);
  }

  static async saveSequenceStep(campaignId: string, data: { step_number: number; delay_days: number; subject: string; body: string }) {
    const seqId = 'seq-' + Math.random().toString(36).substr(2, 9);
    db.run(
      'INSERT INTO email_sequences (id, campaign_id, step_number, delay_days, subject, body) VALUES (?, ?, ?, ?, ?, ?)',
      [seqId, campaignId, data.step_number, data.delay_days || 0, data.subject, data.body]
    );
    return db.get('SELECT * FROM email_sequences WHERE id = ?', [seqId]);
  }

  static async updateSequenceStep(sequenceId: string, data: { delay_days?: number; subject?: string; body?: string }) {
    db.run(
      `UPDATE email_sequences SET 
        delay_days = COALESCE(?, delay_days),
        subject = COALESCE(?, subject),
        body = COALESCE(?, body)
       WHERE id = ?`,
      [data.delay_days, data.subject, data.body, sequenceId]
    );
    return db.get('SELECT * FROM email_sequences WHERE id = ?', [sequenceId]);
  }

  static async deleteSequenceStep(sequenceId: string) {
    db.run('DELETE FROM email_sequences WHERE id = ?', [sequenceId]);
    return { success: true };
  }

  static async simulateEmailSend(campaignId: string) {
    const campaign: any = db.get('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
    if (!campaign) throw new Error('Campaign not found');

    const sequences: any[] = db.query('SELECT * FROM email_sequences WHERE campaign_id = ? ORDER BY step_number ASC', [campaignId]);
    if (sequences.length === 0) throw new Error('No email sequences found for this campaign');

    const pendingLeads: any[] = db.query(
      `SELECT cl.*, l.email, l.first_name, l.company 
       FROM campaign_leads cl 
       JOIN leads l ON cl.lead_id = l.id 
       WHERE cl.campaign_id = ? AND cl.status = 'Pending'`,
      [campaignId]
    );

    if (pendingLeads.length === 0) {
      return { message: 'All leads in campaign have already received emails.', sentCount: 0 };
    }

    const firstSeq = sequences[0];
    let sentCount = 0;
    const now = new Date().toISOString().replace('T', ' ').substr(0, 19);

    for (const lead of pendingLeads) {
      const emailId = 'em-' + Math.random().toString(36).substr(2, 9);
      
      // Insert email record
      db.run(
        'INSERT INTO emails (id, campaign_id, sequence_id, lead_id, status, sent_at) VALUES (?, ?, ?, ?, ?, ?)',
        [emailId, campaignId, firstSeq.id, lead.lead_id, 'sent', now]
      );

      // Update campaign_leads status
      db.run(
        'UPDATE campaign_leads SET status = ?, sent_at = ? WHERE id = ?',
        ['Sent', now, lead.id]
      );

      sentCount++;
    }

    return { success: true, message: `Successfully simulated sending ${sentCount} emails.`, sentCount };
  }

  static async trackEvent(emailId: string, eventType: 'open' | 'click' | 'reply' | 'bounce', metadata?: string) {
    const email: any = db.get('SELECT * FROM emails WHERE id = ?', [emailId]);
    if (!email) throw new Error('Email not found');

    const eventId = 'ev-' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString().replace('T', ' ').substr(0, 19);

    db.run(
      'INSERT INTO email_events (id, email_id, event_type, timestamp, metadata) VALUES (?, ?, ?, ?, ?)',
      [eventId, emailId, eventType, now, metadata || `Simulated ${eventType} event`]
    );

    // Update campaign lead status to highest milestone
    const statusMap: Record<string, string> = {
      open: 'Opened',
      click: 'Clicked',
      reply: 'Replied',
      bounce: 'Bounced'
    };

    if (statusMap[eventType]) {
      db.run(
        'UPDATE campaign_leads SET status = ? WHERE campaign_id = ? AND lead_id = ?',
        [statusMap[eventType], email.campaign_id, email.lead_id]
      );
    }

    return db.get('SELECT * FROM email_events WHERE id = ?', [eventId]);
  }

  static async getEmailEvents(campaignId?: string) {
    if (campaignId) {
      return db.query(
        `SELECT ee.*, e.campaign_id, e.lead_id, l.email as lead_email, l.first_name, l.last_name
         FROM email_events ee
         JOIN emails e ON ee.email_id = e.id
         JOIN leads l ON e.lead_id = l.id
         WHERE e.campaign_id = ?
         ORDER BY ee.timestamp DESC`,
        [campaignId]
      );
    }
    return db.query(
      `SELECT ee.*, e.campaign_id, e.lead_id, l.email as lead_email, l.first_name, l.last_name
       FROM email_events ee
       JOIN emails e ON ee.email_id = e.id
       JOIN leads l ON e.lead_id = l.id
       ORDER BY ee.timestamp DESC
       LIMIT 50`
    );
  }
}
