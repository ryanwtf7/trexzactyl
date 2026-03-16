<?php

namespace Trexzactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Trexzactyl\Models\Payment;

class PaymentProcessing extends Notification implements ShouldQueue
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
            ->subject('Payment Being Processed')
            ->greeting('Hello!')
            ->line('Your payment is currently being processed.')
            ->line('**Payment Details:**')
            ->line('Amount: ' . $this->payment->credit_amount . ' BDT')
            ->line('Payment Method: ' . $paymentMethod)
            ->line('Transaction ID: ' . $this->payment->transaction_id)
            ->line('Status: Processing')
            ->line('Your credits will be added to your account shortly. You will receive a confirmation email once the process is complete.')
            ->salutation('Thank you for your patience!');
    }
}