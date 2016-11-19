<meta name="csrf-token" content="{{ csrf_token() }}">

{!!

    Minify::stylesheet([
        '/css/honeycomb.css',
    ])

!!}