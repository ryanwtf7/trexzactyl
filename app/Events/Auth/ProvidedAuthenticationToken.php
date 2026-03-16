<?php

namespace Trexzactyl\Events\Auth;

use Trexzactyl\Models\User;
use Trexzactyl\Events\Event;

class ProvidedAuthenticationToken extends Event
{
    public function __construct(public User $user, public bool $recovery = false)
    {
    }
}
