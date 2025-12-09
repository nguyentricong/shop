import crypto from 'crypto';

interface MoMoPaymentParams {
  orderId: string;
  amount: number;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
  email: string;
  name: string;
}

interface MoMoResponse {
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
  errorCode?: number;
  message?: string;
  orderId?: string;
}

export async function createMoMoPayment(params: MoMoPaymentParams): Promise<MoMoResponse> {
  const {
    MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_ENDPOINT
  } = process.env;

  if (!MOMO_PARTNER_CODE || !MOMO_ACCESS_KEY || !MOMO_SECRET_KEY || !MOMO_ENDPOINT) {
    console.error('MoMo credentials not configured');
    return { errorCode: -1, message: 'MoMo chưa được cấu hình' };
  }

  const requestId = params.orderId;
  const requestType = 'captureWallet';
  const extraData = Buffer.from(JSON.stringify({ email: params.email })).toString('base64');

  // Tạo signature theo documentation MoMo
  // MoMo signature strictly alphabet order
  // Normalize unicode characters (em-dash, en-dash) để tránh encoding issues
  // orderInfo KHÔNG encode - dùng raw value như trong requestBody
  const rawOrderInfo = params.orderInfo
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/‐/g, '-')  // hyphen
    .replace(/‑/g, '-')  // non-breaking hyphen
    .replace(/−/g, '-')  // minus sign
    .normalize("NFKC")
    .trim();

  // Debug: log char codes
  console.log('orderInfo chars:', rawOrderInfo.split('').map((c, i) => `[${i}]=${c} (${c.charCodeAt(0)})`).join(' '));

  const rawSignature =
    `accessKey=${MOMO_ACCESS_KEY}` +
    `&amount=${params.amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${params.notifyUrl}` +
    `&orderId=${params.orderId}` +
    `&orderInfo=${rawOrderInfo}` +
    `&partnerCode=${MOMO_PARTNER_CODE}` +
    `&redirectUrl=${params.returnUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;
  
  const signature = crypto
    .createHmac('sha256', MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  // Debug logging for signature verification
  console.log('=== MoMo DEBUG ===');
  console.log('SECRET_KEY_LENGTH =', MOMO_SECRET_KEY.length);
  console.log('SECRET_KEY_RAW =', JSON.stringify(MOMO_SECRET_KEY));
  console.log('RAW_SIGNATURE =', rawSignature);
  console.log('COMPUTED_SIGNATURE =', signature);
  console.log('=== END DEBUG ===');

  const requestBody = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount: params.amount.toString(),
    orderId: params.orderId,
    orderInfo: rawOrderInfo,
    redirectUrl: params.returnUrl,
    ipnUrl: params.notifyUrl,
    requestType: 'captureWallet',
    extraData,
    signature,
    lang: 'vi'
  };

  // Debug log (mask secret)
  console.log('MoMo payload', {
    orderId: params.orderId,
    amount: params.amount,
    orderInfo: rawOrderInfo,
    redirectUrl: params.returnUrl,
    ipnUrl: params.notifyUrl,
    rawSignature,
    signature,
  });

  try {
    const response = await fetch(MOMO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    return data as MoMoResponse;
  } catch (error) {
    console.error('MoMo API error:', error);
    return { errorCode: -1, message: 'Lỗi kết nối MoMo' };
  }
}

export function verifyMoMoSignature(data: any): boolean {
  const { MOMO_SECRET_KEY } = process.env;
  if (!MOMO_SECRET_KEY) return false;

  const rawSignature = `accessKey=${data.accessKey}&amount=${data.amount}&extraData=${data.extraData}&message=${data.message}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&partnerCode=${data.partnerCode}&payType=${data.payType}&requestId=${data.requestId}&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${data.transId}`;
  
  const signature = crypto
    .createHmac('sha256', MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  return signature === data.signature;
}
