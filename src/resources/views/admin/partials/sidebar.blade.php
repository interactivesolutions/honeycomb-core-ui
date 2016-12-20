<!-- Left side column. contains the sidebar -->
<aside class="main-sidebar">

    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

        <!-- search form (Optional) -->
        <div class="sidebar-form">
            <div class="input-group">
                <input type="text" name="q" class="form-control search-menu-box" placeholder="{{ trans('HCCoreUI::core.input.value.filter') }}"/>
                <span class="input-group-btn">
                  <button name='search' id='search-btn' class="btn btn-flat"><i class="fa fa-search"></i></button>
                </span>
            </div>
        </div>
        <!-- /.search form -->

        <!-- Sidebar Menu -->
        <ul class="sidebar-menu">

            @if( isset($adminMenu) )
                @include('HCCoreUI::admin.partials.submenu', ['menuItems' => $adminMenu])
            @endif

        </ul><!-- /.sidebar-menu -->
    </section>
    <!-- /.sidebar -->
</aside>