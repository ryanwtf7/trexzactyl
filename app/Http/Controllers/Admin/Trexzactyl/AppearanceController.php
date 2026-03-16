<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Illuminate\Contracts\Config\Repository;
use Trexzactyl\Traits\Commands\EnvironmentWriterTrait;
use Trexzactyl\Exceptions\Model\DataValidationException;
use Trexzactyl\Exceptions\Repository\RecordNotFoundException;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\AppearanceFormRequest;

class AppearanceController extends Controller
{
    use EnvironmentWriterTrait;

    /**
     * AppearanceController constructor.
     */
    public function __construct(
        private Repository $config,
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the Trexzactyl settings interface.
     */
    public function index(): View
    {
        return view('admin.trexzactyl.appearance', [
            'name' => config('app.name'),
            'logo' => config('app.logo'),


            'user' => ['background' => config('theme.user.background')],
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws DataValidationException|RecordNotFoundException
     */
    public function update(AppearanceFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('settings::' . $key, $value);
        }

        $this->writeToEnvironment([
            'APP_NAME' => $request->input('app:name'),
        ]);

        $this->alert->success('Trexzactyl Appearance has been updated.')->flash();

        return redirect()->route('admin.trexzactyl.appearance');
    }
}
