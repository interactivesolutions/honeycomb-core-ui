HCService.FormManager.Objects.BasicField = function ()
{
    /**
     * BasicField scope instance
     *
     * @type {HCService.FormManager.Objects.BasicField}
     */
    var localScope = this;

    /**
     * Events dispatcher
     * @type jQuery Object
     */
    this.eventDispatcher = new HCObjects.HCEventDispatcher ();

    /**
     * Field metadata
     * @type Object
     */
    var fieldData = null;

    /**
     * Unique identification number for a field
     * @type String
     */
    this.uniqueFieldID = HCFunctions.createUUID ();

    /**
     * Field Properties
     * @type Object
     */
    var fieldProperties = null;

    /**
     * Field Options (used by lists)
     * @type Object
     */
    var fieldOptions = null;

    /**
     * Used in dependencies to restore its previous state
     */
    var innerRequired;

    /**
     * Parent DIV field holder
     */
    var parent;

    /**
     * When field has multiple dependencies, storing validation for each of the field
     *
     * @type {Object}
     */
    this.dependencyArray = {};

    /**
     * indicating field data availability in case of dependencies
     * @type Object
     */
    this.available = true;

    /**
     * Multi Language select options
     */
    var multiLanguageSelect;

    /**
     * Is field editable
     * @type Boolean
     */
    var editable;

    /**
     * Setting field metadata and field properties
     *
     * @method setFieldData
     * @param {object} data object which contains metadata and properties.
     */
    this.setFieldData = function (data)
    {
        fieldData       = data;
        fieldProperties = data.properties;
        fieldOptions    = data.options;
        innerRequired   = data.required;
        editable        = data.editable;

        this.updateDependencyArray ();
        this.handleProperties ();
        this.handleOptions ();

        if (this.fieldName != 'button')
            this.handleEditable ();
    };

    /**
     * Returning field data
     *
     * @returns {Object}
     */
    this.getFieldData = function ()
    {
        return fieldData;
    };

    /**
     * Returns Field id
     *
     * @method getFieldID
     * @return {string} id
     */
    this.getFieldID = function ()
    {
        return fieldData.fieldID;
    };

    /**
     * Returning field properties
     *
     * @returns {Object}
     */
    this.getProperties = function ()
    {
        return fieldProperties;
    };

    /**
     * Returning field options
     *
     * @returns {Object}
     */
    this.getOptions = function ()
    {
        return fieldOptions;
    };

    /**
     * Initial dependency, set all to false
     */
    this.updateDependencyArray = function ()
    {
        $.each (fieldData.dependencies, function (key, value)
        {
            localScope.dependencyArray[value.field_id] = false;
        })
    };

    /**
     * This function should format the field, based on provided properties.
     * This function might be overridden
     *
     * @method handleProperties
     */
    this.handleProperties = function ()
    {
    };

    /**
     * This function should add selection options, based on provided options.
     * This function might be overridden
     *
     * @method handleProperties
     */
    this.handleOptions = function ()
    {
    };

    /**
     * Checking if field can be edited
     */
    this.handleEditable = function ()
    {
        if (!editable)
            this.inputField.attr ('disabled', true);
    };

    /**
     * Get the placeholder name
     *
     * @returns {String}
     * @method getPlaceHolder
     */
    this.getPlaceHolder = function ()
    {
        if (fieldData.placeholder)
            return this.getLabel ();

        return '';
    };

    /**
     * Returns Label string
     *
     * @method getLabel
     * @return {string} Label
     */
    this.getLabel = function ()
    {
        return fieldData.label;
    };

    /**
     * Getting annotation
     *
     * @method getAnnotation
     * @returns {String}
     */
    this.getAnnotation = function ()
    {
        if (fieldData.note)
            return '<div style="width: 100%;"><small class="text-muted pull-right">' + fieldData.note + '</small></div>';

        return '';
    };

    /**
     * Returns generated Field HTML div
     *
     * @method getHTML
     * @return {Array} HTML div
     */
    this.getHTML = function ()
    {
        var array = [this.getLabelHTML ()];

        if (this.innerHTML instanceof Array)
        {
            for (var i = 0; i < this.innerHTML.length; i++)
                array.push (this.innerHTML[i]);
        }
        else
            array.push (this.innerHTML);

        return array;
    };

    /**
     * Returns generated Field label HTML div
     *
     * @method getLabelHTML
     * @return {string} HTML div
     */
    this.getLabelHTML = function ()
    {
        //TODO annotations on click / rollover
        var placeholder = '';

        if (!this.getLabel ())
            return '';

        if (fieldData.placeholder)
            placeholder = 'hidden';

        return $ ('<label class="hc-fo-field-label ' + placeholder + '">' + this.getLabel () + ' ' + getRequiredHTML() + '</label>');
    };

    /**
     * Getting required html
     *
     * @returns {*}
     */
    function getRequiredHTML()
    {
        if (fieldData.required && fieldData.requiredVisible)
            return '<span class="text-danger">*</span>';

        return '';
    }

    /**
     * Returns value if the field required or not
     *
     * @method isRequired
     * @return {Boolean} required
     */
    this.isRequired = function ()
    {
        return fieldData.required;
    };

    /**
     * Set field parent
     *
     * @method setParent
     * @param {object} value returns parent div.
     */
    this.setParent = function (value)
    {
        parent = value;
    };

    /**
     * Getting parent
     * @returns {Object|*|Window}
     */
    this.getParent = function ()
    {
        return parent;
    };

    /**
     * When field needs to be on stage, to be created
     * this function will be called.
     * This applies mostly to fields which are using external libraries
     * This function might be overridden
     *
     * @method updateWhenOnStage
     */
    this.updateWhenOnStage = function ()
    {
        this.inputField = $ ('#' + this.uniqueFieldID);
        this.addEvents ();
    };

    /**
     * Adding event listeners for field content to change
     *
     * @method addEvents
     */
    this.addEvents = function ()
    {
        $ (this.inputField).unbind ();
        HCFunctions.bind (this, this.inputField, 'blur', this.validateContentData);
        HCFunctions.bind (this, this.inputField, 'change', this.triggerContentChange);
    };

    /**
     * Function which triggers event for ContentChange
     *
     * @method triggerContentChange
     */
    this.triggerContentChange = function ()
    {
        if (fieldData.multiLanguage)
        {
            var index = this.getContentLanguageElementIndex ();

            if (index >= 0)
            {
                validateIndex (index);
                localScope.form.content.translations[index][localScope.getFieldID ()] = this.getContentData ();
            }
        }
        else
            this.form.content[this.getFieldID ()] = this.getContentData ();

        this.eventDispatcher.trigger ('contentDataChange', this);
    };

    /**
     * Checking if multi language index exists, if not creating one
     * @param index
     */
    function validateIndex (index)
    {
        if (!localScope.form.content.translations[index])
        {
            localScope.form.content.translations[index]                  = {};
            localScope.form.content.translations[index]['language_code'] = localScope.form.currentLanguage;
        }
    }

    /**
     * This function validates the data.
     * This function might be overridden, else it will show a Warning
     *
     * @method validateContentData
     * @return {Boolean} is content valid
     */

    this.validateContentData = function ()
    {
        if (fieldData.requiredLanguages)
        {
            var missingLanguages = HCFunctions.clone (fieldData.requiredLanguages);
            var languagePosition;

            $.each (this.form.content.translations, function (key, value)
            {
                languagePosition = missingLanguages.indexOf (value.language_code);

                if (languagePosition >= 0 && value[localScope.getFieldID ()])
                    missingLanguages.splice (languagePosition, 1);
            });

            if (missingLanguages.length > 0)
            {
                this.showFieldError (this.getLabel () + ' missing languages: ' + missingLanguages.toString ());
                return false;
            }
        }
        else if (this.isRequired () && this.getContentData () == null)
        {
            this.showFieldError (this.getLabel () + ' is empty!');
            return false;
        }

        this.hideFieldError ();
        return true;
    };

    /**
     * Method will be called after a field is on stage and field
     * needs to be updated when updateWhenOnStage is not enough.
     *
     * @method updateWhenOnStageLocal
     */
    this.updateWhenOnStageLocal = function ()
    {
    };

    /**
     * Adding default value
     *
     * @method setDefaultValue
     */
    this.setDefaultValue = function ()
    {
        if (fieldData.value)
            this.setContentData (fieldData.value);
    };

    /**
     * Setting data for the field
     *
     * @method setContentData
     * @param {object} data The available data for Field.
     */
    this.setContentData = function (data)
    {
        if (!this.available && data)
            this.invisibleValue = data;
        else
            this.inputField.val (data);

        this.triggerContentChange ();

    };

    /**
     * Getting content data
     *
     * @method getContentData
     * @returns {*}
     */
    this.getContentData = function ()
    {
        var data = this.inputField.val ();

        if (!data && this.invisibleValue)
            data = this.invisibleValue;

        if (data == "")
            return null;

        return data;
    };

    /**
     * When field is required and entered after the Error has been showed, this function will remove highlight
     * This function might be overridden
     *
     * @method hideFieldError
     */
    this.hideFieldError = function ()
    {
        //TODO make possibility for fields to have warning and danger types
        parent.removeClass ('has-danger').addClass('has-success');
        this.inputField.addClass('form-control-success');
    };

    /**
     * When field is required but not entered, this function will highlight it
     * This function might be overridden.
     *
     * @method showFieldError
     * @param {string} value Error message
     */
    this.showFieldError = function (value)
    {
        parent.addClass ('has-danger');
        this.inputField.removeClass('form-control-success');
        this.showErrorMessage (value);
    };

    /**
     * This function will show ERROR message inside the field or FORM
     * This function might be overridden
     *
     * @method showErrorMessage
     * @param {string} value Error message
     */
    this.showErrorMessage = function (value)
    {
        HCFunctions.showToastrMessage ('warning', value);
    };

    /**
     * Checking for multi language
     */
    this.checkForMultiLanguage = function ()
    {
        var availableLanguages = this.form.getAvailableLanguages ();

        if (availableLanguages.length == 0 || !fieldData.multiLanguage)
            return;

        multiLanguageSelect = $ ('<select id="multi-language-selector" class="form-control col-xs-2"></select>');

        if (!editable)
            multiLanguageSelect.attr('disabled', true);

        $.each (availableLanguages, function (key, value)
        {
            multiLanguageSelect.append ('<option>' + value + '</option>');
        });

        multiLanguageSelect.change (function (e)
        {
            if (e.originalEvent)
            {
                localScope.form.currentLanguage = e.currentTarget.value;
                localScope.form.eventDispatcher.trigger ('languageChanged');
            }
        });

        localScope.form.eventDispatcher.bind (localScope, 'languageChanged', this.languageSelectionChanged);

        this.inputField.addClass('col-xs-10');

        this.innerHTML.addClass('row form-group');
        this.innerHTML.css({'margin-right': 0, 'margin-left': 0});
        this.innerHTML.append (multiLanguageSelect);
    };

    /**
     * MultiLanguage option changed
     */
    this.languageSelectionChanged = function ()
    {
        multiLanguageSelect.val (localScope.form.currentLanguage);
        this.populateContent ();
    };

    /**
     * Populating content, retrieving data from form content
     */
    this.populateContent = function ()
    {
        if (fieldData.multiLanguage)
        {
            var index = this.getContentLanguageElementIndex ();

            if (index >= 0)
            {
                validateIndex (index);
                localScope.setContentData (localScope.form.content.translations[index][localScope.getFieldID ()]);
            }
        }
        else
            localScope.setContentData (localScope.form.content[localScope.getFieldID ()]);
    };

    /**
     * Finding index of translations array, based on currentLanguage
     *
     * @returns {undefined}
     */
    this.getContentLanguageElementIndex = function ()
    {
        var _key = undefined;

        $.each (localScope.form.content.translations, function (key, value)
        {
            if (value.language_code == localScope.form.currentLanguage)
                _key = key;
        });

        if (_key == undefined)
            _key = Object.size (localScope.form.content.translations);

        return _key;
    }

    /**
     * hide field parent
     *
     * @method hideParent
     */
    this.hideParent = function ()
    {
        this.available = false;

        fieldOptions = null;
        parent.addClass ('hc-hidden');

        if (innerRequired == 1)
            this.getFieldData ().required = false;

        this.setContentData (null);
    };

    /**
     * show field parent
     *
     * @method showParent
     */
    this.showParent = function ()
    {
        if (this.getFieldData ().dependencies && !this.dependencyUpdated)
            return;
        else if (this.getFieldData ().dependencies && !this.dependencyAllow)
            return;

        this.available = true;
        // display table for design purpose
        parent.removeClass ('hc-hidden');
        parent.removeAttr ('style');

        if (innerRequired == 1)
            this.getFieldData ().required = true;

        if (this.invisibleValue)
            this.setContentData (this.invisibleValue);

        this.invisibleValue = undefined;
    };

    /*/!**
     * jQuery object of input field;
     * @type Object
     *!/
     this.inputField = null;


     /!**
     * Field identification name
     * @type String
     *!/
     this.fieldName = null;

     /!**
     * Form ID where this field belongs
     * @type String
     *!/
     this.formID = null;

     /!**
     * ISForm object
     *!/
     this.form = null;

     /!**
     * Form structure
     *!/
     this.formFields = null;

     /!**
     * user seted form wrapper
     * @type String
     *!/
     this.formWrapper = null;

     /!**
     * innerHeight HTML
     * @type string|jQuery object
     *!/
     this.innerHTML = null;

     /!**
     * destroy all form
     * @type function
     *!/
     this.destroyForm = null;

     /!**
     * Input field holder
     *!/
     this.parent = null;

     /!**
     * Saving invisible value
     *!/
     this.invisibleValue = null;

     /!**
     * Dependency values which might be used in other fields
     *!/
     this.dependencyValues = {};

     /!**
     * Returns value string
     *
     * @method getValue
     * @return {string} Value
     *!/
     this.getValue = function () {
     return this.inputField.val();
     }


     /!**
     * This function should format the field, based on provided properties.
     * This function might be overridden
     *
     * @method handleProperties
     *!/
     this.handleProperties = function () {
     };

     /!**
     * This function should add selection options, based on provided options.
     * This function might be overridden
     *
     * @method handleProperties
     *!/
     this.handleOptions = function () {
     };



     /!**
     * This function is destroying content variables
     *
     * @method destroy
     *!/
     this.destroy = function ()
     {
     this.inputField.unbind();
     this.destroySubClass();
     };

     /!**
     * This function should destroy parameters of the subClass
     * This function might be overridden
     *
     * @method destroySubClass
     *!/
     this.destroySubClass = function ()
     {
     this.inputField.remove();
     };





     this.dependencyUpdated = this.dependencyAllow = false;

     /!**
     *
     * Updating dependencies
     *
     * @param value
     * @returns {boolean}
     *!/
     this.updateDependencies = function (value)
     {
     this.dependencyUpdated = true;

     var contentData = value.getContentData();
     var dependencies = this.fieldData.dependencies;

     function validateDependency(dependency)
     {
     var success = false;

     if (dependency.value_id)
     {
     if (HCFunctions.isArray(dependency.value_id))
     $.each(dependency.value_id, function (key, value)
     {
     if (value == contentData)
     success = true;
     });
     else if (dependency.value_id == contentData)
     success = true;
     }
     else
     success = true;

     if (success && dependency.options_url)
     localScope.loadOptions(dependency.options_url, value);

     if (success && !(contentData && contentData != ''))
     success = false;

     if (success)
     localScope.dependencyValues[value.fieldID] = value.getContentData();
     else
     delete localScope.dependencyAllow[value.fieldID];
     return success;
     }

     var success = true;

     if (HCFunctions.isArray(dependencies))
     {
     $.each(dependencies, function (key, dependencyValue)
     {
     if (dependencyValue.field_id == value.fieldID)
     localScope.dependencyArray[value.fieldID] = validateDependency(dependencyValue);
     });

     $.each(localScope.dependencyArray, function (successKey, successValue)
     {
     if (!successValue)
     success = false;
     });
     }
     else
     success = validateDependency(dependencies);

     this.dependencyAllow = success;

     return success;
     };

     /!**
     * Executing additional tasks in main field
     *!/
     this.updateDependenciesLocal = function (value)
     {

     };

     /!**
     * Loading options
     *!/
     this.loadOptions = function (url, sourceField)
     {
     var variable = sourceField.getContentData();

     if (variable && !HCFunctions.isString(variable))
     variable = variable.toString();

     var loader;
     loader = new ISLoader.BasicLoader();
     loader.dataTypeJSON();

     if (variable)
     loader.addVariable(sourceField.fieldID, variable);

     loader.load(optionsLoaded, handleError, this, url);
     };

     /!**
     * Options has been loaded
     *
     * @param value
     *!/
     function optionsLoaded(value)
     {
     this.fieldOptions = value;
     this.handleOptions();
     }

     /!**
     * Loading has failed
     *
     * @method handleError
     * @param e error information
     *!/
     function handleError(e)
     {
     HCFunctions.showToastrMessage('error', e);
     submitButton.enable();
     }*/
};