# 🔐 Hướng Dẫn Cấu Hình Payment & Email

## 📧 1. Email Service (Resend)

### Đăng ký Resend (MIỄN PHÍ 100 emails/ngày):
1. Truy cập: https://resend.com
2. Sign up với GitHub hoặc Google
3. Vào Dashboard → API Keys → Create API Key
4. Copy key và paste vào `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

### Verify Domain (Production):
- Settings → Domains → Add Domain
- Thêm DNS records theo hướng dẫn
- Sau khi verify, đổi email sender trong `src/lib/email.ts`

---

## 💰 2. Payment Gateways

### A. MoMo (Khuyến nghị cho VN)

#### Test Environment (FREE):
```bash
MOMO_PARTNER_CODE=MOMOIQA420180417
MOMO_ACCESS_KEY=SvDmj2cOTYZmQQ3H
MOMO_SECRET_KEY=PPuDXq1KowPT1ftR8DvlQTHhC03aul17
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
```

#### Production:
1. Đăng ký: https://business.momo.vn
2. Submit hồ sơ doanh nghiệp
3. Nhận Partner Code, Access Key, Secret Key
4. Đổi endpoint sang: `https://payment.momo.vn/v2/gateway/api/create`

#### Test Payment:
- Tài khoản test: `0963181714`
- Password: `123456`

---

### B. VNPay

#### Đăng ký Sandbox (Test FREE):
1. Truy cập: https://sandbox.vnpayment.vn/devreg
2. Đăng ký tài khoản doanh nghiệp test
3. Lấy TMN Code và Hash Secret
4. Cập nhật `.env.local`:
   ```bash
   VNPAY_TMN_CODE=YOUR_TMN_CODE
   VNPAY_HASH_SECRET=YOUR_HASH_SECRET
   VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
   ```

#### Test Card:
- Card Number: `9704198526191432198`
- Card Holder: `NGUYEN VAN A`
- Expiry: `07/15`
- OTP: `123456`

#### Production:
- Liên hệ: https://vnpay.vn/lien-he
- Phí: 1.5% - 2% mỗi giao dịch

---

### C. Stripe (International)

#### Đăng ký (Test FREE):
1. Truy cập: https://stripe.com
2. Sign up và complete profile
3. Developers → API Keys
4. Copy Secret Key và Publishable Key:
   ```bash
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   ```

#### Test Cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

#### Webhook (cho production):
1. Developers → Webhooks → Add endpoint
2. URL: `https://yourdomain.com/api/payment/stripe/webhook`
3. Events: `checkout.session.completed`
4. Copy Signing Secret:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

#### Production:
- Activate account (cần business info)
- Phí: 2.9% + $0.30 per transaction

---

## 🚀 3. Quick Start

### Test Locally (Development Mode):
```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.local.example .env.local

# 3. Start dev server
npm run dev

# 4. Test purchase flow
# → Trong dev mode, payment sẽ auto-complete
# → License key sẽ hiển thị ngay (không qua payment gateway)
```

### Test với Payment Gateway:
1. Thêm API keys vào `.env.local`
2. Restart server
3. Chọn payment method trong form
4. Sẽ redirect đến payment gateway test

---

## 🔒 4. Security Checklist

✅ **Rate Limiting**: Đã có (10 requests/15 phút)
✅ **Input Validation**: Dùng Zod schema
✅ **Email Validation**: Regex + format check
✅ **SQL Injection**: Safe (dùng prepared statements)
✅ **Webhook Verification**: Signature check cho tất cả gateways

### Thêm CAPTCHA (Optional):
```bash
npm install @hcaptcha/react-hcaptcha
# hoặc
npm install react-google-recaptcha
```

Tích hợp vào form `/buy` trước khi submit.

---

## 📊 5. Monitoring & Logs

### Check logs:
```bash
# Server logs
npm run dev

# Database queries
sqlite3 data/shop.db "SELECT * FROM orders;"
sqlite3 data/shop.db "SELECT * FROM licenses;"
```

### Production monitoring:
- Vercel Analytics (tích hợp sẵn)
- Sentry cho error tracking
- PostHog cho user analytics

---

## 🆘 6. Troubleshooting

### Email không gửi:
- Check RESEND_API_KEY có đúng không
- Verify domain nếu production
- Check console logs

### Payment fail:
- Kiểm tra API keys
- Test với test cards/accounts
- Check webhook logs

### Rate limit hit:
- Đợi 15 phút
- Hoặc tăng limit trong `.env.local`:
  ```bash
  RATE_LIMIT_MAX_REQUESTS=20
  ```

---

## 📝 7. Deployment Checklist

- [ ] Setup domain và SSL
- [ ] Verify Resend domain
- [ ] Đăng ký production payment gateways
- [ ] Update webhook URLs
- [ ] Set environment variables trên hosting
- [ ] Enable rate limiting
- [ ] Setup database backup
- [ ] Add monitoring/analytics
- [ ] Test payment flow với real money (nhỏ)

---

## 💡 Tips

1. **Bắt đầu với MoMo**: Dễ nhất cho thị trường VN
2. **Test thoroughly**: Dùng test accounts trước khi production
3. **Monitor errors**: Check logs thường xuyên
4. **Backup database**: Quan trọng với SQLite
5. **Document API keys**: Lưu ở nơi an toàn (1Password, Bitwarden)

---

Need help? Check:
- MoMo Docs: https://developers.momo.vn
- VNPay Docs: https://sandbox.vnpayment.vn/apis
- Stripe Docs: https://stripe.com/docs
- Resend Docs: https://resend.com/docs
