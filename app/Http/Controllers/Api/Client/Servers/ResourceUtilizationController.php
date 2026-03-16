<?php

namespace Trexzactyl\Http\Controllers\Api\Client\Servers;

use Carbon\Carbon;
use Trexzactyl\Models\Server;
use Illuminate\Cache\Repository;
use Trexzactyl\Transformers\Api\Client\StatsTransformer;
use Trexzactyl\Repositories\Wings\DaemonServerRepository;
use Trexzactyl\Http\Controllers\Api\Client\ClientApiController;
use Trexzactyl\Http\Requests\Api\Client\Servers\GetServerRequest;

class ResourceUtilizationController extends ClientApiController
{
    /**
     * ResourceUtilizationController constructor.
     */
    public function __construct(private Repository $cache, private DaemonServerRepository $repository)
    {
        parent::__construct();
    }

    /**
     * Return the current resource utilization for a server. This value is cached for up to
     * 20 seconds at a time to ensure that repeated requests to this endpoint do not cause
     * a flood of unnecessary API calls.
     *
     * @throws \Trexzactyl\Exceptions\Http\Connection\DaemonConnectionException
     */
    public function __invoke(GetServerRequest $request, Server $server): array
    {
        $key = "resources:$server->uuid";

        try {
            $stats = $this->cache->remember($key, Carbon::now()->addSeconds(20), function () use ($server) {
                return $this->repository->setServer($server)->getDetails();
            });

            return $this->fractal->item($stats)
                ->transformWith($this->getTransformer(StatsTransformer::class))
                ->toArray();
        } catch (\Trexzactyl\Exceptions\Http\Connection\DaemonConnectionException $exception) {
            // Return a graceful error response when Wings is unreachable
            return [
                'object' => 'stats',
                'attributes' => [
                    'current_state' => $server->status ?? 'offline',
                    'is_suspended' => $server->isSuspended(),
                    'resources' => [
                        'memory_bytes' => 0,
                        'cpu_absolute' => 0,
                        'disk_bytes' => 0,
                        'network_rx_bytes' => 0,
                        'network_tx_bytes' => 0,
                        'uptime' => 0,
                    ],
                ],
            ];
        }
    }
}
