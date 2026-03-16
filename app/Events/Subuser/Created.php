<?php

namespace Trexzactyl\Events\Subuser;

use Trexzactyl\Events\Event;
use Trexzactyl\Models\Subuser;
use Illuminate\Queue\SerializesModels;

class Created extends Event
{
    use SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Subuser $subuser)
    {
    }
}
