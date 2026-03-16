<?php

namespace Trexzactyl\Providers;

use Illuminate\Support\ServiceProvider;
use Trexzactyl\Repositories\Eloquent\EggRepository;
use Trexzactyl\Repositories\Eloquent\NestRepository;
use Trexzactyl\Repositories\Eloquent\NodeRepository;
use Trexzactyl\Repositories\Eloquent\TaskRepository;
use Trexzactyl\Repositories\Eloquent\UserRepository;
use Trexzactyl\Repositories\Eloquent\ApiKeyRepository;
use Trexzactyl\Repositories\Eloquent\ServerRepository;
use Trexzactyl\Repositories\Eloquent\SessionRepository;
use Trexzactyl\Repositories\Eloquent\SubuserRepository;
use Trexzactyl\Repositories\Eloquent\DatabaseRepository;
use Trexzactyl\Repositories\Eloquent\LocationRepository;
use Trexzactyl\Repositories\Eloquent\ScheduleRepository;
use Trexzactyl\Repositories\Eloquent\SettingsRepository;
use Trexzactyl\Repositories\Eloquent\AllocationRepository;
use Trexzactyl\Contracts\Repository\EggRepositoryInterface;
use Trexzactyl\Repositories\Eloquent\EggVariableRepository;
use Trexzactyl\Contracts\Repository\NestRepositoryInterface;
use Trexzactyl\Contracts\Repository\NodeRepositoryInterface;
use Trexzactyl\Contracts\Repository\TaskRepositoryInterface;
use Trexzactyl\Contracts\Repository\UserRepositoryInterface;
use Trexzactyl\Repositories\Eloquent\DatabaseHostRepository;
use Trexzactyl\Contracts\Repository\ApiKeyRepositoryInterface;
use Trexzactyl\Contracts\Repository\ServerRepositoryInterface;
use Trexzactyl\Repositories\Eloquent\ServerVariableRepository;
use Trexzactyl\Contracts\Repository\SessionRepositoryInterface;
use Trexzactyl\Contracts\Repository\SubuserRepositoryInterface;
use Trexzactyl\Contracts\Repository\DatabaseRepositoryInterface;
use Trexzactyl\Contracts\Repository\LocationRepositoryInterface;
use Trexzactyl\Contracts\Repository\ScheduleRepositoryInterface;
use Trexzactyl\Contracts\Repository\SettingsRepositoryInterface;
use Trexzactyl\Contracts\Repository\AllocationRepositoryInterface;
use Trexzactyl\Contracts\Repository\EggVariableRepositoryInterface;
use Trexzactyl\Contracts\Repository\DatabaseHostRepositoryInterface;
use Trexzactyl\Contracts\Repository\ServerVariableRepositoryInterface;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register all of the repository bindings.
     */
    public function register()
    {
        // Eloquent Repositories
        $this->app->bind(AllocationRepositoryInterface::class, AllocationRepository::class);
        $this->app->bind(ApiKeyRepositoryInterface::class, ApiKeyRepository::class);
        $this->app->bind(DatabaseRepositoryInterface::class, DatabaseRepository::class);
        $this->app->bind(DatabaseHostRepositoryInterface::class, DatabaseHostRepository::class);
        $this->app->bind(EggRepositoryInterface::class, EggRepository::class);
        $this->app->bind(EggVariableRepositoryInterface::class, EggVariableRepository::class);
        $this->app->bind(LocationRepositoryInterface::class, LocationRepository::class);
        $this->app->bind(NestRepositoryInterface::class, NestRepository::class);
        $this->app->bind(NodeRepositoryInterface::class, NodeRepository::class);
        $this->app->bind(ScheduleRepositoryInterface::class, ScheduleRepository::class);
        $this->app->bind(ServerRepositoryInterface::class, ServerRepository::class);
        $this->app->bind(ServerVariableRepositoryInterface::class, ServerVariableRepository::class);
        $this->app->bind(SessionRepositoryInterface::class, SessionRepository::class);
        $this->app->bind(SettingsRepositoryInterface::class, SettingsRepository::class);
        $this->app->bind(SubuserRepositoryInterface::class, SubuserRepository::class);
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }
}
