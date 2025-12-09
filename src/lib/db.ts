import crypto from 'crypto';
import { Pool } from 'pg';

export type PaymentMethod = 'momo' | 'vnpay' | 'bank' | 'stripe';
export type OrderStatus = 'pending' | 'completed' | 'failed';
export type LicensePlan = 'lifetime' | '1year' | '3month';
export type AuthProvider = 'credentials' | 'google';

export interface Order {
  id: string;
  email: string;
  name: string;
  licenseKey: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
}

export interface License {
  key: string;
  email: string;
  orderId: string;
  activatedAt?: Date;
  expiryAt?: Date;
  plan: LicensePlan;
  active: boolean;
  maxDevices?: number;
}

export interface LicenseActivation {
  id: string;
  licenseKey: string;
  deviceId: string;
  deviceName?: string;
  activatedAt: Date;
  lastUsedAt: Date;
}

export interface TrialUser {
  id: string;
  deviceId: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash?: string | null;
  provider: AuthProvider;
  createdAt: Date | string;
}

// -----------------------------------------------------------------------------
// Postgres Client Setup
// -----------------------------------------------------------------------------

const connectionString = process.env.DATABASE_URL;
if (!connectionString && typeof window === 'undefined') {
  console.warn('DATABASE_URL is not set. Please configure it in .env.local for Postgres.');
}

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
  : undefined;

