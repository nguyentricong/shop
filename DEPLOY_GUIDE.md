# 🚀 HƯỚNG DẪN DEPLOY TRÊN VERCEL (5 PHÚT)

## Bước 1: Push Code lên GitHub

```bash
cd e:\ad-blocker-shop

# Initialize git
git init
git add .
git commit -m "Initial commit - AdBlock Pro Shop"

# Tạo repo mới trên GitHub (https://github.com/new)
# Rồi push:
git remote add origin https://github.com/YOUR_USERNAME/ad-blocker-shop.git
git branch -M main
git push -u origin main
```

## Bước 2: Deploy Vercel (Auto)

1. **Vào:** https://vercel.com/new
2. **Login:** Chọn GitHub
3. **Import:** Chọn repository `ad-blocker-shop`
4. **Configure:**
   - Framework: Next.js (auto detect)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Environment Variables** (thêm)
   ```
   RESEND_API_KEY=sk_...
   STRIPE_PUBLIC_KEY=pk_...
   STRIPE_SECRET_KEY=sk_...
   ```
6. **Click DEPLOY** ✅

**Sau 2-3 phút website sẽ online!**

## Bước 3: Domain Custom (Optional)

1. Vào **Project Settings → Domains**
2. Thêm domain: `adblocker.vn`
3. Update DNS records (hỏi nhà cung cấp)

## Bước 4: Setup Vercel Analytics (Optional)

```bash
npm install @vercel/analytics
```

Thêm vào `src/app/layout.tsx`:
```jsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({children}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Test Tính Năng

### 1. Test Local
```bash
npm run dev
# Vào http://localhost:3000
```

### 2. Test Mua Hàng
- Nhấp "Mua Ngay"
- Điền email + tên
- Submit
- License Key sẽ xuất hiện

### 3. Test Payment (sau khi setup)
- Dùng test card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`

## Chạy Trên Live (Vercel)

Sau khi deploy, mỗi `git push` sẽ tự động deploy

```bash
# Sửa code
nano src/app/page.tsx

# Push
git add .
git commit -m "Update homepage"
git push

# Website tự cập nhật trong 1-2 phút!
```

## Chi Phí

- **Vercel:** FREE (up to 6000 minutes/month)
- **Resend:** FREE (100 emails/day)
- **Stripe:** FREE (2.9% + $0.30 per transaction)
- **MoMo:** Tùy gói shop (từ 0.5%)

## 🎯 Next Steps

1. ✅ Deploy website
2. ⏳ Setup Payment Gateway (MoMo/Stripe)
3. ⏳ Tích hợp extension (license key validation)
4. ⏳ Setup email auto-send
5. ⏳ Admin panel

## 🆘 Troubleshoot

**Vercel build failed?**
- Check build logs: https://vercel.com/dashboard
- Ensure Node 20.9+ (request Vercel CLI)

**Email not sending?**
- Verify Resend API key
- Check spam folder

**Payment not working?**
- Test mode enabled?
- Check Stripe/MoMo webhook

---

**Website của bạn sẽ sẵn sàng bán extension trong vài giờ!** 🎉
