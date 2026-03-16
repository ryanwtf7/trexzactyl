<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Settings;

use Trexzactyl\Models\Server;
use Webmozart\Assert\Assert;
use Illuminate\Validation\Rule;
use Trexzactyl\Models\Permission;
use Trexzactyl\Contracts\Http\ClientPermissionsRequest;
use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class SetDockerImageRequest extends ClientApiRequest implements ClientPermissionsRequest
{
    public function permission(): string
    {
        return Permission::ACTION_STARTUP_DOCKER_IMAGE;
    }

    public function rules(): array
    {
        /** @var \Trexzactyl\Models\Server $server */
        $server = $this->route()->parameter('server');

        Assert::isInstanceOf($server, Server::class);

        return [
            'docker_image' => ['required', 'string', Rule::in(array_values($server->egg->docker_images))],
        ];
    }
}
