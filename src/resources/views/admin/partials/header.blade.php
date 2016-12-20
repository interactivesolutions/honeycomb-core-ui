<!-- Main Header -->
<header class="main-header">

    <!-- Logo -->
    <a href="{{ route('admin.index') }}" class="logo">{{ settings('project_name') }}</a>

    <!-- Header Navbar -->
    <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
        </a>

        <ul class="nav navbar-nav">
            <li>
                <a href="{{ url('/')}}" target="_blank">
                    {{ trans('HCCoreUI::global.index') }}
                </a>
            </li>
        </ul>
        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">

                @if(isPackageEnabled(\interaktyvussprendimai\ocv3languages\providers\OCLanguagesServiceProvider::class))

                    @include('languages::select')

                @endif

                @if(isPackageEnabled(\interaktyvussprendimai\ocv3users\providers\OCUsersServiceProvider::class))

                    @include('users::admin.menu.dropdown')

                @endif

                <!-- Control Sidebar Toggle Button -->
                <li>
                    <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>
                </li>
            </ul>
        </div>
    </nav>
</header>