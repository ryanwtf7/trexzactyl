<?php

namespace Trexzactyl\Events\Auth;

use Trexzactyl\Models\User;
use Trexzactyl\Events\Event;

class DirectLogin extends Event
{
    public function __construct(public User $user, public bool $remember)
    {
    }
}
