<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Schedules;

use Trexzactyl\Models\Permission;

class UpdateScheduleRequest extends StoreScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_UPDATE;
    }
}
