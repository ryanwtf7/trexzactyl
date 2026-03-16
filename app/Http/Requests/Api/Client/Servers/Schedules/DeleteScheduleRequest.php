<?php

namespace Trexzactyl\Http\Requests\Api\Client\Servers\Schedules;

use Trexzactyl\Models\Permission;

class DeleteScheduleRequest extends ViewScheduleRequest
{
    public function permission(): string
    {
        return Permission::ACTION_SCHEDULE_DELETE;
    }
}
