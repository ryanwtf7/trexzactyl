<?php

namespace Trexzactyl\Http\Requests\Api\Client\Store;

use Trexzactyl\Http\Requests\Api\Client\ClientApiRequest;

class BkashPaymentRequest extends ClientApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'amount' => [
                'required',
                'integer',
                'min:' . config('trexzactyl.store.bkash.min_amount', 50),
                'max:' . config('trexzactyl.store.bkash.max_amount', 10000),
            ],
            'transaction_id' => [
                'required',
                'string',
                'min:8',
                'max:20',
                'regex:/^[A-Z0-9]+$/',
            ],
            'sender_number' => [
                'required',
                'string',
                'regex:/^01[3-9]\d{8}$/',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'amount.min' => 'Minimum amount is ' . config('trexzactyl.store.bkash.min_amount', 50) . ' BDT',
            'amount.max' => 'Maximum amount is ' . config('trexzactyl.store.bkash.max_amount', 10000) . ' BDT',
            'transaction_id.regex' => 'Transaction ID must contain only uppercase letters and numbers',
            'sender_number.regex' => 'Please enter a valid Bangladeshi mobile number (e.g., 01XXXXXXXXX)',
        ];
    }
}