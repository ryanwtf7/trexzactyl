<?php

namespace Trexzactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Trexzactyl\Models\Payment;
use Trexzactyl\Http\Controllers\Api\Client\ClientApiController;
use Trexzactyl\Http\Requests\Api\Client\Store\NagadPaymentRequest;
use Trexzactyl\Transformers\Api\Client\Store\OrderTransformer;

class NagadController extends ClientApiController
{
    /**
     * Process a Nagad payment.
     */
    public function purchase(NagadPaymentRequest $request): JsonResponse
    {
        $user = $request->user();

        // Check if transaction ID already exists
        $existingPayment = Payment::where('transaction_id', $request->input('transaction_id'))
            ->where('payment_method', 'nagad')
            ->first();

        if ($existingPayment) {
            return response()->json([
                'error' => 'Transaction ID already exists. Please use a unique transaction ID.'
            ], 422);
        }

        // Create the payment record
        $payment = Payment::create([
            'user_id' => $user->id,
            'amount' => $request->input('amount'),
            'currency' => 'BDT',
            'payment_method' => 'nagad',
            'transaction_id' => $request->input('transaction_id'),
            'sender_number' => $request->input('sender_number'),
            'status' => 'pending',
        ]);

        // Send notification to user
        $user->notify(new \Trexzactyl\Notifications\PaymentPending($payment));

        return $this->fractal->item($payment)
            ->transformWith($this->getTransformer(OrderTransformer::class))
            ->toArray();
    }

    /**
     * Get Nagad payment information and instructions.
     */
    public function info(): JsonResponse
    {
        return response()->json([
            'payment_method' => 'Nagad',
            'instructions' => [
                'Open your Nagad app',
                'Select "Send Money"',
                'Enter the merchant number: ' . config('trexzactyl.store.nagad.merchant_number', '01XXXXXXXXX'),
                'Enter the amount you want to add to your account',
                'Complete the transaction',
                'Copy the transaction ID from the confirmation message',
                'Submit the payment form with your transaction details'
            ],
            'merchant_number' => config('trexzactyl.store.nagad.merchant_number', '01XXXXXXXXX'),
            'min_amount' => config('trexzactyl.store.nagad.min_amount', 50),
            'max_amount' => config('trexzactyl.store.nagad.max_amount', 10000),
            'processing_time' => 'Payments are typically processed within 1-24 hours',
        ]);
    }
}