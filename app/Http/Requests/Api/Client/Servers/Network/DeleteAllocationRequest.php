<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Network;

use Trexzactyl\Models\Permission;
use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class DeleteAllocationRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_ALLOCATION_DELETE;
    }
}
