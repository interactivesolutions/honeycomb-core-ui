<?php

namespace interactivesolutions\honeycombcoreui\providers;

use Illuminate\Support\ServiceProvider;

class HCCoreUiServiceProvider extends ServiceProvider
{
    /**
     * Register artisan commands
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'interactivesolutions\honeycombcoreui\http\controllers';


    /**
     * Bootstrap the application services.
     */
    public function boot()
    {
        $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'honeycombcoreui');

        // Publish your migrations
        $this->publishes([
            __DIR__ . '/../assets/' => public_path('/'),
        ]);
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->commands($this->commands);
    }
}
