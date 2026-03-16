<?php

namespace Trexzactyl\Http\Controllers\Auth;

use Illuminate\Http\JsonResponse;
use Trexzactyl\Exceptions\DisplayException;
use Trexzactyl\Http\Requests\Auth\RegisterRequest;
use Trexzactyl\Services\Users\UserCreationService;
use Trexzactyl\Exceptions\Model\DataValidationException;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;

class RegisterController extends AbstractLoginController
{
    /**
     * RegisterController constructor.
     */
    public function __construct(private UserCreationService $creationService, private SettingsRepositoryInterface $settings)
    {
        parent::__construct();
    }

    /**
     * Handle a register request to the application.
     *
     * @throws DataValidationException|DisplayException
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $approved = true;
        $verified = true;
        $prefix = 'Trexzactyl::registration:';

        if ($this->settings->get($prefix . 'enabled', 'false') != 'true') {
            throw new DisplayException('Unable to register user.');
        }

        if ($this->settings->get($prefix . 'verification', 'false') === 'true') {
            $verified = false;
        }

        if ($this->settings->get('Trexzactyl::approvals:enabled', 'false') === 'true') {
            $approved = false;
        }

        $this->creationService->handle([
            'email' => $request->input('email'),
            'username' => $request->input('user'),
            'name_first' => 'Trexzactyl',
            'name_last' => 'User',
            'password' => $request->input('password'),
            'ip' => $request->getClientIp(),
            'store_cpu' => $this->settings->get($prefix . 'cpu', 0),
            'store_memory' => $this->settings->get($prefix . 'memory', 0),
            'store_disk' => $this->settings->get($prefix . 'disk', 0),
            'store_slots' => $this->settings->get($prefix . 'slot', 0),
            'store_ports' => $this->settings->get($prefix . 'port', 0),
            'store_backups' => $this->settings->get($prefix . 'backup', 0),
            'store_databases' => $this->settings->get($prefix . 'database', 0),
            'approved' => $approved,
            'verified' => $verified,
        ]);

        return new JsonResponse([
            'data' => [
                'complete' => true,
                'intended' => $this->redirectPath(),
                'verified' => $verified,
            ],
        ]);
    }
}
