<?php

namespace Trexzactyl\Notifications;

use Trexzactyl\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class DiscordAccountCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public User $user, public string $tempPassword)
    {
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage())
            ->greeting('Welcome to ' . config('app.name') . ', ' . $this->user->name_first . '!')
            ->line('Your account has been created via Discord.')
            ->line('Username: ' . $this->user->username)
            ->line('Temporary Password: ' . $this->tempPassword)
            ->line('We recommend changing your password immediately after logging in.')
            ->action('Login Now', route('auth.login'));
    }
}
