<?php

namespace Trexzactyl\Http\Requests\Api\Application\Nodes;

use Trexzactyl\Services\Acl\Api\AdminAcl;
use Trexzactyl\Http\Requests\Api\Application\ApplicationApiRequest;

class GetNodesRequest extends ApplicationApiRequest
{
    protected ?string $resource = AdminAcl::RESOURCE_NODES;

    protected int $permission = AdminAcl::READ;
}
