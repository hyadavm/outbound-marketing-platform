import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve(__dirname, '../../../outbound.db');
const sqlite = new Database(dbPath);

// Enable foreign keys and WAL mode for high performance
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('journal_mode = WAL');

export const db = {
  query: (sql: string, params: any[] = []) => {
    const stmt = sqlite.prepare(sql);
    return stmt.all(...params);
  },
  get: (sql: string, params: any[] = []) => {
    const stmt = sqlite.prepare(sql);
    return stmt.get(...params);
  },
  run: (sql: string, params: any[] = []) => {
    const stmt = sqlite.prepare(sql);
    return stmt.run(...params);
  },
  exec: (sql: string) => {
    return sqlite.exec(sql);
  }
};

export const initDatabase = async () => {
  console.log('Initializing Database at:', dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      company TEXT DEFAULT 'Marketing Agency',
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      title TEXT,
      phone TEXT,
      status TEXT DEFAULT 'New',
      score INTEGER DEFAULT 50,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      subject_line TEXT NOT NULL,
      status TEXT DEFAULT 'Draft',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS campaign_leads (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      lead_id TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      sent_at TEXT,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS email_sequences (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      delay_days INTEGER DEFAULT 0,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      sequence_id TEXT NOT NULL,
      lead_id TEXT NOT NULL,
      status TEXT DEFAULT 'queued',
      sent_at TEXT,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
      FOREIGN KEY (sequence_id) REFERENCES email_sequences(id) ON DELETE CASCADE,
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS email_events (
      id TEXT PRIMARY KEY,
      email_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      metadata TEXT,
      FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_campaign_leads_campaign_id ON campaign_leads(campaign_id);
  `);

  // Seed default admin user if missing
  let defaultUser: any = db.get(`SELECT * FROM users WHERE email = ?`, ['alex@outboundio.com']);
  if (!defaultUser) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const userId = 'u-default-101';
    db.run(
      `INSERT INTO users (id, name, email, password_hash, company, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, 'Alex Morgan', 'alex@outboundio.com', passwordHash, 'Apex Growth Media', 'admin']
    );
    defaultUser = { id: userId };
  }

  const userId = defaultUser.id;

  // Check current lead count
  const leadCountRow: any = db.get('SELECT COUNT(*) as count FROM leads WHERE user_id = ?', [userId]);
  const currentCount = leadCountRow ? leadCountRow.count : 0;

  if (currentCount < 5000) {
    const needed = 5000 - currentCount;
    console.log(`Seeding ${needed} additional leads to reach 5,000 lead milestone...`);

    const firstNames = [
      'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
      'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
      'Christopher', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Sandra', 'Mark', 'Margaret',
      'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
      'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Timothy', 'Stephanie',
      'Ethan', 'Chloe', 'Alexander', 'Sophia', 'Mason', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Harper'
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
      'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
      'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
    ];

    const companies = [
      'TechFlow Inc', 'Apex Solutions', 'CloudPulse', 'Nexus Global', 'InnovateAI', 'DataVertex', 'ScaleStack',
      'CyberGrid', 'VentureByte', 'HyperLink Systems', 'OmniSoft', 'QuantumOps', 'VelocityLab', 'PrimeCore',
      'SynergyX', 'AstraCloud', 'BeaconLabs', 'HorizonMedia', 'PulseLogic', 'EnterpriseShift', 'GrowthMatrix',
      'LogicCraft', 'StratosSystems', 'TitanWorks', 'VisionaryGroup', 'PinnacleNet', 'CodeSphere', 'DynamicMedia',
      'CatalystLabs', 'FutureCorp', 'StreamLine Tech', 'InfiniteData', 'ElevateTech', 'FrontierAI', 'VantagePoint'
    ];

    const titles = [
      'VP of Sales', 'Chief Technology Officer', 'Head of Growth', 'Director of Engineering', 'Senior Product Manager',
      'Marketing Lead', 'Demand Generation Director', 'CEO & Founder', 'Business Development Manager', 'Operations Lead',
      'Sales Operations Manager', 'Enterprise Account Executive', 'Growth Lead', 'Revenue Operations Director'
    ];

    const statuses: ('New' | 'Contacted' | 'Qualified' | 'Converted' | 'Unsubscribed')[] = [
      'New', 'Contacted', 'Qualified', 'Converted', 'Unsubscribed'
    ];

    const insertLeadStmt = sqlite.prepare(`
      INSERT INTO leads (id, user_id, first_name, last_name, email, company, title, phone, status, score, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'))
    `);

    sqlite.transaction(() => {
      for (let i = 0; i < needed; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const comp = companies[Math.floor(Math.random() * companies.length)];
        const title = titles[Math.floor(Math.random() * titles.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const score = Math.floor(Math.random() * 60) + 40; // 40-100
        const leadId = `l-bulk-${currentCount + i + 1}`;
        const domain = comp.toLowerCase().replace(/[^a-z]/g, '') + '.io';
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${currentCount + i}@${domain}`;
        const phone = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const daysAgo = Math.floor(Math.random() * 90);

        insertLeadStmt.run(leadId, userId, fn, ln, email, comp, title, phone, status, score, daysAgo);
      }
    })();

    console.log('Successfully seeded database with 5,000+ leads!');
  }

  // Ensure default campaign exists
  let defaultCampaign: any = db.get('SELECT * FROM campaigns WHERE user_id = ? LIMIT 1', [userId]);
  if (!defaultCampaign) {
    const campaignId = 'c-001';
    db.run(
      `INSERT INTO campaigns (id, user_id, name, subject_line, status) VALUES (?, ?, ?, ?, ?)`,
      [campaignId, userId, 'Q3 Enterprise SaaS Outreach', 'Quick question about {{company}}\'s growth strategy', 'Active']
    );
    defaultCampaign = { id: campaignId };
  }

  // Ensure sequence exists
  const existingSeq = db.get('SELECT * FROM email_sequences WHERE campaign_id = ? LIMIT 1', [defaultCampaign.id]);
  if (!existingSeq) {
    db.run(
      `INSERT INTO email_sequences (id, campaign_id, step_number, delay_days, subject, body) VALUES (?, ?, ?, ?, ?, ?)`,
      ['seq-001', defaultCampaign.id, 1, 0, 'Quick question about {{company}}\'s growth strategy', 'Hi {{first_name}},\n\nI came across {{company}} and was really impressed by your recent expansion.\n\nWould you be open to a quick 10-minute chat this Thursday?\n\nBest,\nAlex']
    );
    db.run(
      `INSERT INTO email_sequences (id, campaign_id, step_number, delay_days, subject, body) VALUES (?, ?, ?, ?, ?, ?)`,
      ['seq-002', defaultCampaign.id, 2, 3, 'Following up on my previous email', 'Hi {{first_name}},\n\nJust wanted to bump this to the top of your inbox.\n\nBest,\nAlex']
    );
  }
};
