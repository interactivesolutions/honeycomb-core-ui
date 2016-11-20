HCService.FormManager.Objects.RadioList = function ()
{
    this.inheritFrom = HCService.FormManager.Objects.BasicField;
    this.inheritFrom();

    var idHolder = [];

    /**
     * Field identification name
     * @type String
     */
    this.fieldName = 'radioList';

    var contentData;

    /**
     * Handling properties of the input field
     *
     * @method handleProperties
     */
    this.handleProperties = function ()
    {
        this.innerHTML = $('<div class="form-check"></div>');
    };

    /**
     * Handling options of the input field
     *
     * @method handleOptions
     */
    this.handleOptions = function ()
    {
        this.innerHTML.html('');
        idHolder = [];

        // If no options available ending function
        if (!this.getOptions())
            return;

        var length = this.getOptions().length;
        var horizontal = '';
        var disableValue = '';

        if (this.getFieldData().horizontal)
            horizontal = '-inline';

        if (this.editType || this.editType > 0)
            disableValue = "disabled";

        for (var i = 0; i < length; i++)
        {
            idHolder[this.getOptions()[i].id] = HCFunctions.createUUID();

            this.innerHTML.append('<label class="form-check"' + horizontal + '>' + '<input class="form-check-input" type="radio" name="' + this.uniqueFieldID + '" id="' + idHolder[this.getOptions()[i].id] + '" value="' + this.getOptions()[i].id + '">' + this.getOptions()[i].label + '</label>');
        }

        if (contentData)
            this.setContentData(contentData);
    };


    /**
     * Returning selected item ID
     *
     * @returns {String}
     */
    this.getContentData = function ()
    {
        return $('input:radio[name=' + this.uniqueFieldID + ']:checked', this.innerHTML).val();
    };

    /**
     * Updating current data
     *
     * @method setContentData
     * @param {String} value for SingleLine
     */
    this.setContentData = function (value)
    {
        if (Object.keys(idHolder).length == 0)
        {
            contentData = value;
            return;
        }

        if (!value)
            $('input:radio[name=' + this.uniqueFieldID + ']', this.innerHTML).prop('checked', false);
        else if (HCFunctions.isObject(value))
            $("#" + idHolder[value['id']], this.innerHTML).prop("checked", true);
        else
            $("#" + idHolder[value], this.innerHTML).prop("checked", true);

        this.triggerContentChange();
    };
};