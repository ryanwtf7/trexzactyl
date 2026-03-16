<?php

namespace Trexzactyl\Http\Requests\Api\Application\Servers\Databases;

use Trexzactyl\Services\Acl\Api\AdminAcl;

class ServerDatabaseWriteRequest extends GetServerDatabasesRequest
{
    protected int $permission = AdminAcl::WRITE;
}
