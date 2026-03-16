<?php

namespace Trexzactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TicketDeleted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $ticketId, public string $username)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->greeting('Hello ' . $this->username . '.')
            ->line('Support ticket #' . $this->ticketId . ' has been closed and removed from our system.')
            ->line('If you require further assistance, please open a new ticket.');
    }
}
