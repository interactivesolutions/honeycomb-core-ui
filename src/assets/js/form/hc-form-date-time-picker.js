HCService.FormManager.Objects.DateTimePicker = function ()
{
    this.inheritFrom = HCService.FormManager.Objects.BasicField;
    this.inheritFrom();

    /**
     * Field identification name
     * @type String
     */
    this.fieldName = 'dateTimePicker';

    var scope = this;

    /**
     * Handling properties of the input field
     *
     * @method handleProperties
     */
    this.handleProperties = function ()
    {
        var disabled = '';

        if (this.getFieldData().editType == 1)
            disabled = 'disabled';

        this.innerHTML = $('<div class="input-group date" id="' + this.uniqueFieldID + '"></div>');
        this.inputField = $('<input type="text" class="form-control" ' + disabled + '/>' +
            '<span class="input-group-addon">' +
                '<span class="fa fa-calendar"></span>' +
            '</span>');

        this.innerHTML.append(this.inputField);
    };

    /**
     * Initializing bootstrap dateTimePicker
     */
    this.updateWhenOnStageLocal = function ()
    {
        var field = $('#' + this.uniqueFieldID);
        field.datetimepicker(this.getFieldData().properties).on('dp.change', function (ev)
        {
            scope.triggerContentChange();
        });

        if (this.getFieldData().properties.defaultDate)
            scope.triggerContentChange();
    };

    /**
     * Setting content data
     *
     * @param value
     */
    this.setContentData = function (value)
    {
        $('#' + this.uniqueFieldID).datetimepicker().children('input').val(value);
        this.triggerContentChange();
    };

    /**
     * Getting content data
     *
     * @returns {*|jQuery}
     */
    this.getContentData = function ()
    {
        return $('#' + this.uniqueFieldID).datetimepicker().children('input').val();
    }
};