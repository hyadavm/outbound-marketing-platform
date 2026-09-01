export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  created_at?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Unsubscribed';

export interface Lead {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  title?: string;
  phone?: string;
  status: LeadStatus;
  score: number;
  created_at: string;
}

export type CampaignStatus = 'Draft' | 'Scheduled' | 'Active' | 'Paused' | 'Completed';

export interface CampaignMetrics {
  totalLeads: number;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  subject_line: string;
  status: CampaignStatus;
  created_at: string;
  sequenceStepsCount?: number;
  metrics?: CampaignMetrics;
}

export interface EmailSequence {
  id: string;
  campaign_id: string;
  step_number: number;
  delay_days: number;
  subject: string;
  body: string;
  created_at?: string;
}

export interface EmailEvent {
  id: string;
  email_id: string;
  event_type: 'open' | 'click' | 'reply' | 'bounce';
  timestamp: string;
  metadata?: string;
  first_name?: string;
  last_name?: string;
  lead_email?: string;
  campaign_name?: string;
}

export interface AnalyticsOverview {
  summary: {
    totalLeads: number;
    totalCampaigns: number;
    activeCampaigns: number;
    totalEmailsSent: number;
    openRate: number;
    clickRate: number;
    replyRate: number;
    bounced: number;
  };
  leadStatusDistribution: { status: string; count: number }[];
  timeSeriesData: { date: string; sent: number; opened: number; clicked: number; replied: number }[];
  recentActivity: EmailEvent[];
}
