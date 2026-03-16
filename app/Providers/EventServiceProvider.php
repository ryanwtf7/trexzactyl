<?php

namespace Trexzactyl\Providers;

use Trexzactyl\Models\User;
use Trexzactyl\Models\Server;
use Trexzactyl\Models\Subuser;
use Trexzactyl\Models\EggVariable;
use Trexzactyl\Observers\UserObserver;
use Trexzactyl\Observers\ServerObserver;
use Trexzactyl\Observers\SubuserObserver;
use Trexzactyl\Observers\EggVariableObserver;
use Trexzactyl\Listeners\Auth\AuthenticationListener;
use Trexzactyl\Events\Server\Installed as ServerInstalledEvent;
use Trexzactyl\Notifications\ServerInstalled as ServerInstalledNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     */
    protected $listen = [
        ServerInstalledEvent::class => [ServerInstalledNotification::class],
    ];

    protected $subscribe = [
        AuthenticationListener::class,
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        parent::boot();

        User::observe(UserObserver::class);
        Server::observe(ServerObserver::class);
        Subuser::observe(SubuserObserver::class);
        EggVariable::observe(EggVariableObserver::class);
    }
}
