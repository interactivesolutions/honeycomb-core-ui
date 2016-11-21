# honeycomb-core-ui
HoneyComb coreui repository

## Installation

Begin by installing this package through Composer.


```js
	{
	    "require": {
	    	"interactivesolutions/honeycomb-core-ui": "*"
		}
	}
```

```js
    composer require interactivesolutions/honeycomb-core-uii "0.1.*"
```

## Laravel installation

Then register the service provider and Facade by opening `config/app.php`

    interactivesolutions\honeycombcoreui\providers\HCCoreUiServiceProvider::class

Publish the files:

```
	php artisan vendor:publish

```
