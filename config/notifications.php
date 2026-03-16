<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Notification Settings
    |--------------------------------------------------------------------------
    |
    | This configuration file controls which notifications are sent to users
    | and administrators for various events in the system.
    |
    */

    'enabled' => env('NOTIFICATIONS_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Payment Notifications
    |--------------------------------------------------------------------------
    |
    | Control which payment-related notifications are sent.
    |
    */
    'payments' => [
        'pending' => env('NOTIFY_PAYMENT_PENDING', true),
        'processing' => env('NOTIFY_PAYMENT_PROCESSING', true),
        'approved' => env('NOTIFY_PAYMENT_APPROVED', true),
        'rejected' => env('NOTIFY_PAYMENT_REJECTED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Server Notifications
    |--------------------------------------------------------------------------
    |
    | Control which server-related notifications are sent.
    |
    */
    'servers' => [
        'installed' => env('NOTIFY_SERVER_INSTALLED', true),
        'reinstalled' => env('NOTIFY_SERVER_REINSTALLED', true),
        'deleted' => env('NOTIFY_SERVER_DELETED', true),
        'suspended' => env('NOTIFY_SERVER_SUSPENDED', true),
        'unsuspended' => env('NOTIFY_SERVER_UNSUSPENDED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Account Notifications
    |--------------------------------------------------------------------------
    |
    | Control which account-related notifications are sent.
    |
    */
    'account' => [
        'created' => env('NOTIFY_ACCOUNT_CREATED', true),
        'verified' => env('NOTIFY_ACCOUNT_VERIFIED', true),
        'password_reset' => env('NOTIFY_PASSWORD_RESET', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Admin Notifications
    |--------------------------------------------------------------------------
    |
    | Control which notifications are sent to administrators.
    |
    */
    'admin' => [
        'new_payment' => env('NOTIFY_ADMIN_NEW_PAYMENT', true),
        'new_user' => env('NOTIFY_ADMIN_NEW_USER', false),
        'server_issues' => env('NOTIFY_ADMIN_SERVER_ISSUES', true),
    ],
];