<?php

namespace Trexzactyl\Facades;

use Illuminate\Support\Facades\Facade;
use Trexzactyl\Services\Activity\ActivityLogBatchService;

class LogBatch extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogBatchService::class;
    }
}
