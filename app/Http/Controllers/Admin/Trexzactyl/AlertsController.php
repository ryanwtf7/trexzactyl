<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Exceptions\Model\DataValidationException;
use Trexzactyl\Exceptions\Repository\RecordNotFoundException;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\AlertFormRequest;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;

class AlertsController extends Controller
{
    /**
     * AppearanceController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the Trexzactyl settings interface.
     */
    public function index(): View
    {
        return view('admin.trexzactyl.alerts', [
            'type' => $this->settings->get('trexzactyl::alert:type', 'success'),
            'message' => $this->settings->get('trexzactyl::alert:message'),
        ]);
    }

    /**
     * Update or create an alert.
     *
     * @throws DataValidationException|RecordNotFoundException
     */
    public function update(AlertFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('trexzactyl::' . $key, $value);
        }

        $this->alert->success('Trexzactyl Alert has been updated.')->flash();

        return redirect()->route('admin.trexzactyl.alerts');
    }

    /**
     * Delete the current alert.
     */
    public function remove(): RedirectResponse
    {
        $this->settings->forget('trexzactyl::alert:type');
        $this->settings->forget('trexzactyl::alert:message');

        $this->alert->success('Trexzactyl Alert has been removed.')->flash();

        return redirect()->route('admin.trexzactyl.alerts');
    }
}
