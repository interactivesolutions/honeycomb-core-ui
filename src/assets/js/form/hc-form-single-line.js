HCService.FormManager.Objects.SingleLine = function ()
{
    this.inheritFrom = HCService.FormManager.Objects.BasicField;
    this.inheritFrom ();

    /**
     * Field identification name
     * @type String
     */
    this.fieldName = 'singleLine';

    var scope = this;

    var multiLanguage;
    var currentLanguage = undefined;

    /**
     * Handling properties of the input field
     *
     * @method handleProperties
     */
    this.handleProperties = function ()
    {
        var type = 'text';
        var step = '';

        if (this.getFieldData ().numeric)
        {
            type = 'number';
            step = this.getFieldData().step;

                if (step)
                step = 'step="' + step + '"';
        }

        this.innerHTML = $ ('<div></div>');
        this.inputField  = $ ('<input class="form-control" id="' + this.uniqueFieldID + '" type="' + type + '" ' + step + ' placeholder="' + this.getPlaceHolder () + '">');

        if (this.getFieldData ().maxLength)
            this.inputField.attr ('maxLength', this.getFieldData ().maxLength);

        this.innerHTML.append (this.inputField);
        this.checkForMultiLanguage ();

        this.innerHTML.append (this.getAnnotation());
    };

    /**
     * Updating field when it is on stage
     */
    this.updateWhenOnStageLocal = function ()
    {
        // Getting current language when it is available
        if (multiLanguage)
            currentLanguage = $ (this.innerHTML.find ('#multi-language')).val ();
    };
};