<!-- Main Header -->
<header class="main-header">

    <!-- Logo -->
    <a href="{{ route('admin.index') }}" class="logo">{{ config('app.name') }}</a>

    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
        </a>

        <ul class="nav navbar-nav pull-left">
            <li>
                <a href="{{ url('/')}}" target="_blank">
                    {{ trans('HCTranslations::core.index') }}
                </a>
            </li>
        </ul>

        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">

                <!-- TODO include existing HoneyComb packages -->
            @if(isPackageEnabled(\interactivesolutions\honeycomblanguages\app\providers\HCLanguagesServiceProvider::class))

                @include('HCLanguages::lang-select')

            @endif

            @if(isPackageEnabled(\InteractiveSolutions\HoneycombAcl\Providers\HCACLServiceProvider::class))

                @include('HCACL::admin.dropdown')

            @endif

            <!-- Control Sidebar Toggle Button -->
                <li>
                    <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
                </li>
            </ul>
        </div>
    </nav>
</header>