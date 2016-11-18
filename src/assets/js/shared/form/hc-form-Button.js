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
        this.innerHTML = $('<button tabindex="0" type="button" id="' + this.uniqueFieldID + '"></button>');

        if (this.getFieldData().attributes)
        {
            $.each(this.getFieldData().attributes, function (key, value)
            {
                scope.innerHTML.attr(key, value);
            });
        }

        if (!this.getFieldData().class)
            this.getFieldData().class = 'col-centered';

        this.innerHTML.addClass(this.getFieldData().class);
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
        this.innerHTML.unbind();
        this.innerHTML.removeClass('is-button');
        this.innerHTML.addClass('disabled hc-button-disabled');
    };

    /**
     * Enable button
     */
    this.enable = function ()
    {
        this.innerHTML.removeClass('disabled hc-button-disabled');
        this.innerHTML.addClass('is-button');
        this.innerHTML.html(this.getLabel());

        this.innerHTML.unbind();
        this.innerHTML.bind('click', handleLocalClick);
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