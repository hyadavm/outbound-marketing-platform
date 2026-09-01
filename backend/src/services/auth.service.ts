import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { signToken } from '../utils/jwt';

export class AuthService {
  static async register(data: { name: string; email: string; password: string; company?: string }) {
    const existing = db.get('SELECT * FROM users WHERE email = ?', [data.email]);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const userId = 'u-' + Math.random().toString(36).substr(2, 9);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const company = data.company || 'My Marketing Agency';

    db.run(
      'INSERT INTO users (id, name, email, password_hash, company, role) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, data.name, data.email, passwordHash, company, 'admin']
    );

    const user = { id: userId, name: data.name, email: data.email, company, role: 'admin' };
    const token = signToken({ userId, email: user.email, role: user.role });

    return { user, token };
  }

  static async login(data: { email: string; password: string }) {
    const user: any = db.get('SELECT * FROM users WHERE email = ?', [data.email]);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role
    };

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return { user: userInfo, token };
  }

  static async getUserProfile(userId: string) {
    const user: any = db.get('SELECT id, name, email, company, role, created_at FROM users WHERE id = ?', [userId]);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static async updateProfile(userId: string, data: { name?: string; company?: string }) {
    const user: any = db.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) throw new Error('User not found');

    const newName = data.name || user.name;
    const newCompany = data.company || user.company;

    db.run('UPDATE users SET name = ?, company = ? WHERE id = ?', [newName, newCompany, userId]);
    return this.getUserProfile(userId);
  }
}
