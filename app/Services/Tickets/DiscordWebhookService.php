<?php

namespace Trexzactyl\Services\Tickets;

use Illuminate\Support\Facades\Http;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;

class DiscordWebhookService
{
    public function __construct(protected SettingsRepositoryInterface $settings)
    {
    }

    /**
     * Send a notification to Discord via Webhook.
     */
    public function dispatch(string $title, string $description, int $ticketId, string $userEmail): void
    {
        $url = $this->settings->get('Trexzactyl::tickets:webhook', '');
        if (empty($url)) {
            return;
        }

        Http::post($url, [
            'embeds' => [
                [
                    'title' => $title,
                    'description' => $description,
                    'color' => 3447003, // Blue
                    'fields' => [
                        [
                            'name' => 'Ticket ID',
                            'value' => '#' . $ticketId,
                            'inline' => true,
                        ],
                        [
                            'name' => 'User',
                            'value' => $userEmail,
                            'inline' => true,
                        ],
                    ],
                    'footer' => [
                        'text' => 'Trexzactyl Ticket System',
                    ],
                    'timestamp' => now()->toIso8601String(),
                ],
            ],
        ]);
    }
}
