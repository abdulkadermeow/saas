<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConversationResource\Pages;
use App\Models\Conversation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ConversationResource extends Resource
{
    protected static ?string $model = Conversation::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationLabel = 'المحادثات';
    protected static ?string $modelLabel = 'محادثة';
    protected static ?string $pluralModelLabel = 'المحادثات';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('المستخدم')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Forms\Components\TextInput::make('customer_name')
                    ->label('اسم العميل')
                    ->placeholder('غير محدد')
                    ->maxLength(255),
                Forms\Components\TextInput::make('phone')
                    ->label('رقم الهاتف')
                    ->tel()
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('category')
                    ->label('التصنيف')
                    ->default('استفسار عام')
                    ->maxLength(255),
                Forms\Components\TextInput::make('last_message')
                    ->label('آخر رسالة')
                    ->maxLength(255),
                Forms\Components\DateTimePicker::make('last_message_at')
                    ->label('تاريخ آخر رسالة'),
                Forms\Components\Toggle::make('unread')
                    ->label('غير مقروءة')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('المستخدم')
                    ->default('غير محدد')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('customer_name')
                    ->label('اسم العميل')
                    ->default('غير محدد')
                    ->searchable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('رقم الهاتف')
                    ->default('-')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category')
                    ->label('التصنيف')
                    ->default('عام')
                    ->searchable(),
                Tables\Columns\TextColumn::make('last_message')
                    ->label('آخر رسالة')
                    ->default('-')
                    ->limit(35)
                    ->searchable(),
                Tables\Columns\TextColumn::make('last_message_at')
                    ->label('تاريخ آخر رسالة')
                    ->dateTime('Y-m-d H:i')
                    ->placeholder('-')
                    ->sortable(),
                Tables\Columns\IconColumn::make('unread')
                    ->label('غير مقروءة')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('تاريخ الإنشاء')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('آخر تحديث')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListConversations::route('/'),
            'create' => Pages\CreateConversation::route('/create'),
            'edit' => Pages\EditConversation::route('/{record}/edit'),
        ];
    }
}