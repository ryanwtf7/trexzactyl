<?php

namespace Trexzactyl\Http\Requests\Api\Application\Users;

use Trexzactyl\Services\Acl\Api\AdminAcl as Acl;
use Trexzactyl\Http\Requests\Api\Application\ApplicationApiRequest;

class GetUsersRequest extends ApplicationApiRequest
{
    protected ?string $resource = Acl::RESOURCE_USERS;

    protected int $permission = Acl::READ;
}
