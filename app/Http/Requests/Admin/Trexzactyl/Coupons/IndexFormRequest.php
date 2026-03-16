<?php

namespace Trexzactyl\Http\Requests\Admin\Trexzactyl\Coupons;

use Trexzactyl\Http\Requests\Admin\AdminFormRequest;

class IndexFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'enabled' => 'required|boolean',
        ];
    }
}
