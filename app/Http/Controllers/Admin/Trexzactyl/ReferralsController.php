<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\ReferralsFormRequest;

class ReferralsController extends Controller
{
    /**
     * RegistrationController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the Trexzactyl referrals interface.
     */
    public function index(): View
    {
        return view('admin.trexzactyl.referrals', [
            'enabled' => $this->settings->get('trexzactyl::referrals:enabled', false),
            'reward' => $this->settings->get('trexzactyl::referrals:reward', 250),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws \Trexzactyl\Exceptions\Model\DataValidationException
     * @throws \Trexzactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(ReferralsFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('trexzactyl::referrals:' . $key, $value);
        }

        $this->alert->success('Referral system has been updated.')->flash();

        return redirect()->route('admin.trexzactyl.referrals');
    }
}
