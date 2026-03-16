<?php

namespace Trexzactyl\Http\Controllers\Api\Client\Store;

use Trexzactyl\Models\Nest;
use Trexzactyl\Models\Node;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Trexzactyl\Exceptions\DisplayException;
use Trexzactyl\Services\Store\StoreCreationService;
use Trexzactyl\Transformers\Api\Client\Store\EggTransformer;
use Trexzactyl\Transformers\Api\Client\Store\NestTransformer;
use Trexzactyl\Transformers\Api\Client\Store\NodeTransformer;
use Trexzactyl\Http\Controllers\Api\Client\ClientApiController;
use Trexzactyl\Http\Requests\Api\Client\Store\CreateServerRequest;
use Trexzactyl\Exceptions\Service\Deployment\NoViableNodeException;

class ServerController extends ClientApiController
{
    /**
     * ServerController constructor.
     */
    public function __construct(private StoreCreationService $creationService)
    {
        parent::__construct();
    }

    public function nodes(Request $request): array
    {
        $nodes = Node::where('deployable', true)->get();

        return $this->fractal->collection($nodes)
            ->transformWith($this->getTransformer(NodeTransformer::class))
            ->toArray();
    }

    /**
     * Get all available nests for server deployment.
     */
    public function nests(Request $request): array
    {
        $nests = Nest::where('private', false)->get();

        return $this->fractal->collection($nests)
            ->transformWith($this->getTransformer(NestTransformer::class))
            ->toArray();
    }

    /**
     * Get all available eggs for server deployment.
     */
    public function eggs(Request $request): array
    {
        $id = $request->input('id') ?? Nest::where('private', false)->first()->id;
        $eggs = Nest::query()->where('id', $id)->where('private', false)->first()->eggs;

        return $this->fractal->collection($eggs)
            ->transformWith($this->getTransformer(EggTransformer::class))
            ->toArray();
    }

    /**
     * Stores a new server on the Panel.
     *
     * @throws DisplayException
     * @throws NoViableNodeException
     */
    public function store(CreateServerRequest $request): JsonResponse
    {
        $user = $request->user();
        $fee = Node::find($request->input('node'))->deploy_fee;

        if (!$user->verified) {
            throw new DisplayException('Server deployment is unavailable for unverified accounts.');
        }

        if (Nest::find($request->input('nest'))->private) {
            throw new DisplayException('This nest is private and cannot be deployed to.');
        }

        if ($user->store_slots < 1) {
            throw new DisplayException('You do not have enough server slots in order to deploy a server.');
        }

        $server = $this->creationService->handle($request);

        $user->update([
            'store_balance' => max(0, $user->store_balance - ($fee ?? 0)),
            'store_cpu' => $user->store_cpu - $request->input('cpu'),
            'store_memory' => $user->store_memory - $request->input('memory'),
            'store_disk' => $user->store_disk - $request->input('disk'),
            'store_slots' => $user->store_slots - 1,
            'store_ports' => $user->store_ports - $request->input('ports'),
            'store_backups' => $user->store_backups - $request->input('backups'),
            'store_databases' => $user->store_databases - $request->input('databases'),
        ]);

        return new JsonResponse(['id' => $server->uuidShort]);
    }
}
