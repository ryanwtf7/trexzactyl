<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Trexzactyl\Models\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ServerUnsuspended extends Notification implements ShouldQueue
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
            ->subject('Server Unsuspended - ' . $this->server->name)
            ->greeting('Hello ' . $this->user->username . ',')
            ->line('Great news! Your server has been unsuspended and is now accessible again.')
            ->line('**Server Details:**')
            ->line('Server Name: ' . $this->server->name)
            ->line('Server ID: ' . $this->server->uuidShort)
            ->line('Unsuspension Date: ' . now()->format('F j, Y \a\t g:i A'))
            ->line('**What you can do now:**')
            ->line('• Start your server from the control panel')
            ->line('• Access all your files and configurations')
            ->line('• Resume normal server operations')
            ->action('Access Server', route('server.index', $this->server->uuidShort))
            ->line('Thank you for resolving the issue. If you have any questions, feel free to contact our support team.')
            ->salutation('Welcome back to ' . config('app.name') . '!');
    }
}