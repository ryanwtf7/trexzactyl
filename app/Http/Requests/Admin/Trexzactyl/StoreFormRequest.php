<?php

namespace Trexzactyl\Http\Requests\Admin\Trexzactyl;

use Trexzactyl\Http\Requests\Admin\AdminFormRequest;

class StoreFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'store:enabled' => 'required|in:true,false',
            'store:paypal:enabled' => 'required|in:true,false',
            'store:paypal:client_id' => 'nullable|string',
            'store:paypal:client_secret' => 'nullable|string',
            'store:stripe:enabled' => 'required|in:true,false',
            'store:stripe:secret' => 'nullable|string',
            'store:stripe:webhook_secret' => 'nullable|string',
            'store:bkash:enabled' => 'required|in:true,false',
            'store:bkash:number' => 'nullable|numeric',
            'store:nagad:enabled' => 'required|in:true,false',
            'store:nagad:number' => 'nullable|numeric',
            'store:currency' => 'required|min:1|max:10',
            'store:conversion_rate' => 'required|numeric|min:0',

            'earn:enabled' => 'required|in:true,false',
            'earn:amount' => 'required|numeric|min:0',

            'store:cost:cpu' => 'required|int|min:1',
            'store:cost:memory' => 'required|int|min:1',
            'store:cost:disk' => 'required|int|min:1',
            'store:cost:slot' => 'required|int|min:1',
            'store:cost:port' => 'required|int|min:1',
            'store:cost:backup' => 'required|int|min:1',
            'store:cost:database' => 'required|int|min:1',

            'store:limit:cpu' => 'required|int|min:1',
            'store:limit:memory' => 'required|int|min:1',
            'store:limit:disk' => 'required|int|min:1',
            'store:limit:port' => 'required|int|min:1',
            'store:limit:backup' => 'required|int|min:1',
            'store:limit:database' => 'required|int|min:1',
        ];
    }
}
