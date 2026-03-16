<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public $amount;
    public $currency;

    /**
     * Create a new notification instance.
     */
    public function __construct(int $amount, string $currency)
    {
        $this->amount = $amount;
        $this->currency = $currency;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Approved - ' . config('app.name'))
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your payment of ' . $this->amount . ' credits via ' . ucfirst($this->currency) . ' has been approved.')
            ->line('The credits have been added to your account balance.')
            ->action('View Store', url('/store'))
            ->line('Thank you for using our services!');
    }
}
