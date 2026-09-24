<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // ─── n8n bridge: سر مشترك للمسارات machine-to-machine ────────────────
    // يقرأ N8N_SHARED_SECRET (اسمك) مع دعم N8N_SECRET أيضاً
    'n8n' => [
        'secret' => env('N8N_SHARED_SECRET', env('N8N_SECRET')),
    ],

    // ─── Stripe ──────────────────────────────────────────────────────────
    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    // ─── بوابات الدفع ────────────────────────────────────────────────────
    // PAYMENT_GATEWAY=manual → دفع يدوي عبر واتساب | =stripe → Stripe Checkout
    'payments' => [
        'default' => env('PAYMENT_GATEWAY', env('PAYMENTS_GATEWAY', 'manual')),
        'currency' => env('STRIPE_CURRENCY', env('PAYMENTS_CURRENCY', 'usd')),
        'success_url' => env('PAYMENTS_SUCCESS_URL', env('FRONTEND_URL')),
        'cancel_url' => env('PAYMENTS_CANCEL_URL', env('FRONTEND_URL')),
        'manual_contact' => env('MANUAL_PAYMENT_CONTACT'),
    ],
];
