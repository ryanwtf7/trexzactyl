<?php

namespace Trexzactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Trexzactyl\Models\Payment;

class PaymentPending extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        $paymentMethod = match ($this->payment->currency) {
            'bkash' => 'bKash',
            'nagad' => 'Nagad',
            default => ucfirst($this->payment->currency),
        };

        return (new MailMessage())
            ->subject('Payment Received - Under Review')
            ->greeting('Hello!')
            ->line('We have received your payment and it is currently under review.')
            ->line('**Payment Details:**')
            ->line('Amount: ' . $this->payment->credit_amount . ' BDT')
            ->line('Payment Method: ' . $paymentMethod)
            ->line('Transaction ID: ' . $this->payment->transaction_id)
            ->line('Status: Pending Review')
            ->line('Our team will review your payment within 1-24 hours. You will receive another email once the payment is processed.')
            ->line('If you have any questions, please contact our support team.')
            ->salutation('Thank you for choosing ' . config('app.name') . '!');
    }
}