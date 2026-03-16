<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Network;

use Trexzactyl\Models\Allocation;
use Trexzactyl\Models\Permission;
use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class UpdateAllocationRequest extends ClientApiRequest
{
    public function permission(): string
    {
        return Permission::ACTION_ALLOCATION_UPDATE;
    }

    public function rules(): array
    {
        $rules = Allocation::getRules();

        return [
            'notes' => array_merge($rules['notes'], ['present']),
        ];
    }
}
