var cibcFormValidator = (function(){
    "use strict";
    var debugMode = false;
    var formSubmitted = false;
    var errorsArray = [];
    var addTracking = false;
    var formReflow = false;

    //-----------------helper functions-------------------//

    /**
     * to equilize the hieght of the labels in the row
     * 
     * @param {JQuery element} form - form element
     * @param {String} size - width for equilizer, default medium-up
     * possible values: small-up, medium-up, large-up, medium-only, small-only
     * @param {String} elementClass - class of the element to equilize
     * */
    function setEqualizer(form, size, elementClass) {
        var row =  form.find('.js-validate_row-equalize');
        row.attr('data-equalizer-mq', size ? size : 'medium-up'); 

        row.each(function(){
            var id = makeString();
            $(this).attr('data-equalizer', id);
            var elements = $(this).find('.'+elementClass);
            if(elements.length > 0) {
                elements.attr('data-equalizer-watch', id); 
            } 
                     
        });
        form.foundation('equalizer', 'reflow');
    }

    /**
     * helper function to generate random string for equilizer
     * */
    function makeString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 11; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
   }

   /**
     * helper function to format numbers
     * */
   function formatNumber(lang, val, precision, thousandSeparator, decimalSeparator, prefix, suffix) {
        val = (lang == 'en') ? ('' + val) : ('' + val).replace(/,/,'.'); 
        val = isNaN(val = parseFloat(val)) ? 0 : val; //check it it's number
        val = val.toFixed(precision !== undefined ? precision : 2).split('.');//get number precision
        val[0] = val[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1' + thousandSeparator); //add thousands separator
        return (prefix || '') + val.join(decimalSeparator) + (suffix || ''); // add currency and decimal separator
    }

    /**
     * used to display error message
     * @param {JQuery} field - field element
     * 
     * */
    function displayError(field, form) {
        field.addClass('js-validate__err-field');

        // find and show error
        var error = findErrorMessage(field);
        if(error && error.length > 0) {
            error.show();
            if(formReflow) {
                form.foundation('equalizer', 'reflow');
            }
        }

        field.attr('aria-invalid', 'true');
    }

    /**
     * used to hide error message
     * @param {JQuery} field - field element
     * 
     * */

    function hideError(field, form) {
        field.removeClass('js-validate__err-field');

        // find and hide error
        var error = findErrorMessage(field);
        if(error && error.length > 0) {
            error.hide();
            if(formReflow) {
                form.foundation('equalizer', 'reflow');
            }
        }

        field.attr('aria-invalid', 'false');
    }

    /**
     * used to find error message
     * @param {JQuery} field - field element
     * 
     * */
    function findErrorMessage(field){

        if (typeof (field.attr('aria-describedby')) == 'undefined'){//input field is missing aria-describedby attribute
            if(debugMode){console.error('input is missing "aria-describedby" attribute')};
            return null;
        }

        var errorMsg = $('#' + field.attr('aria-describedby'));

        // no error message exists
        if (errorMsg.length == 0){
            if(debugMode){console.error("Input is missing error message")};
            return;
        }
        
        return errorMsg;
    }


     /**
     * used to determine if the field has multiple errors
     * @param {JQuery} field - field element
     * 
     * */
    function isMultipleErrors(field){
        if (typeof (field.attr('aria-describedby')) == 'undefined') { return false; }
        var errorList = field.attr('aria-describedby').split(' ').filter(function(el){return el !== '';});
        return errorList.length > 1;
    }


     /**
     * used to hide error for all inputs listed
     * @param {JQuery} fields - field elements
     * @param {JQuery} errors - errors elements
     * */
    function hideBlockError(fields, errors) {
        fields.each(function(){
            $(this).removeClass('js-validate__err-field').attr('aria-invalid', 'false');
        });
        errors.each(function(){
            $(this).hide();
        });
    }

     /**
     * used to display error message
     * @param {JQuery} field - field element
     * @param {String} errClass - class of the error
     * */
    function displayMultiError(field, form, errClass) {
        field.addClass('js-validate__err-field');

        // find and show error
        var errorList = findMultiErrorMessage(field, errClass);
        if(errorList && errorList.length > 0) {
            if(!!errClass){
                var errMsg;
                $.each(errorList, function(idx, element){
                    if(element.hasClass(errClass)) {
                        errMsg = element;
                        return false;
                    }
                }); 
                if(errMsg) errMsg.show();
            } else {
                error[0].show();
            }
            if(formReflow) {
                form.foundation('equalizer', 'reflow');
            } 
        }

        field.attr('aria-invalid', 'true');
    }

    /**
     * used to hide error message
     * @param {JQuery} field - field element
     * 
     * */

    function hideMultiError(field, form) {
        field.removeClass('js-validate__err-field');

        // find and hide error
        var errorList = findMultiErrorMessage(field);
        if(errorList && errorList.length > 0) {
            $.each(errorList, function(idx, element){
                element.hide();
            });
            if(formReflow) {
                form.foundation('equalizer', 'reflow');
            }
        }

        field.attr('aria-invalid', 'false');
    }

    /**
     * used to find error message
     * @param {JQuery} field - field element
     * @param {String} errClass - class of the error
     * */
    function findMultiErrorMessage(field, errClass){

        if (typeof (field.attr('aria-describedby')) == 'undefined'){//input field is missing aria-describedby attribute
            if(debugMode){console.error('input is missing "aria-describedby" attribute')};
            return null;
        }

        var errorStr = field.attr('aria-describedby').split(' ').filter(function(el){return el !== '';});
        var errList = errorStr.map(function(el){return $('#'+el)});

        // no error message exists
        if (errList.length == 0){
            if(debugMode){console.error("Input is missing error message")};
            return null;
        }
        
        return errList;
    }

    /**
     * used for validation
     * @param {JQuery} field - field element
     * 
     * */
    function isRequiredAndEmpty(field) {
        return ((field.val() === '' || field.val() === null) && field.attr('aria-required') !== 'false');
    }

    /**
     * used to initialize the modal window on submission
     * @param {JQuery} form - form element
     * 
     * */
    function initModal(form){
        var modal = $('#postSubmissionModel');
        var lang = $('html').attr('lang');
       
        if(!modal.length) {//if model element does not exist, create one in a random div
            $('body').append('<div id="postSubmissionModel" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">'+
            '<div class="reveal-modal-paragraph" id="postSubmissionModelContent"></div>'+
            '<a class="close-reveal-modal link-modal" tabindex="-1" role="button" aria-label="' + (lang === 'en' ? 'Close' : 'Fermer') + '">&#215;</a>'+
            '<a class="modal-reset-link" href="#" onfocus="$(\'a.close-reveal-modal.link-modal\')[0].focus()" style="left:-10000px; position:absolute" aria-hidden="true">&nbsp;</a>'+
            '</div>');

            modal = $('#postSubmissionModel');

            //cancel if already registered
            $(document).off('opened.fndtn.reveal');
            $(document).off('closed.fndtn.reveal');
            //focus on close button for accessibility
            $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
                modal.find('.close-reveal-modal').eq(0).focus();
            });
            //after modal closed, the form should be cleaned
            $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
                form.find('.js-validate__submit').prop('disabled', false).focus();
                form[0].reset();
                $('#postSubmissionModelContent').empty();
            });  
        }

        return modal;
    }

    /**
     * used to display confirmation message in the modal window and fire analytics
     * @param {String} url - url to the modal
     * @param {String} elementID - element of the content for modal
     * @param {JQuery} form - form element
     * @param {String} interactionName - name of the interuction (for analytics)
     * 
     * */
     function displayModalSuccess(url, elementID, form, interactionName, textLimits){
        var modal = initModal(form);
        
        if(url && url.trim().length > 0) {
            $.ajax({
                url,
                type: 'GET',
                dataType: 'html',
                success: function(data){
                    $('#postSubmissionModelContent').html($(data).find('#' + elementID).html());
                    modal.foundation('reveal', 'open');
                    if(addTracking && window.digitalData && window.digitalData.utils && interactionName) {
                        window.digitalData.utils.interaction(interactionName);
                    }
                },
                error: function(){
                    if(debugMode){console.error('Error: could not find post submission page')}; //log error for developer debugging
                }
            });
        } else {
            $('#postSubmissionModelContent').html($('#' + elementID).html());
            modal.foundation('reveal', 'open');
            if(addTracking && window.digitalData && window.digitalData.utils && interactionName) {
                window.digitalData.utils.interaction(interactionName);
            }
        }
        //reset counter after modal closed
        textLimits.each(function(index){
            updateTextLimit(textLimits.eq(index));
        });

    }

    /**
     * used to display error message in the modal window and fire analytics
     * @param {String} url - url to the modal
     * @param {String} elementID - element of the content for modal
     * @param {JQuery} form - form element
     * @param {String} error - server error (for analytics)
     * @param {String} message - server response text (for analytics)
     * 
     * */
    function displayModalError(url, elementID, form, error, message, textLimits){
        var modal = initModal(form);

        if(url && url.trim().length > 0) {
            $.ajax({
                url,
                type: 'GET',
                dataType: 'html',
                success: function(data){
                    $('#postSubmissionModelContent').html($(data).find('#' + elementID).html());
                    modal.foundation('reveal', 'open');
                    if(addTracking && window.digitalData && window.digitalData.utils) {
                        window.digitalData.utils.inPageError([{code: error, message: message, type: 'server'}]);
                    }
                },
                error: function(){
                    if(debugMode){console.error('Error: could not find post submission page')}; //log error for developer debugging
                }
            });
        } else {
            $('#postSubmissionModelContent').html($('#' + elementID).html());
            modal.foundation('reveal', 'open');
            if(addTracking && window.digitalData && window.digitalData.utils) {
                window.digitalData.utils.inPageError([{code: error, message: message, type: 'server'}]);
            }
        }

        //reset counter after modal closed
        textLimits.each(function(index){
            updateTextLimit(textLimits.eq(index));
        });

    }
    /**
     * used to set counter message for textaria
     * @param {JQuery} field - textaria element
     * 
     * */
    function updateTextLimit(field){
        var counterText =  field.data("counter-text");
        var counterTextArray = [];
        if(typeof counterText != 'undefined'){
            counterTextArray = counterText.split(" ");
        }

        var msg = field.parent().find('.js-validate__text-limit-msg');
        // get current values
        var current = field.val().length;
        var max = field.attr('maxlength');

        // check if element has max length
        if (typeof max == 'undefined'){
            if(debugMode){console.error('Element being checked for max length with class="js-validate__text-limit" does not have maxlength attribute.')};
            return;
        }
        if (msg.length == 0){
            if(debugMode){console.error('Textarea character limit messag element either is not a sibling of textarea or does no exist.')};
        } else {
            // Construct string
            if(counterTextArray.length > 0){
                var remainCharsText = counterTextArray.map(function (word) {
                    if (word === "remainChars") {
                        word = max - current;
                    } else if (word === "maxChars") {
                        word = max;
                    }
                    return word;
                })
                msg.html(remainCharsText.join(" "));
            }
        }
    }

    /**
     * turning debug mode on will make the script return more detailed error messages for common form formatting mistakes
     * @param {Boolean} turnOn - true to turn on debug mode, false to turn off
    */
    function toggleDebugMode(turnOn){
        debugMode = turnOn;
    }

    //---------------Regular expressions for validation types ----------------//

    /**
     * Object that holds validation types and their respective regular expression.
     * Add more types as needed :)
     */
    var selectorValidationTypes = {
        'dangerousChars': />|<|\&|#|\\|\[|\]|}|{|%|www\.|http:|https:|ftp|javascript|function|return|\&lt;|\&amp;|\&gt;|\&quot;$/gi,
        'genericText': /^[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ,:\'\-=_!@# \+\*\?\.\[\]\^\$\(\)\{\}\|\\\&]*[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ]+[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ,:\'\-=_!@# \+\*\?\.\[\]\^\$\(\)\{\}\|\\\&]*$/,
        'multiLineGenricText': /[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ,:\'\-=_!@# \+\*\?\.\[\]\^\$\(\)\{\}\|\\\&]*[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ]+[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ,:\'\-=_!@# \+\*\?\.\[\]\^\$\(\)\{\}\|\\\&]*/,
        'multiLineGenericText': /^[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ«»æÆ¢£¥œŒƒP,:\'-=_!@# \+\*\?\.\[\]\^\$\(\)\{\}\|\\\&\f\n\r]*[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ«»æÆ¢£¥œŒƒP]+[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ«»æÆ¢£¥œŒƒP,:\'-=_!@# \+\*\?\.\[\]\^\$\(\)\{\}\|\\\&\f\n\r]*$/,
        '2DigitWholeNumber': /^[0-9]{2}$/,
        '3DigitWholeNumber': /^[0-9]{3}$/,
        '4DigitWholeNumber': /^[0-9]{4}$/,
        '5DigitWholeNumber': /^[0-9]{5}$/,
        '8DigitWholeNumber': /^[0-9]{8}$/,
        'alphabetic': /^([A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ]+[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ\' \-,]*)$/,
        'alphabetic2': /^([A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ#]+[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ\' #\-\/.,]*)$/,
        'alphabetic3': /^([A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ]+[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ\' \-,]*)$/,
        'alphabetic4': /^([A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ]+[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ\' \-,]*)$/,
        'alphanumeric': /^([A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ]+[A-Za-z0-9ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüýÿ\' \-]*)$/,
        'alphanumericStrict': /^[A-Za-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöùúûüýÿ0-9]+$/,
        'bankAccount': /^((([0-9]{2}[- ])?[0-9]{5})|([0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]))$/,
        'bankAccount1': /^([0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?[0-9]?)$/,
        'CCNumber': /^[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}[ ]?[0-9]{4}$/,
        'currency': /^((([0-9]{1,3}([, ]?[ ]?[0-9]{3})*)|([0-9]*))([.][0-9]{1,2})?)$/,
        'currency2': /^((([0-9]{1,3}([, ]?[ ]?[0-9]{3}){0,2})|([0-9]{0,9}))([.][0-9]{1,2})?)$/,
        'dateFull': /^(([1][012])|([0]?[1-9]))[\/](([3][01])|([12][0-9])|([0]?[1-9]))[\/](((19)|(20))[0-9]{2})$/,
        'dateDay': /^(([3][01])|([12][0-9])|([0]?[1-9]))$/,
        'dateYear': /^(((19)|(20))[0-9]{2})$/,
        'date':/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)(\d{2}|\d{4})$/,
        'decimalNumber': /^(([0-9]+)|([0-9]*[.][0-9]+))$/,
        'email': /^[a-zA-Z0-9!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~]+([.][a-zA-Z0-9!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~]+)*[@]([a-zA-Z0-9]+([\.\-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})|(((([01]?[0-9]{0,2})|(2(([0-4][0-9])|(5[0-5]))))\.){3}(([01]?[0-9]{0,2})|(2(([0-4][0-9])|(5[0-5]))))))$/,
        'cibcEmail': /^[a-zA-Z0-9!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~]+([.][a-zA-Z0-9!#\$%\&'\*\+\-\/=\?\^_`\{\|\}~]+)*[@][Cc][Ii][Bb][Cc][\.][Cc](([aA])|([oO][mM]))$/,
        'expDateMonth': /^[01][0-9]$/,
        'percentage': /^[01]?[0-9]{1,2}$/,
        'phoneNumber': /^[0-9]{3}[ \-\.]?[0-9]{4}$/,
        'phoneNumberFull': /^((([\(][0-9]{3}[\)][ ]?)|([0-9]{3}[ \-\.]?))[0-9]{3}[ \-\.]?[0-9]{4})$/,
        'foreignPhoneNumber': /^[0-9\-\.]+$/,
        'postalCode': /^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$/,
        'zipCode': /^\d{5}?$/,
        'spacedWholeNumber': /^[0-9 ]+$/,
        'SINumber': /^[0-9]{3}[ ]?[0-9]{3}[ ]?[0-9]{3}$/,
        'wholeNumber': /^[0-9]+$/,
        'agentID': /^[a-zA-Z]{2}[0-9]{4}/,
        'lettersNumbersSpecial': /^([a-zA-Z0-9àÀâÂäÄæÆçÇéÉèÈêÊëËîÎïÝôÔœŒùÙûÛüÜ\s\$\#\@\&\-\\\.\,\;\(\)\/\'\’]+)*$/,
        'numbersOnly': /^([0-9]+\s?)*$/,
        'exceptRestricted': /^[^\"\%\<\>\[\]\{\}]+$/
    }

    //---------------validation functions-----------------//

    /**
     * Uses to add validation type to specfic needs
     *  @param {String} name - name of the type of validation, must be unique
     *  @param {String} regExp - regular expression to validate
     * */
    function addValidationType(name, regExp) {
        if(selectorValidationTypes) {
            selectorValidationTypes[name] = regExp;
        }
    }

    function dateFormat(dateStr){
        var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; 
        if (dateStr.length === 10){
            pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        }
        
        return (new Date(dateStr.replace(pattern,'$3-$2-$1'))).getTime();
    }
    
    /**
     * Uses the validationTypes object to validate value
     * 
     * @param {JQuery} field - field to validate
     * @param {String} type - validation type
     * @returns {Boolean} if field value is valid under given type
     */
    function validateType(field, type) {
        var fieldVal = field.val();
        if(!fieldVal || fieldVal.length === 0) return true;

        if(type === 'date') {
            var toValidate = dateFormat(fieldVal);
            if(isNaN(toValidate)) return false;

            var minDate = field.data('min-date');
            var maxDate = field.data('max-date');

            if(typeof minDate !== 'undefined') {
                var checkDate = dateFormat(minDate);
                if(toValidate < checkDate){
                    return false;
                } 
            }             
            if(typeof maxDate !== 'undefined') {
                var checkDate = dateFormat(maxDate);
                if(toValidate > checkDate){
                    return false;
                } 
            }

        } else if (type === 'none') {
            return true;
        }
        return selectorValidationTypes[type].test(fieldVal)
    }

    /**
     * validates form field and toggles error messages for field
     * 
     * @param {JQuery} field - field element (radio, checkbox, etc)
     * @param {JQuery} form - form element
     * @return {Boolean} if the input is valid
     */

    function validateField(field, form) {
        var condBlock = field.closest('.js-validate__cond-block');
        if(condBlock.length > 0) {
            if(typeof condBlock.attr('hidden') !== 'undefined') {
                return false;
            }
        }

        var type = field.data('validation-type');
        var inputName = field.data('input-name'); //used for errors tracking for analytics

        type = type ? type : 'genericText'; //set generic text as default

        var isMulti = isMultipleErrors(field);

        if(!isMulti) {
            if (isRequiredAndEmpty(field) || !validateType(field, type)) {
                displayError(field, form);
                if(addTracking && formSubmitted && typeof inputName !== 'undefined') {
                    errorsArray.push({code: field.attr('id'), field: inputName, type: 'error'});
                }
                return true; //error has been detected 
            }
            hideError(field, form);
            return false; //no error detected
            
        } else {
            hideMultiError(field, form); // hide errors first 
            if (isRequiredAndEmpty(field)) {
            
                displayMultiError(field, form, 'js-validate__error-empty');
                if(addTracking && formSubmitted && typeof inputName !== 'undefined') {
                    errorsArray.push({code: field.attr('id'), field: inputName, type: 'error'});
                }
                return true; //error has been detected 
            } else if (!validateType(field, type)) {
                
                displayMultiError(field, form, 'js-validate__error-invalid');
                if(addTracking && formSubmitted && typeof inputName !== 'undefined') {
                    errorsArray.push({code: field.attr('id'), field: inputName, type: 'error'});
                }
                return true; //error has been detected 
            }

            hideMultiError(field, form);
            return false; //no error detected
        }

    }

    /**
     * Validates whether a selection group has the right amount of selections made
     * 
     * @param {jQuery} field - field element (radio, checkbox, etc)
     * @param {jQuery} form - form element
     * @returns {Boolean} if the field input is valid
     */

    function validateSelectField(field, form) {
        var condBlock = field.closest('.js-validate__cond-block');
        if(condBlock.length > 0) {
            if(typeof condBlock.attr('hidden') !== 'undefined') {
                return false;
            }
        }
        var groupName = field.attr('name');
        var list = form.find('input[name="' + groupName + '"]');
        var firstField = list.eq(0);

        //get minimum and maximum number of selections
        var type = firstField.data('validation-type');      
        type = type ? type.split('-') : 'select'; 
        var inputName = firstField.data('input-name'); //used for errors tracking for analytics
        var min = type.length > 1 ? type[1] : 1;
        var max = type.length == 3 ? type[2] : Infinity;

        var selections = list.filter(':checked');
        var numOfBoxesSelected = selections.length;

        //if checkbox, create a list of inputs inside of a hidden input
        if(firstField.prop('type') == 'checkbox'){
            //update checkbox input group value
            var inputField = form.find('input[name="' + groupName.split('-')[0]+ '"]');
            if(inputField.length > 0) {
                inputField.val('');//clear value
                if (selections.length === 0 && typeof inputField.data('default-value') !== 'undefined') {
                    inputField.val(inputField.data('default-value'));
                } else {
                    selections.each(function () {
                        inputField.val(inputField.val() + $(this).val() + (selections.length > 1 ? '; ' : ''));//add values
                    });
                }
            }
            
        } 
        
        if ((numOfBoxesSelected < min || numOfBoxesSelected > max) && firstField.attr('aria-required') !== 'false') {//validate whether select button selected
            displayError(firstField, form);
            if(addTracking && formSubmitted && typeof inputName !== 'undefined') {
                errorsArray.push({code: groupName, firstField: inputName, type: 'error'});
            }

            return true;
        } else {
            hideError(firstField, form);
            return false;
        }
    }


    function resetInputs(block){ 
        $.each(block, function(idx, element){
            element.attr('hidden', '');
            var condBlockFields = element.find('.js-validate__input');
            var condBlockErrors = element.find('.js-validate__error, .error');
            var condSelected = condBlockFields.filter(':checked');
            var defaultVal = condBlockFields.filter(function(){
                return typeof $(this).data('default-value') !== 'undefined';
            });
            var inputsOnly = condBlockFields.filter(function(){
                return $(this).attr('type') !== 'checkbox' && $(this).attr('type') !== 'radio';
            });
            condSelected.attr('checked', false).trigger('change');
            inputsOnly.val('');
            defaultVal.each(function(){
                $(this).val($(this).data('default-value'));
            });
            hideBlockError(condBlockFields, condBlockErrors);
        });

    }

    function updateCondBlock(field, form){
    
        var type = field.attr('type');

        if(type==='button') {
            var isExpanded = field.attr('aria-expanded') == 'true';  
            var condGroup = field.closest('.js-validate__cond-buttons');
            var list;
            if(condGroup.length > 0){
                list = condGroup.find('button.js-validate_cond-element');
            } else {
                list = form.find('button.js-validate_cond-element');
            }

            list.each(function(){                
                var block = $(this).attr('aria-controls');
                if(typeof block !== 'undefined' && block !== '') {
                    var blockString = block.split(' ').filter(function(el){return el !== '';});
                    var blockList = blockString.map(function(el){return $('#'+el)});
                    $(this).attr('aria-expanded', 'false');
                    resetInputs(blockList);   
                }
                          
            });

            var condBlock = field.attr('aria-controls');
            if(typeof condBlock !== 'undefined' && condBlock !== ''){
                var condBlockString = condBlock.split(' ').filter(function(el){return el !== '';});
                var condBlockList = condBlockString.map(function(el){return $('#'+el)});
                if(!isExpanded && condBlockList.length > 0) {            
                    field.attr('aria-expanded', 'true');               
                    $.each(condBlockList, function(idx, element){element.removeAttr('hidden');}); 
                    field.trigger('button-expand');
                } else {
                    field.trigger('button-collapse');
                }
            }
           
        } else if (type === 'checkbox' || type === 'radio') {
            var list = form.find('input[name="'+field.attr('name')+'"]');
            var selected = list.filter(':checked');

            list.each(function(){
                
                var block = $(this).attr('aria-controls');
                if(typeof block !== 'undefined' && block !== '') {
                    var blockString = block.split(' ').filter(function(el){return el !== '';});
                    var blockList = blockString.map(function(el){return $('#'+el)});
                    if(type === 'checkbox') {
                        $(this).attr('aria-expanded', 'false');
                    }
                    resetInputs(blockList);  
                }
               
            });

            selected.each(function(){
                var condBlock = $(this).attr('aria-controls');
                if(typeof condBlock !== 'undefined' && condBlock !== '') {
                    var condBlockString = condBlock.split(' ').filter(function(el){return el !== '';});
                    var condBlockList = condBlockString.map(function(el){return $('#'+el)});
                    if(condBlockList.length > 0) {
                        if(type === 'checkbox') {
                            $(this).attr('aria-expanded', 'true');     
                        }            
                        $.each(condBlockList, function(idx, element){element.removeAttr('hidden');}); 
                    }
                }

            });

        } else { 
            var options = field.find('option');
            var selected = options.filter(':selected');

            options.each(function(){
                var block =$(this).attr('aria-controls');
                if(typeof block !== 'undefined' && block !== '') {
                    var blockString = block.split(' ').filter(function(el){return el !== '';});
                    var blockList = blockString.map(function(el){return $('#'+el)});
                    resetInputs(blockList);
                }
            });

            var condBlock = selected.attr('aria-controls');
            if(typeof condBlock !== 'undefined' && condBlock !== '') {
                var condBlockString = condBlock.split(' ').filter(function(el){return el !== '';});
                var condBlockList = condBlockString.map(function(el){return $('#'+el)});
                if(condBlockList.length > 0) {
                    $.each(condBlockList, function(idx, element){element.removeAttr('hidden');}); 
                }
            }

        }

    }

    function validateMultiStep(form) {
        var stepFields = form.find('.step-view:visible').find('.js-validate__input');
        var stepGroup = stepFields.filter(function(){
            return $(this).attr('type') === 'checkbox' || $(this).attr('type') === 'radio';
        });

        var stepNogroups = stepFields.filter(function(){
            return $(this).attr('type') !== 'checkbox' && $(this).attr('type') !== 'radio';
        });

        var error = false;
        var verified = [];

        errorsArray = [];

        stepGroup.each(function(){
            var groupName = $(this).attr('name');
            if(verified.indexOf(groupName) === -1) {
                verified.push(groupName);
                var list = $('input[name=' + groupName + ']');
                if(validateSelectField(list.eq(0), form)){
                    error = true;
                }
            }
        });

        //check every step field
        stepNogroups.each(function () {
            if (validateField($(this), form)) {
                error = true;
            }
        });

        if(!error) {
            return false;
        } else{
            $('[aria-invalid="true"]').eq(0).focus(); //focus on first known error input
            if(errorsArray.length > 0) {
                if(addTracking && window.digitalData && window.digitalData.utils) {
                    window.digitalData.utils.inPageError(errorsArray);
                }
            }
            return true;
        }

    }

    /**
     * Validate and process submission passed form
     * 
     * @param {JQuery element} form form to be validated
     * @param {String} backEndURL API url to submit form to, default: https://www.cibconline.cibc.com
     */

    function processForm(form, backEndURL='https://www.cibconline.cibc.com') { 
        
        if(!!window.backendHostname) {
            backEndURL = window.backendHostname;
        } 

        var url = backEndURL;
        if(url.indexOf('/ebm-forms/api/v2/json/forms') === -1) {
            url = url + '/ebm-forms/api/v2/json/forms';
        } 

        var pageUrl = window.location.pathname;
        var submitButton = form.find('.js-validate__submit');
        
        addTracking = typeof submitButton.data('add-tracking') !== 'undefined' && submitButton.data('add-tracking');
        formReflow = typeof submitButton.data('form-reflow') !== 'undefined' && submitButton.data('form-reflow');
        
        //add event listeners to each field
        var fields = form.find('.js-validate__input');

        var groups = fields.filter(function(){
            return $(this).attr('type') === 'checkbox' || $(this).attr('type') === 'radio';
        });
        var nogroups = fields.filter(function(){
            return $(this).attr('type') !== 'checkbox' && $(this).attr('type') !== 'radio';
        });

        var conditionalField = fields.filter(function(){
            return $(this).hasClass('js-validate_cond-element');
        });

        var conditionalButton = form.find('button.js-validate_cond-element');

        groups.change(function(){//checkboxes only
            validateSelectField($(this), form);
        });

        nogroups.blur(function () {//all inputs exept checkboxes
            validateField($(this), form);         
        });

        conditionalField.change(function(){
            updateCondBlock($(this), form);
        });

        conditionalButton.click(function(){
            updateCondBlock($(this), form);
        });

        //Find all text limits
        var textLimits = form.find('.js-validate__text-limit');

        // initialize text remaining mesage
        textLimits.each(function(index){
            updateTextLimit(textLimits.eq(index));
        })
        // Add event listeners for when a key is pressed on the textarea
        textLimits.keyup(function() {
            updateTextLimit($(this));
        })

        //on form submission 
        submitButton.click(function (event) {
            event.preventDefault(); // stop default form submission 
            var error = false;
            var submitBtn = $(this);
            var verified = [];

            formSubmitted = true;
            errorsArray = [];

            groups.each(function(){
                var groupName = $(this).attr('name');
                if(verified.indexOf(groupName) === -1) {
                    verified.push(groupName);
                    var list = $('input[name=' + groupName + ']');
                    if(validateSelectField(list.eq(0), form)){
                        error = true;
                    }
                }
            });

            //check every field
            nogroups.each(function () {
                if (validateField($(this), form)) {
                    error = true;
                }
            });


            //if there is no error, submit the form
            if (!error) {
                //disable button so user doesn't hit multiple times
                submitBtn.prop('disabled', true);

                var requestData = form.serializeObject();

                //get the id of the element to display in the model
                var successContentID = submitBtn.data("successmessageid");
                var errorContentID = submitBtn.data("errormessageid");
                var interactionName = submitBtn.data("interaction-name"); 
                var ignoreConditional = submitBtn.data("ignore-conditional");              
                var ignoreHidden = submitBtn.data("ignore-hidden");
                var replaceChars = typeof submitBtn.data("replace-chars") !== 'undefined';
                var formatValue = typeof submitBtn.data("format-number") !== 'undefined';

                var confirmationPage = requestData.form.collectedData.confirmPage;
                var errorPage = requestData.form.collectedData.errorPage;

                if(pageUrl.indexOf('/content/') === 0) {
                    var pathArray = pageUrl.split('/');
                    if(confirmationPage !== '' && confirmationPage.indexOf('/content/') !== 0) {
                        confirmationPage = '/content/' + pathArray[2] + confirmationPage;
                    }
                    if(errorPage !== '' && errorPage.indexOf('/content/') !== 0) {
                        errorPage = '/content/' + pathArray[2] + errorPage;
                    }    
                }

                if(ignoreConditional){
                    var withoutEmpty = requestData.form.collectedData.fields.filter(function(val){
                        return val.value !== "" || (val.value === "" && typeof $('[name="'+val.name+'"]').eq(0).data('ignore-empty') === 'undefined');
                    });
                    
                    if(withoutEmpty.length > 0) {
                        requestData.form.collectedData.fields = withoutEmpty;
                    } 
                    
                } else if (ignoreHidden){
                    var withoutHidden = requestData.form.collectedData.fields.filter(function(val){
                        return $('[name="'+val.name+'"]').eq(0).is(':visible') || ($('[name="'+val.name+'"]').eq(0).is(':hidden') && typeof $('[name="'+val.name+'"]').eq(0).data('ignore-hidden') === 'undefined');
                    });
                    if(withoutHidden.length > 0) {
                        requestData.form.collectedData.fields = withoutHidden;
                    }
                }

                if(replaceChars) {
                    var lang = $('html').attr('lang');
                    var withReplacement = requestData.form.collectedData.fields.map(function(element, index){
                        if(typeof $('[name="'+element.name+'"]').eq(0).data('illegalchars-replace') !== 'undefined'){
                            var currentChars = element.value;
                            var replacedChars = '';
                            if (lang === 'en') {
                                replacedChars = window.illegalCharReplace(currentChars);
                            } else if (lang === 'fr') {
                                replacedChars = window.illegalCharReplace_FR(currentChars);
                            }
                            element.value = replacedChars;
                        } 
                        return element;
                    });
                    requestData.form.collectedData.fields = withReplacement;
                }

                if(formatValue){
                    var lang = $('html').attr('lang');
                    var withFormat = requestData.form.collectedData.fields.map(function(element, index){
                        if(typeof $('[name="'+element.name+'"]').eq(0).data('format-value') !== 'undefined'){
                            var currentValue = element.value;
                            var formattedValue = '';
                            var formatString = $('[name="'+element.name+'"]').eq(0).data('format-value');
                            if (lang === 'en') {
                                if(formatString === 'currency'){
                                    formattedValue = formatNumber(lang, currentValue, 0, ',', '.', '$', '');
                                } 
                            } else if (lang === 'fr') {
                                if(formatString === 'currency'){
                                    formattedValue = formatNumber(lang, currentValue, 0, ' ', ',', '', ' $');
                                }
                            }
                            element.value = formattedValue;
                        } 
                        return element;
                    });
                    requestData.form.collectedData.fields = withFormat;
                }

                
                $.ajax({
                    url: url,
                    async: true,
                    cache: false,
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(requestData, null, ' '),
                    headers: {
                        'accept': 'application/vnd.api+json',
                        'brand': 'cibc',
                        'content-type': 'application/vnd.api+json'
                    },
                    success: function(){
                        if(successContentID) {
                            displayModalSuccess(confirmationPage, successContentID, form, interactionName, textLimits);
                            form.trigger('form-submission', 'success');
                        } else if(confirmationPage !== ''){
                            window.location = confirmationPage;
                        } else {
                            form.trigger('form-submission', 'success');
                        }
                        
                    },
                    error: function(xhr, status, error){
                        if(errorContentID){
                            displayModalError(errorPage, errorContentID, form, error, xhr.responseText, textLimits);
                            form.trigger('form-submission', 'success');
                        } else if(errorPage !== '') {
                            window.location = errorPage;
                        } else {
                            form.trigger('form-submission', 'error');
                        }
                       
                    }
                });
                

            } else {
                $('[aria-invalid="true"]').eq(0).focus(); //focus on first known error input
                if(errorsArray.length > 0) {
                    if(addTracking && window.digitalData && window.digitalData.utils) {
                        window.digitalData.utils.inPageError(errorsArray);
                    }
                    formSubmitted = false; //reset form submission to don't push another values in errorsArray
                }
            }
        });
    }

    //public methods
    return {
        processForm,
        toggleDebugMode,
        setEqualizer,
        addValidationType,
        validateMultiStep
    }
})()

