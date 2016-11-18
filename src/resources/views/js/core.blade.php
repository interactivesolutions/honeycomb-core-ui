<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">

{!!

    Minify::javascript([
        '/js/shared/hc-functions.js',
    ])

!!}
