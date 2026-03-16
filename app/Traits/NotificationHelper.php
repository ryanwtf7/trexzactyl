<?php

namespace Trexzactyl\Traits;

trait NotificationHelper
{
    /**
     * Check if notifications are globally enabled.
     */
    protected function notificationsEnabled(): bool
    {
        return config('notifications.enabled', true);
    }

    /**
     * Check if a specific notification type is enabled.
     */
    protected function notificationEnabled(string $type, string $event): bool
    {
        if (!$this->notificationsEnabled()) {
            return false;
        }

        return config("notifications.{$type}.{$event}", true);
    }

    /**
     * Send notification if enabled.
     */
    protected function sendNotificationIfEnabled($notifiable, $notification, string $type, string $event): void
    {
        if ($this->notificationEnabled($type, $event)) {
            $notifiable->notify($notification);
        }
    }
}