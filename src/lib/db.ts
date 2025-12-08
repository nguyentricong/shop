// SQLite database for production
import Database from 'better-sqlite3';
import path from 'path';

export interface Order {
  id: string;
  email: string;
  name: string;
  licenseKey: string;
  paymentMethod: 'momo' | 'bank' | 'paypal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface License {
  key: string;
  email: string;
  orderId: string;
  activatedAt?: Date;
  expiryAt?: Date;
  plan: 'lifetime' | '1year' | '3month';
  active: boolean;
}

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'data', 'shop.db');
const sqlite = new Database(dbPath);

// Create tables if not exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    licenseKey TEXT UNIQUE NOT NULL,
    paymentMethod TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS licenses (
    key TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    orderId TEXT NOT NULL,
    activatedAt TEXT,
    expiryAt TEXT,
    plan TEXT NOT NULL,
    active INTEGER NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id)
  );

  CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
  CREATE INDEX IF NOT EXISTS idx_orders_licenseKey ON orders(licenseKey);
  CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);
`);

// Orders API
export const db = {
  // Orders
  createOrder(order: Omit<Order, 'id' | 'createdAt'>) {
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    
    const stmt = sqlite.prepare(`
      INSERT INTO orders (id, email, name, licenseKey, paymentMethod, amount, currency, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, order.email, order.name, order.licenseKey, order.paymentMethod, order.amount, order.currency, order.status, createdAt);
    
    return {
      id,
      ...order,
      createdAt: new Date(createdAt)
    } as Order;
  },

  getOrder(id: string) {
    const stmt = sqlite.prepare('SELECT * FROM orders WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return undefined;
    return { ...row, createdAt: new Date(row.createdAt) } as Order;
  },

  getOrderByEmail(email: string) {
    const stmt = sqlite.prepare('SELECT * FROM orders WHERE email = ?');
    const rows = stmt.all(email) as any[];
    return rows.map(row => ({ ...row, createdAt: new Date(row.createdAt) } as Order));
  },

  getOrderByLicenseKey(licenseKey: string) {
    const stmt = sqlite.prepare('SELECT * FROM orders WHERE licenseKey = ?');
    const row = stmt.get(licenseKey) as any;
    if (!row) return undefined;
    return { ...row, createdAt: new Date(row.createdAt) } as Order;
  },

  getAllOrders() {
    const stmt = sqlite.prepare('SELECT * FROM orders');
    const rows = stmt.all() as any[];
    return rows.map(row => ({ ...row, createdAt: new Date(row.createdAt) } as Order));
  },

  // Licenses
  createLicense(license: License) {
    const stmt = sqlite.prepare(`
      INSERT INTO licenses (key, email, orderId, activatedAt, expiryAt, plan, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      license.key,
      license.email,
      license.orderId,
      license.activatedAt?.toISOString() || null,
      license.expiryAt?.toISOString() || null,
      license.plan,
      license.active ? 1 : 0
    );
    
    return license;
  },

  getLicense(key: string) {
    const stmt = sqlite.prepare('SELECT * FROM licenses WHERE key = ?');
    const row = stmt.get(key) as any;
    if (!row) return undefined;
    
    return {
      ...row,
      activatedAt: row.activatedAt ? new Date(row.activatedAt) : undefined,
      expiryAt: row.expiryAt ? new Date(row.expiryAt) : undefined,
      active: row.active === 1
    } as License;
  },

  validateLicense(key: string) {
    const license = this.getLicense(key);
    if (!license) return { valid: false, message: 'License not found' };
    
    if (!license.active) return { valid: false, message: 'License is inactive' };
    
    if (license.expiryAt && new Date() > license.expiryAt) {
      return { valid: false, message: 'License has expired' };
    }
    
    return { valid: true, message: 'License is valid' };
  },

  activateLicense(key: string) {
    const license = this.getLicense(key);
    if (!license) return false;
    
    const stmt = sqlite.prepare(`
      UPDATE licenses SET active = 1, activatedAt = ? WHERE key = ?
    `);
    
    stmt.run(new Date().toISOString(), key);
    return true;
  },

  getAllLicenses() {
    const stmt = sqlite.prepare('SELECT * FROM licenses');
    const rows = stmt.all() as any[];
    return rows.map(row => ({
      ...row,
      activatedAt: row.activatedAt ? new Date(row.activatedAt) : undefined,
      expiryAt: row.expiryAt ? new Date(row.expiryAt) : undefined,
      active: row.active === 1
    } as License));
  }
};

// Mock data for testing
export function initializeMockData() {
  const mockLicenseKey = 'ADBLOCK-PRO-ABC123DEF456';
  const mockOrder: Order = {
    id: '1',
    email: 'user@example.com',
    name: 'Nguyễn Văn A',
    licenseKey: mockLicenseKey,
    paymentMethod: 'momo',
    amount: 49000,
    currency: 'VND',
    status: 'completed',
    createdAt: new Date('2025-01-09'),
  };

  const mockLicense: License = {
    key: mockLicenseKey,
    email: 'user@example.com',
    orderId: '1',
    plan: 'lifetime',
    active: true,
  };

  // Check if data already exists
  const existing = sqlite.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (existing.count === 0) {
    const orderStmt = sqlite.prepare(`
      INSERT INTO orders (id, email, name, licenseKey, paymentMethod, amount, currency, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    orderStmt.run(
      mockOrder.id,
      mockOrder.email,
      mockOrder.name,
      mockOrder.licenseKey,
      mockOrder.paymentMethod,
      mockOrder.amount,
      mockOrder.currency,
      mockOrder.status,
      mockOrder.createdAt.toISOString()
    );

    const licenseStmt = sqlite.prepare(`
      INSERT INTO licenses (key, email, orderId, activatedAt, expiryAt, plan, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    licenseStmt.run(
      mockLicense.key,
      mockLicense.email,
      mockLicense.orderId,
      null,
      null,
      mockLicense.plan,
      1
    );
  }
}

// Initialize with mock data
if (typeof window === 'undefined') {
  initializeMockData();
}
