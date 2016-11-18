<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">

{!!

    Minify::javascript([
        '/js/shared/hc-helpers.js',
        '/js/shared/hc-objects.js',
        '/js/shared/hc-functions.js',
        '/js/shared/hc-loader.js',
        '/js/shared/hc-service.js',
        '/js/shared/hc-form-manager.js',
        '/js/shared/hc-form.js',
        
        '/js/shared/form/hc-form-BasicField.js',
    ])

!!}