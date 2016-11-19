HCService.FormManager.Objects.Button = function ()
{
    this.inheritFrom = HCService.FormManager.Objects.BasicField;
    this.inheritFrom();

    var scope = this;

    /**
     * Field identification name
     * @type String
     */
    this.fieldName = 'button';

    /**
     * Call function when button is clicked
     *
     * @type {function}
     */
    this.handleClick = undefined;

    /**
     * Handling properties of the input field
     *
     * @method handleProperties
     */
    this.handleProperties = function ()
    {
        this.innerHTML = this.inputHTML = $('<button tabindex="0" type="button" id="' + this.uniqueFieldID + '"></button>');

        if (this.getFieldData().attributes)
        {
            $.each(this.getFieldData().attributes, function (key, value)
            {
                scope.inputHTML.attr(key, value);
            });
        }

        if (!this.getFieldData().class)
            this.getFieldData().class = 'col-centered';

        this.inputHTML.addClass(this.getFieldData().class);
        this.enable();
    };

    /**
     * Returning label html as empty string
     *
     * @returns {string}
     */
    this.getLabelHTML = function ()
    {
        return '';
    };

    /**
     * Handle button click
     */
    function handleClickLocal()
    {
        switch (scope.fieldData.type)
        {
            case 'submit':
                break;
        }

        scope.handleClick();
    }

    /**
     * Disable button
     */
    this.disable = function ()
    {
        this.inputHTML.unbind();
        this.inputHTML.removeClass('is-button');
        this.inputHTML.addClass('disabled hc-button-disabled');
    };

    /**
     * Enable button
     */
    this.enable = function ()
    {
        this.inputHTML.removeClass('disabled hc-button-disabled');
        this.inputHTML.addClass('is-button');
        this.inputHTML.html(this.getLabel());

        this.inputHTML.unbind();
        this.inputHTML.bind('click', handleLocalClick);
    };

    /**
     * Handling button click
     */
    function handleLocalClick()
    {
        if (scope.handleClick)
            scope.handleClick();
    }
};