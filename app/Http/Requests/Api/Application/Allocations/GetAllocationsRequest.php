<?php

namespace Trexzactyl\Http\Requests\Api\Application\Allocations;

use Trexzactyl\Services\Acl\Api\AdminAcl;
use Trexzactyl\Http\Requests\Api\Application\ApplicationApiRequest;

class GetAllocationsRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_ALLOCATIONS;

    protected int $permission = AdminAcl::READ;
}
