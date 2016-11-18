/**
 * A module which contains all Loader used by HoneyComb* environment.
 * @module ISLoader
 */
HCSLoader = new function ()
{
    /**
     * @class BasicLoader is a default class which will be used by all of the Loaders
     */
    this.BasicLoader = function ()
    {
        /**
         * Call method which will be used when loading data
         * @type string
         */
        var method;

        /**
         * Data type which is expected from server to be returned
         * @type string
         */
        var dataType;

        /**
         * Variables which will be send with the URLCall holder
         * @type {Array}
         */
        var urlVariables = [];

        /**
         * The onSuccess function to be called after successfully load
         * @callback onSuccess
         */
        var onSuccess;

        /**
         * The onFailure function to be called after loading has failed
         * @callback onSuccess
         */
        var onFailure;

        /**
         * XMLHttpRequest
         */
        var xhr;

        /**
         * The URL to be requested
         * @type string
         */
        this.url = undefined;

        /**
         * Should Loader cahche the data or not,
         * If set to false, at the end of the Call it will add value "_" with timestamp
         * @callback onSuccess
         * @param {boolean} [true]
         */
        this.cache = true;

        /**
         * Setting Call method to OPTIONS
         *
         * @method methodOPTIONS
         */
        this.methodOPTIONS = function ()
        {
            method = 'OPTIONS';
        };

        /**
         * Setting Call method to GET
         *
         * @method methodGET
         */
        this.methodGET = function ()
        {
            method = 'GET';
        };

        /**
         * Setting Call method to HEAD
         *
         * @method methodHEAD
         */
        this.methodHEAD = function ()
        {
            method = 'HEAD';
        };

        /**
         * Setting Call method to POST
         *
         * @method methodPOST
         */
        this.methodPOST = function ()
        {
            method = 'POST'
        };

        /**
         * Setting Call method to PUT
         *
         * @method methodPUT
         */
        this.methodPUT = function ()
        {
            method = 'PUT';
        };

        /**
         * Setting Call method to DELETE
         *
         * @method methodDELETE
         */
        this.methodDELETE = function ()
        {
            method = 'DELETE';
        };

        /**
         * Setting Call method to TRACE
         *
         * @method methodTRACE
         */
        this.methodTRACE = function ()
        {
            method = 'TRACE';
        };

        /**
         * Setting Call method to CONNECT
         *
         * @method methodCONNECT
         */
        this.methodCONNECT = function ()
        {
            method = 'CONNECT';
        };

        /**
         * Getting method of call
         *
         * @method getMethod
         * @returns {string} current method
         */
        this.getMethod = function ()
        {
            return method;
        };

        /**
         * Setting expected dataType to xml
         *
         * @method dataTypeXML
         */
        this.dataTypeXML = function ()
        {
            dataType = 'xml';
        };

        /**
         * Setting expected dataType to html
         *
         * @method dataTypeHTML
         */
        this.dataTypeHTML = function ()
        {
            dataType = 'html';
        };

        /**
         * Setting expected dataType to script
         *
         * @method dataTypeSCRIPT
         */
        this.dataTypeSCRIPT = function ()
        {
            dataType = 'script';
        };

        /**
         * Setting expected dataType to json
         *
         * @method dataTypeJSON
         */
        this.dataTypeJSON = function ()
        {
            dataType = 'json';
        };

        /**
         * Setting expected dataType to jsonp
         *
         * @method dataTypeJSONP
         */
        this.dataTypeJSONP = function ()
        {
            dataType = 'jsonp';
        };

        /**
         * Setting expected dataType to text
         *
         * @method dataTypeTEXT
         */
        this.dataTypeTEXT = function ()
        {
            dataType = 'text';
        };

        /**
         * Setting variable which will be parsed on request
         *
         * @method addVariable
         * @param {string} id of the variable
         * @param {string} value  of the variable
         */
        this.addVariable = function (id, value)
        {
            urlVariables[id] = value;
        };

        /**
         * Removing variable
         *
         * @method removeVariable
         * @param {string} id of the setted variable
         */
        this.removeVariable = function (id)
        {
            delete urlVariables[id];
        };

        /**
         * Returning an array of stored variables
         *
         * @method getVariables
         * @returns {Array} stored variables
         */
        this.getVariables = function ()
        {
            return urlVariables;
        };

        this.abortCall = function ()
        {
            "use strict";
            xhr.abort ();
        };

        /**
         * Loading the call with already configured data
         *
         * @method load
         * @param {function} success The success function to be called after successful load
         * @param {function} failure The success function to be called after loading has failed
         * @param {object} scope of the callback function
         * @param {string} url The URL to be requested
         * @param {*} honeyCombHeader HoneyComb calls headers
         */
        this.load = function (success, failure, scope, url, honeyCombHeader)
        {
            onSuccess = success;
            onFailure = failure;

            var cacheUpdateType, cacheSendType;

            if (HCFunctions.isArray (honeyCombHeader))
            {
                cacheUpdateType = honeyCombHeader[0];
                cacheSendType   = honeyCombHeader[1];
            }
            else
                cacheUpdateType = honeyCombHeader;

            var _data = {};

            if (url)
                this.url = url;

            if (!method)
                this.methodGET ();

            if (!dataType)
                this.dataTypeTEXT ();

            for (var id in urlVariables)
                if (urlVariables.hasOwnProperty (id))
                    _data[id] = urlVariables[id];

            xhr = jQuery.ajax ({
                url: this.url,
                type: method,
                data: _data,
                dataType: dataType,
                beforeSend: function (request)
                {
                    if (cacheUpdateType)
                        request.setRequestHeader ("HC-Update-Type", cacheUpdateType);

                    if (cacheSendType)
                        request.setRequestHeader ("HC-Item-Type", cacheSendType);
                },
                success: function (r)
                {
                    if (HCFunctions.isStringJson (r))
                        r = JSON.parse (r);

                    if (r.success == false || r.success == 'false')
                    {
                        if (HCFunctions.isStringJson (r.message))
                        {
                            var list = JSON.parse (r.message);

                            $.each (list, function (key, value)
                            {
                                $.each (value, function (key, message)
                                {
                                    executeErrorFunction (message);
                                });
                            });
                        }
                        else
                            executeErrorFunction (r.message);
                    }
                    else if (onSuccess)
                        onSuccess.call (scope, r);
                },
                error: function (request, status, error)
                {
                    executeErrorFunction (error + ' [' + request.status + ']')
                }
            });
            
            function executeErrorFunction (message)
            {
                if (onFailure && scope)
                    onFailure.call (scope, message);
                else
                    HCFunctions.showToastrMessage ('error', message);
            }
        };
    };
};