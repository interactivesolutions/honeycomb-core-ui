@extends('HCCoreUI::admin.layout')

@section('content')
    <div class="row">
        <!-- /.col -->
        <div class="col-md-3 col-sm-6 col-xs-12">
            <div class="info-box">
                <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

                <div class="info-box-content">
                    <span class="info-box-text">{{ trans('users::dash.users') }}</span>
                    <span class="info-box-number">{{ \interaktyvussprendimai\ocv3users\models\OCUsers::count() }}</span>
                </div>
                <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
        </div>
        <!-- /.col -->

        @if(isPackageEnabled(\interaktyvussprendimai\camovies\providers\CAMoviesServiceProvider::class))
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-yellow"><i class="ion ion-ios-film"></i></span>

                    <div class="info-box-content">
                        <span class="info-box-text">{{ trans('camovies::movies.dash.movies') }}</span>
                        <span class="info-box-number">{{ \interaktyvussprendimai\camovies\models\CAMovies::count() }}</span>
                    </div>
                    <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
            </div>
            <!-- /.col -->

            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people"></i></span>

                    <div class="info-box-content">
                        <span class="info-box-text">{{ trans('camovies::movies.dash.persons') }}</span>
                        <span class="info-box-number">{{ \interaktyvussprendimai\camovies\models\CAPersons::count() }}</span>
                    </div>
                    <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
            </div>
            <!-- /.col -->
        @endif
    </div>
@endsection