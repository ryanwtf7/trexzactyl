<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Databases;

use Trexzactyl\Models\Permission;
use Trexzactyl\Contracts\Http\ClientPermissionsRequest;
use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class GetDatabasesRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_DATABASE_READ;
    }
}
