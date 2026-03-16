<?php

namespace Trexzactyl\Contracts\Core;

use Trexzactyl\Events\Event;

interface ReceivesEvents
{
    /**
     * Handles receiving an event from the application.
     */
    public function handle(Event $notification): void;
}
