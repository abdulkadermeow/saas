public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        // الحساب غير مفعل افتراضياً (false)
        $table->boolean('is_approved')->default(false)->after('email');
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('is_approved');
    });
}