<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Trexzactyl\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TicketCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Ticket $ticket, public User $user)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->greeting('Hello ' . $this->user->username . '.')
            ->line('We have received your support ticket.')
            ->line('Ticket ID: #' . $this->ticket->id)
            ->line('Title: ' . $this->ticket->title)
            ->action('View Ticket', url('/tickets/' . $this->ticket->id));
    }
}
