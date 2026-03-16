<?php

namespace Trexzactyl\Transformers\Api\Client\Store;

use Trexzactyl\Models\Payment;
use Trexzactyl\Transformers\Api\Client\BaseClientTransformer;

class OrderTransformer extends BaseClientTransformer
{
    /**
     * Return the resource name for the transformer.
     */
    public function getResourceName(): string
    {
        return 'order';
    }

    /**
     * Transform a payment into an order response.
     */
    public function transform(Payment $payment): array
    {
        return [
            'id' => $payment->id,
            'user_id' => $payment->user_id,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'payment_method' => $payment->payment_method_name,
            'transaction_id' => $payment->transaction_id,
            'sender_number' => $payment->sender_number,
            'status' => $payment->status,
            'status_label' => $payment->status_label,
            'rejection_reason' => $payment->rejection_reason,
            'processed_at' => $payment->processed_at?->toAtomString(),
            'created_at' => $payment->created_at->toAtomString(),
            'updated_at' => $payment->updated_at->toAtomString(),
        ];
    }


}