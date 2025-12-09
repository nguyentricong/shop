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

  // Sanitize URLs to avoid CR/LF or spaces breaking signature
  const sanitizedReturnUrl = params.returnUrl.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, '');
  const sanitizedNotifyUrl = params.notifyUrl.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, '');
  const sanitizedOrderInfo = params.orderInfo.trim();

  // Tạo signature theo documentation MoMo
  const amountNum = Number(params.amount);
  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amountNum}&extraData=${extraData}&ipnUrl=${sanitizedNotifyUrl}&orderId=${params.orderId}&orderInfo=${sanitizedOrderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${sanitizedReturnUrl}&requestId=${requestId}&requestType=${requestType}`;
  
  const signature = crypto
    .createHmac('sha256', MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');

  const requestBody = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount: amountNum,
    orderId: params.orderId,
    orderInfo: sanitizedOrderInfo,
    redirectUrl: sanitizedReturnUrl,
    ipnUrl: sanitizedNotifyUrl,
    requestType,
    extraData,
    signature,
    lang: 'vi'
  };

  // Debug log (mask secret)
  console.log('MoMo payload', {
    orderId: params.orderId,
    amount: amountNum,
    orderInfo: sanitizedOrderInfo,
    redirectUrl: sanitizedReturnUrl,
    ipnUrl: sanitizedNotifyUrl,
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
