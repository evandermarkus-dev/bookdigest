$token = 'sbp_cb28bf35b3a01c504bd3fb14c15e1aca12cbae0d'
$ref = 'mzssenuirgmcgnbjvibd'
$base = "https://api.supabase.com/v1/projects/$ref/database/query"
$headers = @{ Authorization = "Bearer $token"; 'Content-Type' = 'application/json' }

function Run-SQL($sql) {
  $body = '{"query":' + ($sql | ConvertTo-Json) + '}'
  try {
    $r = Invoke-RestMethod -Uri $base -Method Post -Headers $headers -Body $body -ContentType 'application/json'
    Write-Host "OK: $sql" -ForegroundColor Green
  } catch {
    Write-Host "ERR: $sql => $_" -ForegroundColor Yellow
  }
}

Run-SQL 'ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN NOT NULL DEFAULT false'
Run-SQL 'ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT'
Run-SQL 'ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS streak_count INT NOT NULL DEFAULT 0'
Run-SQL 'ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS longest_streak INT NOT NULL DEFAULT 0'
Run-SQL 'ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS last_summary_date DATE'
Write-Host 'Done!' -ForegroundColor Cyan
