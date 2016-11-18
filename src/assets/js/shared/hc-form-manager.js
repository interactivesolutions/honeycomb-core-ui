HCService.FormManager = new function ()
{
    this.Objects = [];
    
    this.inheritFrom = HCService.BasicService;
    this.inheritFrom();
    
    var initializedLocal = false;
    
    /**
     * All registered Form fields are stored here
     * @type {Array}
     */
    var availableFields = [];
    
    /**
     * Registering field which will be used in FormBuilder
     *
     * @method registerField
     * @param {class} field class to be registered
     */
    this.registerField = function (field)
    {
        var testField = new field();
        var superClass = new testField.inheritFrom();
        
        if (superClass instanceof HCService.FormManager.Objects.BasicField)
            availableFields[testField.fieldName] = field;
        
        superClass = null;
        testField = null;
    };
    
    /**
     * Registering all available form fields
     *
     * @method handleData
     */
    this.initialize = function ()
    {
        this.registerField(HCService.FormManager.Objects.SingleLine);
        
        initializedLocal = true;
    };
    
    /**
     * loads contend data
     * @method loadContentData
     *
     * @param data configuration for creating new form
     */
    this.createForm = function (data)
    {
        if (!initializedLocal)
            this.initialize();
        
        return new HCService.FormManager.ISForm(data, availableFields);
    };
};