<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\ServerFormRequest;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;

class ServerController extends Controller
{
    /**
     * StoreController constructor.
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
        $prefix = 'trexzactyl::renewal:';

        return view('admin.trexzactyl.server', [
            'enabled' => $this->settings->get($prefix . 'enabled', false),
            'default' => $this->settings->get($prefix . 'default', 7),
            'cost' => $this->settings->get($prefix . 'cost', 20),
            'deletion' => $this->settings->get($prefix . 'deletion', true),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws \Trexzactyl\Exceptions\Model\DataValidationException
     * @throws \Trexzactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(ServerFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('trexzactyl::renewal:' . $key, $value);
        }

        $this->alert->success('Trexzactyl Server settings has been updated.')->flash();

        return redirect()->route('admin.trexzactyl.server');
    }
}
