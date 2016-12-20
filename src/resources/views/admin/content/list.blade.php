@extends('HCCoreUI::admin.layout')

@if ( isset( $config['title'] ) &&  ! empty($config['title']))
    @section('content-header',  $config['title'] )
@endif

@section('content')

    <div id="here-comes-list"></div>

@endsection

@section('scripts')
    <script>
        $(document).ready(function () {
            new HCService.List.SimpleList({
                div: '#here-comes-list',

                @include('HCCoreUI::admin.partials.list-settings')
            });
        });
    </script>

@endsection
