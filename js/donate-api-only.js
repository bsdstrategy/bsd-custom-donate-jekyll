(function(e,t){window._gaq=window._gaq||[];window.optimizely=window.optimizely||[];var n=function(e){e=e.replace(/(\[|\])/g,"\\$1");var t=new RegExp("[\\?&]"+e+"=([^&#]*)"),n=t.exec(window.location.href);return n===null?"":n[1]},r=function(e,t){window._gaq.push(["_trackEvent"].concat(e));window.optimizely.push(["trackEvent"].concat(t))},i={},s=window.location.hash.replace("#",""),o=window.location.protocol.indexOf("s")===-1,u=n("nomin")==="1",a="ontouchstart"in window||"msmaxtouchpoints"in window.navigator;String.prototype.commafy=function(){return this.replace(/(^|[^\w.])(\d{4,})/g,function(e,t,n){return t+n.replace(/\d(?=(?:\d\d\d)+(?!\d))/g,"$&,")})};Number.prototype.commafy=function(){return String(this).commafy()};if(o){console.log("WARNING: nonsecure domain = test mode.");e("body").prepend('<div class="insecure-warning">non-secure domain, using test mode.</div>')}e.wait=function(t){return e.Deferred(function(e){setTimeout(e.resolve,t)})};e.Topic=function(t){var n,r=t&&i[t];if(!r){n=e.Callbacks();r={publish:n.fire,subscribe:n.add,unsubscribe:n.remove};t&&(i[t]=r)}return r};var f=f||{};(function(e){"use strict";e.fn.extend({quickDonate:function(t){function w(){i.addClass("qd_loading");var t=e.ajax({url:s.indexOf("noquickd")>-1&&a?"/":f.settings.tokenRequestPath,converters:{"text json":jQuery.parseJSON},type:"GET",dataType:"json"});return t}function E(){var e=w();e.always(function(t){f.tokenRequest=t;f.settings.responseHandler(e,t)})}function S(t){return t.pipe(function(t){return t.error?e.Deferred().reject(t):t},function(t){return e.Deferred().reject(t)})}function x(){return S(e.ajax({url:"/page/spud?type=getm&field=email,firstname,lastname,addr1,city,state_cd,zip,phone&jsonp=?",dataType:"jsonp"}))}function T(){return S(e.ajax({url:"https://my.democrats.org/page/graph/me?callback=?&jsoncallback=?",dataType:"jsonp"}))}var n=e(this),i=n.add(e("body")),u=n.find(".bsdcd-form ").eq(0),a=!0,l=!1,c=["firstname","lastname","email","zip","phone","country","addr1","addr2","city","state_cd","occupation","employer"],h=["cc_number","cc_expir_month","cc_expir_year"],p,d,v,m,g,y,b;f.settings=f.settings||{};y=function(t){t=typeof t=="object"?t:{};e.each(c,function(e,n){var r=u.find('[name="'+n+'"]'),i=t[n]||null;i&&r.val(i).removeClass("placeholder").addClass("prefilled")})};b=function(){i.removeClass("qd_loading").addClass(l?" qd_not_enabled":" qd_load_failed");e.Topic("qd-status").publish(!1);a&&x().always(function(e){y(e)})};m=function(t,n){if(t.status===200&&n)if(typeof n.enabled=="boolean"&&typeof n.token=="string"&&typeof n.token_info=="object"&&typeof n.token_info.account_last_four=="string"&&typeof n.token_info.cc_type_cd=="string"&&typeof n.token_info.cc_expir_month=="string"&&typeof n.token_info.cc_expir_year=="string"&&typeof n.token_info.firstname=="string"&&typeof n.token_info.lastname=="string"&&typeof n.token_info.addr1=="string"&&typeof n.token_info.addr2=="string"&&typeof n.token_info.city=="string"&&typeof n.token_info.state_cd=="string"&&typeof n.token_info.zip=="string"&&typeof n.token_info.country=="string"&&typeof n.token_info.email=="string"&&typeof n.token_info.phone=="string"&&typeof n.token_info.employer=="string"&&typeof n.token_info.occupation=="string"){f.settings.debug===!0&&console.log("properties in response object are all the correct type");if(n.enabled){u.find("[name='quick_donate_populated']").val(n.token);n.token_info.cc_type_cd==="ax"?e("[name='cc_number']").val("XXXXXXXXXXX"+n.token_info.account_last_four):e("[name='cc_number']").val("XXXXXXXXXXXX"+n.token_info.account_last_four);u.find("[value='"+n.token_info.cc_type_cd+"']").prop("checked",!0);n.token_info.cc_expir_month.length===1?u.find("[name='cc_expir_month']").val("0"+n.token_info.cc_expir_month):u.find("[name='cc_expir_month']").val(n.token_info.cc_expir_month);n.token_info.cc_start_month&&n.token_info.cc_start_month.length===1?u.find("[name='cc_start_month']").val("0"+n.token_info.cc_start_month):u.find("[name='cc_start_month']").val(n.token_info.cc_start_month);n.token_info.cc_start_month&&u.find("[name='cc_start_year']").val(n.token_info.cc_start_year);u.find("[name='cc_expir_year']").val(n.token_info.cc_expir_year);u.find("[name='firstname']").val(n.token_info.firstname);u.find("[name='lastname']").val(n.token_info.lastname);u.find("[name='addr1']").val(n.token_info.addr1);u.find("[name='addr2']").val(n.token_info.addr2);u.find("[name='city']").val(n.token_info.city);u.find("[name='zip']").val(n.token_info.zip);u.find("[name='country']").val(n.token_info.country).change();u.find("[name='email']").val(n.token_info.email);u.find("[name='phone']").val(n.token_info.phone);u.find("[name='employer']").val(n.token_info.employer);u.find("[name=occupation]").val(n.token_info.occupation);u.find("[name='state_cd']").val(n.token_info.state_cd);u.find("[name='quick_donate_populated']").val(n.token);e(f.settings.nameElement).text(n.token_info.firstname+" "+n.token_info.lastname);e(f.settings.addrElement).text(n.token_info.addr1+" "+n.token_info.addr2);e(f.settings.locElement).text(n.token_info.city+" "+n.token_info.state_cd+" "+n.token_info.zip+" "+n.token_info.country);f.cvvHolder=u.removeClass("cvv-input").find("#cc_cvv_cont").detach();n.token_info.cc_type_cd==="vs"?d="Visa":n.token_info.cc_type_cd==="mc"?d="MasterCard":n.token_info.cc_type_cd==="ax"?d="American Express":n.token_info.cc_type_cd==="dc"&&(d="DiscoverCard");e(f.settings.ccTypeElement).text(d);n.token_info.cc_type_cd==="ax"?v="**** ****** *"+n.token_info.account_last_four:v="**** **** **** "+n.token_info.account_last_four;e(f.settings.ccNumberElement).text(v);i.addClass("qd_populated").removeClass("qd_loading qd_load_failed");window.location.hash.indexOf("noquickd")>-1&&(window.location.hash="");r(["Quick Donate","populated",!0],"quick_donate_populated");e.Topic("data-update").publish("qd_populated");e.Topic("qd-status").publish(!0);e.Topic("change-step").publish(e(".sequential_breadcrumb_amount").hasClass("completed")?2:0)}else b()}else{f.settings.debug===!0&&console.log("properties in response object are not the correct type");b()}else{f.settings.debug===!0&&console.log("something was wrong with the response object",t,f.tokenRequest);b()}typeof f.settings.callback=="function"&&f.settings.callback();a=!1};g=function(t,n,s){typeof t=="object"&&t.preventDefault();s||r(["Quick Donate","cleared",n],"quick_donate_cleared_"+n);if(n==="nuclear"){e.each(c.concat(h),function(e,t){u.find('[name="'+t+'"]').val("")});e(".sequential_breadcrumb_name, .sequential_breadcrumb_payment").removeClass("completed");e.ajax({dataType:"jsonp",jsonp:"jsonp",url:"/page/user/logout",timeout:8e3}).done(function(e){i.addClass("qd_load_failed")}).fail(function(){if(o){window.location.hash="noquickd";window.location.reload()}})}else{i.addClass("qd_cleared");e.each(h,function(e,t){u.find('[name="'+t+'"]').val("")});e(".sequential_breadcrumb_payment").removeClass("completed")}e.Topic("qd-status").publish(!1);i.removeClass("qd_populated");u.find("[name='quick_donate_populated']").val("");u.find("[name='cc_type_cd']").filter(":checked").prop("checked",!1);f.cvvHolder&&f.cvvHolder.length&&u.addClass("cvv-input").find("#cc_expiration_cont").after(f.cvvHolder);e.Topic("change-step").publish(1,!0);e.Topic("data-update").publish("qd_cleared")};p={tokenRequestPath:"/ctl/Contribution/Quick/GetToken",nuclearElement:"#qd_nuclear",differentInfoElement:"#qd_clear_info",nameElement:"#qd_name",addrElement:"#qd_address",locElement:"#qd_location",ccTypeElement:"#qd_cc_type",ccNumberElement:"#qd_cc_number",clearInfo:g,responseHandler:m};f.settings=e.extend(!0,p,t);E();f.tryToken=E;e(f.settings.nuclearElement).click(function(e){f.settings.clearInfo(e,"nuclear")});e(f.settings.differentInfoElement).click(function(e){f.settings.clearInfo(e,"reveal")});e(".qd-log-in-link").click(function(e){e.preventDefault();window.open("/ctl/Contribution/Quick/Login","quickDonateLogin","status=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=0,width=550,height=350")});e(".qd-log-out-link").click(function(e){e.preventDefault();f.settings.clearInfo(e,"nuclear")});e.Topic("bsd-validation-update").subscribe(function(e,t){!e&&!t&&f.settings.clearInfo(0,"reveal",!0)});window.bQuery=window.bQuery||jQuery;window.bQuery.bsd=window.bQuery.bsd||{};window.bQuery.bsd.quickDonate=function(){l=!0;f.tryToken()};return this}})})(jQuery);(function(e){e.fn.extend({detectCCType:function(t){function g(){var e=l.val(),t=[];n.removeClass("cc-is-vs cc-is-ax cc-is-ds cc-is-mc cc-is-ma cc-is-qd cc-cover");if(!m.test(e)){i.prop("checked",!1);c.test(e)?t=s:h.test(e)?t=o:p.test(e)?t=u:d.test(e)?t=a:v.test(e)&&(t=f);if(t.length){t.prop("checked",!0);n.addClass("cc-cover cc-is-"+t.val())}}else n.addClass("cc-is-qd")}var n=e(this).find("form"),r=n.find(".cc_type_cont"),i=n.find("[name='cc_type_cd']"),s=i.filter("[value='vs']"),o=i.filter("[value='ax']"),u=i.filter("[value='ds']"),a=i.filter("[value='mc']"),f=i.filter("[value='ma']"),l=n.find('[name="cc_number"]'),c=/^4/,h=/^3[47]/,p=/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,d=/^5[1-5]/,v=/^(5018|5020|5038|6304|6759|676[1-3])/,m=/^x/i;e.Topic&&e.Topic("data-update").subscribe(g);l.on("keyup change",function(){setTimeout(g,0)});l.on("paste",function(){setTimeout(g,0)});n.addClass("cc-type-detection-active");return this}})})(jQuery);var l={};(function(e){"use strict";e.fn.serializeObject=function(){var t={},n=this.serializeArray();e.each(n,function(){if(t[this.name]!==undefined){t[this.name].push||(t[this.name]=[t[this.name]]);t[this.name].push(this.value||"")}else t[this.name]=this.value||""});return t};e.fn.extend({blueContribute:function(t){var i=e(this),s=e("body"),u=!1,a=i.find('[name="source_codes"]'),f=a.val(),c=i.find(".bsdcd-general_error"),h=n("source")||n("fb_ref"),p=n("subsource"),d=i.find("[name='slug']"),v=document.title,m=!1,g={unknown:"We were unable to process your transaction at this time.",invalid:"Your donation was not successful. Please correct the problems marked below.",declined:"The transaction was declined. Please check that the address information is correct or else use a different card.",review:"Your transaction is under review, there is no need to resubmit at this time."},y,b,w,E,S,x;if(h||p){p&&(h=h?h+","+p:p);a.val(f?f+","+h:h)}y=function(e){l.settings.debug&&typeof console=="object"&&window.console.log(e)};E=function(){return!0};S=function(t){var n=1,r=["Processing",".Processing.","..Processing..","...Processing..."],i=r.length;m=t;if(t){s.addClass("blue_contribute_processing");(function o(){e.wait(400).then(function(){document.title=r[n%i]+" | "+v;if(m){n++;o()}else document.title=v})})()}else s.removeClass("blue_contribute_processing")};x=function(e){c.text(e).removeClass("hidden")};b=function(t){var a=!1,f,h;if(l.latestResponseObject){y("removing previous errors");y(l.latestResponseObject.field_errors);if(e.isArray(l.latestResponseObject.field_errors)){if(l.latestResponseObject.field_errors.length>0)for(f=0;f<=l.latestResponseObject.field_errors.length-1;f++){y("reseting "+l.latestResponseObject.field_errors[f].field);i.find("."+l.latestResponseObject.field_errors[f].field+"_error").text("").addClass("hidden");i.find("."+l.latestResponseObject.field_errors[f].field+"_related").removeClass("bsdcd-error");c.text("").addClass("hidden");s.removeClass("blue_contribute_error")}}else y("no field errors on the latest repsonse object")}else y("this is the first submission");var p=!1;if(t&&!t.api_version)try{l.latestResponseObject=jQuery.parseJSON(t.responseText)||t;p=!0}catch(d){p=!1;y("api response body invalid")}else{l.latestResponseObject=t;p=!0}h=l.latestResponseObject;if(p===!0&&h){if(!h.status||h.status!=="success"&&h.status!=="paypal"){y("response was not a success status code");if(h.code==="noslug"||h.code==="invalidslug")x(g.unknown+" [No slug]");else if(h.code==="validation"){y("validation error");r(["Donate API","Validation Errors",l.latestResponseObject.field_errors.length],"donate_api_valiation_error");if(h.field_errors&&e.isArray(h.field_errors)&&h.field_errors.length>0){y(h.field_errors);h.field_errors.length===1&&h.field_errors[0].field==="amount_group"&&(a=!0);for(f=0;f<=h.field_errors.length-1;f++){i.find("."+h.field_errors[f].field+"_error").text(h.field_errors[f].message).removeClass("hidden");i.find("."+h.field_errors[f].field+"_related").addClass("bsdcd-error").removeClass("hidden")}x(g.invalid)}else{y("invalid field_errors property in the donate api");x(g.unknown+" [Invalid Validaiton Repsonse]")}}else if(h.code==="gateway"){y("gateway rejected the transaction");if(h.gateway_response&&h.gateway_response.status==="decline"){x(g.declined);y("bank declined");r(["Donate API","Gateway Error",h.gateway_response.status],"donate_api_gateway_error")}else if(h.gateway_response&&h.gateway_response.status==="review"){x(g.review+" [Gateway]");y("transaction under review");r(["Donate API","Gateway Error","review"],"donate_api_gateway_error")}else{x(g.unknown+" [Gateway]");y("unknown error gateway error");r(["Donate API","Unknown Gateway Error","unknown or malformed"],"donate_api_gateway_error")}}else{x(g.unknown+" [Code: "+(h.code?h.code:"unknown")+"]");y("truly unknown error from donate api");r(["Donate API","Unknown Error",h.code?h.code:"unknown"],"donate_api_gateway_error")}s.addClass("blue_contribute_error");S(!1);u=!1;e.Topic&&e.Topic("bsd-validation-update").publish(!1,a);window.scrollTo(0,0)}else if(typeof l.settings.customSuccess=="function"){S(!1);l.settings.customSuccess(h)}else if(!n("debug")||!o)window.location=h.redirect_url}else{u=!1;s.addClass("blue_contribute_error");S(!1);e.Topic&&e.Topic("bsd-validation-update").publish(!1,a);y("donate api response not parsable");x(g.unknown+" [API DOWN]")}typeof l.settings.afterPost=="function"&&l.settings.afterPost()};w={debug:!1,postTo:"/page/cde/Api/Charge/v1",beforePost:E,responseHandler:b,customSuccess:null,postdelay:0,slug:i.data("slug")||"default",recurSlug:i.data("recur-slug")||!1};l.settings=e.extend(!0,w,t);l.settings.recurSlug?i.on("click","[name='recurring_acknowledge']",function(e){d.val()===l.settings.slug?d.val(l.settings.recurSlug):d.val(l.settings.slug)}):i.find("[name='recurring_acknowledge']").closest("li").remove();l.submitForm=function(){y("form submit attempt");var t=!0,n;typeof l.settings.beforePost=="function"&&(t=l.settings.beforePost());if(t&&!u){u=!0;S(!0);e.wait(l.settings.postdelay).then(function(){n=e.ajax({url:l.settings.postTo,type:o?"GET":"POST",dataType:"json",converters:{"text json":jQuery.parseJSON},timeout:3e4,data:i.serializeObject()}).always(b);o&&console.log("non-secure domain, transaction results simulated")})}else y("double submission detected")};i.submit(function(e){l.submitForm();e.preventDefault()});typeof l.settings.afterInit=="function"&&l.settings.afterInit();return this}})})(jQuery);(function(e){function N(t){if(!t||typeof t!="string")return!1;var n=t.split("x"),r=0;n&&n.length&&e.each(n,function(e,t){var n=parseFloat(t);if(n&&i.eq(r).length&&n>=b&&n<=w){i.eq(r).html(E+n.commafy());s.eq(r).val(n);r++}})}function C(e){var t=f.val(),n=l.hide().find(".state_cd");if(t==="US"){if(!n.is("select")){n.remove();l.append(m.val(""))}r.removeClass("state-text-input");c.html("State<span>*</span>");v.html("ZIP<span>*</span>");y="US"}else{if(n.is("select")){n.remove();l.append(g.val(""))}r.addClass("state-text-input");c.html(t==="GB"?"County<span>*</span>":"State/Region/Province<span>*</span>");v.html("Postal Code<span>*</span>");y=t==="GB"?"GB":"INT"}l.show()}var t=e("#bsd_contribute_cont")||e("body"),r=t.find("form"),i=r.find(".preset_amount_label"),s=r.find(".preset_amount_input"),o=r.find(".amount_other"),a=r.find(".other_amount_radio"),f=r.find(".country"),l=r.find(".state_cd_cont").eq(0),c=l.find("label"),h=l.find("input,select").eq(0),p=h.attr("id"),d=h.attr("tabindex"),v=r.find("label.zip_related"),m=t.find(".us-state-dropdown").eq(0).clone().val("").addClass("state_cd").removeClass("hidden").attr("name","state_cd").attr("id",p).attr("tabindex",d),g=e("<input/>",{type:"text",name:"state_cd",id:p,"class":"text state_cd",tabindex:d}),y=r.data("default-country"),b=parseFloat(r.data("min-donation"))||0,w=parseFloat(r.data("max-donation"))||Infinity,E=e("[data-currency-symbol]").data("currency-symbol")||"$",S=n("amounts"),x=n("default_amt"),T=parseFloat(n("skip"))||!1;console.log(T);e(".other_amount_label").hide();r.find('[name="http_referrer"]').val(document.referrer);if(u){e("<input/>",{type:"hidden",name:"nomin",value:"1"}).appendTo(r);b=.01}window.BSDcustomAmounts=N;N(S);if(x&&parseFloat(x)&&s.filter(function(){return e(this).val()===x}).length>0){s.filter(function(){return e(this).val()===x}).eq(0).next("label").click();T&&T===1&&e.wait(3).done(function(){e.Topic("change-step").publish(1);console.log("skip")})}r.find(".honoree-select").on("change",function(){var t=e(this),n=t.val();r.removeClass("honor-section memorial-section");n==="1"?r.addClass("honor-section memorial-section"):n==="0"&&r.addClass("honor-section")});r.on("click",".preset_amount_label",function(t){var n=e(this);i.removeClass("active");n.addClass("active");o.val("");n.prev().prop("checked",!0)}).on("keydown",".amount_other",function(){i.removeClass("active");s.each(function(){e(this).prop("checked",!1)});a.prop("checked",!0)}).one("keydown",".amount_other",function(){t.removeClass("pre-first-click")}).one("click",".preset_amount_label",function(){e("body").find(".pre-first-click").length&&e.Topic("change-step").publish(1);t.removeClass("pre-first-click")});f.on("change",function(){C()})})(jQuery)})(jQuery,window);