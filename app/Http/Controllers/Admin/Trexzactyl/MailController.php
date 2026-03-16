<?php

namespace Trexzactyl\Http\Controllers\Admin\Trexzactyl;

use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Trexzactyl\Notifications\MailTested;
use Illuminate\Contracts\Console\Kernel;
use Trexzactyl\Exceptions\DisplayException;
use Trexzactyl\Http\Controllers\Controller;
use Illuminate\View\Factory as ViewFactory;
use Illuminate\Support\Facades\Notification;
use Illuminate\Contracts\Encryption\Encrypter;
use Trexzactyl\Providers\SettingsServiceProvider;
use Trexzactyl\Traits\Commands\EnvironmentWriterTrait;
use Trexzactyl\Http\Requests\Admin\Trexzactyl\MailFormRequest;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Illuminate\Contracts\Config\Repository as ConfigRepository;

class MailController extends Controller
{
    use EnvironmentWriterTrait;

    /**
     * MailController constructor.
     */
    public function __construct(
        private ConfigRepository $config,
        private Encrypter $encrypter,
        private Kernel $kernel,
        private SettingsRepositoryInterface $settings,
        private ViewFactory $view
    ) {
    }

    /**
     * Render UI for editing mail settings. This UI should only display if
     * the server is configured to send mail using SMTP.
     */
    public function index(): View
    {
        return $this->view->make('admin.trexzactyl.mail', [
            'disabled' => $this->config->get('mail.default') !== 'smtp',
        ]);
    }

    /**
     * Handle request to update SMTP mail settings.
     *
     * @throws DisplayException
     * @throws \Trexzactyl\Exceptions\Model\DataValidationException
     * @throws \Trexzactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(MailFormRequest $request): Response
    {
        if ($this->config->get('mail.default') !== 'smtp') {
            throw new DisplayException('This feature is only available if SMTP is the selected email driver for the Panel.');
        }

        $values = $request->normalize();
        if (array_get($values, 'mail:mailers:smtp:password') === '!e') {
            $values['mail:mailers:smtp:password'] = '';
        }

        foreach ($values as $key => $value) {
            if (in_array($key, SettingsServiceProvider::getEncryptedKeys()) && !empty($value)) {
                $value = $this->encrypter->encrypt($value);
            }

            $this->settings->set('settings::' . $key, $value);
        }

        $this->writeToEnvironment([
            'MAIL_HOST' => $request->input('mail:mailers:smtp:host'),
            'MAIL_PORT' => $request->input('mail:mailers:smtp:port'),
            'MAIL_ENCRYPTION' => $request->input('mail:mailers:smtp:encryption'),
            'MAIL_USERNAME' => $request->input('mail:mailers:smtp:username'),
            'MAIL_FROM_ADDRESS' => $request->input('mail:from:address'),
            'MAIL_FROM_NAME' => $request->input('mail:from:name'),
        ]);

        if (!empty($request->input('mail:mailers:smtp:password'))) {
            $this->writeToEnvironment([
                'MAIL_PASSWORD' => $request->input('mail:mailers:smtp:password'),
            ]);
        }

        $this->kernel->call('queue:restart');

        return response('', 204);
    }

    /**
     * Submit a request to send a test mail message.
     */
    public function test(Request $request): Response
    {
        try {
            Notification::route('mail', $request->user()->email)
                ->notify(new MailTested($request->user()));
        } catch (\Exception $exception) {
            return response($exception->getMessage(), 500);
        }

        return response('', 204);
    }
}
