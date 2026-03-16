<?php

namespace Trexzactyl\Events\Server;

use Trexzactyl\Events\Event;
use Trexzactyl\Models\Server;
use Illuminate\Queue\SerializesModels;

class Installed extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Server $server)
    {
    }
}
