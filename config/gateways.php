<?php

/*
|--------------------------------------------------------------------------
| Trexzactyl Gateways
|--------------------------------------------------------------------------
| This configuration file is used to determine the settings for Trexzactyl's
| payment gateways (Stripe and PayPal by default).
*/

return [
    /*
    |--------------------------------------------------------------------------
    | Preferred Currency
    |--------------------------------------------------------------------------
    | This value determines what currency to process orders in.
    |
    */
    'currency' => env('STORE_CURRENCY', 'USD'),

    /*
    |--------------------------------------------------------------------------
    | Cost per 100 credits
    |--------------------------------------------------------------------------
    | This value determines how much 100 credits costs. Defaults to $1 USD.
    |
    */
    'cost' => env('STORE_COST', 1.00),

    /*
    |--------------------------------------------------------------------------
    | PayPal Configuration
    |--------------------------------------------------------------------------
    | These values determine the configuration for the PayPal purchase system.
    |
    */
    'paypal' => [
        'client_id' => env('PAYPAL_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Stripe Configuration
    |--------------------------------------------------------------------------
    | These values determine the configuration for the Stripe purchase system.
    |
    */
    'stripe' => [
        'secret' => env('STRIPE_CLIENT_SECRET', ''),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Manual Payment Configuration (Bangladesh)
    |--------------------------------------------------------------------------
    | These values determine the configuration for manual payments via bKash/Nagad.
    |
    */
    'bkash' => [
        'number' => env('BKASH_NUMBER', ''),
    ],

    'nagad' => [
        'number' => env('NAGAD_NUMBER', ''),
    ],
];
