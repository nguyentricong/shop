#!/usr/bin/env python3
"""
Insert test license key into Postgres database
"""
import os
import uuid
from datetime import datetime, timedelta
import psycopg2

# Get DATABASE_URL from .env.local
db_url = os.getenv('DATABASE_URL')
if not db_url:
    # Try to read from file
    try:
        with open('.env.local', 'r') as f:
            for line in f:
                if line.startswith('DATABASE_URL='):
                    db_url = line.split('=', 1)[1].strip().strip('"')
                    break
    except:
        pass

if not db_url:
    print('❌ DATABASE_URL not found!')
    exit(1)

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    license_key = 'ADBLOCK-PRO-MIXNQYBC-89JSLD'
    test_email = 'test@example.com'
    
    # Check if license exists
    cursor.execute('SELECT * FROM licenses WHERE key = %s', (license_key,))
    if cursor.fetchone():
        print(f'✅ License already exists: {license_key}')
        cursor.close()
        conn.close()
        exit(0)
    
    # Check if order exists
    cursor.execute('SELECT id FROM orders WHERE license_key = %s', (license_key,))
    result = cursor.fetchone()
    
    if result:
        order_id = result[0]
        print(f'✅ Using existing order: {order_id}')
    else:
        # Create test order
        order_id = str(uuid.uuid4())
        cursor.execute(
            '''INSERT INTO orders (id, email, name, license_key, payment_method, amount, currency, status)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
            (order_id, test_email, 'Test User', license_key, 'momo', 49000, 'VND', 'completed')
        )
        conn.commit()
        print(f'✅ Created test order: {order_id}')
    
    # Insert license
    now = datetime.now()
    expiry_date = now + timedelta(days=365)
    
    cursor.execute(
        '''INSERT INTO licenses (key, email, order_id, activated_at, expiry_at, plan, active)
           VALUES (%s, %s, %s, %s, %s, %s, %s)''',
        (license_key, test_email, order_id, now, expiry_date, 'lifetime', True)
    )
    conn.commit()
    
    print('✅ Successfully inserted test license:')
    print(f'   Key: {license_key}')
    print(f'   Email: {test_email}')
    print(f'   Status: Active')
    print(f'   Plan: Lifetime')
    print('\n💡 You can now test with this key in the extension!')
    
    cursor.close()
    conn.close()

except Exception as e:
    print(f'❌ Error: {e}')
    exit(1)
