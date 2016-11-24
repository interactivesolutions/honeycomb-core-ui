HCService.PopUp = new function ()
{
    this.Pop = function (data)
    {
        /**
         * Generating unique form id
         * @type {string}
         */

        var id = HCFunctions.createUUID();

        var popUpContent;
        var body;
        var closeButton;
        var footer;
        var header;
        var content;
        var overlay;
        var inside;

        function initialize()
        {
            createContentHolders();
            createTitle();
            createCloseButton();
            createContent();
            createBottomButtons();
        }

        /**
         * Creating bottom buttons
         *
         * @method createBottomButtons
         */
        function createBottomButtons()
        {
            var buttonsHolderID = HCFunctions.createUUID();
            var buttonsHolder = $('<div id="' + buttonsHolderID + '"></div>');
            footer.append(buttonsHolder);

            var buttons = [];
            var button;
            var buttonInfo;

            switch (data.type)
            {
                case 'select':
                    buttons.push({
                        'class': 'btn btn-default btn-sm',
                        'label': 'Cancel',
                        'scope': this,
                        'callBack': function (e)
                        {
                            closePopUp();
                        }
                    });

                    buttons.push({
                        'class': 'btn btn-primary btn-sm',
                        'label': 'Select',
                        'scope': this,
                        'callBack': submitData
                    });
                    break;

                case 'form':

                    data.config.buttonsDivID = '#' + buttonsHolderID;
                    break;
            }

            for (var i = 0; i < buttons.length; i++)
            {
                buttonInfo = buttons[i];
                button = $('<button type="button" class="' + buttonInfo.class + '">' + buttonInfo.label + '</button>');

                addButtonAction(button, buttonInfo);
                buttonsHolder.append(button);
            }

            popUpContent.append(footer);
        }

        function addButtonAction(button, data)
        {
            button.bind('click', function ()
            {
                data.callBack.call(data.scope, data.args);
            });
        }

        function submitData()
        {
            data.callBack(data.content.getData());
            closePopUp();
        }

        /**
         * Creating content
         *
         * @method createContent
         */
        function createContent()
        {
            var _content;

            switch (data.type)
            {
                case 'form':

                    inside.addClass('form');
                    data.config.divID = '#' + id;

                    var form = HCService.FormManager.createForm(data.config);
                    form.successCallBack = closePopUp;
                    break;

                default:
                    _content = data.content.getHTML();
            }

            inside.append(_content);
        }

        /**
         * Creating required content holders and pop up environment
         *
         * @method createContentHolders
         */
        function createContentHolders()
        {
            body = $('body');
            body.addClass('stop-scrolling');

            overlay = $('<div class="is-popup-overlay"></div>');
            body.append(overlay);

            popUpContent = $('<div class="is-popup-content"></div>');
            body.append(popUpContent);

            header = $('<div class="row is-popup-header col-md-12"></div>');
            inside = $('<div id="' + id + '" class="row is-popup-inside"></div>');
            footer = $('<div class="row is-popup-footer"></div>');

            popUpContent.append([header, inside, footer]);
        }

        /**
         * Creating Title
         *
         * @method createTitle
         */
        function createTitle()
        {
            header.append('<div class="is-popup-title">' + data.label + '</div>');
        }

        /**
         * Creating Close button
         *
         * @method createCloseButton
         */
        function createCloseButton()
        {
            closeButton = $('<div class="is-popup-close close fa fa-close"></div>');
            header.append(closeButton);
            closeButton.unbind().bind('click', function (e)
            {
                closePopUp();
            });
        }

        /**
         * Closing popup
         *
         * @method closePopUp
         */
        function closePopUp(e)
        {
            if (e && data.callBack)
                data.callBack(e);

            body.removeClass('stop-scrolling');
            overlay.remove();
            overlay = undefined;
            popUpContent.remove();
            popUpContent = undefined;
            body = undefined;
            closeButton = undefined;
            footer = undefined;
            content = undefined;
        }

        initialize();
    };
};