<?php

namespace Trexzactyl\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ServerDeleted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $serverName, public string $username, public ?string $reason = null)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        $message = (new MailMessage())
            ->subject('Server Deleted - ' . $this->serverName)
            ->greeting('Hello ' . $this->username . ',')
            ->line('Your server "' . $this->serverName . '" has been deleted from our system.')
            ->line('**Server Details:**')
            ->line('Server Name: ' . $this->serverName)
            ->line('Deletion Date: ' . now()->format('F j, Y \a\t g:i A'));

        if ($this->reason) {
            $message->line('**Reason:** ' . $this->reason);
        }

        return $message
            ->line('All server data, including files and databases, has been permanently removed.')
            ->line('If this was unexpected or you have questions, please contact our support team.')
            ->action('Visit Panel', route('index'))
            ->salutation('Thank you for using ' . config('app.name') . '.');
    }
}
