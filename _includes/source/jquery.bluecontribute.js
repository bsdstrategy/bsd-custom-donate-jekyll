/*global jQuery, quickDonate */
/*
 * blueContribute.js 
 *
 * Author: Kyle Rush
 * kylerrush@gmail.com
 * kylerush.net
 *
 *
 */
var blueContribute = {};

(function($){

    "use strict";

    //function to serialize form data into an object since jQuery doesn't natively do this -- UGH
    $.fn.serializeObject = function(){

        var o = {};

        var a = this.serializeArray();

        $.each(a, function() {

            if (o[this.name] !== undefined) {

                if (!o[this.name].push) {

                    o[this.name] = [o[this.name]];

                }

                o[this.name].push(this.value || '');

            } else {

                o[this.name] = this.value || '';

            }

        });

        return o;
    };

    //creat the blueContribute jQuery plugin
    $.fn.extend({
        
        //pass the options variable to the function
        blueContribute: function(options) {

            var $form = $(this),
                $body = $('body'),
                locked = false,
                $sourceField = $form.find('[name="source_codes"]'),
                defaultsource = $sourceField.val(),
                $genError = $form.find('.bsdcd-general_error'),
                urlsource = gup('source')|| gup('fb_ref') || '',
                $slugField = $form.find("[name='slug']"),
                pagetitle = document.title,
                wait = false;

            //transfer sourcecodes.  How would we handle cookies/if this page was not the landing page?
            $sourceField.val( defaultsource ? defaultsource + ',' + urlsource : urlsource );


            var debug, defaultResponseHandler, defaults, defaultBeforePost, processingState;

            debug = function(message){

                if(blueContribute.settings.debug){

                    if(typeof console === 'object'){

                        window.console.log(message);

                    } else {

                        window.alert(message);

                    }

                }

            };

            /*optional function could include additional _synchronous_ validation checks, but in the base install isn't needed*/
            defaultBeforePost = function(){

                return true;

            };

            processingState = function(on){
                var i = 1,
                    states = ['Processing','.Processing.','..Processing..','...Processing...'],
                    ln = states.length;
                    wait = on; //cancels any outstanding timers
                if (on){
                    $body.addClass('blue_contribute_processing');
                    (function processing(){
                        $.wait(400).then(function(){
                            document.title = states[i % ln] + " | " +pagetitle;
                            if (wait){
                                i++;
                                processing();
                            }
                            else {
                                document.title = pagetitle;
                            }
                        });
                    }());
                }else {
                    $body.removeClass('blue_contribute_processing');
                }
            };

            defaultResponseHandler = function(data){

                var amt_error_only = false, i;

                //remove all existing errors
                if(blueContribute.latestResponseObject){

                    debug('removing previous errors');
                    debug(blueContribute.latestResponseObject.field_errors);

                    if( $.isArray(blueContribute.latestResponseObject.field_errors) ){

                        if(blueContribute.latestResponseObject.field_errors.length > 0){

                            for(i = 0; i <= blueContribute.latestResponseObject.field_errors.length - 1; i++){

                                debug('reseting ' + blueContribute.latestResponseObject.field_errors[i].field);

                                //wipe the error messages for each field
                                $('.' + blueContribute.latestResponseObject.field_errors[i].field + '_error').text('').addClass('hidden');

                                //remove the error class to the related fields
                                $('.' + blueContribute.latestResponseObject.field_errors[i].field + '_related').removeClass('bsdcd-error');

                                //remove the general errors message
                                $genError.text('').removeClass('hidden');

                                $body.toggleClass('blue_contribute_error');

                            }

                        }

                    } else {

                        debug('there were no field errors on the latest repsonse object');

                    }

                } else {

                    debug('the previous response object does not exist. this is the first submission');

                }

                var responseIsValidJSON = false;

                console.log('req', data);

                if(data && !data.api_version){
                //try to parse the response body as json, if errors occur it is most likely because the json is invalid or because html was returned instead
                    try {

                        blueContribute.latestResponseObject = jQuery.parseJSON(data.responseText)||data;
                        responseIsValidJSON = true;

                    } catch(err) {

                        responseIsValidJSON = false;

                        debug('the response body from the api could not be parsed as json by jquery');
                    }
                }else{
                    blueContribute.latestResponseObject = data;
                    responseIsValidJSON = true;
                }

                //console.log('nowdata', blueContribute.latestResponseObject, data.status, data.responseText);

                //to do: add other expected status codes here like 400 i think?

                if(responseIsValidJSON === true){

                    if(blueContribute.latestResponseObject.status === 'success'){

                        //if there's no debug parameter or if the site is secure, go to the redirect url
                        if(!gup('debug') || !nonsecure) { window.location = blueContribute.latestResponseObject.redirect_url; }

                    } else {

                        debug('response was not a success status code');

                        locked = false;

                        if(blueContribute.latestResponseObject.code === 'noslug'  || blueContribute.latestResponseObject.code === 'invalidslug'){

                            window.alert("A BSD slug must be provided as a value in a hidden field named 'slug' on this form.");

                        } else if(blueContribute.latestResponseObject.code === 'validation'){

                            debug('validation error');

                            report(
                                ['Donate API', 'Validation Errors', blueContribute.latestResponseObject.field_errors.length],
                                'donate_api_valiation_error'
                            );

                            if( $.isArray(blueContribute.latestResponseObject.field_errors) ){

                                if(blueContribute.latestResponseObject.field_errors.length > 0){

                                    debug(blueContribute.latestResponseObject.field_errors);

                                    if (blueContribute.latestResponseObject.field_errors.length===1 && blueContribute.latestResponseObject.field_errors[0].field==="amount_group"){
                                        amt_error_only = true;
                                    }

                                    for(i = 0; i <= blueContribute.latestResponseObject.field_errors.length - 1; i++){
                                        
                                        //inject the error messages for each field
                                        $('.' + blueContribute.latestResponseObject.field_errors[i].field + '_error').text(blueContribute.latestResponseObject.field_errors[i].message).removeClass('hidden');

                                        //add the error class to the related fields
                                        $('.' + blueContribute.latestResponseObject.field_errors[i].field + '_related').addClass('bsdcd-error').removeClass('hidden');

                                        //inject the general errors message
                                        $genError.text('Your donation was not successful. Please correct the problems marked below.').removeClass('hidden');

                                    }

                                } else {

                                    debug('the field_errors property in the donate api response is an array, but has no items');

                                }

                            } else {

                                debug('the field_errors property in the donate api response is not an array');

                            }

                        } else if(blueContribute.latestResponseObject.code === 'gateway'){

                            debug('donate api response indicates that the gateway rejected the transaction');

                            report(
                                ['Donate API', 'Gateway Error', blueContribute.latestResponseObject.gateway_response.status],
                                'donate_api_gateway_error'
                            );
                            
                            //checking for a declined card
                            if(blueContribute.latestResponseObject.gateway_response.status === "decline"){

                                $genError.text('The transaction was declined. Please check that the address information is correct or else use a different card.').removeClass('hidden');

                                debug('donate api response indicates that the gateway rejected the transaction because the bank declined the transaction');

                            } else {

                                //blueContribute.latestResponseObject.gateway_response.status === "unkown" ||
                                //blueContribute.latestResponseObject.gateway_response.status === "error"
                                //not sure why this would happen
                                $genError.text('There was a problem with your submission. Please try again.').removeClass('hidden');

                                debug('unknown error received from the donate api');

                            }

                        }

                        //adjust the dom so that the user can see the errors
                        $body.addClass('blue_contribute_error');
                        processingState(false);

                        //alert others of the fail
                        //will currently blow away QD if the amount is wrong... that's wrong, I think
                        if ($.Topic) { $.Topic('bsd-validation-update').publish( false, amt_error_only ); }

                        window.scrollTo(0, 0);

                    }

                } else {

                    locked = false;
                    //adjust the dom so that the user can see the errors
                    $body.addClass('blue_contribute_error');  //toggle off the processing body class
                    processingState(false);
                    //alert others of the fail
                    //will currently blow away QD if the amount is wrong... that's wrong, I think
                    if ($.Topic) { $.Topic('bsd-validation-update').publish( false, amt_error_only ); }
                    //to do: update dom with a general error message to indicate to the user that something is wrong
                    debug('donate api response was not parsable by jquery/is not valid json--it is probably html');
                    $genError.text('We are unable to process your transaction at this time.').removeClass('hidden');
                }

                //behavior that happens on success or fail
                if( typeof blueContribute.settings.afterPost === 'function' ){

                    blueContribute.settings.afterPost();

                }

            };
            
            //Set the default settings
            defaults = {

                debug: false,

                postTo: '/page/cde/Api/Charge/v1',

                beforePost: defaultBeforePost,

                responseHandler:  defaultResponseHandler,

                postdelay: 0, //artificially deplay the submission

                slug: ($form.data('slug')||'default'),

                recurSlug: ($form.data('recur-slug')||false)

            };
            
            //consolidate both user defined and default functions
            blueContribute.settings =  $.extend(true, defaults, options);

            console.log(blueContribute.settings);
            //if a recurring slug exists, allow it to switch the submit slug, or else remove it for safety's sake
            if(blueContribute.settings.recurSlug){
                $form.on('click', "[name='recurring_acknowledge']", function(e){

                    if($slugField.val() === blueContribute.settings.slug){

                        $slugField.val(blueContribute.settings.recurSlug);

                    } else {

                        $slugField.val(blueContribute.settings.slug);

                    }
                });
            }else{
                $form.find("[name='recurring_acknowledge']").closest('li').remove();
            }

            blueContribute.submitForm = function(){

                debug('form submit attempt');

                var beforePostReturnValue = true,
                    apiRequest;

                if(typeof blueContribute.settings.beforePost === 'function'){

                    beforePostReturnValue = blueContribute.settings.beforePost();

                }

                if(beforePostReturnValue && !locked){
                    locked = true;
                    processingState(true);
                    /*default wait is zero, but we can optionally increase it*/
                    $.wait(blueContribute.settings.postdelay).then(function(){

                        //send the donation api request
                        apiRequest = $.ajax({

                            url: blueContribute.settings.postTo,
                            
                            type: nonsecure?'GET':'POST',

                            dataType: 'json',

                            converters: { "text json": jQuery.parseJSON },

                            timeout: 30000,

                            data: $form.serializeObject()

                        }).always(defaultResponseHandler);

                        if(nonsecure){ console.log('form is on a non-secure domain, transaction results simulated'); }

                    });

                }else {
                    debug('double submission detected');
                }

            };

            $form.submit(function(e){

                blueContribute.submitForm();
                
                e.preventDefault();

            });

            //initalization function
            if(typeof blueContribute.settings.afterInit === 'function'){

                blueContribute.settings.afterInit();

            }

        }
            
    });

})(jQuery);
                    