(function($,w){
    window._gaq = window._gaq || [];
    window.optimizely = window.optimizely || [];

    var gup = function(name) {
            name = name.replace(/(\[|\])/g,"\\$1");
            var regex = new RegExp("[\\?&]"+name+"=([^&#]*)"),
                results = regex.exec( window.location.href );
                return ( results === null )?"":results[1];
        },
        report = function(ga,opt){
            window._gaq.push( ['_trackEvent'].concat(ga) );
            window.optimizely.push( ['trackEvent'].concat(opt) );
            //console.log("ANALYTICS:", ga,opt);
        },
        topics = {},
        hash = window.location.hash.replace("#",''),
        nonsecure = ( window.location.protocol.indexOf('s')===-1 ),
        nomin = ( gup('nomin')==="1" ),
        touch  = !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator);

    String.prototype.commafy = function () {
        return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
            return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
        });
    };

    Number.prototype.commafy = function () {
        return String(this).commafy();
    };

    if (nonsecure){
        console.log('WARNING: nonsecure domain = test mode.');
        $('body').prepend('<div class="insecure-warning">non-secure domain, using test mode.</div>');
    }

    /*add pretty timeouts*/
    $.wait = function(time) {
      return $.Deferred(function(dfd) {
        setTimeout(dfd.resolve, time);
      });
    };

    /*add basic pub sub, for error-free behavior chains*/
    $.Topic = function( id ) {
        
        var callbacks,
            topic = id && topics[ id ];
        if ( !topic ) {
            callbacks = $.Callbacks();
            topic = {
                publish: callbacks.fire,
                subscribe: callbacks.add,
                unsubscribe: callbacks.remove
            };
            if ( id ) {
                topics[ id ] = topic;
            }
        }
        return topic;
    };
/*
 * quickDonate.js
 *
 * Author: Kyle Rush
 * kylerrush@gmail.com
 * kylerush.net
 *

 */
var quickDonate = quickDonate || {};

