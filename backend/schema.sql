-- MySQL Schema for Outbound Marketing & Lead Management Platform

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  company VARCHAR(255) DEFAULT 'Marketing Agency',
  role VARCHAR(50) DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  title VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'New', -- New, Contacted, Qualified, Converted, Unsubscribed
  score INT DEFAULT 50,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS campaigns (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject_line VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft', -- Draft, Scheduled, Active, Paused, Completed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS campaign_leads (
  id VARCHAR(36) PRIMARY KEY,
  campaign_id VARCHAR(36) NOT NULL,
  lead_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Sent, Opened, Clicked, Replied, Bounced
  sent_at DATETIME,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_sequences (
  id VARCHAR(36) PRIMARY KEY,
  campaign_id VARCHAR(36) NOT NULL,
  step_number INT NOT NULL,
  delay_days INT DEFAULT 0,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS emails (
  id VARCHAR(36) PRIMARY KEY,
  campaign_id VARCHAR(36) NOT NULL,
  sequence_id VARCHAR(36) NOT NULL,
  lead_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) DEFAULT 'queued', -- queued, sent, failed
  sent_at DATETIME,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (sequence_id) REFERENCES email_sequences(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_events (
  id VARCHAR(36) PRIMARY KEY,
  email_id VARCHAR(36) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- open, click, reply, bounce
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT,
  FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
);
