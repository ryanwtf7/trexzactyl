<?php

namespace Trexzactyl\Facades;

use Illuminate\Support\Facades\Facade;
use Trexzactyl\Services\Activity\ActivityLogService;

class Activity extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return ActivityLogService::class;
    }
}
