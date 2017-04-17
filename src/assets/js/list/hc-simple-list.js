HCService.List.SimpleList = function (configuration) {
    this.inheritFrom = HCService.List.Core;
    this.inheritFrom();

    /**
     *  Full data list
     */
    var dataList;

    /**
     * Total selected rows
     *
     * @type {number}
     */
    var totalSelectedRows = 0;

    /**
     * Creating content
     */
    this.createContentList = function () {
        listElementsHolder = {};

        switch (configuration.type) {
            case 'endless':

                dataList = new HCService.List.Endless({
                    url: this.getDataURL(''),
                    onLoadComplete: createTableHeader,
                    createElement: createListElement
                });

                break;
        }
    };

    /**
     * Creating list element
     *
     * @param data
     */
    function createListElement(data) {
        listElementsHolder[data.id] = new scope.ListElement(data);
    }

    var listContainer;
    var listElementsHolder;
    var mainCheckBox;
    var scope = this;

    /**
     *  Creating table headers
     */
    function createTableHeader() {
        var headers = $('<div class="list-group-item hc-list-headers"></div>');
        var useTranslations = true;

        mainCheckBox = $('<div class="hc-list-item-value independent" style="width: 30px;padding-top: 2px;">'
            + '<input type="checkbox" value="" name="checkbox" class="">'
            + '</div>');

        if (!configuration.headers) {
            useTranslations = false;
            configuration.headers = dataList.getLoadedData().data[0];
        }

        if (scope.actionListItems.delete || scope.actionListItems.merge) {
            headers.append(mainCheckBox);

            mainCheckBox.bind('change', function () {
                totalSelectedRows = 0;
                var checkStatus = $(':checked', mainCheckBox).prop('checked');

                $.each(listElementsHolder, function (key, value) {
                    if (checkStatus)
                        value.selectItem();
                    else
                        value.deselectItem();
                });
            });
        }

        var label;
        var dropDownItem;
        var displayOption = $('<div id="hc-header-settings" class="btn-group hc-list-item-value"></div>');
        var dropDownMenu = $('<div class="dropdown-menu dropdown-menu-right"></div>');
        var headerSettings = $('<i aria-haspopup="true" aria-expanded="false" class="fa fa-columns"></i>');

        displayOption.append(headerSettings);
        displayOption.append(dropDownMenu);

        headerSettings.on('click', function (event) {
            $(this).parent().toggleClass('open');
        });

        $('body').on('click', function (e) {
            if (!headerSettings.is(e.target) && dropDownMenu.has(e.target).length === 0)
                displayOption.removeClass('open');
        });

        $.each(configuration.headers, function (key, value) {
            if (!useTranslations)
                label = key;
            else
                label = value.label;

            dropDownItem = $('<a class="dropdown-item"><label><input data-id="' + key + '" type="checkbox" checked><span>' + label + '</span></label></a>');
            dropDownItem.bind('click', handleHeaderSettingsClick);

            dropDownMenu.append(dropDownItem);
            headers.append('<div class="hc-list-item-value" data-id="' + key + '">' + label + '</div>');
        });

        headers.append(displayOption);

        listContainer = $('<div class="hc-list-container"></div>');
        scope.mainContainer.append(listContainer);
        listContainer.append(headers);

        /**
         * When settings is clicked hide / show row
         * @param e
         */
        function handleHeaderSettingsClick(e) {
            //TODO save status for each list to cookie!
            //TODO Allow min 1 selected item!
            var target = $(e.target);
            var data = target.data();

            if (Object.size(data) != 0) {
                if (target.is(':checked')) {
                    hiddenColumns.remove(data.id);

                    listContainer.find('.hc-list-item-value').filter(
                        function () {
                            return $(this).data('id') === data.id;
                        })
                        .show();
                }
                else {
                    hiddenColumns.push(data.id);

                    listContainer.find('.hc-list-item-value').filter(
                        function () {
                            return $(this).data('id') === data.id;
                        })
                        .hide();
                }
            }
        }
    }

    var hiddenColumns = [];

    /**
     * LIST ITEM ELEMENT
     */

    this.ListElement = function (data) {
        this.isSelected = false;

        var leScope = this;

        var currentID = data.id;

        var disabledFully = isDisabled(data, configuration.disableByFieldsFully) ? 'disabled' : '';

        var record = $('<div id="' + currentID + '" class="list-group-item hc-list-item ' + disabledFully + '"></div>');

        if (scope.actionListItems.delete || scope.actionListItems.merge) {
            var checkBox = $('<input type="checkbox" value="" name="checkbox" class="">');

            if (disabledFully != '')
                checkBox.attr('disabled', true);

            checkBox = $('<div class="hc-list-item-value independent hover ">' + checkBox.outerHTML() + '</div>');
            checkBox.bind('click', handleCheckBoxClick);
            checkBox.bind('change', handleCheckBoxChange);
            record.append(checkBox);
        }

        listContainer.append(record);

        $.each(configuration.headers, function (key, value) {
            if (key.indexOf('.') != -1) {
                if (key.indexOf('{lang}') != -1)
                    key = HCFunctions.replaceBrackets(key, {'lang': HCFunctions.getTranslationsLanguageElementIndex(HCService.FRONTENDLanguage, data.translations)});

                value = HCFunctions.pathIndex(data, key);
            }
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

        record.append('<div class="hc-list-item-value"></div>');
        enableListItemChildren(currentID);

        /**
         * Creating record item
         *
         * @param key
         * @param value
         * @param disabled
         * @returns {string}
         */
        function createRecordItem(key, value, disabled) {
            if (!HCFunctions.isArray(value))
                value = HCFunctions.stripHTML(value);

            var cell = getValue(key, value, disabled);
            var holder = $('<div data-id="' + key + '" class="hc-list-item-value"></div>');
            holder.append(cell.cell);
            holder.addClass(cell.parentClass);

            if (hiddenColumns.indexOf(key) >= 0)
                holder.hide();

            return holder;
        }

        /**
         * Getting actual value for given data depending on configuration
         * @param key
         * @param value
         * @returns {*}
         */
        function getValue(key, value, disabled) {
            var parentClass = '';

            if (configuration.headers[key]) {
                var config = configuration.headers[key];

                switch (config.type) {
                    case 'image':

                        if (!config.options)
                            config.options = {w:100, h:100};

                        if (value != null && value != '' && value != '-')
                            value = '<div style="width: ' + config.options.w + 'px; height:' + config.options.h + 'px; background: center no-repeat url(' + configuration.imagesURL + '/' + value + '/' + config.options.w + '/' + config.options.h + '); background-size:contain; margin: 0 auto;"></div>';
                        else
                            value = '<i class="fa fa-picture-o" aria-hidden="true" style="opacity: 0.5" width="' + config.options.w + 'px" height="' + config.options.h + '"></i>';
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
                            value = createSilentButton(value);
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
            function createFontAwesomeCell(data) {
                if (!data)
                    return '-';

                var html = '';

                $.each(data, function (key, value) {
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
            function createListCheckBox(value) {
                var checkBox = $('<input type="checkbox">');
                var url = config.url.replace('/id/', '/' + data.id + '/');

                if (value == 1)
                    checkBox.prop('checked', true);

                if (config.url)
                    checkBox.bind('change', function (e) {
                        if (e.currentTarget.checked)
                            value = 1;
                        else
                            value = 0;

                        checkBox.addClass('disabled');

                        var loader = new HCLoader.BasicLoader();
                        loader.addVariable(key, value);
                        loader.methodPUT();
                        loader.load(handleStrictLoaded, handleError, null, url, 'strict');
                    });

                return checkBox;

                function handleStrictLoaded(data) {
                    checkBox.removeClass('disabled');
                    checkBox.parent().addClass('strict-success');
                }

                function handleError(e) {
                    checkBox.removeClass('disabled');
                    HCFunctions.notify('error', e);
                }
            }

            function isIndependent(disabled) {
                if (!disabled)
                    return 'independent';
                else
                    return '';
            }

            function createFormButton(value) {
                var button = $('<i class="fa fa-list-alt" aria-hidden="true"></i>');
                button.bind('click', function () {
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

            function createSilentButton(value) {
                var button = $('<i class="fa fa-refresh is-silent-button" aria-hidden="true"></i>');
                button.bind('click', function () {
                    handleButton();
                });

                function handleButton() {
                    button.addClass('fa-spin');
                    button.addClass('fa-fw');
                    button.unbind();
                    new HCLoader.BasicLoader().load(handleSilentLoaded, handleError, this, value);
                }

                function handleError(e) {
                    button.removeClass('fa-spin');
                    button.removeClass('fa-refresh');
                    button.removeClass('fa-fw');
                    button.addClass('fa-exclamation-triangle');
                    button.css('color', 'red');

                    HCFunctions.notify('error', e);
                }

                function handleSilentLoaded(data) {
                    if (data.success == true) {
                        button.removeClass('fa-spin');
                        button.removeClass('fa-refresh');
                        button.removeClass('fa-fw');
                        button.addClass('fa-check');
                        button.css('color', 'green');
                    }
                }

                return button;
            }

            function createExternalButton(value) {
                return $('<a href="' + value + '" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i></a>');
                ;
            }
        }

        /**
         * Enabling list item
         *
         * @param id
         */
        function enableListItemChildren(id) {
            var record = $('#' + id);
            var canUpdate = (configuration.actions && configuration.actions.indexOf('update') >= 0);

            record.removeClass('disabled');

            $.each(record.children(), function (key, child) {
                    if ($(child).attr('class').split(' ').indexOf('independent') == -1) {
                        if (canUpdate)
                            $(child).bind('click', function () {
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

        function handleCheckBoxClick(e) {

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

        function handleCheckBoxChange() {
            if ($(':checkbox', checkBox).prop('checked')) {
                record.addClass('hc-active');
                leScope.isSelected = true;
            }
            else {
                record.removeClass('hc-active');
                leScope.isSelected = false;
            }

            updateSelected(leScope.isSelected);
        }

        function markUpdatedItem() {
            console.log('TODO: mark me', currentID)
        }

        this.selectItem = function () {
            if (isVisible && !$(':checkbox', checkBox).attr('disabled')) {
                $(':checkbox', checkBox).prop('checked', true);
                handleCheckBoxChange();
            }
        };

        this.deselectItem = function () {
            $(':checkbox', checkBox).prop('checked', false);
            handleCheckBoxChange();
        };

        this.showElement = function () {
            isVisible = true;
            record.show();
        };

        this.hideElement = function () {
            isVisible = false;
            this.deselectItem();
            record.hide();
        };
    };

    /**
     * Update count in the buttons
     *
     * @param increase
     */
    function updateSelected(increase) {
        if (increase)
            totalSelectedRows++;
        else if (totalSelectedRows > 0)
            totalSelectedRows--;

        if (totalSelectedRows > 0) {
            $('.counter', scope.actionListItems.delete).show();

            if (totalSelectedRows >= Object.size(listElementsHolder))
                $(':not(:checked)', mainCheckBox).prop("checked", true);
            else
                $(':checked', mainCheckBox).prop("checked", false);
        }
        else {
            $(':checked', mainCheckBox).prop('checked', false);
            $('.counter', scope.actionListItems.delete).hide();
        }

        $('.counter', scope.actionListItems.delete).html('(' + totalSelectedRows + ')');
    }

    /**
     * Checking if the list element will be fully disabled
     *
     * @param data
     * @param config
     * @returns {boolean}
     */
    function isDisabled(data, config) {
        if (!config)
            return false;

        var disabled = false;

        $.each(config, function (config_key, config_value) {
            if (HCFunctions.isString(config_value)) {
                if (config_key.indexOf('.') >= 0) {
                    if (HCFunctions.pathIndex(data, config_key) == config_value)
                        disabled = true;
                }
                else if (data[config_key] == config_value)
                    disabled = true;

                if (config_value == 'IS_NOT_NULL')
                    if (data[config_key])
                        disabled = true;
            }
            else {
                var cf = config_value.toString();

                // Checking if value is an array
                if (cf.indexOf(',') >= 0) {
                    if (config_value.indexOf(HCFunctions.pathIndex(data, config_key)) >= 0)
                        disabled = true;
                }
                // Checking if key has multiple params
                else if (config_key.indexOf('.') >= 0) {
                    if (HCFunctions.pathIndex(data, config_key) == config_value)
                        disabled = true;
                }
                else if (data[config_key] == cf)
                    disabled = true;
            }
        });

        return disabled;
    }

    /**
     * Creating table header
     * @param url
     */
    this.handleReloadAction = function (url) {
        listContainer.find('.hc-list-item').remove();
        dataList.reload(url);
    };

    /**
     * Enabling filter
     *
     * @param value
     */
    this.handleFilterButtonActionClick = function (value) {
        $.each($('.hc-list-container .hc-list-item'), function (key, element) {
            listElementsHolder[$(element).attr('id')].showElement();
        });

        $.each($('.hc-list-container .hc-list-item:not(:contains_ci(' + value + '))'), function (key, element) {
            listElementsHolder[$(element).attr('id')].hideElement();
        });
    };

    this.handleDeleteButtonClick = function () {
        var listToDelete = getSelectedListItems();

        if (listToDelete.length == 0)
            return;

        var loader = new HCLoader.BasicLoader();
        loader.addVariable('list', listToDelete);
        loader.methodDELETE();
        loader.load(null, null, null, configuration.contentURL, 'delete');

        $.each(listToDelete, function (key, value) {
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
    function getSelectedListItems() {
        var list = [];

        $.each(listElementsHolder, function (key, value) {
            if (value.isSelected)
                list.push(key);
        });

        return list;
    }

    /**
     * After successful creation reload the content
     * @param url
     */
    this.handleSuccessCreation = function (url) {
        this.handleReloadAction(url);
    };

    this.initializeCore(configuration);
};