<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\AssistantSettingResource\Pages;
use App\Models\AssistantSetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AssistantSettingResource extends Resource
{
    protected static ?string $model = AssistantSetting::class;
    protected static ?string $navigationIcon = 'heroicon-o-check-badge';
    protected static ?string $navigationLabel = 'مراجعة التوجيهات';
    protected static ?string $pluralModelLabel = 'توجيهات المساعدين';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')->label('العميل')->searchable(),
                Tables\Columns\TextColumn::make('assistant')->label('المساعد')->badge(),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('الحالة')
                    ->colors(['warning' => 'pending', 'success' => 'active'])
                    ->formatStateUsing(fn ($state) => $state === 'pending' ? 'بانتظار الموافقة' : 'فعال'),
                Tables\Columns\TextColumn::make('updated_at')->label('تاريخ الطلب')->dateTime(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->label('حالة الطلب')
                    ->options(['pending' => 'بانتظار الموافقة', 'active' => 'فعال'])
                    ->default('pending'),
            ])
            ->actions([
                Tables\Actions\Action::make('review')
                    ->label('مراجعة وموافقة')
                    ->icon('heroicon-o-eye')
                    ->color('primary')
                    ->visible(fn (AssistantSetting $record) => $record->status === 'pending')
                    // قمنا بإضافة دالة fillForm هنا لملء الحقول بالبيانات
                    ->fillForm(fn (AssistantSetting $record): array => [
                        'prompt' => $record->prompt,
                        'draft_prompt' => $record->draft_prompt,
                    ])
                    ->form([
                        Forms\Components\Textarea::make('prompt')->label('التعليمات الحالية')->disabled(),
                        Forms\Components\Textarea::make('draft_prompt')->label('التعديل المطلوب')->required(),
                    ])
                    ->action(function (AssistantSetting $record, array $data): void {
                        $record->update([
                            'prompt' => $data['draft_prompt'],
                            'skills' => $record->draft_skills,
                            'draft_prompt' => null,
                            'draft_skills' => null,
                            'status' => 'active',
                        ]);
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageAssistantSettings::route('/'),
        ];
    }
}