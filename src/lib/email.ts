import nodemailer from 'nodemailer';

// Lazily create SMTP transporter so missing env vars do not crash module evaluation
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Gmail app password typically uses 465
    auth: { user, pass }
  });

  return transporter;
}

interface EmailParams {
  to: string;
  name: string;
  licenseKey: string;
  downloadUrl?: string;
  baseUrl?: string;
}

export async function sendLicenseEmail({ to, name, licenseKey, downloadUrl, baseUrl }: EmailParams) {
  const client = getTransporter();
  if (!client) {
    const error = new Error('SMTP configuration is missing');
    console.error(error.message);
    return { success: false, error };
  }

  try {
    const from = process.env.SMTP_FROM || 'AdBlock Pro <no-reply@example.com>';
    const downloadLink = 'https://ablockyoutube.vercel.app/downloads/AdBlock-Pro-YouTube.zip';
    
    // Log for debugging
    console.log('Sending email to:', to);
    console.log('Download URL:', downloadLink);
    
    const info = await client.sendMail({
      from,
      to,
      subject: '🎉 License Key AdBlock Pro của bạn đã sẵn sàng!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
    .license-box { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .license-key { font-size: 20px; font-weight: 700; color: #15803d; font-family: monospace; letter-spacing: 1px; }
    .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0; }
    .steps { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .step { margin: 15px 0; padding-left: 30px; position: relative; }
    .step::before { content: "✓"; position: absolute; left: 0; color: #22c55e; font-weight: bold; font-size: 18px; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🎉 Cảm ơn bạn đã mua AdBlock Pro!</h1>
      <p style="margin: 10px 0 0; opacity: 0.9;">Trải nghiệm web không quảng cáo bắt đầu ngay bây giờ</p>
    </div>
    
    <div class="content">
      <p>Xin chào <strong>${name}</strong>,</p>
      
      <p>Cảm ơn bạn đã tin tưởng và mua <strong>AdBlock Pro</strong>! Đây là License Key trọn đời của bạn:</p>
      
      <div class="license-box">
        <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">LICENSE KEY CỦA BẠN</p>
        <div class="license-key">${licenseKey}</div>
        <p style="margin: 10px 0 0; color: #64748b; font-size: 12px;">Vui lòng lưu lại key này để kích hoạt extension</p>
      </div>
      
      <div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
        <h3 style="margin: 0 0 15px; color: #1e40af;">📥 TẢI EXTENSION</h3>
        <p style="margin: 10px 0; color: #64748b; font-size: 14px;">File <strong>AdBlock-Pro-YouTube.zip</strong></p>
        
        <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 15px auto;">
          <tr>
            <td align="center" style="border-radius: 8px; background: #2563eb;">
              <a href="https://ablockyoutube.vercel.app/downloads/AdBlock-Pro-YouTube.zip" target="_blank" style="display: inline-block; padding: 15px 30px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px;">
                ⬇️ TẢI XUỐNG NGAY
              </a>
            </td>
          </tr>
        </table>
        
        <p style="margin: 15px 0 5px; color: #475569; font-size: 12px;">Nếu button không hoạt động, sao chép link sau:</p>
        <div style="background: #ffffff; border: 2px dashed #94a3b8; padding: 10px; border-radius: 6px; margin: 10px auto; max-width: 480px;">
          <p style="color: #334155; font-size: 11px; font-family: 'Courier New', monospace; margin: 0; line-height: 1.6; word-break: break-all; user-select: all;">
            https://ablockyoutube<span>.</span>vercel<span>.</span>app/downloads/AdBlock-Pro-YouTube<span>.</span>zip
          </p>
        </div>
        <p style="margin: 5px 0; color: #94a3b8; font-size: 11px; font-style: italic;">Dán link trên vào thanh địa chỉ trình duyệt</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 15px; color: #1e293b;">📋 Hướng dẫn cài đặt (3 bước):</h3>
        <div class="step">1️⃣ Tải file ZIP ở trên → Giải nén</div>
        <div class="step">2️⃣ Chrome: <code style="background: #e2e8f0; padding: 2px 6px;">chrome://extensions/</code> → Bật <strong>Developer mode</strong> → <strong>Load unpacked</strong> → Chọn thư mục</div>
        <div class="step">3️⃣ Mở extension → Nhập License Key → Xác nhận ✅</div>
      </div>
      
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
        <strong>🎁 Lợi ích:</strong> Chặn 100% quảng cáo YouTube & Facebook • Trọn đời • Cập nhật miễn phí
      </div>
      
      <p style="color: #64748b; font-size: 13px; margin: 20px 0;">Cần hỗ trợ? Email: <a href="mailto:support@yourdomain.com" style="color: #2563eb;">support@yourdomain.com</a></p>
      
      <p style="margin-top: 30px;">
        Trân trọng,<br>
        <strong>Đội ngũ AdBlock Pro</strong>
      </p>
    </div>
    
    <div class="footer">
      <p>Email này được gửi tự động, vui lòng không trả lời.</p>
      <p>&copy; 2025 AdBlock Pro. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
}
