<?php

namespace Trexzactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\JsonResponse;
use Trexzactyl\Http\Controllers\Controller;

class PaymentMethodController extends Controller
{
    /**
     * Get available payment methods and their configurations.
     */
    public function index(): JsonResponse
    {
        $paymentMethods = [];

        // bKash
        if (config('trexzactyl.store.bkash.enabled', true)) {
            $paymentMethods['bkash'] = [
                'name' => 'bKash',
                'currency' => 'BDT',
                'merchant_number' => config('trexzactyl.store.bkash.merchant_number', '01XXXXXXXXX'),
                'min_amount' => config('trexzactyl.store.bkash.min_amount', 50),
                'max_amount' => config('trexzactyl.store.bkash.max_amount', 10000),
                'enabled' => true,
                'type' => 'manual',
            ];
        }

        // Nagad
        if (config('trexzactyl.store.nagad.enabled', true)) {
            $paymentMethods['nagad'] = [
                'name' => 'Nagad',
                'currency' => 'BDT',
                'merchant_number' => config('trexzactyl.store.nagad.merchant_number', '01XXXXXXXXX'),
                'min_amount' => config('trexzactyl.store.nagad.min_amount', 50),
                'max_amount' => config('trexzactyl.store.nagad.max_amount', 10000),
                'enabled' => true,
                'type' => 'manual',
            ];
        }

        // Stripe
        if (config('store.stripe.enabled', false)) {
            $paymentMethods['stripe'] = [
                'name' => 'Stripe',
                'currency' => 'USD',
                'enabled' => true,
                'type' => 'automatic',
                'public_key' => config('store.stripe.public_key'),
            ];
        }

        // PayPal
        if (config('store.paypal.enabled', false)) {
            $paymentMethods['paypal'] = [
                'name' => 'PayPal',
                'currency' => 'USD',
                'enabled' => true,
                'type' => 'automatic',
                'client_id' => config('store.paypal.client_id'),
                'sandbox' => config('store.paypal.sandbox', true),
            ];
        }

        return response()->json([
            'payment_methods' => $paymentMethods,
            'default_currency' => 'BDT',
            'supported_currencies' => ['BDT', 'USD'],
        ]);
    }
}