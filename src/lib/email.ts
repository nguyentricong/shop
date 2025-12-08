import { Resend } from 'resend';

// Lazily create the Resend client so missing env vars do not crash module evaluation
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  resendClient = new Resend(apiKey);
  return resendClient;
}

interface EmailParams {
  to: string;
  name: string;
  licenseKey: string;
  downloadUrl: string;
}

export async function sendLicenseEmail({ to, name, licenseKey, downloadUrl }: EmailParams) {
  const client = getResendClient();
  if (!client) {
    const error = new Error('RESEND_API_KEY is missing');
    console.error(error.message);
    return { success: false, error };
  }

  try {
    const { data, error } = await client.emails.send({
      from: 'AdBlock Pro <noreply@yourdomain.com>',
      to: [to],
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
      
      <div class="steps">
        <h3 style="margin-top: 0; color: #1e293b;">📋 Hướng dẫn kích hoạt (3 bước):</h3>
        <div class="step">Tải extension từ Chrome Web Store</div>
        <div class="step">Mở extension và nhấn "Kích Hoạt License"</div>
        <div class="step">Dán License Key và nhấn "Xác Nhận"</div>
      </div>
      
      <div style="text-align: center;">
        <a href="${downloadUrl}" class="btn">📥 Tải Extension Ngay</a>
      </div>
      
      <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
        <strong>⚠️ Lưu ý quan trọng:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>License Key chỉ gửi 1 lần duy nhất qua email này</li>
          <li>Không chia sẻ key với người khác</li>
          <li>Bạn có thể xem lại key tại Dashboard</li>
        </ul>
      </div>
      
      <h3>🎁 Bạn nhận được gì?</h3>
      <ul>
        <li>✅ Chặn 100% quảng cáo YouTube & Facebook</li>
        <li>✅ Trọn đời sử dụng - không giới hạn thời gian</li>
        <li>✅ Cập nhật miễn phí mãi mãi</li>
        <li>✅ Hỗ trợ kỹ thuật 24/7</li>
      </ul>
      
      <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ:</p>
      <p>📧 Email: support@yourdomain.com<br>
      💬 Facebook: fb.com/adblockvn</p>
      
      <p>Chúc bạn có trải nghiệm tuyệt vời! 🚀</p>
      
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

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
}
