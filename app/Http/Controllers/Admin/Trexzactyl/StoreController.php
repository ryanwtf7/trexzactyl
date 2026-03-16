<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Trexzactyl\Http\Controllers\Controller;
use Trexzactyl\Exceptions\Model\DataValidationException;
use Trexzactyl\Exceptions\Repository\RecordNotFoundException;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\StoreFormRequest;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;

class StoreController extends Controller
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
     * Render the Trexzactyl store settings interface.
     */
    public function index(): View
    {
        $prefix = 'trexzactyl::store:';

        $currencies = [];
        foreach (config('store.currencies') as $key => $value) {
            $currencies[] = ['code' => $key, 'name' => $value];
        }

        return view('admin.trexzactyl.store', [
            'enabled' => $this->settings->get($prefix . 'enabled', false),
            'paypal_enabled' => $this->settings->get($prefix . 'paypal:enabled', false),
            'stripe_enabled' => $this->settings->get($prefix . 'stripe:enabled', false),
            'bkash_enabled' => $this->settings->get($prefix . 'bkash:enabled', false),
            'nagad_enabled' => $this->settings->get($prefix . 'nagad:enabled', false),
            'selected_currency' => $this->settings->get($prefix . 'currency', 'USD'),
            'currencies' => $currencies,

            'earn_enabled' => $this->settings->get('trexzactyl::earn:enabled', false),
            'earn_amount' => $this->settings->get('trexzactyl::earn:amount', 1),

            'cpu' => $this->settings->get($prefix . 'cost:cpu', 100),
            'memory' => $this->settings->get($prefix . 'cost:memory', 50),
            'disk' => $this->settings->get($prefix . 'cost:disk', 25),
            'slot' => $this->settings->get($prefix . 'cost:slot', 250),
            'port' => $this->settings->get($prefix . 'cost:port', 20),
            'backup' => $this->settings->get($prefix . 'cost:backup', 20),
            'database' => $this->settings->get($prefix . 'cost:database', 20),

            'limit_cpu' => $this->settings->get($prefix . 'limit:cpu', 100),
            'limit_memory' => $this->settings->get($prefix . 'limit:memory', 4096),
            'limit_disk' => $this->settings->get($prefix . 'limit:disk', 10240),
            'limit_port' => $this->settings->get($prefix . 'limit:port', 1),
            'limit_backup' => $this->settings->get($prefix . 'limit:backup', 1),
            'limit_database' => $this->settings->get($prefix . 'limit:database', 1),

            'paypal_client_id' => $this->settings->get($prefix . 'paypal:client_id', config('gateways.paypal.client_id')),
            'paypal_client_secret' => $this->settings->get($prefix . 'paypal:client_secret', config('gateways.paypal.client_secret')),
            'stripe_secret' => $this->settings->get($prefix . 'stripe:secret', config('gateways.stripe.secret')),
            'stripe_webhook_secret' => $this->settings->get($prefix . 'stripe:webhook_secret', config('gateways.stripe.webhook_secret')),
            'bkash_number' => $this->settings->get($prefix . 'bkash:number', config('gateways.bkash.number')),
            'nagad_number' => $this->settings->get($prefix . 'nagad:number', config('gateways.nagad.number')),
            'conversion_rate' => $this->settings->get($prefix . 'conversion_rate', 115),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(StoreFormRequest $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('trexzactyl::' . $key, $value);
        }

        $this->alert->success('If you have enabled a payment gateway, please remember to configure them. <a href="https://docs.trexz.xyz">Documentation</a>')->flash();

        return redirect()->route('admin.trexzactyl.store');
    }
}
