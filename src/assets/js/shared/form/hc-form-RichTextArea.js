HCService.FormManager.Objects.RichTextArea = function ()
{
    this.inheritFrom = HCService.FormManager.Objects.BasicField;
    this.inheritFrom();

    /**
     * Field identification name
     * @type String
     */
    this.fieldName = 'richTextArea';

    var parentScope = this.parentScrope;

    var scope = this;

    /**
     * Handling properties of the input field
     *
     * @method handleProperties
     */
    this.handleProperties = function ()
    {
        this.innerHTML = $ ('<div></div>');
        this.inputField  = $ ('<textarea class="form-control" rows="' + this.getFieldData().rows + '" id="' + this.uniqueFieldID + '"></textarea>');
        this.innerHTML.append (this.inputField);
        this.checkForMultiLanguage ();

        this.innerHTML.append (this.getAnnotation());
    };

    /**
     *
     * @method updateWhenOnStageLocal
     */
    this.updateWhenOnStageLocal = function ()
    {
        var plugins =  this.getFieldData().plugins || ["image media fullscreen wordcount preview"];
        var toolbar = this.getFieldData().toolbar || 'undo redo | bold italic underline | styleselect fullscreen preview | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | media image';

        tinymce.init(
            {
                selector: '#' + this.uniqueFieldID,
                plugins: plugins,
                toolbar: toolbar,
                height: this.getFieldData().height || 200,
                setup : function(rt) {
                    rt.on('blur', function(e) {
                        parentScope.validateContentData();
                    });

                    rt.on('change', function (){
                        parentScope.triggerContentChange();
                    });

                    rt.on('init', function (){
                        scope.innerHTML.find('.mce-tinymce').addClass('col-xs-10');
                        scope.innerHTML.find('.mce-tinymce').css({"box-sizing": "border-box", "-moz-box-sizing": "border-box", "-webkit-box-sizing": "border-box"});
                    });
                }
            });

        if (this.getFieldData().multiLanguage)
        {
            console.log(tinymce.editors[this.uniqueFieldID]);
        }
        //
    };

    /**
     * Getting content
     *
     * @returns {*}
     */
    this.getContentData = function ()
    {
        if (tinymce.editors[this.uniqueFieldID])
        {
            var data = tinymce.editors[this.uniqueFieldID].getContent();

            if (data == '')
                return null;

            return data;
        }
    };

    /**
     * Setting content
     *
     * @param data
     */
    this.setContentData = function (data)
    {
        if (tinymce.editors[this.uniqueFieldID]) {
            data = data ? data : '';
            tinymce.editors[this.uniqueFieldID].setContent(data);
        }
    }
};