(function($){

    "use strict";

    //creat the Quick Donate jQuery plugin
    $.fn.extend({

        //pass the options variable to the function
        quickDonate: function(options) {

            var $topNode = $(this),//attach to the element outside the core form
                $bothNodes = $topNode.add($('body')), //because we want qd to inform both login sections outside the form and the form itself, we need to apply classes both places
                $form = $topNode.find('.bsdcd-form ').eq(0),
                firstTry = true,
                loggedin = false,
                spudfields = ['firstname', 'lastname', 'email', 'zip', 'phone', 'country','addr1', 'addr2', 'city', 'state_cd', 'occupation', 'employer'],
                qdfields = ['cc_number','cc_expir_month','cc_expir_year'],
                defaults, ccName, ccNumberFormatted, defaultResponseHandler, clearQDInfo, prefill, qdFail;

            quickDonate.s = quickDonate.s || {};


            prefill = function(obj){
                obj = (typeof obj === "object")? obj : {};
                $.each(spudfields,function(i,v){

                    var $f = $form.find('[name="'+v+'"]'),
                        //insert = decodeURIComponent(gup(v)).replace(/\+/g,' ') || obj[v]|| null; //prefill from url maybe not wanted on contrib pages?
                        insert = obj[v]|| null;

                    if (insert) {
                        $f.val(insert).removeClass('placeholder').addClass('prefilled');
                    }
                });
            };

            qdFail = function(){
                //need to get the logged in state because asking people who are already logged in to log in is pointless
                $bothNodes.removeClass('qd_loading').addClass(  ((loggedin)?' qd_not_enabled':' qd_load_failed')  ); //if user is logged in but
                $.Topic('qd-status').publish( false );
                if (firstTry){
                    getSpud().always(function(d){ prefill(d); });
                }
            };

            defaultResponseHandler = function(responseObject, t){

                if(responseObject.status === 200 && t){

                    //strictly check all the data types so that there are no js errors if the response is screwed up
                    if(
                        typeof t.enabled === 'boolean' &&
                        typeof t.token === 'string' &&
                        typeof t.token_info === 'object' &&
                        typeof t.token_info.account_last_four === 'string' &&
                        typeof t.token_info.cc_type_cd === 'string' &&
                        typeof t.token_info.cc_expir_month === 'string' &&
                        typeof t.token_info.cc_expir_year === 'string' &&
                        typeof t.token_info.firstname === 'string' &&
                        typeof t.token_info.lastname === 'string' &&
                        typeof t.token_info.addr1 === 'string' &&
                        /* we need to make sure addr2 is always a string, even blank if there is no value */
                        typeof t.token_info.addr2 === 'string' &&
                        typeof t.token_info.city === 'string' &&
                        typeof t.token_info.state_cd === 'string' &&
                        typeof t.token_info.zip === 'string' &&
                        typeof t.token_info.country === 'string' &&
                        typeof t.token_info.email === 'string' &&
                        typeof t.token_info.phone === 'string' &&
                        typeof t.token_info.employer === 'string' &&
                        typeof t.token_info.occupation === 'string'

                    ){

                        if(quickDonate.s.debug === true){

                            console.log('properties in response object are all the right type');

                        }

                        if(t.enabled){

                            //put all the field values in
                            $form.find("[name='quick_donate_populated']").val(t.token);

                            if(t.token_info.cc_type_cd === 'ax'){

                                $("[name='cc_number']").val('XXXXXXXXXXX' + t.token_info.account_last_four);

                            } else {

                                $("[name='cc_number']").val('XXXXXXXXXXXX' + t.token_info.account_last_four);

                            }
                            $form.find("[value='" + t.token_info.cc_type_cd + "']").prop('checked', true);

                            /* the donate api should always return a two digit number, even if the mont is something like "5" */
                            if(t.token_info.cc_expir_month.length === 1){
                                $form.find("[name='cc_expir_month']").val('0' + t.token_info.cc_expir_month);
                            } else {
                                $form.find("[name='cc_expir_month']").val(t.token_info.cc_expir_month);
                            }
                            /*possible maestro support*/
                            if(t.token_info.cc_start_month && t.token_info.cc_start_month.length === 1){
                                $form.find("[name='cc_start_month']").val('0' + t.token_info.cc_start_month);
                            } else {
                                $form.find("[name='cc_start_month']").val(t.token_info.cc_start_month);
                            }
                            if(t.token_info.cc_start_month){
                                $form.find("[name='cc_start_year']").val(t.token_info.cc_start_year);
                            }

                            $form.find("[name='cc_expir_year']").val(t.token_info.cc_expir_year);
                            $form.find("[name='firstname']").val(t.token_info.firstname);
                            $form.find("[name='lastname']").val(t.token_info.lastname);
                            $form.find("[name='addr1']").val(t.token_info.addr1);
                            $form.find("[name='addr2']").val(t.token_info.addr2);
                            $form.find("[name='city']").val(t.token_info.city);
                            $form.find("[name='zip']").val(t.token_info.zip);
                            $form.find("[name='country']").val(t.token_info.country).change(); //have to make sure the state field is the right format
                            $form.find("[name='email']").val(t.token_info.email);
                            $form.find("[name='phone']").val(t.token_info.phone);
                            $form.find("[name='employer']").val(t.token_info.employer);
                            $form.find("[name=occupation]").val(t.token_info.occupation);
                            $form.find("[name='state_cd']").val(t.token_info.state_cd);
                            $form.find("[name='quick_donate_populated']").val(t.token);

                            //put the qd info text into the dom elements
                            $(quickDonate.s.nameElement).text(t.token_info.firstname + ' ' + t.token_info.lastname);
                            $(quickDonate.s.addrElement).text(t.token_info.addr1 + ' ' + t.token_info.addr2);
                            $(quickDonate.s.locElement).text(t.token_info.city + ' ' + t.token_info.state_cd + ' ' + t.token_info.zip + ' ' + t.token_info.country);

                              //detach cvv
                            quickDonate.cvvHolder = $form.removeClass('cvv-input').find('.cc_cvv_cont').detach();

                            /*need to verify that all of these values are correct */
                            if(t.token_info.cc_type_cd === 'vs'){

                                ccName = 'Visa';

                            } else if(t.token_info.cc_type_cd === 'mc'){

                                ccName = 'MasterCard';

                            } else if(t.token_info.cc_type_cd === 'ax'){

                                ccName = 'American Express';

                            } else if(t.token_info.cc_type_cd === 'dc'){

                                ccName = 'DiscoverCard';

                            }
                            $(quickDonate.s.ccTypeElement).text(ccName);

                            //format the card number
                            if(t.token_info.cc_type_cd === 'ax'){

                                ccNumberFormatted = '**** ****** *' + t.token_info.account_last_four;

                            } else {

                                ccNumberFormatted = '**** **** **** ' + t.token_info.account_last_four;

                            }
                            $(quickDonate.s.ccNumberElement).text(ccNumberFormatted);
                            //add the qd enabled body class for css
                            $bothNodes.addClass('qd_populated').removeClass('qd_loading qd_load_failed');
                            if(window.location.hash.indexOf('noquickd')>-1){
                                window.location.hash = '';
                            }

                            report(
                                ['Quick Donate', 'populated', true],
                                'quick_donate_populated'
                            );

                            $.Topic('data-update').publish( 'qd_populated' );
                            $.Topic('qd-status').publish( true );
                            //if sequential we can skip to the last step if the user has already completed amounts.  We may want to move this check into sequential.js somehow
                            if(quickDonate.s.skiptoStep) {
                                $.Topic('change-step').publish(
                                    ( $('.sequential_breadcrumb_amount').hasClass('completed') )? quickDonate.s.skiptoStep : 0
                                );
                            }

                        } else {

                            qdFail();

                        }

                    } else {

                        if(quickDonate.s.debug === true){

                            console.log('properties in response object are not the correct type');

                        }

                        //something was wrong with the response object
                        qdFail();
                        //if user doesn't have quick donate yet, don't prompt them to login. But no way to tell when logged out...
                    }

                } else {

                    //something was wrong with the response object
                    if(quickDonate.s.debug === true){
                        console.log('something was wrong with the response object',responseObject, quickDonate.tokenRequest);
                    }
                    qdFail();

                }

                //run the callback object
                if(typeof quickDonate.s.callback === 'function'){
                        quickDonate.s.callback();
                }
                firstTry = false;
            };

            clearQDInfo = function(e, method, noreport){

                if(typeof e === 'object'){ e.preventDefault(); }

                if(!noreport){
                    report(
                        ['Quick Donate', 'cleared', method],
                        'quick_donate_cleared_'+method
                    );
                }

                if(method === 'nuclear'){

                    $.each( spudfields.concat(qdfields), function(i,v){
                        $form.find('[name="'+v+'"]').val('');
                    });
                    $('.sequential_breadcrumb_name, .sequential_breadcrumb_payment').removeClass('completed'); //back up any completion measures

                    $.ajax({
                        "dataType": "jsonp",
                        "jsonp":"jsonp",
                        "url": "/page/user/logout",
                        "timeout": 8000
                    }).done(function(data){
                         $bothNodes.addClass('qd_load_failed'); //when logout is complete, put login link back
                    }).fail(function(){
                        if (nonsecure){
                            //if we're in test mode, fake a logout. all the above code should allow a user to donate fresh even if the logout failed
                            window.location.hash = 'noquickd';
                            window.location.reload();
                        }
                    });
                }
                else {
                    $bothNodes.addClass('qd_cleared');
                    $.each(qdfields, function(i,v){
                        $form.find('[name="'+v+'"]').val('');
                    });
                    $('.sequential_breadcrumb_payment').removeClass('completed'); //back up completion measure
                }
                $.Topic('qd-status').publish( false );
                $bothNodes.removeClass('qd_populated');
                $form.find("[name='quick_donate_populated']").val('');
                $form.find("[name='cc_type_cd']").filter(':checked').prop('checked',false);
                if (quickDonate.cvvHolder && quickDonate.cvvHolder.length) {
                    $form.addClass('cvv-input').find('.cc_expiration_cont').after(quickDonate.cvvHolder);
                }
                $.Topic('change-step').publish(1, true); //go to now unhidden name step, but do it silently
                $.Topic('data-update').publish( 'qd_cleared' );
            };

            //set the default settings
            defaults = {

                tokenRequestPath: '/ctl/Contribution/Quick/GetToken',
                nuclearElement: '.qd_nuclear',
                differentInfoElement: '.qd_clear_info',
                nameElement: '.qd_name',
                addrElement: '.qd_address',
                locElement: '.qd_location',
                ccTypeElement: '.qd_cc_type',
                ccNumberElement: '.qd_cc_number',
                clearInfo: clearQDInfo,
                skiptoStep: 2,
                responseHandler: defaultResponseHandler

            };

            //consolidate both user defined and default functions
            quickDonate.s =  $.extend(true, defaults, options);

            function requestToken(){
                $bothNodes.addClass('qd_loading');

                var tr = $.ajax({

                    url: (hash.indexOf('noquickd')>-1 && firstTry)?'/':quickDonate.s.tokenRequestPath,

                    converters: { "text json": jQuery.parseJSON },

                    type: 'GET',

                    dataType: 'json'

                });
                return tr;
            }

            function tryToken(){
                var obj = requestToken();
                obj.always(function(d) {
                    quickDonate.tokenRequest = d;
                    quickDonate.s.responseHandler(obj, d);
                });
            }


            tryToken();

            quickDonate.tryToken = tryToken;

            //if qd fails, we can get the spud for the domain in question
            function resFilter(prom){
                return prom.pipe(function(d){
                    return (!d.error)?d:$.Deferred().reject(d);
                },function(d){
                    return $.Deferred().reject(d);
              });
            }
            function getSpud(){
                return resFilter(
                    $.ajax($.extend({
                        url:'/page/spud?type=getm&field=email,firstname,lastname,addr1,city,state_cd,zip,phone&jsonp=?',
                        dataType:'jsonp'
                    },nonsecure?{jsonpCallback:'fake'}:{}))
                );
            }
            function getGraph(){
              return resFilter($.ajax({url:'/page/graph/me?callback=?&jsoncallback=?',dataType:'jsonp'}));
            }

            $(quickDonate.s.nuclearElement).click(function(e){

                quickDonate.s.clearInfo(e, 'nuclear');

            });

            $(quickDonate.s.differentInfoElement).click(function(e){

                quickDonate.s.clearInfo(e, 'reveal');

            });

            $( '.qd-log-in-link' ).click(function(e){
                e.preventDefault();

                window.open(
                    '/ctl/Contribution/Quick/Login'+(location.hostname==="localhost"?'.html':''),
                    'quickDonateLogin',
                    'status=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=0,width=550,height=350'
                );
            });

            /*not currently exposed/used*/
            $( '.qd-log-out-link' ).click(function(e){
                e.preventDefault();
                quickDonate.s.clearInfo(e, 'nuclear');
            });

            //clear quick donate if the blue validation had any other errors than just the amount
            $.Topic('bsd-validation-update').subscribe(function(ok, amt_error_only){
                if (!ok && !amt_error_only){
                    quickDonate.s.clearInfo(0, 'reveal', true); //clear qd because user had errors, but don't report since it's assumed and not user initiated
                }
            });

            /*fake the existence of bQuery and or add a silly method to catch login attempts*/
            window.bQuery = window.bQuery || jQuery;
            window.bQuery.bsd = window.bQuery.bsd || {};
            window.bQuery.bsd.quickDonate = function(){
                loggedin = true;
                quickDonate.tryToken();
            };


            return this; //chainablility
        }

    });

})(jQuery);

