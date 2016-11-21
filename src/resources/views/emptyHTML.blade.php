<html lang="en">
<head>
    <meta charset="utf-8">

    @if (isset($content))
        <title>{{ array_get($content, 'title') }}</title>
        <meta name="description" content="{{ array_get($content, 'description') }}">
        <meta name="author" content="{{ array_get($content, 'author') }}">
    @endif

    @include('honeycombcoreui::css.core')
    @include('honeycombcoreui::css.global')

</head>

<body>
@include('honeycombcoreui::js.global')
@include('honeycombcoreui::js.shared')
@include('honeycombcoreui::js.form')
@include('honeycombcoreui::js.list')
</body>
</html>