<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Startup;

use Trexzactyl\Models\Permission;
use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class GetStartupRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_STARTUP_READ;
    }
}
