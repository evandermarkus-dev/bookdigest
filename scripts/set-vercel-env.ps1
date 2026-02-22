# Run this script once to set Vercel environment variables.
# Fill in your actual values before running.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/set-vercel-env.ps1

Set-Location (Split-Path $PSScriptRoot -Parent)

$vars = @{
  'NEXT_PUBLIC_SUPABASE_URL'           = 'YOUR_SUPABASE_URL'
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'      = 'YOUR_SUPABASE_ANON_KEY'
  'ANTHROPIC_API_KEY'                  = 'YOUR_ANTHROPIC_KEY'
  'STRIPE_SECRET_KEY'                  = 'YOUR_STRIPE_SECRET_KEY'
  'STRIPE_PRICE_ID'                    = 'YOUR_STRIPE_PRICE_ID'
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' = 'YOUR_STRIPE_PUBLISHABLE_KEY'
  'EMAIL_FROM'                         = 'BookDigest <noreply@yourdomain.com>'
  'NEXT_PUBLIC_SITE_URL'               = 'https://your-app.vercel.app'
}

foreach ($key in $vars.Keys) {
  $val = $vars[$key]
  Write-Host "Setting $key..." -ForegroundColor Cyan
  $val | vercel env add $key production --force 2>&1
}

Write-Host 'All done!' -ForegroundColor Green
