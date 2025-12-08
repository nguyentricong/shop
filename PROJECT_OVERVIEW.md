# 📦 TỔNG QUAN DỰ ÁN - AdBlock Pro Shop

## 🎯 Mục Đích
Bán extension chặn quảng cáo YouTube/Facebook qua website, nhận license key từ khách hàng

## 📂 Cấu Trúc Folder

```
e:\ad-blocker-shop/              # Website bán hàng (Next.js)
├── src/
│   ├── app/
│   │   ├── page.tsx             # Homepage (quảng cáo)
│   │   ├── buy/page.tsx         # Trang checkout
│   │   ├── dashboard/page.tsx   # Dashboard khách hàng
│   │   ├── layout.tsx           # Layout chung
│   │   └── api/
│   │       └── purchase/route.ts # API xử lý thanh toán
│   └── ...
├── public/                       # Ảnh, icons
├── .env.local                    # Biến môi trường
├── vercel.json                   # Config Vercel
├── package.json
└── DEPLOY_GUIDE.md              # Hướng dẫn deploy

e:\project/                       # Extension code (Chrome)
├── manifest.json                 # Config extension
├── content-youtube.js            # Script chặn ads YouTube
├── content-facebook.js           # Script chặn ads Facebook
├── popup.html / popup.js         # UI extension
├── background.js                 # Service worker
├── images/                       # Icons
└── ad-blocker.zip                # File .zip để upload

e:\ad-blocker-shop\
└── ... (website bán hàng)
```

## 🔄 Quy Trình Bán Hàng

```
1. Khách vào Website
   ↓
2. Xem quảng cáo + Features
   ↓
3. Click "Mua Ngay"
   ↓
4. Điền email + tên + chọn thanh toán
   ↓
5. Nhấp "Thanh Toán"
   ↓
6. API tạo License Key tự động
   ↓
7. Email gửi License Key cho khách
   ↓
8. Khách tải extension từ Chrome Web Store
   ↓
9. Nhập License Key vào extension
   ↓
10. Extension kích hoạt ✅
```

## 💾 Dữ Liệu Lưu Trữ

### Hiện Tại (Demo)
- Dữ liệu lưu trong RAM (mất khi restart)
- Phù hợp để test

### Khi Production
- Cần PostgreSQL database
- Bảng: `purchases`, `licenses`, `users`
- Lưu: email, tên, license key, ngày mua, status

## 🔐 License Key Format

```
ADBLOCK-PRO-<TIMESTAMP>-<RANDOM>

Ví dụ:
ADBLOCK-PRO-ABC123DEF456-XYZABC
```

### Cách Validate (trong extension)
```javascript
const isValid = licenseKey.startsWith('ADBLOCK-PRO-');
// Có thể call API: /api/validate-license?key=...
```

## 💳 Tích Hợp Thanh Toán

### Phase 1 (Hiện Tại)
- Chưa có thanh toán thực
- Chỉ tạo form và generate key

### Phase 2 (Cần Làm)
1. **MoMo** (khuyến khích Việt Nam)
   - Gọi MoMo API trong `/api/purchase`
   - Webhook confirm payment
   - Tạo license key khi thành công

2. **Stripe** (quốc tế)
   - Thanh toán qua card
   - Webhook xác nhận
   - Auto create license

3. **Bank Transfer** (manual)
   - Hướng dẫn chuyển khoản
   - Admin confirm → create license

## 📊 Tính Năng Hiện Có

✅ Homepage (quảng cáo)
✅ Checkout page
✅ License key generator
✅ Dashboard khách hàng
✅ API basic
✅ Responsive design

⏳ Thanh toán (cần setup)
⏳ Email auto (cần Resend API)
⏳ Admin panel
⏳ Analytics

## 🚀 Để Deploy Ngay

1. **Push GitHub**
   ```bash
   cd e:\ad-blocker-shop
   git init
   git add .
   git commit -m "AdBlock Pro Shop"
   git remote add origin https://github.com/YOUR/ad-blocker-shop
   git push -u origin main
   ```

2. **Deploy Vercel**
   - Vào https://vercel.com/new
   - Chọn GitHub repo
   - Click Deploy
   - ✅ Xong!

3. **Domain (optional)**
   - Mua domain (namecheap, godaddy)
   - Update DNS
   - Thêm vào Vercel

## 📝 File Quan Trọng

| File | Mục Đích |
|------|---------|
| `src/app/page.tsx` | Homepage |
| `src/app/buy/page.tsx` | Checkout page |
| `src/app/api/purchase/route.ts` | API thanh toán |
| `.env.local` | Biến môi trường |
| `vercel.json` | Config deploy |

## 🎨 Tùy Chỉnh

### Đổi Tên
```javascript
// src/app/page.tsx line 9
<h1 className="text-2xl font-bold text-white">🚀 AdBlock Pro</h1>
// Đổi thành: AdBlock VN, MyAdblocker, etc.
```

### Đổi Giá
```javascript
// src/app/buy/page.tsx line 100
<span>49,000₫</span>
// Đổi thành giá bạn muốn
```

### Đổi Màu
```css
/* Tailwind classes */
from-blue-600 to-purple-700   /* Gradient */
bg-green-500                   /* Green button */
```

## 📞 Support Email

Cần setup domain email:
```
support@adblocker.vn
sales@adblocker.vn
```

Dùng dịch vụ như:
- Brevo (SendGrid)
- Resend.com
- AWS SES

## 🎓 Learning Resources

- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com
- Vercel: https://vercel.com/docs
- Stripe: https://stripe.com/docs
- MoMo: https://developers.momo.vn

## ✅ Checklist Launch

- [ ] Deploy website lên Vercel
- [ ] Setup domain custom
- [ ] Tích hợp payment gateway
- [ ] Setup email service
- [ ] Test checkout flow
- [ ] Create admin panel
- [ ] Setup analytics
- [ ] Marketing campaign
- [ ] Customer support

---

**🎉 Website sẵn sàng bán extension!**

Tiếp theo: Setup thanh toán + Email service
