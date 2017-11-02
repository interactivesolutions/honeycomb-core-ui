@extends('HCCoreUI::admin.layout')

@section('content')
    <div class="row">
        <!-- /.col -->
        <div class="col-md-3 col-sm-6 col-xs-12">
            <div class="info-box">
                <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

                <div class="info-box-content">
                    <span class="info-box-text">{{ trans('HCTranslations::core.users') }}</span>
                    <span class="info-box-number">{{ \interactivesolutions\honeycombacl\app\models\HCUsers::count() }}</span>
                </div>
                <!-- /.info-box-content -->
            </div>
            <!-- /.info-box -->
        </div>
        <!-- /.col -->


    </div>
@endsection