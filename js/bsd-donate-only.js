/*! 2014-11-13 */!function(a){window._gaq=window._gaq||[],window.optimizely=window.optimizely||[];{var b=function(a){a=a.replace(/(\[|\])/g,"\\$1");var b=new RegExp("[\\?&]"+a+"=([^&#]*)"),c=b.exec(window.location.href);return null===c?"":c[1]},c=function(a,b){window._gaq.push(["_trackEvent"].concat(a)),window.optimizely.push(["trackEvent"].concat(b))},d={},e=(window.location.hash.replace("#",""),-1===window.location.protocol.indexOf("s")),f="1"===b("nomin");!!("ontouchstart"in window)||!!("msmaxtouchpoints"in window.navigator)}String.prototype.commafy=function(){return this.replace(/(^|[^\w.])(\d{4,})/g,function(a,b,c){return b+c.replace(/\d(?=(?:\d\d\d)+(?!\d))/g,"$&,")})},Number.prototype.commafy=function(){return String(this).commafy()},e&&(console.log("WARNING: nonsecure domain = test mode."),a("body").prepend('<div class="insecure-warning">non-secure domain, using test mode.</div>')),a.wait=function(b){return a.Deferred(function(a){setTimeout(a.resolve,b)})},a.Topic=function(b){var c,e=b&&d[b];return e||(c=a.Callbacks(),e={publish:c.fire,subscribe:c.add,unsubscribe:c.remove},b&&(d[b]=e)),e},function(a){a.fn.extend({detectCCType:function(){function b(){var a=j.val(),b=[];c.removeClass("cc-is-vs cc-is-ax cc-is-ds cc-is-mc cc-is-ma cc-is-qd cc-cover"),p.test(a)?c.addClass("cc-is-qd"):(d.prop("checked",!1),k.test(a)?b=e:l.test(a)?b=f:m.test(a)?b=g:n.test(a)?b=h:o.test(a)&&(b=i),b.length&&(b.prop("checked",!0),c.addClass("cc-cover cc-is-"+b.val())))}var c=a(this).find("form"),d=(c.find(".cc_type_cont"),c.find("[name='cc_type_cd']")),e=d.filter("[value='vs']"),f=d.filter("[value='ax']"),g=d.filter("[value='ds']"),h=d.filter("[value='mc']"),i=d.filter("[value='ma']"),j=c.find('[name="cc_number"]'),k=/^4/,l=/^3[47]/,m=/^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,n=/^5[1-5]/,o=/^(5018|5020|5038|6304|6759|676[1-3])/,p=/^x/i;return a.Topic&&a.Topic("data-update").subscribe(b),j.on("keyup change",function(){setTimeout(b,0)}),j.on("paste",function(){setTimeout(b,0)}),c.addClass("cc-type-detection-active"),this}})}(jQuery);var g={};!function(a){"use strict";a.fn.serializeObject=function(){var b={},c=this.serializeArray();return a.each(c,function(){void 0!==b[this.name]?(b[this.name].push||(b[this.name]=[b[this.name]]),b[this.name].push(this.value||"")):b[this.name]=this.value||""}),b},a.fn.extend({blueContribute:function(d){var f,h,i,j,k,l,m=a(this),n=a("body"),o=!1,p=m.find('[name="source_codes"]'),q=p.val(),r=m.find(".bsdcd-general_error"),s=b("source")||b("fb_ref"),t=b("subsource"),u=m.find("[name='slug']"),v=document.title,w=!1,x={unknown:"We were unable to process your transaction at this time.",invalid:"Your donation was not successful. Please correct the problems marked below.",declined:"The transaction was declined. Please check that the address information is correct or else use a different card.",review:"Your transaction is under review, there is no need to resubmit at this time."};return(s||t)&&(t&&(s=s?s+","+t:t),p.val(q?q+","+s:s)),f=function(a){g.settings.debug&&"object"==typeof console&&window.console.log(a)},j=function(){return!0},k=function(b){var c=1,d=["Processing",".Processing.","..Processing..","...Processing..."],e=d.length;w=b,b?(n.addClass("blue_contribute_processing"),function f(){a.wait(400).then(function(){document.title=d[c%e]+" | "+v,w?(c++,f()):document.title=v})}()):n.removeClass("blue_contribute_processing")},l=function(a){r.text(a).removeClass("hidden")},h=function(d){var h,i,j=!1;if(g.latestResponseObject)if(f("removing previous errors"),f(g.latestResponseObject.field_errors),a.isArray(g.latestResponseObject.field_errors)){if(g.latestResponseObject.field_errors.length>0)for(h=0;h<=g.latestResponseObject.field_errors.length-1;h++)f("reseting "+g.latestResponseObject.field_errors[h].field),m.find("."+g.latestResponseObject.field_errors[h].field+"_error").text("").addClass("hidden"),m.find("."+g.latestResponseObject.field_errors[h].field+"_related").removeClass("bsdcd-error"),r.text("").addClass("hidden"),n.removeClass("blue_contribute_error")}else f("no field errors on the latest repsonse object");else f("this is the first submission");var p=!1;if(d&&!d.api_version)try{g.latestResponseObject=jQuery.parseJSON(d.responseText)||d,p=!0}catch(q){p=!1,f("api response body invalid")}else g.latestResponseObject=d,p=!0;if(i=g.latestResponseObject,p===!0&&i)if(!i.status||"success"!==i.status&&"paypal"!==i.status){if(f("response was not a success status code"),"noslug"===i.code||"invalidslug"===i.code)l(x.unknown+" [No slug]");else if("validation"===i.code)if(f("validation error"),c(["Donate API","Validation Errors",g.latestResponseObject.field_errors.length],"donate_api_valiation_error"),i.field_errors&&a.isArray(i.field_errors)&&i.field_errors.length>0){for(f(i.field_errors),1===i.field_errors.length&&"amount_group"===i.field_errors[0].field&&(j=!0),h=0;h<=i.field_errors.length-1;h++)m.find("."+i.field_errors[h].field+"_error").text(i.field_errors[h].message).removeClass("hidden"),m.find("."+i.field_errors[h].field+"_related").addClass("bsdcd-error").removeClass("hidden");l(x.invalid)}else f("invalid field_errors property in the donate api"),l(x.unknown+" [Invalid Validaiton Repsonse]");else"gateway"===i.code?(f("gateway rejected the transaction"),i.gateway_response&&"decline"===i.gateway_response.status?(l(x.declined),f("bank declined"),c(["Donate API","Gateway Error",i.gateway_response.status],"donate_api_gateway_error")):i.gateway_response&&"review"===i.gateway_response.status?(l(x.review+" [Gateway]"),f("transaction under review"),c(["Donate API","Gateway Error","review"],"donate_api_gateway_error")):(l(x.unknown+" [Gateway]"),f("unknown error gateway error"),c(["Donate API","Unknown Gateway Error","unknown or malformed"],"donate_api_gateway_error"))):(l(x.unknown+" [Code: "+(i.code?i.code:"unknown")+"]"),f("truly unknown error from donate api"),c(["Donate API","Unknown Error",i.code?i.code:"unknown"],"donate_api_gateway_error"));n.addClass("blue_contribute_error"),k(!1),o=!1,a.Topic&&a.Topic("bsd-validation-update").publish(!1,j),window.scrollTo(0,0)}else"function"==typeof g.settings.customSuccess?(k(!1),g.settings.customSuccess(i)):b("debug")&&e||(window.location=i.redirect_url);else o=!1,n.addClass("blue_contribute_error"),k(!1),a.Topic&&a.Topic("bsd-validation-update").publish(!1,j),f("donate api response not parsable"),l(x.unknown+" [API DOWN]");"function"==typeof g.settings.afterPost&&g.settings.afterPost()},i={debug:!1,postTo:"/page/cde/Api/Charge/v1",beforePost:j,responseHandler:h,customSuccess:null,postdelay:0,slug:m.data("slug")||"default",recurSlug:m.data("recur-slug")||!1},g.settings=a.extend(!0,i,d),g.settings.recurSlug?m.on("click","[name='recurring_acknowledge']",function(){u.val(u.val()===g.settings.slug?g.settings.recurSlug:g.settings.slug)}):m.find("[name='recurring_acknowledge']").closest("li").remove(),g.submitForm=function(){f("form submit attempt");var b=!0;"function"==typeof g.settings.beforePost&&(b=g.settings.beforePost()),b&&!o?(o=!0,k(!0),a.wait(g.settings.postdelay).then(function(){a.ajax({url:g.settings.postTo,type:e?"GET":"POST",dataType:"json",converters:{"text json":jQuery.parseJSON},timeout:3e4,data:m.serializeObject()}).always(h),e&&console.log("non-secure domain, transaction results simulated")})):f("double submission detected")},m.submit(function(a){g.submitForm(),a.preventDefault()}),"function"==typeof g.settings.afterInit&&g.settings.afterInit(),this}})}(jQuery),function(a){function c(b){if(!b||"string"!=typeof b)return!1;var c=b.split("x"),d=0;c&&c.length&&a.each(c,function(a,b){var c=parseFloat(b);c&&h.eq(d).length&&c>=v&&w>=c&&(h.eq(d).html(x+c.commafy()),i.eq(d).val(c),d++)})}function d(){var a=l.val(),b=m.hide().find(".state_cd");"US"===a?(b.is("select")||(b.remove(),m.append(s.val(""))),g.removeClass("state-text-input"),n.html("State<span>*</span>"),r.html("ZIP<span>*</span>"),u="US"):(b.is("select")&&(b.remove(),m.append(t.val(""))),g.addClass("state-text-input"),n.html("GB"===a?"County<span>*</span>":"State/Region/Province<span>*</span>"),r.html("Postal Code<span>*</span>"),u="GB"===a?"GB":"INT"),m.show()}var e=a(".bsdcd-outer-container")||a("body"),g=e.find("form"),h=g.find(".preset_amount_label"),i=g.find(".preset_amount_input"),j=g.find(".amount_other"),k=g.find(".other_amount_radio"),l=g.find(".country"),m=g.find(".state_cd_cont").eq(0),n=m.find("label"),o=m.find("input,select").eq(0),p=o.attr("id"),q=o.attr("tabindex"),r=g.find("label.zip_related"),s=e.find(".us-state-dropdown").eq(0).clone().val("").addClass("state_cd").attr("name","state_cd").attr("id",p).attr("tabindex",q),t=a("<input/>",{type:"text",name:"state_cd",id:p,"class":"text state_cd",tabindex:q}),u=g.data("default-country"),v=parseFloat(g.data("min-donation"))||.01,w=parseFloat(g.data("max-donation"))||1/0,x=a("[data-currency-symbol]").data("currency-symbol")||"$",y=b("amounts"),z=b("default_amt"),A=parseFloat(b("skip"))||!1;a(".other_amount_label").hide(),g.find('[name="http_referrer"]').val(document.referrer),f&&(a("<input/>",{type:"hidden",name:"nomin",value:"1"}).appendTo(g),v=.01),window.BSDcustomAmounts=c,c(y),g.on("click",".preset_amount_label",function(){var b=a(this);h.removeClass("active"),b.addClass("active"),j.val(""),b.prev().prop("checked",!0)}).on("keydown",".amount_other",function(){h.removeClass("active"),i.each(function(){a(this).prop("checked",!1)}),k.prop("checked",!0)}),z&&parseFloat(z)&&i.filter(function(){return a(this).val()===z}).length>0&&(i.filter(function(){return a(this).val()===z}).eq(0).next("label").click(),e.removeClass("pre-first-click"),A&&1===A&&a.wait(3).done(function(){a.Topic("change-step").publish(1)})),g.one("keydown",".amount_other",function(){e.removeClass("pre-first-click")}).one("click",".preset_amount_label,.preset_amount_input",function(){a("html").find(".pre-first-click").length&&a.Topic("change-step").publish(1),e.removeClass("pre-first-click")}),g.find(".honoree-select").on("change",function(){var b=a(this),c=b.val();g.removeClass("honor-section memorial-section"),"1"===c?g.addClass("honor-section memorial-section"):"0"===c&&g.addClass("honor-section")}),l.on("change",function(){d()})}(jQuery)}(jQuery,window);