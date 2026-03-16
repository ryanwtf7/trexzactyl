<?php

namespace Trexzactyl\Http\Controllers\Api\Client\Servers;

use Trexzactyl\Models\Server;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Trexzactyl\Services\Servers\ServerDeletionService;
use Trexzactyl\Transformers\Api\Client\ServerTransformer;
use Trexzactyl\Services\Servers\GetUserPermissionsService;
use Trexzactyl\Http\Controllers\Api\Client\ClientApiController;
use Trexzactyl\Http\Requests\Api\Client\Servers\GetServerRequest;
use Trexzactyl\Http\Requests\Api\Client\Servers\DeleteServerRequest;
use Trexzactyl\Http\Requests\Api\Client\Servers\UpdateBackgroundRequest;

class ServerController extends ClientApiController
{
    /**
     * ServerController constructor.
     */
    public function __construct(private GetUserPermissionsService $permissionsService, private ServerDeletionService $deletionService)
    {
        parent::__construct();
    }

    /**
     * Transform an individual server into a response that can be consumed by a
     * client using the API.
     */
    public function index(GetServerRequest $request, Server $server): array
    {
        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->addMeta([
                'is_server_owner' => $request->user()->id === $server->owner_id,
                'user_permissions' => $this->permissionsService->handle($server, $request->user()),
            ])
            ->toArray();
    }

    /**
     * Updates the background image for a server.
     */
    public function updateBackground(UpdateBackgroundRequest $request, Server $server): JsonResponse
    {
        $url = $request->input('bg');
        $server->update(['bg' => $url]);

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }

    /**
     * Deletes the requested server via the API and
     * returns the resources to the authenticated user.
     *
     * @throws DisplayException
     */
    public function delete(DeleteServerRequest $request, Server $server): JsonResponse
    {
        $user = $request->user();

        if ($user->id != $server->owner_id) {
            throw new DisplayException('You are not authorized to perform this action.');
        }

        if ($this->settings->get('Trexzactyl::renewal:deletion') != 'true') {
            throw new DisplayException('This feature has been locked by administrators.');
        }

        // Store server details before deletion
        $serverName = $server->name;
        $username = $user->username;

        try {
            $this->deletionService->returnResources(true)->handle($server);
        } catch (DisplayException $ex) {
            throw new DisplayException('Unable to delete the server from the system.');
        }

        // Send notification after successful deletion
        $user->notify(new \Trexzactyl\Notifications\ServerDeleted($serverName, $username));

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
