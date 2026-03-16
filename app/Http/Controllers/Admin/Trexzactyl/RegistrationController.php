<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Traits\Commands\EnvironmentWriterTrait;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\RegistrationFormRequest;

class RegistrationController extends Controller
{
    use EnvironmentWriterTrait;

    /**
     * RegistrationController constructor.
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
        return view('admin.trexzactyl.registration', [
            'enabled' => $this->settings->get('Trexzactyl::registration:enabled', false),
            'verification' => $this->settings->get('Trexzactyl::registration:verification', false),

            'discord_enabled' => $this->settings->get('Trexzactyl::discord:enabled', false),
            'discord_id' => $this->settings->get('Trexzactyl::discord:id', 0),
            'discord_secret' => $this->settings->get('Trexzactyl::discord:secret', 0),

            'cpu' => $this->settings->get('Trexzactyl::registration:cpu', 100),
            'memory' => $this->settings->get('Trexzactyl::registration:memory', 1024),
            'disk' => $this->settings->get('Trexzactyl::registration:disk', 5120),
            'slot' => $this->settings->get('Trexzactyl::registration:slot', 1),
            'port' => $this->settings->get('Trexzactyl::registration:port', 1),
            'backup' => $this->settings->get('Trexzactyl::registration:backup', 1),
            'database' => $this->settings->get('Trexzactyl::registration:database', 0),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws \Trexzactyl\Exceptions\Model\DataValidationException
     * @throws \Trexzactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(RegistrationFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('Trexzactyl::' . $key, $value);
        }

        $this->writeToEnvironment([
            'DISCORD_CLIENT_ID' => $request->input('discord:id'),
            'DISCORD_CLIENT_SECRET' => $request->input('discord:secret'),
            'DISCORD_REDIRECT_URI' => config('app.url') . '/auth/discord/callback',
        ]);

        $this->alert->success('Trexzactyl Registration has been updated.')->flash();

        return redirect()->route('admin.trexzactyl.registration');
    }
}
