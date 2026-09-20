<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| ملف خفيف جداً — بس بيحوّل "غير المسجلين" لصفحة دخول الفرونت
| (Laravel/Filament بيطلبوا مسار اسمه login وقت الحماية)
| ما بيلمس API ولا أي شي تاني.
*/

Route::get('/login', function () {
    return redirect(env('FRONTEND_URL', 'http://localhost:3000') . '/login');
})->name('login');

// الصفحة الرئيسية للباك: حوّلها عالفرونت كمان (اختياري بس مريح)
Route::get('/', function () {
    return redirect(env('FRONTEND_URL', 'http://localhost:3000'));
});