<?php

namespace Trexzactyl\Facades;

use Illuminate\Support\Facades\Facade;
use Trexzactyl\Services\Activity\ActivityLogTargetableService;

class LogTarget extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogTargetableService::class;
    }
}
