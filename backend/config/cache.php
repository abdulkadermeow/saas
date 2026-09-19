<?php

return [

    'default' => env('CACHE_STORE', 'file'),

    'stores' => [
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],
        'database' => [
            'driver' => 'database',
            'table' => env('DB_CACHE_TABLE', 'cache'),
            'connection' => env('DB_CACHE_CONNECTION'),
        ],
        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],
    ],

    'prefix' => env('CACHE_PREFIX', 'rafiq_cache'),

];
