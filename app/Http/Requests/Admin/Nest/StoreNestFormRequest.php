<?php

namespace Trexzactyl\Http\Requests\Admin\Nest;

use Trexzactyl\Http\Requests\Admin\AdminFormRequest;

class StoreNestFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:1|max:191',
            'description' => 'string|nullable',
            'private' => 'required|in:0,1',
        ];
    }
}
