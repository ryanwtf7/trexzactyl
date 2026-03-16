<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers;

use Trexzactyl\Models\Permission;
use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class ShareConsoleRequest extends ClientApiRequest
{
    /**
     * Determine if the API user has permission to perform this action.
     */
    public function permission(): string
    {
        return Permission::ACTION_CONTROL_CONSOLE;
    }
}
