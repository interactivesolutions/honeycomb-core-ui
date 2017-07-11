@extends('HCCoreUI::admin.layout')

@if ( isset( $config['title'] ) &&  ! empty($config['title']))
    @section('content-header',  $config['title'] )
@endif

@section('css')
    <style>
        .nav-link.active {
            font-weight: 600;
        }
    </style>
@endsection

@section('content')


    <div class="col-md-12">
        <!-- Nav tabs -->
        <div class="nav-tabs-custom">
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-toggle="tab" href="#basic"
                       role="tab">{{ trans('HCECommerceGoods::e_commerce_goods_edit.basic_settings') }}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" href="#combinations"
                       role="tab">{{ trans('HCECommerceGoods::e_commerce_goods_edit.combinations') }}</a>
                </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                <div class="tab-pane active" id="basic" role="tabpanel">
                    <div id="goodsEdit"></div>
                </div>

                <div class="tab-pane" id="combinations" role="tabpanel">
                    <div class="tab-content">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="box box-default box-solid">
                                    <div class="box-header with-border">
                                        <h3 class="box-title">{{ trans('HCECommerceGoods::e_commerce_goods_edit.combinations') }}</h3>

                                        <div class="box-tools pull-right">
                                            <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                                        class="fa fa-minus"></i>
                                            </button>
                                        </div>
                                        <!-- /.box-tools -->
                                    </div>
                                    <!-- /.box-header -->
                                    <div class="box-body">
                                        @if($config['combinations']->isNotEmpty())
                                            <ul class="todo-list">
                                                @foreach($config['combinations'] as $combination)
                                                    <li>
                                                         <span class="text">
                                                             @foreach($combination->attribute_values as $value)
                                                                 {{ array_get($value, 'attribute.label') }}
                                                                 : {{ $value->label }},
                                                             @endforeach
                                                        </span>
                                                        <!-- General tools such as edit or delete-->
                                                        <div class="tools">
                                                            <i class="fa fa-trash-o remove-combination"
                                                               data-delete-url="{{ route('admin.routes.e.commerce.goods.{_id}.combination.{id}.delete', [request()->segment(4), $combination->id]) }}"></i>
                                                        </div>
                                                    </li>
                                                @endforeach
                                            </ul>
                                        @else
                                            {{ trans('HCECommerceGoods::e_commerce_goods_edit.no_combinations') }}
                                        @endif
                                    </div>
                                    <!-- /.box-body -->
                                </div>
                            </div>

                            @if($config['attributes']->isNotEmpty() && $config['combinations']->isEmpty())
                                <div class="col-md-4">
                                    <form action="{{ route('admin.routes.e.commerce.goods.{_id}.generate', request()->segment(4)) }}"
                                          method="POST">
                                        {{ csrf_field() }}

                                        @foreach($config['attributes'] as $attribute)

                                            <div class="box box-default box-solid">
                                                <div class="box-header with-border">
                                                    <h3 class="box-title">{{ get_translation_name('label', app()->getLocale(), $attribute->translations->toArray()) }}</h3>

                                                    <div class="box-tools pull-right">
                                                        <button type="button" class="btn btn-box-tool"
                                                                data-widget="collapse"><i
                                                                    class="fa fa-minus"></i>
                                                        </button>
                                                    </div>
                                                    <!-- /.box-tools -->
                                                </div>
                                                <!-- /.box-header -->
                                                <div class="box-body">
                                                    @if($attribute->values->isNotEmpty())
                                                        @foreach($attribute->values as $value)
                                                            <div class="radio">
                                                                <label>
                                                                    <input type="radio" name="{{ $attribute->id }}"
                                                                           value="{{ $value->id }}">
                                                                    <span class="text">{{ get_translation_name('label', app()->getLocale(), $value->translations->toArray()) }}</span>
                                                                </label>
                                                            </div>
                                                        @endforeach
                                                    @endif
                                                </div>
                                                <!-- /.box-body -->
                                            </div>
                                        @endforeach

                                        <button type="submit"
                                                class="btn btn-block btn-primary">{{ trans('HCECommerceGoods::e_commerce_goods_edit.generate_combination') }}</button>
                                    </form>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


@endsection

@section('scripts')
    <script>
        $(document).ready(function () {
            var config = {!! json_encode($config) !!};
            config.divID = '#goodsEdit';
            var form = HCService.FormManager.createForm(config);

            if (window.location.hash == '#combinations') {
                $('.nav-tabs-custom a[href="#combinations"]').tab('show')
            }

            $('.remove-combination').on('click', function () {
                if (confirm('Are you sure?')) {
                    var self = $(this);
                    var deleteUrl = $(this).data('delete-url');

                    $.ajax({
                        url: deleteUrl,
                        type: 'DELETE',
                        success: function (result) {
                            if (result.success) {
                                self.parent().parent().remove()
                            }
                        }
                    });
                }
            });
        });
    </script>
@endsection
