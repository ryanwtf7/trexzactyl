<?php

namespace Trexzactyl\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'payments';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'amount',
        'currency',
        'payment_method',
        'transaction_id',
        'sender_number',
        'status',
        'rejection_reason',
        'processed_at',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'amount' => 'integer',
        'processed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the status label for display.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending Review',
            'processing' => 'Processing',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get the payment method name for display.
     */
    public function getPaymentMethodNameAttribute(): string
    {
        return match ($this->payment_method) {
            'bkash' => 'bKash',
            'nagad' => 'Nagad',
            'stripe' => 'Stripe',
            'paypal' => 'PayPal',
            default => ucfirst($this->payment_method),
        };
    }
}