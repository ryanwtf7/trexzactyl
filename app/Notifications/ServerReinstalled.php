<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Trexzactyl\Models\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ServerReinstalled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Server $server, public User $user)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->subject('Server Reinstalled - ' . $this->server->name)
            ->greeting('Hello ' . $this->user->username . ',')
            ->line('Your server has been successfully reinstalled as requested.')
            ->line('**Server Details:**')
            ->line('Server Name: ' . $this->server->name)
            ->line('Server ID: ' . $this->server->uuidShort)
            ->line('Reinstall Date: ' . now()->format('F j, Y \a\t g:i A'))
            ->line('**Important Notes:**')
            ->line('• All previous server files have been removed')
            ->line('• The server is being set up with a fresh installation')
            ->line('• You may need to reconfigure your server settings')
            ->line('• It may take a few minutes for the server to be fully ready')
            ->action('Access Server', route('server.index', $this->server->uuidShort))
            ->line('If you experience any issues, please contact our support team.')
            ->salutation('Thank you for using ' . config('app.name') . '!');
    }
}
