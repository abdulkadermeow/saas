<?php

use Illuminate\Support\Facades\Schedule;

/*
|--------------------------------------------------------------------------
| Console Routes & Scheduling
|--------------------------------------------------------------------------
*/

// تجديد الاشتراكات النشطة يومياً: تصفير رصيد الرسائل وتمديد renews_at شهراً
Schedule::command('subscriptions:renew')->daily();
