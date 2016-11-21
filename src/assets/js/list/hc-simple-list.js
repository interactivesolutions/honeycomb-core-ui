HCService.List.SimpleList = function (configuration)
{
    this.inheritFrom = HCService.List.Core;
    this.inheritFrom();

    /**
     *  Full data list
     */
    var dataList;

    /**
     * Creating content
     */
    this.createContentList = function ()
    {
        listElementsHolder = {};

       /* endlessScroll = new HCObjects.EndlessScroll({
            url: configuration.url,
            onLoadComplete: createTableHeader,
            createElement: createListElement
        });*/
    };

    /**
     * Creating list element
     *
     * @param data
     */
    function createListElement(data)
    {
        listElementsHolder[data.id] = new scope.ListElement(data);
    }

    var listContainer;
    var mainCheckBox;
    var listElementsHolder;
    var scope = this;

    /**
     *  Creating table headers
     */
    function createTableHeader()
    {
        return;

        var headers = $('<div class="is-list-item content-is-list-headers"></div>');
        var useTranslations = true;
        mainCheckBox = $('<div style="width:1px; text-align:center;" class="is-list-item-value independent">' +
            '<input type="checkbox" value="" name="checkbox" class="">' +
            '</div>');

        if (!configuration.headers)
        {
            useTranslations = false;
            configuration.headers = endlessScroll.getLoadedData().data[0];
        }

        if (scope.actionListItems.delete || scope.actionListItems.merge || scope.actionListItems.custom)
        {
            headers.append(mainCheckBox);

            mainCheckBox.bind('change', function ()
            {
                var checkStatus = $(':checked', mainCheckBox).prop('checked');

                $.each(listElementsHolder, function (key, value)
                {
                    if (checkStatus)
                        value.selectItem();
                    else
                        value.deselectItem();
                });
            });
        }

        var label;

        $.each(configuration.headers, function (key, value)
        {
            if (!useTranslations)
                label = key;
            else
                label = value.label;

            headers.append('<div class="is-list-item-value">' + label + '</div>');
        });

        listContainer = $('<div class="is-list-container"></div>');
        scope.mainContainer.append(listContainer);
        listContainer.append(headers);
    }

    /**
     * LIST ITEM ELEMENT
     */

    this.ListElement = function (data)
    {
        this.isSelected = false;

        var leScope = this;

        var currentID = data.id;

        var disabledFully = isDisabled(data, configuration.disableByFieldsFully) ? 'disabled' : '';
        var disabledPartially = isDisabled(data, configuration.disableByFieldsPartially) ? 'independent' : '';

        if (disabledFully)
            disabledPartially = '';

        var record = $('<div id="' + currentID + '"class="is-list-item is-list-item-color ' + disabledFully + ' ' + disabledPartially + '"></div>');

        if (scope.actionListItems.delete || scope.actionListItems.merge || scope.actionListItems.custom)
        {
            var checkBox = $('<input type="checkbox" value="" name="checkbox" class="">');

            if (disabledFully != '' || disabledPartially != '')
                checkBox.attr('disabled', true);

            checkBox = $('<div style="width:1px; text-align:center;" class="is-list-item-value independent hover">' + checkBox.outerHTML() + '</div>');
            checkBox.bind('click', handleCheckBoxClick);
            checkBox.bind('change', handleCheckBoxChange);
            record.append(checkBox);
        }

        listContainer.append(record);

        $.each(configuration.headers, function (key, value)
        {
            if (key.indexOf('.') != -1)
                value = ISFunctions.pathIndex(data, key);
            else if (configuration.headers)
                value = data[key];

            if (!value)
                value = '-';

            if (disabledFully == '')
                disabledFully = false;
            else
                disabledFully = true;

            record.append(createRecordItem(key, value, disabledFully));
        });

        if (disabledFully == '' && disabledPartially == '')
            enableListItemChildren(currentID);
        else
            disableListItemChildren(currentID);

        /**
         * If item is disabled, disabling all divs except independent
         *
         * @param id
         */
        function disableListItemChildren(id)
        {
            var record = $('#' + id);

            record.removeClass('disabled');

            $.each(record.children(), function (key, child)
                {
                    if ($(child).attr('class').split(' ').indexOf('independent') == -1)
                    {
                        $(child).addClass('disabled');
                    }
                }
            );
        }

        /**
         * Creating record item
         *
         * @param key
         * @param value
         * @param disabled
         * @returns {string}
         */
        function createRecordItem(key, value, disabled)
        {
            if (!ISFunctions.isArray(value))
                value = ISFunctions.stripHTML(value);

            var cell = getValue(key, value, disabled);
            var holder = $('<div class="is-list-item-value"></div>');
            holder.append(cell.cell);
            holder.addClass(cell.parentClass);
            return holder;
        }

        /**
         * Getting actual value for given data depending on configuration
         * @param key
         * @param value
         * @returns {*}
         */
        function getValue(key, value, disabled)
        {
            var parentClass = '';

            if (configuration.headers[key])
            {
                var config = configuration.headers[key];

                switch (config.type)
                {
                    case 'image':

                        if (value != null && value != '' && value != '-')
                            value = '<img src="' + configuration.imagesURL + '/' + value + '/' + config.options.w + '/' + config.options.h + ' "style="max-width: ' + config.options.w + 'px;">';
                        else
                            value = '<img style="opacity: 0.5" src="/octopus/img/no_image.svg" width="' + config.options.w + 'px" height="' + config.options.h + '">';
                        break;

                    case 'text':
                        break;

                    case 'form-button':

                        parentClass = isIndependent(disabled);
                        parentClass += 'disabled';

                        /*if (config.value && config.value.length > 0)
                         value = createFormButton(config);*/
                        break;

                    case 'checkbox':

                        parentClass = isIndependent(disabled);

                        if (!config.url)
                            parentClass += ' disabled';

                        value = createListCheckBox(value);
                        break;

                    case 'silent-button':

                        parentClass = isIndependent(disabled);

                        if (disabled || value == '-')
                            value = '-';
                        else
                            value = createSilentButton(value, config.showAlert);
                        break;

                    case 'external-button':

                        parentClass = isIndependent(disabled);
                        value = createExternalButton(value);
                        break;

                    case 'font-awesome-cell':

                        value = createFontAwesomeCell(value);
                        break;

                    default :
                        console.log(config.type);
                }
            }

            return {cell: value, parentClass: parentClass};

            /**
             * Creating font awesome cell with icons inside
             * @param data
             * @returns {string}
             */
            function createFontAwesomeCell(data)
            {
                if (!data)
                    return '-';

                var html = '';

                $.each(data, function(key, value){
                    html += '<span><i style="color:' + value.color + ' " class="fa ' + value.icon + '" aria-hidden="true"></i></span>'
                });

                return html;
            }

            /**
             * Creating a Checkbox to use fo a single record value change
             *
             * @param value
             * @returns {*|jQuery|HTMLElement}
             */
            function createListCheckBox(value)
            {
                var checkBox = $('<input type="checkbox">');
                var url = config.url + '/' + data.id;

                if (value == 1)
                    checkBox.prop('checked', true);

                if (config.url)
                    checkBox.bind('change', function (e)
                    {
                        if (e.currentTarget.checked)
                            value = 1;
                        else
                            value = 0;

                        checkBox.addClass('disabled');

                        var loader = new ISLoader.BasicLoader();
                        loader.addVariable(key, value);
                        loader.methodPUT();
                        loader.load(handleStrictLoaded, handleError, null, url, 'strict');
                    });

                return checkBox;

                function handleStrictLoaded(data)
                {
                    checkBox.removeClass('disabled');
                    checkBox.parent().addClass('strict-success');
                }

                function handleError(e)
                {
                    checkBox.removeClass('disabled');
                    ISFunctions.showToastrMessage('error', e);
                }
            }

            function isIndependent(disabled)
            {
                if (!disabled)
                    return 'independent';
                else
                    return '';
            }

            function createFormButton(value)
            {
                var button = $('<i class="fa fa-list-alt" aria-hidden="true"></i>');
                button.bind('click', function ()
                {
                    HCService.PopUp.Pop({
                        label: 'New Record',
                        type: 'form',
                        config: {
                            structureURL: value.value,
                            contentID: currentID
                        }
                    });
                });

                return button;
            }

            function createSilentButton(value, showAlert)
            {
                var button = $('<i class="fa fa-refresh is-silent-button" aria-hidden="true"></i>');
                button.bind('click', function ()
                {
                    if (showAlert)
                    {
                        // sweet alert for confirmation
                        swal({
                            title: "Are you sure?",
                            text: "You will not be able to recover this action!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes",
                            closeOnConfirm: true
                        }, function ()
                        {
                            handleButton();
                        });
                    } else
                    {
                        handleButton();
                    }
                });

                function handleButton()
                {
                    button.addClass('fa-spin');
                    button.addClass('fa-fw');
                    button.addClass('is-silent-button-active');
                    button.removeClass('is-silent-button');
                    button.unbind();
                    new ISLoader.BasicLoader().load(handleSilentLoaded, handleError, this, value);
                }

                function handleError(e)
                {
                    button.removeClass('fa-spin');
                    button.removeClass('fa-refresh');
                    button.removeClass('fa-fw');
                    button.removeClass('is-silent-button-active');
                    button.addClass('fa-exclamation-triangle');
                    button.css('color', 'red');

                    ISFunctions.showToastrMessage('error', e);
                }

                function handleSilentLoaded(data)
                {
                    if (data.success == true)
                    {
                        button.removeClass('fa-spin');
                        button.removeClass('fa-refresh');
                        button.removeClass('fa-fw');
                        button.removeClass('is-silent-button-active');
                        button.addClass('fa-check');
                        button.css('color', 'green');
                    }
                }

                return button;
            }

            function createExternalButton(value)
            {
                var button = $('<a href="' + value + '" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a>');
                return button;
            }
        }

        /**
         * Enabling list item
         *
         * @param id
         */
        function enableListItemChildren(id)
        {
            var record = $('#' + id);
            var canUpdate = (configuration.actions && configuration.actions.indexOf('update') >= 0);

            record.removeClass('disabled');

            if (canUpdate)
                record.addClass('active');

            $.each(record.children(), function (key, child)
                {
                    if ($(child).attr('class').split(' ').indexOf('independent') == -1)
                    {
                        if (canUpdate)
                            $(child).bind('click', function ()
                            {
                                if (configuration.forms.newRecord)
                                    location.href = '//' + location.host + location.pathname + '/' + id;
                                else
                                    HCService.PopUp.Pop({
                                        label: 'Record ID: ' + id,
                                        type: 'form',
                                        config: {
                                            structureURL: configuration.forms.edit,
                                            contentID: id
                                        },
                                        callBack: markUpdatedItem
                                    });
                            });
                    }
                }
            );
        }

        var isVisible = true;

        function handleCheckBoxClick (e) {

            if ($(e.target).is(':checkbox'))
                return;

            if ($(':checkbox', checkBox).prop('checked')) {
                $(':checkbox', checkBox).prop('checked', false);
                handleCheckBoxChange();
            } else if (isVisible) {
                $(':checkbox', checkBox).prop('checked', true);
                handleCheckBoxChange();
            }

        }

        function handleCheckBoxChange()
        {
            if ($(':checkbox', checkBox).prop('checked'))
            {
                record.addClass('is-admin-list-item-selected');
                leScope.isSelected = true;
            }
            else
            {
                record.removeClass('is-admin-list-item-selected');
                leScope.isSelected = false;
            }

            updateSelected(leScope.isSelected);
        }

        function markUpdatedItem()
        {
            console.log('TODO: mark me', currentID)
        }

        this.selectItem = function ()
        {
            if (isVisible)
            {
                $(':checkbox', checkBox).prop('checked', true);
                handleCheckBoxChange();
            }
        };

        this.deselectItem = function ()
        {
            $(':checkbox', checkBox).prop('checked', false);
            handleCheckBoxChange();
        };

        this.showElement = function ()
        {
            isVisible = true;
            record.show();
        };

        this.hideElement = function ()
        {
            isVisible = false;
            this.deselectItem();
            record.hide();
        };
    };

    var total = 0;

    /**
     * Update count in the buttons
     *
     * @param increase
     */
    function updateSelected(increase)
    {
        if (increase)
            total++;
        else
            total--;

        if (total > 0)
        {
            $('.counter', scope.actionListItems.delete).show();

            if (total >= Object.size(listElementsHolder))
                $(':not(:checked)', mainCheckBox).prop("checked", true);
            else
                $(':checked', mainCheckBox).prop("checked", false);
        }
        else
        {
            $(':checked', mainCheckBox).prop('checked', false);
            $('.counter', scope.actionListItems.delete).hide();
        }

        $('.counter', scope.actionListItems.delete).html('(' + total + ')');
    }

    /**
     * Checking if the list element will be fully disabled
     *
     * @param data
     * @param config
     * @returns {boolean}
     */
    function isDisabled(data, config)
    {
        if (!config)
            return false;

        //console.log(data, config);

        var disabled = false;

        $.each(config, function (config_key, config_value)
        {
            if (ISFunctions.isString(config_value))
            {
                if (config_key.indexOf('.') >= 0)
                {
                    if (ISFunctions.pathIndex(data, config_key) == config_value)
                        disabled = true;
                }
                else if (data[config_key] == config_value)
                    disabled = true;

                if (config_value == 'IS_NOT_NULL')
                    if (data[config_key])
                        disabled = true;
            }
            else
            {
                var cf = config_value.toString();

                // Checking if value is an array
                if (cf.indexOf(',') >= 0)
                {
                    if (config_value.indexOf(ISFunctions.pathIndex(data, config_key)) >= 0)
                        disabled = true;
                }
                // Checking if key has multiple params
                else if (config_key.indexOf('.') >= 0)
                {
                    if (ISFunctions.pathIndex(data, config_key) == config_value)
                        disabled = true;
                }
                else if (data[config_key] == cf)
                    disabled = true;
            }
        });

        return disabled;
    }

    this.handleReloadAction = function (url)
    {
        createTableHeader();
    };

    /**
     * Enabling filter
     *
     * @param value
     */
    this.handleFilterButtonActionClick = function (value)
    {
        $.each($('.is-list-container .is-list-item-color'), function (key, element)
        {
            listElementsHolder[$(element).attr('id')].showElement();
        });

        $.each($('.is-list-item-color:not(:contains_ci(' + value + '))'), function (key, element)
        {
            listElementsHolder[$(element).attr('id')].hideElement();
        });
    };

    this.handleDeleteButtonClick = function ()
    {
        var listToDelete = getSelectedListItems();

        if(listToDelete.length == 0)
            return;

        var loader = new HCLoader.BasicLoader();
        loader.addVariable('list', listToDelete);
        loader.methodDELETE();
        loader.load(null, null, null, configuration.url, 'delete');

        $.each(listToDelete, function (key, value)
        {
            updateSelected(false);
            $('#' + value).remove();
            delete (listElementsHolder[value]);
        });
    };

    /**
     * Getting selected items
     *
     * @returns {Array}
     */
    function getSelectedListItems()
    {
        var list = [];

        $.each(listElementsHolder, function (key, value)
        {
            if (value.isSelected)
                list.push(key);
        });

        return list;
    }

    /**
     * After successful creation reload the content
     * @param url
     */
    this.handleSuccessCreation = function (url)
    {
        this.handleReloadAction(url);
    };

    /**
     * Creating custom actions
     *
     * @param data
     */
    this.createCustomAction = function (data)
    {
        var customButton = '<div class="btn btn-success hc-action-list-button">';

        if (data.icon && data.icon != '')
            customButton += '<i class="fa ' + data.icon + '"></i>';

        customButton += '<div class="counter"></div>';

        if (data.label && data.label != '')
            customButton += '<div class="label">' + data.label + '</div>';

        customButton += '</div>';

        customButton = $(customButton);

        scope.actionListItems.custom = true;

        customButton.bind('click', function (e)
        {
            data.callback(getSelectedListItems());
        });

        return customButton;
    };

    this.initializeCore(configuration);
};