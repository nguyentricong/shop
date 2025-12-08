import crypto from 'crypto';

interface VNPayPaymentParams {
  orderId: string;
  amount: number;
  orderInfo: string;
  returnUrl: string;
  ipAddr: string;
}

export function createVNPayPaymentUrl(params: VNPayPaymentParams): string {
  const { VNPAY_TMN_CODE, VNPAY_HASH_SECRET, VNPAY_URL } = process.env;

  if (!VNPAY_TMN_CODE || !VNPAY_HASH_SECRET || !VNPAY_URL) {
    throw new Error('VNPay credentials not configured');
  }

  const date = new Date();
  const createDate = date.toISOString().replace(/[-:]/g, '').split('.')[0];
  const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
    .toISOString().replace(/[-:]/g, '').split('.')[0];

  let vnpParams: any = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNPAY_TMN_CODE,
    vnp_Amount: params.amount * 100, // VNPay uses smallest unit
    vnp_CreateDate: createDate,
    vnp_CurrCode: 'VND',
    vnp_IpAddr: params.ipAddr,
    vnp_Locale: 'vn',
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: params.returnUrl,
    vnp_TxnRef: params.orderId,
    vnp_ExpireDate: expireDate
  };

  // Sort params
  vnpParams = sortObject(vnpParams);

  const signData = new URLSearchParams(vnpParams).toString();
  const hmac = crypto.createHmac('sha512', VNPAY_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnpParams['vnp_SecureHash'] = signed;

  return VNPAY_URL + '?' + new URLSearchParams(vnpParams).toString();
}

export function verifyVNPaySignature(vnpParams: any): boolean {
  const { VNPAY_HASH_SECRET } = process.env;
  if (!VNPAY_HASH_SECRET) return false;

  const secureHash = vnpParams['vnp_SecureHash'];
  delete vnpParams['vnp_SecureHash'];
  delete vnpParams['vnp_SecureHashType'];

  const sortedParams = sortObject(vnpParams);
  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac('sha512', VNPAY_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  return secureHash === signed;
}

function sortObject(obj: any): any {
  const sorted: any = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}
