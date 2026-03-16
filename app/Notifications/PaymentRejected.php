<?php

namespace Trexzactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Trexzactyl\Models\Payment;

class PaymentRejected extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Payment $payment, public ?string $reason = null)
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

        $message = (new MailMessage())
            ->subject('Payment Rejected')
            ->greeting('Hello!')
            ->line('Unfortunately, your payment has been rejected.')
            ->line('**Payment Details:**')
            ->line('Amount: ' . $this->payment->credit_amount . ' BDT')
            ->line('Payment Method: ' . $paymentMethod)
            ->line('Transaction ID: ' . $this->payment->transaction_id)
            ->line('Status: Rejected');

        if ($this->reason) {
            $message->line('**Reason:** ' . $this->reason);
        }

        return $message
            ->line('If you believe this is an error or have questions about the rejection, please contact our support team with your transaction details.')
            ->line('You can submit a new payment with the correct information.')
            ->salutation('Thank you for your understanding.');
    }
}