HCService.FormManager.Objects.DropDownList = function ()
{
    this.inheritFrom = HCService.FormManager.Objects.BasicField;
    this.inheritFrom();

    /**
     * Field identification name
     * @type String
     */
    this.fieldName = 'dropDownList';

    /**
     * This scope
     *
     * @type {HCService.FormManager.Objects.DropDownList}
     */
    var scope = this;

    /**
     * Handling properties of the input field
     *
     * @method handleProperties
     */
    this.handleProperties = function ()
    {
        var multiple = '';

        if (this.getFieldData().search)
            if (!this.getFieldData().search.maximumSelectionLength || this.getFieldData().search.maximumSelectionLength > 0)
                multiple = 'multiple';

        this.innerHTML = this.inputField = $('<select ' + multiple + ' id="' + this.uniqueFieldID + '" class="form-control" style="width:auto;"></select>');
    };

    /**
     * Handling options of the input field
     *
     * @method handleOptions
     */
    this.handleOptions = function ()
    {
        if (!this.getOptions())
            return;

        var fieldOptions = formatData(this.getOptions());

        var length_i      = fieldOptions.length;
        var length_j;
        var option;

        var existingValue = this.getContentData() ? this.getContentData() : this.getFieldData().value;

        this.inputField.html('');

        for (var i = 0; i < length_i; i++)
        {
            if (fieldOptions[i].children)
            {
                length_j = fieldOptions[i].children.length;
                option   = '<optgroup label="' + fieldOptions[i].text + '">';

                for (var j = 0; j < length_j; j++)
                    option += '<option value="' + fieldOptions[i].children[j].id + '">' + fieldOptions[i].children[j].text + '&nbsp;&nbsp;</option>';

                option += '</optgroup>';
            }
            else
                option = '<option value="' + fieldOptions[i].id + '">' + fieldOptions[i].text + '&nbsp;&nbsp;</option>';

            this.inputField.append(option);
        }

        if (existingValue)
        {
            var selectItem = $('#' + this.uniqueFieldID);
            selectItem.val(existingValue).trigger("change");
        }
    };

    /**
     * Updating when item is on stage
     */
    this.updateWhenOnStageLocal = function ()
    {
        if (this.getFieldData().search)
        {
            addAjax();
            this.updateSelectComponent();
        }
    };

    function addAjax()
    {
        if (!scope.getFieldData().search.url)
            return;

        scope.getFieldData().search['ajax'] = {
            url           : scope.getFieldData().search.url,
            dataType      : 'json',
            delay         : 250,
            data          : function (params)
            {
                if (!scope.dependencyValues)
                    scope.dependencyValues = {};

                scope.searchPhrase = scope.dependencyValues['q'] = params.term;
                return scope.dependencyValues;
            },
            processResults: function (data, page)
            {
                return {
                    results: formatData(data)
                };
            },
            escapeMarkup  : function (markup)
            {
                return markup;
            }
        };
    }

    /**
     * Setting new data
     *
     * @method setContentData
     * @param {String} data for SingleLine
     */
    this.setContentData = function (data)
    {
        if (this.getFieldData().search)
        {
            var selectItem = $('#' + this.uniqueFieldID);
            var values     = [];

            if (this.getFieldData().search.maximumSelectionLength === 1)
            {
                if (HCFunctions.isObject(data))
                {
                    data = formatData([data])[0];

                    var $option = $('#' + scope.uniqueFieldID + " option[value='" + data.id + "']");

                    if (!$option.length)
                        selectItem.append($('<option/>', {value: data.id, text: data.text}));

                    selectItem.trigger("update");
                    selectItem.val(data.id).trigger("change");
                }
                else
                    selectItem.val(data).trigger("change");
            }
            else
            {
                data = formatData(data);

                $.each(data, function (key, value)
                {
                    var $option = $('#' + scope.uniqueFieldID + " option[value='" + value.id + "']");

                    if ($option.length)
                    {
                        if (value.text === '' || value.text !== $option.text())
                            value.text = $option.text();

                        $option.remove();
                    }

                    selectItem.append($('<option/>', {value: value.id, text: value.text}));
                    selectItem.trigger("change");
                    values.push(value.id);
                });

                //TODO: update not reaching the enableSortable() update eventHandler
                selectItem.val(values.toString().split(',')).trigger("change").trigger('update');
            }
        }
        else
            $(this.inputField).val(data);

        if (this.getContentData() === null && data)
            this.getFieldData().value = data;

        this.triggerContentChange();
    };

    /**
     * Formatting data to fit the select2 component
     *
     * @param data
     * @returns {*}
     */
    function formatData(data, nodeNames)
    {
        var text;
        var multiLevel = scope.getFieldData().multiLevel;

        if (!nodeNames)
            nodeNames = scope.getFieldData().search ? scope.getFieldData().search.showNodes : scope.getFieldData().showNodes;

        return $.map(data, function (obj)
        {
            text = '';

            if (HCFunctions.isString(obj))
                obj = {id: obj, value: obj};

            if (multiLevel)
            {
                function format(data)
                {
                    var formatted = {};
                    var children  = data[multiLevel['field_children']];

                    formatted.id   = data.id;
                    formatted.text = data[multiLevel['field_name']];

                    if (children && children.length > 0)
                    {
                        formatted.children = [];
                        $.each(children, function (child_key, child_value)
                        {
                            formatted.children.push(format(child_value));
                        });
                    }

                    return formatted;
                }

                return format(obj);
            }
            else
            {
                $.each(obj, function (key, value)
                {
                    if (key !== 'id' && value)
                        if (nodeNames)
                        {
                            if (nodeNames.indexOf(key) >= 0)
                                text += value + ' | ';
                            else if (HCFunctions.isArray(value))
                            {
                                $.each(nodeNames, function (node_key, node_value)
                                {
                                    if (node_value.indexOf('{lang}') !== -1)
                                    {

                                        node_value = HCFunctions.replaceBrackets(node_value, {'lang': HCFunctions.getTranslationsLanguageElementIndex(HCService.FRONTENDLanguage, value)});
                                        text += HCFunctions.pathIndex(obj, node_value) + ' | ';
                                        return false;
                                    }
                                    else
                                    if (value[node_value] && value[node_value] !== '' && value[node_value] !== null)
                                        text += value[node_value] + ' | ';
                                });
                            }
                        }
                        else
                            text += value + ' | ';
                });

                text = text.substr(0, text.length - 3);
                return {id: obj.id, text: text};
            }
        });
    }

    /**
     * Enabling or updating select2 field
     */
    this.updateSelectComponent = function ()
    {
        var selectItem = $('#' + this.uniqueFieldID);
        selectItem.select2(this.getFieldData().search);

        if (this.getFieldData().editType !== 1)
            if (this.getFieldData().sortable)
                this.enableSortable(selectItem);

        if (this.getFieldData().new)
            this.addNewOption(this.getFieldData().new, this.newOptionCreated);
        else
            this.getParent().find('.select2-container').removeAttr('style');
    };

    /**
     * Adding new option which was just created to the list
     * @param response
     */
    this.newOptionCreated = function (response)
    {
        response = formatData([response], scope.getFieldData().new.showNodes)[0];

        var selectItem = $('#' + scope.uniqueFieldID);
        var $option    = $('#' + scope.uniqueFieldID + " option[value='" + response.id + "']");

        if (!$option.length)
            selectItem.append($('<option/>', {value: response.id, text: response.text}));

        var newList = selectItem.val();
        newList.push(response.id);

        selectItem.trigger("change");
        selectItem.val(newList).trigger("change");
    };

    /**
     * Adding new Option button
     */
    this.addNewOption = function (options, callBack)
    {
        var newOption = $('<div class="btn btn-success is-list-action-item btn-add-new-option"><i class="fa fa-fw fa-plus"></i></div>');
        newOption.bind('click', handleNewOption);

        this.getParent().find('.select2-container').css('width', 'calc(100% - 60px)');
        this.getParent().find('.select2-container').css('margin-right', '5px');
        this.getParent().append(newOption);

        function handleNewOption()
        {
            HCService.PopUp.Pop({
                label   : 'New Record',
                type    : 'form',
                config  : {
                    structureURL: getStructureURL()
                },
                callBack: callBack
            });
        }

        function getStructureURL ()
        {
            var url = options.url;

            if (options.require)
                $.each(options.require, function (key, value){
                    if (url.indexOf('?') === -1)
                        url += '?' + value + '=' + scope.form.content[value];
                    else
                        url += '&' + value + '=' + scope.form.content[value];
                });

            return url;
        }
    };

    /**
     * Enabling sorting
     *
     * @param selectItem
     */
    this.enableSortable = function (selectItem)
    {
        selectItem.parent().find("ul.select2-selection__rendered").sortable({
            containment: 'parent',
            update     : function ()
            {
                orderSortedValues();
            }
        });

        function orderSortedValues()
        {
            selectItem.parent().find("ul.select2-selection__rendered").children("li[title]").each(function (i, obj)
            {
                var element = selectItem.children("option[value='" + obj.title + "']");
                moveElementToEndOfParent(element)
            });
        }

        function moveElementToEndOfParent(element)
        {
            var parent = element.parent();
            element.detach();
            parent.append(element);
        }

        function stopAutomaticOrdering()
        {
            selectItem.on("select2:select", function (evt)
            {
                var id      = evt.params.data.id;
                var element = $(this).children("option[value=" + id + "]");

                moveElementToEndOfParent(element);
                $(this).trigger("change");
            });
        }

        stopAutomaticOrdering();
    };

    /**
     * Returning field value
     *
     * @returns {*}
     */
    this.getValue = function ()
    {
        var context       = $('.is-fo-dropdown-list option[value=' + this.contentData + ']', this.innerHTML).context;
        var selectedIndex = context.selectedIndex;

        if (selectedIndex === -1)
            selectedIndex = 0;

        return context[selectedIndex].text;
    };

    /**
     * Getting content data
     *
     * @method getContentData
     * @returns {*}
     */
    this.getContentData = function ()
    {
        if (!this.inputField)
            return null;

        var data = this.inputField.val();

        if (data && this.getFieldData().search && this.getFieldData().search.maximumSelectionLength === 1)
            data = data.toString();

        if (data === "")
            data = null;

        if (this.getFieldData().search && this.getFieldData().sortable)
        {
            data = [];

            var selectItem  = $('#' + this.uniqueFieldID);
            var sequence    = selectItem.parent().find("ul.select2-selection__rendered").children('.select2-selection__choice');
            var sequenceIds = $(this.inputField[0]).children();

            $.each(sequence, function (key, value)
            {
                $.each(sequenceIds, function (seqKey, seqValue)
                {
                    if ('×' + $(seqValue).text() === value.innerText)
                        data.push(seqValue.value);
                });
            });
        }

        return data;
    };

    /**
     * Focus on the dropdown list
     */
    this.focus = function ()
    {
        var selectItem = $('#' + this.uniqueFieldID);

        if (this.getFieldData().search)
            selectItem.select2('open');
    }
};