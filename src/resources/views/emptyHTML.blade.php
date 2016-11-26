<html lang="en">
<head>
    <meta charset="utf-8">

    @if (isset($content))
        <title>{{ array_get($content, 'title') }}</title>
        <meta name="description" content="{{ array_get($content, 'description') }}">
        <meta name="author" content="{{ array_get($content, 'author') }}">
    @endif

    @include('HCCoreUI::css.core')
    @include('HCCoreUI::css.global')

</head>

<body>
@include('HCCoreUI::js.global')
@include('HCCoreUI::js.shared')
@include('HCCoreUI::js.form')
@include('HCCoreUI::js.list')
</body>
</html>