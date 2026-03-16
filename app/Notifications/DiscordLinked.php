<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class DiscordLinked extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public User $user)
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
            ->line('Your account has been successfully linked with Discord.')
            ->line('You can now use Discord for faster logins and receive community rewards.')
            ->action('Visit Dashboard', route('index'));
    }
}
