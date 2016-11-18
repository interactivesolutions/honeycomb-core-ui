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
        this.innerHTML = $ ('<div></div>');
        var inputHTML  = $ ('<input class="input-style" id="' + this.uniqueFieldID + '" type="text" placeholder="' + this.getPlaceHolder () + '">');
        
        if (this.getFieldData ().centered)
            inputHTML.css ('text-align', 'center');
        
        if (this.getFieldData ().maxLength)
            inputHTML.attr ('maxLength', this.getFieldData ().maxLength);
        
        this.innerHTML.append (inputHTML);
        
        enableMultiLanguage (inputHTML);
    };
    
    /**
     * Enabling multi language
     */
    function enableMultiLanguage (inputHTML)
    {
        multiLanguage = scope.getMultiLanguageDropDown ();
        
        if (multiLanguage)
        {
            inputHTML.addClass ('hc-multi-language');
            scope.innerHTML.append (multiLanguage);
        }
    }
    
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