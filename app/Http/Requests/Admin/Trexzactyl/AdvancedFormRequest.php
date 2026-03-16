<?php

namespace Trexzactyl\Http\Requests\Admin\Trexzactyl;

use Trexzactyl\Http\Requests\Admin\AdminFormRequest;

class AdvancedFormRequest extends AdminFormRequest
{
    /**
     * Return all the rules to apply to this request's data.
     */
    public function rules(): array
    {
        return [
            'trexzactyl:auth:2fa_required' => 'required|integer|in:0,1,2',

            'recaptcha:enabled' => 'required|in:true,false',
            'recaptcha:secret_key' => 'required|string|max:191',
            'recaptcha:website_key' => 'required|string|max:191',
            'trexzactyl:guzzle:timeout' => 'required|integer|between:1,60',
            'trexzactyl:guzzle:connect_timeout' => 'required|integer|between:1,60',

            'trexzactyl:client_features:allocations:enabled' => 'required|in:true,false',
            'trexzactyl:client_features:allocations:range_start' => [
                'nullable',
                'required_if:trexzactyl:client_features:allocations:enabled,true',
                'integer',
                'between:1024,65535',
            ],
            'trexzactyl:client_features:allocations:range_end' => [
                'nullable',
                'required_if:trexzactyl:client_features:allocations:enabled,true',
                'integer',
                'between:1024,65535',
                'gt:trexzactyl:client_features:allocations:range_start',
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'recaptcha:enabled' => 'reCAPTCHA Enabled',
            'recaptcha:secret_key' => 'reCAPTCHA Secret Key',
            'recaptcha:website_key' => 'reCAPTCHA Website Key',
            'trexzactyl:guzzle:timeout' => 'HTTP Request Timeout',
            'trexzactyl:guzzle:connect_timeout' => 'HTTP Connection Timeout',
            'trexzactyl:client_features:allocations:enabled' => 'Auto Create Allocations Enabled',
            'trexzactyl:client_features:allocations:range_start' => 'Starting Port',
            'trexzactyl:client_features:allocations:range_end' => 'Ending Port',
        ];
    }
}
