<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Extensions\Spatie\Fractalistic\Fractal;
use Trexzactyl\Services\Helpers\SoftwareVersionService;
use Trexzactyl\Repositories\Wings\DaemonServerRepository;
use Trexzactyl\Traits\Controllers\PlainJavascriptInjection;
use Trexzactyl\Contracts\Repository\NodeRepositoryInterface;
use Trexzactyl\Contracts\Repository\ServerRepositoryInterface;

class IndexController extends Controller
{
    use PlainJavascriptInjection;

    public function __construct(
        private Fractal $fractal,
        private DaemonServerRepository $repository,
        private SoftwareVersionService $versionService,
        private NodeRepositoryInterface $nodeRepository,
        private ServerRepositoryInterface $serverRepository,
    ) {
    }

    public function index(): View
    {
        $nodes = $this->nodeRepository->all();
        $servers = $this->serverRepository->all();
        $allocations = DB::table('allocations')->count();
        $suspended = DB::table('servers')->where('status', 'suspended')->count();

        $memoryUsed = 0;
        $memoryTotal = 0;
        $diskUsed = 0;
        $diskTotal = 0;

        foreach ($nodes as $node) {
            $stats = $this->nodeRepository->getUsageStatsRaw($node);

            $memoryUsed += $stats['memory']['value'];
            $memoryTotal += $stats['memory']['max'];
            $diskUsed += $stats['disk']['value'];
            $diskTotal += $stats['disk']['max'];
        }

        $this->injectJavascript([
            'servers' => $servers,
            'diskUsed' => $diskUsed,
            'diskTotal' => $diskTotal,
            'suspended' => $suspended,
            'memoryUsed' => $memoryUsed,
            'memoryTotal' => $memoryTotal,
        ]);

        return view('admin.trexzactyl.index', [
            'version' => $this->versionService,
            'servers' => $servers,
            'allocations' => $allocations,
            'used' => [
                'memory' => $memoryUsed,
                'disk' => $diskUsed,
            ],
            'available' => [
                'memory' => $memoryTotal,
                'disk' => $diskTotal,
            ],
        ]);
    }
}
