<?php

return [

    /*
    | سر مشترك لمصادقة طلبات n8n الآلية (machine-to-machine)
    */
    'n8n_secret' => env('N8N_SHARED_SECRET'),

    'frontend_url' => env('FRONTEND_URL', 'http://localhost:5173'),

    'payments' => [
        'gateway' => env('PAYMENT_GATEWAY', 'stripe'),
        'currency' => env('STRIPE_CURRENCY', 'usd'),
        'manual_contact' => env('MANUAL_PAYMENT_CONTACT'),
    ],

    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

];
