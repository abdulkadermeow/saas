#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# فحص سريع لباك إند منصة رفيق ورفيقة
# الاستخدام:  bash scripts/verify.sh https://api.your-domain.com/api
# ─────────────────────────────────────────────────────────────

BASE="${1:-http://localhost:8080/api}"
BASE="${BASE%/}"
PASS=0; FAIL=0

ok()   { echo "✅ $1"; PASS=$((PASS+1)); }
bad()  { echo "❌ $1"; FAIL=$((FAIL+1)); }

check() { # check <الوصف> <المتوقع> <الفعلي>
  if echo "$3" | grep -q "$2"; then ok "$1"; else bad "$1 — المتوقع [$2] والفعلي: $(echo "$3" | head -c 200)"; fi
}

EMAIL="test-$(date +%s)@example.com"
PASSWORD="Test12345"

echo ""
echo "════ 1) الصحة العامة ════"
R=$(curl -s -m 10 "$BASE/plans")
check "GET /plans يرجع الباقات الثلاث" '"id":"business"' "$R"
check "باقة الأعمال فيها ميزة POS" '"pos":true' "$R"

echo ""
echo "════ 2) المصادقة ════"
R=$(curl -s -m 10 -X POST "$BASE/auth/register" -H 'Content-Type: application/json' \
     -d "{\"name\":\"متجر تجريبي\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "تسجيل حساب جديد" '"token"' "$R"
TOKEN=$(echo "$R" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

R=$(curl -s -m 10 "$BASE/me" -H "Authorization: Bearer $TOKEN")
check "GET /me بالتوكن" "$EMAIL" "$R"

R=$(curl -s -m 10 -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
     -d '{"email":"wrong@example.com","password":"WrongPass1"}')
check "رفض بيانات دخول خاطئة" 'غير صحيحة' "$R"

echo ""
echo "════ 3) الاشتراك والدفع ════"
R=$(curl -s -m 10 "$BASE/subscription" -H "Authorization: Bearer $TOKEN")
check "GET /subscription (لا اشتراك بعد)" '"subscription":null' "$R"

R=$(curl -s -m 10 -X POST "$BASE/subscription/checkout" -H "Authorization: Bearer $TOKEN" \
     -H 'Content-Type: application/json' -d '{"plan_id":"business"}')
check "إنشاء جلسة دفع لباقة الأعمال" '"checkout_url"' "$R"

echo ""
echo "════ 4) حماية ميزة POS ════"
R=$(curl -s -m 10 "$BASE/pos/connection" -H "Authorization: Bearer $TOKEN")
check "مستخدم بدون باقة أعمال يُرفض (403)" 'باقة الأعمال' "$R"

R=$(curl -s -m 10 -X POST "$BASE/pos/verify-license" -H 'Content-Type: application/json' \
     -d '{"license_key":"invalid-key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}')
check "مفتاح ترخيص وهمي يرجع valid:false" '"valid":false' "$R"

echo ""
echo "════ 5) حماية n8n ════"
R=$(curl -s -m 10 "$BASE/n8n/assistant-config?user_id=1&assistant=rafiq")
check "بدون السر المشترك يُرفض (401)" 'غير مصر' "$R"

echo ""
echo "════════════════════════════"
echo "النتيجة: نجح $PASS / فشل $FAIL"
[ "$FAIL" -eq 0 ] && echo "🎉 الباك إند شغال بالكامل" || echo "⚠️  راجع البنود الفاشلة فوق"
echo ""
