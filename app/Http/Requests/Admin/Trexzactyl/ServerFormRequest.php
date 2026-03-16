<?php

namespace Trexzactyl\Http\Requests\Admin\Trexzactyl;

use Trexzactyl\Http\Requests\Admin\AdminFormRequest;

class ServerFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'enabled' => 'required|in:true,false',
            'default' => 'required|int|min:1',
            'cost' => 'required|int|min:0',
            'editing' => 'required|in:true,false',
            'deletion' => 'required|in:true,false',
        ];
    }
}
