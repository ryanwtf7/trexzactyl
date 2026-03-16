<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Files;

use Trexzactyl\Models\Permission;
use Trexzactyl\Contracts\Http\ClientPermissionsRequest;
use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class CopyFileRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_FILE_CREATE;
    }

    public function rules(): array
    {
        return [
            'location' => 'required|string',
        ];
    }
}
