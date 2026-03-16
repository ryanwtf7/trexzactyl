<?php

namespace Trexzactyl\Events\User;

use Trexzactyl\Models\User;
use Trexzactyl\Events\Event;
use Illuminate\Queue\SerializesModels;

class Created extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public User $user)
    {
    }
}
