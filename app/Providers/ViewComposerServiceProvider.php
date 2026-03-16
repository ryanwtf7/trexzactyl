<?php

namespace Trexzactyl\Providers;

use Illuminate\Support\ServiceProvider;
use Trexzactyl\Http\ViewComposers\StoreComposer;
use Trexzactyl\Http\ViewComposers\SettingComposer;

class ViewComposerServiceProvider extends ServiceProvider
{
    /**
     * Register bindings in the container.
     */
    public function boot()
    {
        $this->app->make('view')->composer('*', SettingComposer::class);
        $this->app->make('view')->composer('*', StoreComposer::class);
    }
}
