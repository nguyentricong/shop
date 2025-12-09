cd e:\ad-blocker-shop

# Array of environment variables to add
$envVars = @(
    "DATABASE_URL=postgresql://neondb_owner:npg_pSLWjutBNP50@ep-noisy-art-a1860d0t-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    "POSTGRES_URL=postgresql://neondb_owner:npg_pSLWjutBNP50@ep-noisy-art-a1860d0t-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    "POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_pSLWjutBNP50@ep-noisy-art-a1860d0t.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    "MOMO_PARTNER_CODE=MOMOIQA420180417",
    "MOMO_ACCESS_KEY=SvDmj2cOTYZmQQ3H",
    "MOMO_SECRET_KEY=PPuDXq1KowPT1ftR8DvlQTHhC03aul17",
    "MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create",
    "VNPAY_TMN_CODE=",
    "VNPAY_HASH_SECRET=",
    "VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "STRIPE_SECRET_KEY=",
    "STRIPE_PUBLISHABLE_KEY=",
    "STRIPE_WEBHOOK_SECRET=",
    "NEXT_PUBLIC_BASE_URL=https://ablockyoutube.vercel.app",
    "RATE_LIMIT_MAX_REQUESTS=10",
    "RATE_LIMIT_WINDOW_MS=900000",
    "NEXTAUTH_SECRET=kd1s2iVGDjUOMIf8KuQC9BXNltE5HYoh"
)

foreach ($var in $envVars) {
    Write-Host "Adding: $var" -ForegroundColor Green
    # Parse variable name and value
    $parts = $var -split "=", 2
    $name = $parts[0]
    $value = if ($parts.Count -eq 2) { $parts[1] } else { "" }
    
    # Add to vercel
    vercel env add $name --value $value
}

Write-Host "All environment variables added!" -ForegroundColor Green
