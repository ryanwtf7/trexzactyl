<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Trexzactyl\Models\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ServerSuspended extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Server $server, public User $user, public ?string $reason = null)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        $message = (new MailMessage())
            ->subject('Server Suspended - ' . $this->server->name)
            ->greeting('Hello ' . $this->user->username . ',')
            ->line('Your server has been suspended and is no longer accessible.')
            ->line('**Server Details:**')
            ->line('Server Name: ' . $this->server->name)
            ->line('Server ID: ' . $this->server->uuidShort)
            ->line('Suspension Date: ' . now()->format('F j, Y \a\t g:i A'));

        if ($this->reason) {
            $message->line('**Reason:** ' . $this->reason);
        }

        return $message
            ->line('**What this means:**')
            ->line('• Your server is temporarily unavailable')
            ->line('• All server processes have been stopped')
            ->line('• Your files and data remain safe')
            ->line('• The server can be unsuspended once the issue is resolved')
            ->line('Please contact our support team to resolve this issue and have your server unsuspended.')
            ->action('Contact Support', route('index'))
            ->salutation('Thank you for your understanding.');
    }
}