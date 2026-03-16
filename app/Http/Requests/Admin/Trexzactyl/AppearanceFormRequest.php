<?php

namespace Trexzactyl\Http\Requests\Admin\Trexzactyl;

use Trexzactyl\Http\Requests\Admin\AdminFormRequest;

class AppearanceFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'app:name' => 'required|string|max:191',
            'app:logo' => 'required|string|max:191',
            'theme:user:background' => 'nullable|url',

        ];
    }
}
