<?php

namespace Trexzactyl\Http\Requests\Api\Application\Nests\Eggs;

use Trexzactyl\Services\Acl\Api\AdminAcl;
use Trexzactyl\Http\Requests\Api\Application\ApplicationApiRequest;

class GetEggRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_EGGS;

    protected int $permission = AdminAcl::READ;
}
