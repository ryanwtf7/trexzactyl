<?php

namespace Trexzactyl\Http\Controllers\Api\Application\Servers;

use Trexzactyl\Models\Server;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Spatie\QueryBuilder\QueryBuilder;
use Trexzactyl\Services\Servers\ServerCreationService;
use Trexzactyl\Services\Servers\ServerDeletionService;
use Trexzactyl\Transformers\Api\Application\ServerTransformer;
use Trexzactyl\Http\Requests\Api\Application\Servers\GetServerRequest;
use Trexzactyl\Http\Requests\Api\Application\Servers\GetServersRequest;
use Trexzactyl\Http\Requests\Api\Application\Servers\ServerWriteRequest;
use Trexzactyl\Http\Requests\Api\Application\Servers\StoreServerRequest;
use Trexzactyl\Http\Controllers\Api\Application\ApplicationApiController;

class ServerController extends ApplicationApiController
{
    /**
     * ServerController constructor.
     */
    public function __construct(
        private ServerCreationService $creationService,
        private ServerDeletionService $deletionService
    ) {
        parent::__construct();
    }

    /**
     * Return all the servers that currently exist on the Panel.
     */
    public function index(GetServersRequest $request): array
    {
        $servers = QueryBuilder::for(Server::query())
            ->allowedFilters(['uuid', 'uuidShort', 'name', 'description', 'image', 'external_id'])
            ->allowedSorts(['id', 'uuid'])
            ->paginate($request->query('per_page') ?? 50);

        return $this->fractal->collection($servers)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->toArray();
    }

    /**
     * Create a new server on the system.
     *
     * @throws \Throwable
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Trexzactyl\Exceptions\DisplayException
     * @throws \Trexzactyl\Exceptions\Model\DataValidationException
     * @throws \Trexzactyl\Exceptions\Repository\RecordNotFoundException
     * @throws \Trexzactyl\Exceptions\Service\Deployment\NoViableAllocationException
     * @throws \Trexzactyl\Exceptions\Service\Deployment\NoViableNodeException
     */
    public function store(StoreServerRequest $request): JsonResponse
    {
        $server = $this->creationService->handle($request->validated(), $request->getDeploymentObject());

        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->respond(201);
    }

    /**
     * Show a single server transformed for the application API.
     */
    public function view(GetServerRequest $request, Server $server): array
    {
        return $this->fractal->item($server)
            ->transformWith($this->getTransformer(ServerTransformer::class))
            ->toArray();
    }

    /**
     * Deletes a server.
     *
     * @throws \Trexzactyl\Exceptions\DisplayException
     */
    public function delete(ServerWriteRequest $request, Server $server, string $force = ''): Response
    {
        $this->deletionService
            ->withForce($force === 'force')
            ->returnResources($request->filled('return_resources'))
            ->handle($server);

        return $this->returnNoContent();
    }
}
