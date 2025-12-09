/**
 * Test script to insert a license key into the database
 * Run: node scripts/insert-test-license.js
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

async function insertTestLicense() {
  try {
    // First create a test order
    const licenseKey = 'ADBLOCK-PRO-MIXNQYBC-89JSLD';
    const testEmail = 'test@example.com';
    
    // Check if license already exists
    const existingLicense = await pool.query(
      'SELECT * FROM licenses WHERE key = $1',
      [licenseKey]
    );

    if (existingLicense.rows.length > 0) {
      console.log('✅ License already exists:', licenseKey);
      process.exit(0);
    }

    // Check if order exists
    let orderId;
    const existingOrder = await pool.query(
      'SELECT id FROM orders WHERE license_key = $1',
      [licenseKey]
    );

    if (existingOrder.rows.length > 0) {
      orderId = existingOrder.rows[0].id;
      console.log('✅ Using existing order:', orderId);
    } else {
      // Create test order
      const crypto = require('crypto');
      orderId = crypto.randomUUID();
      
      await pool.query(
        `INSERT INTO orders (id, email, name, license_key, payment_method, amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          orderId,
          testEmail,
          'Test User',
          licenseKey,
          'momo',
          49000,
          'VND',
          'completed'
        ]
      );
      console.log('✅ Created test order:', orderId);
    }

    // Insert license
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year

    await pool.query(
      `INSERT INTO licenses (key, email, order_id, activated_at, expiry_at, plan, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        licenseKey,
        testEmail,
        orderId,
        now,
        expiryDate,
        'lifetime',
        true
      ]
    );

    console.log('✅ Successfully inserted test license:');
    console.log('   Key:', licenseKey);
    console.log('   Email:', testEmail);
    console.log('   Status: Active');
    console.log('   Plan: Lifetime');
    console.log('\n💡 You can now test with this key in the extension!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

insertTestLicense();
