<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // نتحقق أولاً إذا كان الحقل غير موجود لتجنب خطأ تكرار الإنشاء
            if (!Schema::hasColumn('users', 'is_approved')) {
                // الحساب غير مفعل افتراضياً (false)
                $table->boolean('is_approved')->default(false)->after('email');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // نتحقق من وجود الحقل قبل محاولة حذفه
            if (Schema::hasColumn('users', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};