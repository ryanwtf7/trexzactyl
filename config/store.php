<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Trexzactyl Storefront Settings
    |--------------------------------------------------------------------------
    |
    | This configuration file is used to interact with the app in order to
    | get and set configurations for the Trexzactyl Storefront.
    |
    */

    'currencies' => [
        'EUR' => 'Euro',
        'USD' => 'US Dollar',
        'JPY' => 'Japanese Yen',
        'GBP' => 'Pound Sterling',
        'CAD' => 'Canadian Dollar',
        'AUD' => 'Australian Dollar',
        'BDT' => 'Bangladeshi Taka',
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Gateway Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for various payment gateways supported by the store.
    |
    */

    'bkash' => [
        'enabled' => env('BKASH_ENABLED', true),
        'merchant_number' => env('BKASH_MERCHANT_NUMBER', '01XXXXXXXXX'),
        'min_amount' => env('BKASH_MIN_AMOUNT', 50),
        'max_amount' => env('BKASH_MAX_AMOUNT', 10000),
        'currency' => 'BDT',
    ],

    'nagad' => [
        'enabled' => env('NAGAD_ENABLED', true),
        'merchant_number' => env('NAGAD_MERCHANT_NUMBER', '01XXXXXXXXX'),
        'min_amount' => env('NAGAD_MIN_AMOUNT', 50),
        'max_amount' => env('NAGAD_MAX_AMOUNT', 10000),
        'currency' => 'BDT',
    ],

    'stripe' => [
        'enabled' => env('STRIPE_ENABLED', false),
        'public_key' => env('STRIPE_PUBLIC_KEY'),
        'secret_key' => env('STRIPE_SECRET_KEY'),
    ],

    'paypal' => [
        'enabled' => env('PAYPAL_ENABLED', false),
        'client_id' => env('PAYPAL_CLIENT_ID'),
        'client_secret' => env('PAYPAL_CLIENT_SECRET'),
        'sandbox' => env('PAYPAL_SANDBOX', true),
    ],
];