// Ensure schema exists (runs once per cold start)
const initPromise = (async () => {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      license_key TEXT UNIQUE NOT NULL,
      payment_method TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS licenses (
      key TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      order_id TEXT NOT NULL REFERENCES orders(id),
      activated_at TIMESTAMPTZ,
      expiry_at TIMESTAMPTZ,
      plan TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT FALSE,
      max_devices INTEGER NOT NULL DEFAULT 3
    );

    CREATE TABLE IF NOT EXISTS license_activations (
      id TEXT PRIMARY KEY,
      license_key TEXT NOT NULL REFERENCES licenses(key),
      device_id TEXT NOT NULL,
      device_name TEXT,
      activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(license_key, device_id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT,
      provider TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS trial_users (
      id TEXT PRIMARY KEY,
      device_id TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
    CREATE INDEX IF NOT EXISTS idx_orders_license_key ON orders(license_key);
    CREATE INDEX IF NOT EXISTS idx_licenses_email ON licenses(email);
    CREATE INDEX IF NOT EXISTS idx_license_activations_key ON license_activations(license_key);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_trial_users_device ON trial_users(device_id);
  `);
})();

// Helpers to map DB rows -> domain models
interface DbOrderRow {
  id: string;
  email: string;
  name: string;
  license_key: string;
  payment_method: PaymentMethod;
  amount: number;
  currency: string;
  status: OrderStatus;
  created_at: Date;
}

interface DbLicenseRow {
  key: string;
  email: string;
  order_id: string;
  activated_at: Date | null;
  expiry_at: Date | null;
  plan: LicensePlan;
  active: boolean;
  max_devices?: number;
}

interface DbLicenseActivationRow {
  id: string;
  license_key: string;
  device_id: string;
  device_name: string | null;
  activated_at: Date;
  last_used_at: Date;
}

interface DbUserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  provider: AuthProvider;
  created_at: Date;
}

interface DbTrialUserRow {
  id: string;
  device_id: string;
  created_at: Date;
}

function mapOrder(row?: DbOrderRow | null): Order | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    licenseKey: row.license_key,
    paymentMethod: row.payment_method,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    createdAt: new Date(row.created_at)
  };
}

function mapLicense(row?: DbLicenseRow | null): License | undefined {
  if (!row) return undefined;
  return {
    key: row.key,
    email: row.email,
    orderId: row.order_id,
    activatedAt: row.activated_at ? new Date(row.activated_at) : undefined,
    expiryAt: row.expiry_at ? new Date(row.expiry_at) : undefined,
    plan: row.plan,
    active: row.active,
    maxDevices: row.max_devices || 3
  };
}

function mapLicenseActivation(row?: DbLicenseActivationRow | null): LicenseActivation | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    licenseKey: row.license_key,
    deviceId: row.device_id,
    deviceName: row.device_name || undefined,
    activatedAt: new Date(row.activated_at),
    lastUsedAt: new Date(row.last_used_at)
  };
}

function mapUser(row?: DbUserRow | null): User | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    provider: row.provider,
    createdAt: new Date(row.created_at)
  };
}

function mapTrialUser(row?: DbTrialUserRow | null): TrialUser | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    deviceId: row.device_id,
    createdAt: new Date(row.created_at)
  };
}

// -----------------------------------------------------------------------------
// Public DB API (async)
// -----------------------------------------------------------------------------
export const db = {
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const id = `ord_${crypto.randomUUID()}`;
    const { rows } = await pool.query<DbOrderRow>(
      `INSERT INTO orders (id, email, name, license_key, payment_method, amount, currency, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, order.email, order.name, order.licenseKey, order.paymentMethod, order.amount, order.currency, order.status]
    );
    return mapOrder(rows[0]) as Order;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbOrderRow>(
      `UPDATE orders SET status = $2 WHERE id = $1 RETURNING *`,
      [id, status]
    );
    return mapOrder(rows[0]);
  },

  async getOrder(id: string): Promise<Order | undefined> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbOrderRow>(`SELECT * FROM orders WHERE id = $1 LIMIT 1`, [id]);
    return mapOrder(rows[0]);
  },

  async getOrderByEmail(email: string): Promise<Order[]> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbOrderRow>(`SELECT * FROM orders WHERE email = $1 ORDER BY created_at DESC`, [email]);
    return rows.map(mapOrder).filter(Boolean) as Order[];
  },

  async getOrderByLicenseKey(licenseKey: string): Promise<Order | undefined> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbOrderRow>(`SELECT * FROM orders WHERE license_key = $1 LIMIT 1`, [licenseKey]);
    return mapOrder(rows[0]);
  },

  async getAllOrders(): Promise<Order[]> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbOrderRow>(`SELECT * FROM orders ORDER BY created_at DESC`);
    return rows.map(mapOrder).filter(Boolean) as Order[];
  },

  async createLicense(license: License): Promise<License> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbLicenseRow>(
      `INSERT INTO licenses (key, email, order_id, activated_at, expiry_at, plan, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        license.key,
        license.email,
        license.orderId,
        license.activatedAt || null,
        license.expiryAt || null,
        license.plan,
        license.active
      ]
    );
    return mapLicense(rows[0]) as License;
  },

  async getLicense(key: string): Promise<License | undefined> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbLicenseRow>(`SELECT * FROM licenses WHERE key = $1 LIMIT 1`, [key]);
    return mapLicense(rows[0]);
  },

  async validateLicense(key: string): Promise<{ valid: boolean; message: string }> {
    const license = await this.getLicense(key);
    if (!license) return { valid: false, message: 'License not found' };
    if (!license.active) return { valid: false, message: 'License is inactive' };
    if (license.expiryAt && new Date() > license.expiryAt) {
      return { valid: false, message: 'License has expired' };
    }
    return { valid: true, message: 'License is valid' };
  },

  async activateLicense(key: string): Promise<boolean> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const now = new Date();
    const { rowCount } = await pool.query(
      `UPDATE licenses SET active = TRUE, activated_at = $1 WHERE key = $2`,
      [now, key]
    );
    return (rowCount ?? 0) > 0;
  },

  async getAllLicenses(): Promise<License[]> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbLicenseRow>(`SELECT * FROM licenses ORDER BY activated_at DESC NULLS LAST`);
    return rows.map(mapLicense).filter(Boolean) as License[];
  },

  async activateLicenseDevice(licenseKey: string, deviceId: string, deviceName?: string): Promise<{ allowed: boolean; message: string; activeDevices?: number; activationId?: string }> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;

    // Get license and check max devices
    const licenseResult = await pool.query<DbLicenseRow>(`SELECT * FROM licenses WHERE key = $1`, [licenseKey]);
    const license = licenseResult.rows[0];

    if (!license) {
      return { allowed: false, message: 'License not found' };
    }

    const maxDevices = license.max_devices || 3;

    // Check if device already activated
    const existingResult = await pool.query<DbLicenseActivationRow>(
      `SELECT * FROM license_activations WHERE license_key = $1 AND device_id = $2`,
      [licenseKey, deviceId]
    );

    if (existingResult.rows.length > 0) {
      // Device already activated, just update last_used_at
      await pool.query(
        `UPDATE license_activations SET last_used_at = NOW() WHERE license_key = $1 AND device_id = $2`,
        [licenseKey, deviceId]
      );
      return { allowed: true, message: 'Device already activated', activeDevices: existingResult.rows.length, activationId: existingResult.rows[0].id };
    }

    // Count active devices
    const countResult = await pool.query<{ count: number }>(
      `SELECT COUNT(*) as count FROM license_activations WHERE license_key = $1`,
      [licenseKey]
    );

    const activeDevices = parseInt((countResult.rows[0]?.count || 0).toString(), 10);

    if (activeDevices >= maxDevices) {
      return { allowed: false, message: `Device limit reached (${maxDevices} devices max)`, activeDevices };
    }

    // Add new device activation
    const id = `act_${crypto.randomUUID()}`;
    await pool.query(
      `INSERT INTO license_activations (id, license_key, device_id, device_name, activated_at, last_used_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [id, licenseKey, deviceId, deviceName || null]
    );

    return { allowed: true, message: 'Device activated', activeDevices: activeDevices + 1, activationId: id };
  },

  async getLicenseActivations(licenseKey: string): Promise<LicenseActivation[]> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbLicenseActivationRow>(
      `SELECT * FROM license_activations WHERE license_key = $1 ORDER BY last_used_at DESC`,
      [licenseKey]
    );
    return rows.map(mapLicenseActivation).filter(Boolean) as LicenseActivation[];
  },

  async removeDeviceActivation(activationId: string): Promise<boolean> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rowCount } = await pool.query(`DELETE FROM license_activations WHERE id = $1`, [activationId]);
    return (rowCount ?? 0) > 0;
  },

  async createTrialUser(deviceId: string): Promise<TrialUser> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const id = `trial_${crypto.randomUUID()}`;
    const { rows } = await pool.query<DbTrialUserRow>(
      `INSERT INTO trial_users (id, device_id) VALUES ($1, $2) RETURNING *`,
      [id, deviceId]
    );
    return mapTrialUser(rows[0]) as TrialUser;
  },

  async getTrialUser(deviceId: string): Promise<TrialUser | undefined> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbTrialUserRow>(
      `SELECT * FROM trial_users WHERE device_id = $1 LIMIT 1`,
      [deviceId]
    );
    return mapTrialUser(rows[0]);
  },

  async hasUsedTrial(deviceId: string): Promise<boolean> {
    const trial = await this.getTrialUser(deviceId);
    return !!trial;
  },

  async createUser(user: { email: string; name: string; passwordHash?: string | null; provider: AuthProvider }): Promise<User> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const id = `usr_${crypto.randomUUID()}`;
    const { rows } = await pool.query<DbUserRow>(
      `INSERT INTO users (id, email, name, password_hash, provider)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, user.email.toLowerCase(), user.name, user.passwordHash || null, user.provider]
    );
    return mapUser(rows[0]) as User;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!pool) throw new Error('DATABASE_URL not configured');
    await initPromise;
    const { rows } = await pool.query<DbUserRow>(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email.toLowerCase()]);
    const user = mapUser(rows[0]);
    if (user) {
      user.createdAt = user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt;
    }
    return user;
  },

  async upsertOAuthUser(params: { email: string; name: string; provider: AuthProvider }): Promise<User> {
    const existing = await this.getUserByEmail(params.email);
    if (existing) return existing;
    return this.createUser({ ...params, passwordHash: null });
  }
};

// -----------------------------------------------------------------------------
// Mock data for local development
// -----------------------------------------------------------------------------
export async function initializeMockData() {
  if (!pool) return;
  await initPromise;

  const { rows } = await pool.query<{ count: string }>(`SELECT COUNT(*) as count FROM orders`);
  const count = parseInt(rows[0]?.count || '0', 10);
  if (count > 0) return;

  const mockLicenseKey = 'ADBLOCK-PRO-ABC123DEF456';
  const mockOrder: Order = {
    id: 'ord_mock_1',
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
    orderId: mockOrder.id,
    plan: 'lifetime',
    active: true,
  };

  await pool.query(
    `INSERT INTO orders (id, email, name, license_key, payment_method, amount, currency, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      mockOrder.id,
      mockOrder.email,
      mockOrder.name,
      mockOrder.licenseKey,
      mockOrder.paymentMethod,
      mockOrder.amount,
      mockOrder.currency,
      mockOrder.status,
      mockOrder.createdAt,
    ]
  );

  await pool.query(
    `INSERT INTO licenses (key, email, order_id, activated_at, expiry_at, plan, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      mockLicense.key,
      mockLicense.email,
      mockLicense.orderId,
      new Date(),
      null,
      mockLicense.plan,
      true,
    ]
  );
}

// Auto-init mock data on server start (dev only)
if (typeof window === 'undefined') {
  initializeMockData().catch((err) => console.error('Mock data init error:', err));
}
