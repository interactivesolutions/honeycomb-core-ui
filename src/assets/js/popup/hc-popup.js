HCService.PopUp = new function ()
{
    this.Pop = function (data)
    {
        /**
         * Generating unique form id
         * @type {string}
         */

        var id = HCFunctions.createUUID();
        var modal;

        var popUpContent;
        var body;
        var footer;
        var content;

        function initialize()
        {
            createContentHolders();
            //    createCloseButton();
            //    createContent();
            //    createBottomButtons();
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

                    data.config.divID = '#' + id + ' .modal-dialog .modal-content .modal-body';
                    data.config.buttonsDivID = '#' + id + ' .modal-dialog .modal-content .modal-footer';

                    var form = HCService.FormManager.createForm(data.config);
                    form.successCallBack = closePopUp;
                    break;

                default:
                    _content = data.content.getHTML();
            }

            return _content;
        }

        /**
         * Creating required content holders and pop up environment
         *
         * @method createContentHolders
         */
        function createContentHolders()
        {
            body = $('body');

            modal = $('<div class="modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                '<div class="modal-dialog" role="document">' +
                '<div class="modal-content"></div>' +
                '</div>' +
                '</div>');

            var modalContent = $(modal.find('.modal-content'));

            var modalHeader = $('<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title">' + createTitle() + ' </h4>' +
                '</div>');

            var modalBody = $('<div class="modal-body"><div class="hc-loader"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div></div>');
                modalBody.append(createContent());

            var modalFooter = $('<div class="modal-footer"></div>');

            modalContent.append(modalHeader);
            modalContent.append(modalBody);
            modalContent.append(modalFooter);

            body.append(modal);

            modal.modal();

            modal.on('hidden.bs.modal', function () {
                modal.remove();
            })
        }

        /**
         * Creating Title
         *
         * @method createTitle
         */
        function createTitle()
        {
            return '<div class="is-popup-title">' + data.label + '</div>';
        }

        function closePopUp()
        {
            $(modal.find('.close')).click();
        }

        initialize();
    };
};