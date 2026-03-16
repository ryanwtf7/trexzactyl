<?php

namespace Trexzactyl\Services\Store;

use Trexzactyl\Models\Egg;
use Trexzactyl\Models\Nest;
use Trexzactyl\Models\Node;
use Trexzactyl\Models\Server;
use Trexzactyl\Models\Allocation;
use Trexzactyl\Models\EggVariable;
use Trexzactyl\Exceptions\DisplayException;
use Trexzactyl\Services\Servers\ServerCreationService;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Http\Requests\Api\Client\Store\CreateServerRequest;
use Trexzactyl\Exceptions\Service\Deployment\NoViableAllocationException;

class StoreCreationService
{
    public function __construct(
        private SettingsRepositoryInterface $settings,
        private ServerCreationService $creationService,
        private StoreVerificationService $verifyService
    ) {
    }

    /**
     * Creates a server on Trexzactyl using the Storefront.
     *
     * @throws DisplayException
     */
    public function handle(CreateServerRequest $request): Server
    {
        $egg = Egg::find($request->input('egg'));
        $nest = Nest::find($request->input('nest'))->id;
        $node = Node::find($request->input('node'))->id;

        $this->verifyService->handle($request);

        $data = [
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'owner_id' => $request->user()->id,
            'egg_id' => $egg->id,
            'nest_id' => $nest,
            'node_id' => $node,
            'allocation_id' => $this->getAllocation($node),
            'allocation_limit' => $request->input('ports'),
            'backup_limit' => $request->input('backups'),
            'database_limit' => $request->input('databases'),
            'environment' => [],
            'memory' => $request->input('memory'),
            'disk' => $request->input('disk'),
            'cpu' => $request->input('cpu'),
            'swap' => 0,
            'io' => 500,
            'image' => array_values($egg->docker_images)[0],
            'startup' => $egg->startup,
            'start_on_completion' => false,
            // Settings for the renewal system. Even if the renewal system is disabled,
            // mark this server as enabled - so that if the renewal system is enabled again,
            // it'll be part of the renewable servers.
            'renewable' => true,
            'renewal' => $this->settings->get('Trexzactyl::renewal:default'),
        ];

        foreach (EggVariable::where('egg_id', $egg->id)->get() as $var) {
            $key = "v1-{$egg->id}-{$var->env_variable}";
            $data['environment'][$var->env_variable] = $request->get($key, $var->default_value);
        }

        // Deduct the deployment fee from the user's balance.
        $fee = Node::find($node)->deploy_fee;
        if ($fee > 0) {
            $request->user()->decrement('store_balance', $fee);
        }

        return $this->creationService->handle($data);
    }

    /**
     * Gets an allocation for server deployment.
     *
     * @throws NoViableAllocationException
     */
    protected function getAllocation(int $node): int
    {
        $allocation = Allocation::where('node_id', $node)->where('server_id', null)->first();

        if (!$allocation) {
            throw new NoViableAllocationException('No allocations are available for deployment.');
        }

        return $allocation->id;
    }
}