(function($){

    $.fn.extend({
        
        detectCCType: function($container) {
            
            //radio selectors
			var $form = $(this).find('form'),
                $ccTypeSection = $form.find('.cc_type_cont'),
                $ccArray = $form.find("[name='cc_type_cd']"),
				$visa = $ccArray.filter("[value='vs']"),
				$amex = $ccArray.filter("[value='ax']"),
				$discover = $ccArray.filter("[value='ds']"),
				$mastercard = $ccArray.filter("[value='mc']"),
                $maestro = $ccArray.filter("[value='ma']"),
				$ccNum = $form.find('[name="cc_number"]'),
				visaRegEx = /^4/,
				amexRegEx = /^3[47]/,
				discoverRegEx = /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
				masterCardRegEx = /^5[1-5]/,
                maestroRegex = /^(5018|5020|5038|6304|6759|676[1-3])/,
				quickDonateRegEx = /^x/i;
			
			function setCreditCardType(){
                
				var creditCardNumber = $ccNum.val(),
					valid = [];

				$form.removeClass('cc-is-vs cc-is-ax cc-is-ds cc-is-mc cc-is-ma cc-is-qd cc-cover');

				/*if it's not quick donate, remove the checked state from all cardtypes then check to see if one is valid*/
				if( !quickDonateRegEx.test(creditCardNumber) ){
					
                    $ccArray.prop('checked',false);
                    
					if(visaRegEx.test(creditCardNumber)){
						valid = $visa;
					} else if(amexRegEx.test(creditCardNumber)){
						valid = $amex;
					} else if(discoverRegEx.test(creditCardNumber)) {
						valid = $discover;
					} else if(masterCardRegEx.test(creditCardNumber)) {
						valid = $mastercard;
					} else if(maestroRegex.test(creditCardNumber)) {
                        valid = $maestro;
                    }

                    if (valid.length){
                        valid.prop('checked', true);
                        $form.addClass('cc-cover cc-is-'+valid.val());
                    }
				}
                else {
                    $form.addClass('cc-is-qd');
                }
			}
			
            /*subscribe to any events that change the data, such as a QD token coming in*/
            if ($.Topic) { $.Topic('data-update').subscribe( setCreditCardType ); }

			/*bind the behavior to all events that might change the value*/
			$ccNum.on('keyup change', function(){
                setTimeout(setCreditCardType, 0);
            });

            $ccNum.on('paste', function(){
                setTimeout(setCreditCardType, 0);
            });

			//apply class to parent indicating script is running correctly
			$form.addClass('cc-type-detection-active');

            return this;//chainability
        }
        
    });

})(jQuery);
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
                urlsource = gup('source')||gup('fb_ref'),
                urlsubsource = gup('subsource'),
                $slugField = $form.find("[name='slug']"),
                pagetitle = document.title,
                wait = false,
                msg = {
                    "unknown":"We were unable to process your transaction at this time.",
                    "invalid":"Your donation was not successful. Please correct the problems marked below.",
                    "declined":"The transaction was declined. Please check that the address information is correct or else use a different card.",
                    "review":"Your transaction is under review, there is no need to resubmit at this time."
                }, debug, defaultResponseHandler, defaults, defaultBeforePost, processingState, genError;

            //transfer sourcecodes.  How would we handle cookies/if this page was not the landing page?

            if(urlsource || urlsubsource) {
                if ( urlsubsource ) { urlsource = (urlsource)?urlsource+','+urlsubsource:urlsubsource; }
                $sourceField.val( defaultsource  ? defaultsource + ',' + urlsource : urlsource );
            }

            debug = function(message){
                if(blueContribute.settings.debug){
                    if(typeof console === 'object'){
                        window.console.log(message);
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

            genError = function(msg){
               $genError.text(msg).removeClass('hidden');
            };

            defaultResponseHandler = function(data){

                var amt_error_only = false, i, resobj;

                //remove all existing errors
                if(blueContribute.latestResponseObject){

                    debug('removing previous errors');
                    debug(blueContribute.latestResponseObject.field_errors);

                    if( $.isArray(blueContribute.latestResponseObject.field_errors) ){

                        if(blueContribute.latestResponseObject.field_errors.length > 0){

                            for(i = 0; i <= blueContribute.latestResponseObject.field_errors.length - 1; i++){

                                debug('reseting ' + blueContribute.latestResponseObject.field_errors[i].field);

                                //wipe the error messages for each field
                                $form.find('.' + blueContribute.latestResponseObject.field_errors[i].field + '_error').text('').addClass('hidden');

                                //remove the error class to the related fields
                                $form.find('.' + blueContribute.latestResponseObject.field_errors[i].field + '_related').removeClass('bsdcd-error');

                                //remove the general errors message
                                $genError.text('').addClass('hidden');

                                $body.removeClass('blue_contribute_error');

                            }

                        }

                    } else {

                        debug('no field errors on the latest repsonse object');

                    }

                } else {

                    debug('this is the first submission');

                }

                var responseIsValidJSON = false;

                if(data && !data.api_version){
                //try to parse the response body as json, if errors occur it is most likely because the json is invalid or because html was returned instead
                    try {

                        blueContribute.latestResponseObject = jQuery.parseJSON(data.responseText)||data;
                        responseIsValidJSON = true;

                    } catch(err) {

                        responseIsValidJSON = false;

                        debug('api response body invalid');
                    }
                }else{
                    blueContribute.latestResponseObject = data;
                    responseIsValidJSON = true;
                }
                resobj = blueContribute.latestResponseObject;

                if(responseIsValidJSON === true && resobj){
                    if(resobj.status && (resobj.status === "success" || resobj.status === "paypal"  ) ){
                        //if custom success is defined, fire it with the response object
                        if (typeof blueContribute.settings.customSuccess === 'function'){
                            processingState(false);
                            blueContribute.settings.customSuccess(resobj);
                        }
                        //if there's no debug parameter and if the site is secure, go to the redirect url
                        else if(!gup('debug') || !nonsecure) {
                            window.location = resobj.redirect_url;
                        }

                    } else {
                        //we have some sort of failure to communicate
                        debug('response was not a success status code');

                        if(resobj.code === 'noslug'  || resobj.code === 'invalidslug'){

                            genError(msg.unknown + ' [No slug]');

                        } else if(resobj.code === 'validation'){

                            debug('validation error');

                            report(
                                ['Donate API', 'Validation Errors', blueContribute.latestResponseObject.field_errors.length],
                                'donate_api_valiation_error'
                            );

                            if( resobj.field_errors && $.isArray(resobj.field_errors) && (resobj.field_errors.length > 0) ){

                                    debug(resobj.field_errors);

                                    if (resobj.field_errors.length===1 && resobj.field_errors[0].field==="amount_group"){
                                        amt_error_only = true;
                                    }

                                    for(i = 0; i <= resobj.field_errors.length - 1; i++){
                                        
                                        //inject the error messages for each field
                                        $form.find('.' + resobj.field_errors[i].field + '_error').text(resobj.field_errors[i].message).removeClass('hidden');

                                        //add the error class to the related fields
                                        $form.find('.' + resobj.field_errors[i].field + '_related').addClass('bsdcd-error').removeClass('hidden');

                                    }

                                    //inject the general errors message
                                    genError(msg.invalid);

                            } else {

                                debug('invalid field_errors property in the donate api');
                                genError(msg.unknown +' [Invalid Validaiton Repsonse]');

                            }

                        } else if(resobj.code === 'gateway'){

                            debug('gateway rejected the transaction');
                            
                            //checking for a declined card
                            if(resobj.gateway_response && resobj.gateway_response.status === "decline"){

                                genError(msg.declined);

                                debug('bank declined');

                                report(
                                    ['Donate API', 'Gateway Error', resobj.gateway_response.status],
                                    'donate_api_gateway_error'
                                );

                            } else if ( resobj.gateway_response && resobj.gateway_response.status==="review" ){
                                genError(msg.review +' [Gateway]');

                                debug('transaction under review');
                                report(
                                    ['Donate API', 'Gateway Error', 'review'],
                                    'donate_api_gateway_error'
                                );
                            }else {

                                //blueContribute.latestResponseObject.gateway_response.status === "unkown" ||
                                //blueContribute.latestResponseObject.gateway_response.status === "error"
                                //not sure why this would happen
                                genError(msg.unknown +' [Gateway]');

                                debug('unknown error gateway error');
                                report(
                                    ['Donate API', 'Unknown Gateway Error', 'unknown or malformed'],
                                    'donate_api_gateway_error'
                                );
                            }

                        }else {
                            
                            genError(msg.unknown +' [Code: '+((resobj.code)?resobj.code:'unknown')+']');
                            debug('truly unknown error from donate api');
                            report(
                                ['Donate API', 'Unknown Error', (resobj.code)?resobj.code:'unknown'],
                                'donate_api_gateway_error'
                            );

                        }

                        //adjust the dom so that the user can see the errors
                        $body.addClass('blue_contribute_error');
                        processingState(false);
                        locked = false;

                        //alert others of the fail
                        //will currently blow away QD if the amount is wrong... that's wrong, I think
                        if ($.Topic) { $.Topic('bsd-validation-update').publish( false, amt_error_only ); }

                        window.scrollTo(0, 0);

                    } //end else for valid error response 

                } else {
                    //invalid json
                    locked = false;
                    //adjust the dom so that the user can see the errors
                    $body.addClass('blue_contribute_error');  //toggle off the processing body class
                    processingState(false);
                    //alert others of the fail
                    if ($.Topic) { $.Topic('bsd-validation-update').publish( false, amt_error_only ); }
                    //to do: update dom with a general error message to indicate to the user that something is wrong
                    debug('donate api response not parsable');
                    genError(msg.unknown +' [API DOWN]');
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

                customSuccess: null,

                postdelay: 0, //artificially deplay the submission

                slug: ($form.data('slug')||'default'),

                recurSlug: ($form.data('recur-slug')||false)

            };
            
            //consolidate both user defined and default functions
            blueContribute.settings =  $.extend(true, defaults, options);

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

                var beforePostReturnValue = true;

                if(typeof blueContribute.settings.beforePost === 'function'){

                    beforePostReturnValue = blueContribute.settings.beforePost();

                }

                if(beforePostReturnValue && !locked){
                    locked = true;
                    processingState(true);
                    /*default wait is zero, but we can optionally increase it*/
                    $.wait(blueContribute.settings.postdelay).then(function(){

                        //send the donation api request
                        $.ajax({

                            url: blueContribute.settings.postTo,
                            
                            type: nonsecure?'GET':'POST',

                            dataType: 'json',

                            converters: { "text json": jQuery.parseJSON },

                            timeout: 30000,

                            data: $form.serializeObject()

                        }).always(defaultResponseHandler);

                        if(nonsecure){ console.log('non-secure domain, transaction results simulated'); }

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

            return this;//chainability
        }
            
    });

}(jQuery));
/*
*
* sequential.js
*
* Written by Kyle Rush (kylerrush@gmail.com)
*/

var sequential = {};

(function($){

	"use strict";

	//creat the Quick Donate jQuery plugin
    $.fn.extend({
        
        //pass the options variable to the function
        sequential: function(options) {

            var $topNode = $(this),
                $form = $topNode.find('.bsdcd-form'),
                $otheramt = $form.find('[name="amount_other"]'),
                $breadcrumbs = $topNode.find('.sequential_breadcrumb');

			sequential.currentStep = 0;
			sequential.currency_symbol = $('[data-currency-symbol]').data('currency-symbol')||"$";

            var countryVal = "US";

			/*make sequential QD aware*/
			sequential.qd = false;
			$.Topic('qd-status').subscribe(function(status){
				sequential.qd = status;
			});

            /*if bsd reports errors, drop sequential styling*/
            $.Topic('bsd-validation-update').subscribe(function(ok){
                if(!ok) { $topNode.removeClass('sequential'); }
            });

			sequential.utilityFunctions = {};

			sequential.utilityFunctions.goToStep = function(step, silent){

                //console.log(step);

				var isPreviousStep, changeStep, oldstep = sequential.currentStep, $newStep, stepname;

				isPreviousStep = step < sequential.currentStep;

                if (step>0){$topNode.removeClass('pre-first-click');}

				changeStep = function(){

					//console.log('step',step, silent);
                    sequential.currentStep = step;

                    $topNode.removeClass('sequential_step_' + oldstep).find('.sequential_error_message').text('');
                    sequential.s.stepContainers.eq(oldstep).addClass('inactive').removeClass('active');
                    $breadcrumbs.eq(oldstep).removeClass('active');

                    //if qd is populated and step 1 was valid, users should go right to the step 2 without adding step 1
                    if(step===1 && sequential.qd){
                        sequential.utilityFunctions.goToStep(2);
                    }else {
                        $topNode.addClass('sequential_step_' + step);

                        $newStep = $breadcrumbs.eq(step);
                        stepname = $newStep.data('stepname');

                        $newStep.addClass('active').prevAll().removeClass('step-error').addClass('completed');
                        sequential.s.stepContainers.eq(step).addClass('active').removeClass('inactive').prevAll().addClass('completed');

                        //if not touch, focus on this steps first required field that is currently without a value
                        if(!touch){
                            sequential.s.stepContainers.eq(step).find('input').find('[required]').filter(function(){
                                if($(this).val() === ""){
                                    return true;
                                }
                            }).first().focus();
                        }

                        if(!silent){
                            report(
                                ['Sequential donate', 'Screen view', stepname],
                                'sequential_screen_' + stepname
                            );
                        }
                    }
				};

				if( typeof step === 'number' ){

					if( typeof sequential.s.validationFunctions[sequential.currentStep] === 'function'){

						if( isPreviousStep ){

							changeStep();

						} else if( sequential.currentStep !== step ) {

                            //this still allows us to skip from step 1 to step 3, past an invalid step 2....
							if( sequential.s.validationFunctions[sequential.currentStep]() ){

                                if( sequential.currentStep === sequential.s.submitStep ){

                                    //last step so submit the form
                                    blueContribute.submitForm();
                                    $topNode.find('.sequential-donate-btn-copy').text('Processing...');
                                }
                                else if ( (step - sequential.currentStep) > 1){
                                    sequential.utilityFunctions.goToStep(sequential.currentStep+1);
                                    sequential.utilityFunctions.goToStep(step);
                                }
                                else{
                                    changeStep();
                                }
							} else {
								//console.log('step fail',sequential.currentStep);
                                $('li.sequential_breadcrumb_' + sequential.currentStep).removeClass('completed').addClass('step-error');
							}

						}

					}

				}

			};

			$.Topic('change-step').subscribe(sequential.utilityFunctions.goToStep); //allow other modules to change steps 

            sequential.utilityFunctions.validateAmountsAndPersonal = function(){
                return sequential.utilityFunctions.validateAmounts() && sequential.utilityFunctions.validatePersonalInfo();
            };

			sequential.utilityFunctions.validateAmounts = function (){

				var amountRadioGroupNumber, otherAmountNumber, amountIsSelected, amountIsUnderMaximum, amountIsOverMinimum, amount, tmpamount = $otheramt.val();

				$topNode.removeClass('sequential_error').find('.sequential_error_message').text('');

				amountRadioGroupNumber = parseFloat( $form.find("input[name='amount']:checked").val() );

				if (tmpamount) { otherAmountNumber =  parseFloat( $otheramt.val( tmpamount.replace(/[^\d\.]/g,'') ).val() ); }

				amountIsSelected = function(){

					if( otherAmountNumber ){

						//other amount field has a valid number in it

						//console.log('other amount has a valid number in it');

						amount = otherAmountNumber;

						return true;

					} else {

						//other amount is not a valid number

						if( amountRadioGroupNumber ){

							//console.log('a valid preset radio is selected');

							amount = amountRadioGroupNumber;

							return true;

						} else {

							//no amount is selected

                            //console.log('no amount selected');
                            report(
                                ['Sequential donate', 'Amount error', 'no amount selected'],
                                'sequential_amount_not_selected'
                            );
							return false;

						}

					}

				};

				amountIsUnderMaximum = function(amount){

					if(typeof sequential.s.donationAmountLimit === 'number'){

						//console.log('donation amount minimum is set');

						if(typeof amount === 'number'){

							if( amount <= sequential.s.donationAmountLimit ){

								//user selected amount is under maximum
								return true;

							} else {

								//user selected amount is not under maximum
                                report(
                                    ['Sequential donate', 'Amount error', 'Above maximum'],
                                    'sequential_amount_over_maximum_error'
                                );

								return false;

							}

						} else {

							//argument is not a number, so just let it go through and catch the problem on the server side
							return true;

						}

					} else {

						//no amount maximum is set o return true
						return true;

					}

				};

				amountIsOverMinimum = function(amount){

					if(typeof sequential.s.donationAmountMinimum === 'number'){

						if(typeof amount === 'number'){

							if( amount >= sequential.s.donationAmountMinimum || nomin){

								//user selected amount is over minimum
								return true;

							} else {

                                report(
                                    ['Sequential donate', 'Amount error', 'Below minimum'],
                                    'sequential_amount_under_minimum_error'
                                );

                                return false;
							}

						} else {

							//no minimum is specified
							return true;

						}

					} else {

						//no amount minimum is set so return true
						return true;

					}

				};

				if( amountIsSelected() ){

					//console.log('amount is selected');

					if( amountIsUnderMaximum(amount) ){

						//console.log('selected amount is under maximum');

						if( amountIsOverMinimum(amount) ){

							//amount is over minimum

							//console.log('selected amount is over minimum');

							$topNode.find('.sequential-donate-btn-copy').text('Donate ' + sequential.currency_symbol + amount.commafy());

							return true;

						} else {

							//amount is under minimum

							//console.log('selected amount is NOT over minimum');
                            console.log(sequential.currency_symbol);
							$topNode.addClass('sequential_error').find('.sequential_error_message').text(
                                (sequential.s.customErrors.undermin) ?
                                sequential.s.customErrors.undermin :
                                ('The minimum amount is ' + sequential.currency_symbol + sequential.s.donationAmountMinimum + '.')
                            );

							return false;

						}

					} else {

						//amount is over maximum

						//console.log('selected amount is NOT under maximum');

                        $topNode.addClass('sequential_error').find('.sequential_error_message').text(
                            (sequential.s.customErrors.overmax) ?
                                sequential.s.customErrors.overmax :
                                ('The maximum amount is ' + sequential.currency_symbol + sequential.s.donationAmountLimit.commafy() + '.')
                            );
						return false;

					}

				} else {

                    //no amount is selected

					//console.log('no amount is selected');

					$topNode.addClass('sequential_error').find('.sequential_error_message').text('Please select an amount.');

					return false;

				}

			};

			sequential.utilityFunctions.validatePersonalInfo = function(){

				var numberOfInvalidFields, firstName, lastName, address, city, $state, zip, email, phone, country, employer, occupation, $zip;

				numberOfInvalidFields = 0;

				$topNode.removeClass('sequential_error').find('.sequential_error_message').text('');

				firstName = $("[name='firstname']");

				if( !firstName.val() ){

					numberOfInvalidFields++;

					firstName.addClass('bsdcd-error');

				} else {

					firstName.removeClass('bsdcd-error');

				}

				lastName = $("[name='lastname']");

				if( !lastName.val() ){

					numberOfInvalidFields++;

					lastName.addClass('bsdcd-error');

				} else {

					lastName.removeClass('bsdcd-error');

				}

				address = $("[name='addr1']");

				if( !address.val() ){

					numberOfInvalidFields++;

					address.addClass('bsdcd-error');

				} else {

					address.removeClass('bsdcd-error');

				}

				city = $("[name='city']");

				if( !city.val() ){

					numberOfInvalidFields++;

					city.addClass('bsdcd-error');

				} else {

					city.removeClass('bsdcd-error');

				}

				$state = $("[name='state_cd']");

				if( ($state.is('select') && $state.val().length !== 2 ) || !$state.val() ){

					numberOfInvalidFields++;

					$state.addClass('bsdcd-error');

				} else {

					$state.removeClass('bsdcd-error');

				}


                country = $form.find('[name="country"]');
                countryVal = country.val();

                if(sequential.s.requireCountry){

                    if( !country.val() ){

                        numberOfInvalidFields++;

                        country.addClass('bsdcd-error');

                    }
                    else {
                        country.removeClass('bsdcd-error');
                    }

                }


				//needs to not use US validation when it's not the US
				$zip = $form.find("[name='zip']");
                zip = $zip.val();

                //console.log('zip',zip);
				if( countryVal ==="US" ){
					zip.replace(/\D/g, '');
				}

				if( countryVal === "US" && zip.length >= 5 && zip.length <= 9 ){
					$zip.removeClass('bsdcd-error');
				} else if ( countryVal === "GB" && zip.length >= 3 && zip.length <= 10 ){
					$zip.removeClass('bsdcd-error');
				}else if ( countryVal !== "US" && countryVal !== "GB" && !!zip ){
					$zip.removeClass('bsdcd-error');//if international, just check for anything and let the server validate it
				}else {

					numberOfInvalidFields++;

					$zip.addClass('bsdcd-error');

				}



				email = {};

				email.input = $form.find("[name='email']");

				email.address = email.input.val();

				email.isValid = function(){

					var emailRegEx = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

					if( emailRegEx.test(email.address) ){

						return true;

					} else {

						return false;

					}

				};

				if( email.isValid() ){

					email.input.removeClass('bsdcd-error');

				} else {

					numberOfInvalidFields++;

					email.input.addClass('bsdcd-error');

				}

				phone = {};

				phone.input = $form.find("[name='phone']");

				phone.number = phone.input.val();

				phone.isValid = function(){

					var rawPhoneNumber = phone.number.replace(/\D/g, '');

					if(rawPhoneNumber.length >= 10 && rawPhoneNumber.length <= 11){

						return true;

					} else {

						return false;

					}

				};

				if( (sequential.s.optionalphone && !phone.number) || phone.isValid() ){

					phone.input.removeClass('bsdcd-error');

				} else {

					numberOfInvalidFields++;

					phone.input.addClass('bsdcd-error');

				}

                employer = $form.find("[name='employer']");

                if( employer.length && !employer.val() ){

                    numberOfInvalidFields++;

                    employer.addClass('bsdcd-error');

                } else {

                    employer.removeClass('bsdcd-error');

                }

                occupation = $form.find("[name='occupation']");

                if( occupation.length && !occupation.val() ){

                    numberOfInvalidFields++;

                    occupation.addClass('bsdcd-error');

                } else {

                    occupation.removeClass('bsdcd-error');

                }

				if(numberOfInvalidFields > 0){

					$topNode.addClass('sequential_error');

					$topNode.find('.sequential_error_message').text('Please correct the problems shown above.');

                    report(
                        ['Sequential donate', 'Personal Info validation errors', numberOfInvalidFields],
                        'sequential_personal_info_errors'
                    );

					return false;

				} else {

					return true;

				}

			};

			sequential.utilityFunctions.validatePaymentInfo = function (){

				var creditCard, expirationDate, invalidFields, cvv, pp;

				invalidFields = 0;

                pp = $form.find('[name="cc_type_cd"]').filter(':checked').val() === "pp";

				creditCard = {};

				creditCard.field = $form.find("[name='cc_number']");

				creditCard.number = creditCard.field.val();


				if(/[0-9]{13,19}|([0-9- ]{3,8}){3,6}/.test(creditCard.number) || (sequential.qd && creditCard.number.indexOf('XXX')>-1 || pp) ){

					creditCard.field.removeClass('bsdcd-error');

				} else {

                    invalidFields++;

                    creditCard.field.addClass('bsdcd-error');

				}

				expirationDate = {};

				expirationDate.month = {};

				expirationDate.month.field = $form.find("[name='cc_expir_month']");

				expirationDate.month.val = expirationDate.month.field.val();

				expirationDate.month.regEx = /^(01|02|03|04|05|06|07|08|09|10|11|12)$/;

				expirationDate.month.isValid = function(){

					if( expirationDate.month.regEx.test(expirationDate.month.val) || pp){

						return true;

					} else {

						return false;
					}

				};

				if( expirationDate.month.isValid() ){

					expirationDate.month.field.removeClass('bsdcd-error');

				} else {

					invalidFields++;

					expirationDate.month.field.addClass('bsdcd-error');

				}

				expirationDate.year = {};

				expirationDate.year.field = $form.find("[name='cc_expir_year']");

				expirationDate.year.val = parseInt( expirationDate.year.field.val(), 10 );

				if( ( isNaN(expirationDate.year.val) || expirationDate.year.val < 2013) && !pp) {

                    expirationDate.year.field.addClass('bsdcd-error');

                    invalidFields++;

				} else {

                    expirationDate.year.field.removeClass('bsdcd-error');

				}

                cvv = $form.find('[name="cc_cvv"]');

                if(sequential.s.requireCVV){

                    if( pp || sequential.qd || /^[0-9]{3,4}$/.test( cvv.val() ) ){

                        cvv.removeClass('bsdcd-error');

                    }else {
                        invalidFields++;
                        cvv.addClass('bsdcd-error');

                    }

                }


				if( invalidFields > 0 ){

                    //console.log(invalidFields);

					$('.sequential_error_message').text('Please correct the problems marked above.');

					$('body').addClass('sequential_error');

                    report(
                        ['Sequential donate', 'Payment Info validation errors', invalidFields],
                        'sequential_payment_info_errors'
                    );

					return false;

				} else {

					$topNode.removeClass('sequential_error').find('.sequential_error_message').text('');

					return true;

				}

			};

			var defaults = {

				stepContainers: $topNode.find('.sequential_step'),

				donationAmountLimit: $form.data('max-donation')||null,

				donationAmountMinimum: $form.data('min-donation')||null,

                requireCountry: $form.data('require-country')||false,

                optionalphone: $form.data('optional-phone')||false,

                requireCVV: $form.data('require-cvv')||false,

                submitStep: $topNode.find('.sequential_step').length-1||2, //default to the last step

                customErrors: {},

				validationFunctions: [sequential.utilityFunctions.validateAmounts, sequential.utilityFunctions.validatePersonalInfo, sequential.utilityFunctions.validatePaymentInfo]

			};

			//consolidate both user defined and default settings
			sequential.s = $.extend(true, defaults, options);

			//add sequential body class
			$topNode.addClass('sequential').addClass('sequential_step_' + sequential.currentStep);

			if( sequential.s.requireCountry ){

				$topNode.addClass('sequential_country_field');

			}

			//show the first step
			$(sequential.s.stepContainers[0]).addClass('active');
			$('li.sequential_breadcrumb_0').addClass('active');

			//hide the others
			$(sequential.s.stepContainers).not( $(sequential.s.stepContainers[sequential.currentStep]) ).addClass('inactive');

            //enable next buttons
			$topNode.on('click','.sequential_move_forward',function(e){
                e.preventDefault();
                sequential.utilityFunctions.goToStep(sequential.currentStep + 1);
            });


            $('.bsdcd-seq-breadcrumbs').on('click', 'a', function(e){
                e.preventDefault();
                var step = $(this).closest('li').data('step');
                sequential.utilityFunctions.goToStep(step);
            });

            return this;
        }

    });

})(jQuery);

window.sequential = sequential;
//global jQuery, dsa-controller
//this library creates some core behaviors on donate forms if present, such as amount labels (for legacy support), internationalization, in-honor-of-fields

(function($){

    //need to decouple this first value: all this behavior should be plugin-y
    var $body = $('.bsdcd-outer-container')||$('body'),
        $form = $body.find('form'),
        $presetBtns = $form.find('.preset_amount_label'),
        $presetInputs = $form.find('.preset_amount_input'),
        $otherAmt = $form.find('.amount_other'),
        $otherAmtRadio = $form.find('.other_amount_radio'),
        $country = $form.find('.country'),
        $state_cdCont = $form.find('.state_cd_cont').eq(0),
        $state_label = $state_cdCont.find('label'),
        $state_cd = $state_cdCont.find('input,select').eq(0),
        state_cd_id = $state_cd.attr('id'),
        state_cd_tabindex = $state_cd.attr('tabindex'),
        $zip_label = $form.find('label.zip_related'),
        $stateFrag = $body.find('.us-state-dropdown').eq(0).clone().val('').addClass('state_cd').attr('name','state_cd').attr('id',state_cd_id).attr('tabindex',state_cd_tabindex),
        $stateInput = $('<input/>',{'type':'text','name':'state_cd','id':state_cd_id,'class':'text state_cd', 'tabindex':state_cd_tabindex}),
        countryVal = $form.data('default-country'),
        min = parseFloat($form.data('min-donation'))||0.01,
        max = parseFloat($form.data('max-donation'))||Infinity,
        symbol = $('[data-currency-symbol]').data('currency-symbol')||"$",
        custom_amounts = gup('amounts'),
        default_amount = gup('default_amt'),
        skip = parseFloat(gup('skip'))||false;

	$('.other_amount_label').hide();

    $form.find('[name="http_referrer"]').val(document.referrer);

    if(nomin){
        $('<input/>',{'type':'hidden','name':'nomin','value':'1'}).appendTo($form);
        min = 0.01;
    }

    //accept an 'x' separated string of amounts, validate each, and assign them to buttons 
    function customAmounts(cas){
        if (!cas || typeof cas !== "string"){ return false; }
        var ca_array = cas.split('x'),
            btn = 0;
        if(ca_array && ca_array.length){
            $.each(ca_array,function(i,v){
                var amt = parseFloat(v);
                if(amt && $presetBtns.eq(btn).length && amt>=min && amt<=max){
                    $presetBtns.eq(btn).html(symbol+(amt.commafy()) );
                    $presetInputs.eq(btn).val(amt);
                    btn++;
                }
            });
        }
    }
    //maybe make this global at some point so it can be exposed to optimizely?
    window.BSDcustomAmounts = customAmounts;
    customAmounts(custom_amounts);

	//apply an active class to a label when amount is selected
	$form.on('click','.preset_amount_label',function(e){
		var $el = $(this);
		$presetBtns.removeClass('active');
		$el.addClass('active');
		$otherAmt.val('');
        $el.prev().prop('checked', true);
	}).on('keydown','.amount_other',function(){
		$presetBtns.removeClass('active');
		$presetInputs.each(function(){
			$(this).prop('checked',false);
		});
        $otherAmtRadio.prop('checked', true);
	});

    //if there's a url parameter requesting a default amount be preselected, see if it's valid and matches an existing label, then select it
    if (default_amount && parseFloat(default_amount) && $presetInputs.filter( function(){ return $(this).val() === default_amount; } ).length>0  ){
        $presetInputs.filter( function(){ return $(this).val() === default_amount; } ).eq(0).next('label').click();
        $body.removeClass('pre-first-click'); //default amount should expose the next button

        //if skip to second step is requested, do so if an amount is already in. Not sure why the delay is needed here
        if(skip && skip===1 ){
            $.wait(3).done(function(){
                $.Topic('change-step').publish(1);
            });
        }
    }

    //now that we've dealt with pre-clicks, lets potentially bind the click behavior to change things on the first click
    $form.one('keydown','.amount_other',function(){
		$body.removeClass('pre-first-click');
	}).one('click','.preset_amount_label,.preset_amount_input',function(){
		if ($('html').find('.pre-first-click').length) { $.Topic('change-step').publish(1); }
        $body.removeClass('pre-first-click');
	});

    //toggle honeree select areas open and toggle between memorial or not
    $form.find('.honoree-select').on('change',function(){
        var $el = $(this), val = $el.val();
        $form.removeClass('honor-section memorial-section');
        if(val==="1"){
            $form.addClass('honor-section memorial-section');
        }
        else if (val==="0"){
            $form.addClass('honor-section');
        }
    });

    //handles the simplest way to support international validation changes based on country
	function switchCountry(qd){
        var val = $country.val(),
            $oldstate = $state_cdCont.hide().find('.state_cd');
		if(val === "US"){
            if(!$oldstate.is('select')){
                $oldstate.remove();
                $state_cdCont.append($stateFrag.val(''));
            }
            $form.removeClass('state-text-input');
            $state_label.html('State<span>*</span>');
            $zip_label.html('ZIP<span>*</span>');
            countryVal = "US";
		}
		else{
            if($oldstate.is('select')){
                $oldstate.remove();
                $state_cdCont.append($stateInput.val(''));
            }
            $form.addClass('state-text-input');
            $state_label.html((val==="GB")?'County<span>*</span>':'State/Region/Province<span>*</span>');
            $zip_label.html('Postal Code<span>*</span>');
            countryVal = (val==="GB")?'GB':'INT';
		}
		$state_cdCont.show();
	}

	$country.on('change',function(){
		switchCountry();
	});

}(jQuery));}(jQuery,window));