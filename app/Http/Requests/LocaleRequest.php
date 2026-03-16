<?php

namespace Trexzactyl\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LocaleRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $namespace = $this->input('namespace', $this->input('space'));
        if ($namespace !== null) {
            $this->merge(['namespace' => $namespace]);
        }
        if (!$this->has('locale')) {
            $this->merge(['locale' => app()->getLocale()]);
        }
    }

    public function rules(): array
    {
        return [
            'locale' => ['required', 'string', 'regex:/^[a-z][a-z]$/'],
            'namespace' => ['required', 'string', 'regex:/^[a-z]{1,191}$/'],
        ];
    }
}
