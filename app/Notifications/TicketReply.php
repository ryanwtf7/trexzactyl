<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Trexzactyl\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TicketReply extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Ticket $ticket, public User $user, public string $replyContent)
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
            ->line('A new reply has been posted to your support ticket.')
            ->line('Ticket ID: #' . $this->ticket->id)
            ->line('Title: ' . $this->ticket->title)
            ->line('---')
            ->line($this->replyContent)
            ->line('---')
            ->action('View Discussion', url('/tickets/' . $this->ticket->id));
    }
}
