<?php

namespace Trexzactyl\Http\Requests\Admin\Payments;

use Trexzactyl\Http\Requests\Admin\AdminFormRequest;

class RejectPaymentRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'reason' => 'required|string|min:10|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'A rejection reason is required.',
            'reason.min' => 'Rejection reason must be at least 10 characters.',
            'reason.max' => 'Rejection reason cannot exceed 500 characters.',
        ];
    }
}