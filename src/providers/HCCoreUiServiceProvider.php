<?php

namespace interactivesolutions\honeycombcoreui\providers;

use Devfactory\Minify\Facades\MinifyFacade;
use Devfactory\Minify\MinifyServiceProvider;
use Illuminate\Foundation\AliasLoader;
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
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'HCCoreUI');
        $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'HCCoreUI');

        // Publish your migrations
        $this->publishes([
            __DIR__ . '/../assets/' => public_path('/'),
        ]);

        // register minify class facade
        AliasLoader::getInstance()->alias('Minify', MinifyFacade::class);
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->commands($this->commands);

        if (class_exists(MinifyServiceProvider::class))
            $this->app->register(MinifyServiceProvider::class);
    }
}
