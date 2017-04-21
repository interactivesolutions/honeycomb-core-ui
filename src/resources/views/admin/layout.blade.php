<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ settings('project_name') }} {{ trans('HCCoreUI::core.administration') }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}"/>
    <meta content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' name='viewport'>

    @include('HCCoreUI::admin.includes.rollbar')

    @include('HCCoreUI::css.global')
    @include('HCCoreUI::css.core')
</head>
<body class="skin-blue">
<div class="wrapper">

    <!-- if dev environment activate this div -->
    @if(app()->environment() == "local")
        <div style="position: absolute">
            {!! trans('HCCoreUI::core.dev_env') !!}
        </div>
    @endif


<!-- Header -->
    @include('HCCoreUI::admin.partials.header')

<!-- Sidebar -->
    @include('HCCoreUI::admin.partials.sidebar')

<!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                @yield('content-header')
                <small>@yield('content-description')</small>
            </h1>
            {{--<ol class="breadcrumb">--}}
            {{--<li><a href="#"><i class="fa fa-dashboard"></i> Level</a></li>--}}
            {{--<li class="active">Here</li>--}}
            {{--</ol>--}}
        </section>

        <!-- Main content -->
        <section class="content">

            <!-- Your Page Content Here -->
            @yield('content')

        </section><!-- /.content -->
    </div><!-- /.content-wrapper -->

    <!-- Footer -->
    @include('HCCoreUI::admin.partials.footer')

<!-- The Right Sidebar -->
    @include('HCCoreUI::admin.partials.right-sidebar')

</div><!-- ./wrapper -->

<!-- REQUIRED JS SCRIPTS -->

<!-- Octopus js files -->
@include('HCCoreUI::js.global')
@include('HCCoreUI::js.shared')
@include('HCCoreUI::js.form')
@include('HCCoreUI::js.list')


<script>
    //TODO read from cache
    HCService.FRONTENDLanguage = HCService.CONTENTLanguage = '{{ app()->getLocale() }}';
</script>

<script>
    jQuery.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
</script>
<!-- Your Page Scripts Here -->
@yield('scripts')

@include('HCCoreUI::admin.partials.sidebar-filter-js')
</body>
</html>