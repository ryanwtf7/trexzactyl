<?php

namespace Trexzactyl\Providers;

use Trexzactyl\Models\ApiKey;
use Trexzactyl\Models\Server;
use Laravel\Sanctum\Sanctum;
use Trexzactyl\Policies\ServerPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     */
    protected $policies = [
        Server::class => ServerPolicy::class,
    ];

    public function boot()
    {
        Sanctum::usePersonalAccessTokenModel(ApiKey::class);

        $this->registerPolicies();
    }

    public function register()
    {
        Sanctum::ignoreMigrations();
    }
}
