/*------------------------------
 * Copyright 2014 Pixelized
 * http://www.pixelized.cz
 *
 * Freelancer theme v1.0
------------------------------*/

$(window).scroll(function(){
	if($(window).scrollTop() > 600) {
		$('.navbar-default').fadeIn(300);
	}
	else {
		$('.navbar-default').fadeOut(300);
	}
	
	if($(window).width() > 767) {
		if ($(this).scrollTop() > 600) {
			$('.scroll-up').fadeIn(300);
		} else {
			$('.scroll-up').fadeOut(300);
		}		
	}
});

$(document).ready(function() {	

	$("a.scroll[href^='#']").on('click', function(e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({ scrollTop: $(this.hash).offset().top}, 1000, function(){window.location.hash = hash;});
	});
	
	$('#skills-toggle').click(function() {
        $('#skills').slideToggle(500);
		$('.chart').easyPieChart({
			barColor: '#1ABC9C',
			trackColor: '#2F4254',
			scaleColor: false,
			lineCap: 'butt',
			lineWidth: 12,
			size:110,
			animate: 2000
		});
    });
	
	$('#overlay-hide').click(function() {
		$('#reference .reference-overlay').animate({opacity:0},1000);
		$('#reference-text').animate({opacity:0},1000);
	});
		
	$('.overlay-wrapper').mouseenter(function() {
		$(this).find('.overlay a:first-child').addClass('animated slideInLeft');
		$(this).find('.overlay a:last-child').addClass('animated slideInRight');
    });
	
	$('.overlay-wrapper').mouseleave(function() {
		$(this).find('.overlay a:first-child').removeClass('animated slideInLeft');
		$(this).find('.overlay a:last-child').removeClass('animated slideInRight');
    });
	
	$('.carousel').mouseenter(function() {
		$('.carousel-control').fadeIn(300);
	});
	
	$('.carousel').mouseleave(function() {
		$('.carousel-control').fadeOut(300);
	});
	
	if($(window).width() > 767) {
		$('.service').mouseenter(function(e) {
			$(this).find('img').animate({paddingBottom: "15px"},500);
		});
		
		$('.service').mouseleave(function(e) {
			$(this).find('img').stop().animate({paddingBottom: "0px"},500);
		});
	}
	
	if($(window).width() > 767) {
		$('.scrollpoint.sp-effect1').waypoint(function(){$(this).toggleClass('active');$(this).toggleClass('animated fadeInLeft');},{offset:'90%'});
		$('.scrollpoint.sp-effect2').waypoint(function(){$(this).toggleClass('active');$(this).toggleClass('animated fadeInRight');},{offset:'90%'});
		$('.scrollpoint.sp-effect3').waypoint(function(){$(this).toggleClass('active');$(this).toggleClass('animated fadeInDown');},{offset:'90%'});
		$('.scrollpoint.sp-effect4').waypoint(function(){$(this).toggleClass('active');$(this).toggleClass('animated fadeIn');},{offset:'60%'});
		
		$('.macbook-inner').waypoint(function(){$(this).toggleClass('active');$(this).toggleClass('black');},{offset:'60%'});
	}
});

/*!
* bootstrap-lightbox.js v0.6.1 
* Copyright 2013 Jason Butz
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function ($) {
	"use strict";


/* LIGHTBOX CLASS DEFINITION
 * ========================= */

	var Lightbox = function (element, options)
	{
		this.options = options;
		this.$element = $(element)
			.delegate('[data-dismiss="lightbox"]', 'click.dismiss.lightbox', $.proxy(this.hide, this));

		this.options.remote && this.$element.find('.lightbox-body').load(this.options.remote);

	}

	// We depend upon Twitter Bootstrap's Modal library to simplify things here
	Lightbox.prototype = $.extend({},$.fn.modal.Constructor.prototype);

	Lightbox.prototype.constructor = Lightbox;

	// We can't use Modal for this, it depends upon a class
	Lightbox.prototype.enforceFocus = function ()
	{
		var that = this;
		$(document).on('focusin.lightbox', function (e)
		{
			if (that.$element[0] !== e.target && !that.$element.has(e.target).length)
			{
				that.$element.focus();
			}
		});
	};

	// We have to have a copy of this since we are tweaking it a bit
	Lightbox.prototype.show = function()
	{
		var that = this,
			e    = $.Event('show');
	
		this.$element.trigger(e);
	
		if (this.isShown || e.isDefaultPrevented()) return;
	
		this.isShown = true;
	

		this.escape();
	
		// This bit is added since we don't display until we have the size
		//	which prevents image jumping
		this.preloadSize(function()
		{
			that.backdrop(function ()
			{
				var transition = $.support.transition && that.$element.hasClass('fade');
		
				if (!that.$element.parent().length)
				{
					that.$element.appendTo(document.body); //don't move modals dom position
				}
		
				that.$element.show();
		
				if (transition)
				{
					that.$element[0].offsetWidth; // force reflow
				}
		
				that.$element
					.addClass('in')
					.attr('aria-hidden', false);
		
				that.enforceFocus();
		
				transition ?
					that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
					that.$element.focus().trigger('shown');
			});
		});
	};

	// We have to have this because of a class in it
	Lightbox.prototype.hide = function (e)
	{
        e && e.preventDefault();

        var that = this;

        e = $.Event('hide');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        this.escape();

        $(document).off('focusin.lightbox');

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true);

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal();
    };

    // This references a class as well
    Lightbox.prototype.escape = function()
	{
		var that = this;
		if (this.isShown && this.options.keyboard)
		{
			this.$element.on('keyup.dismiss.lightbox', function ( e )
			{
				e.which == 27 && that.hide();
			});
		}
		else if (!this.isShown)
		{
			this.$element.off('keyup.dismiss.lightbox');
		}
	}

	Lightbox.prototype.preloadSize = function(callback)
	{
		var callbacks = $.Callbacks();
		if(callback) callbacks.add( callback );
		var that = this;

		var windowHeight,
			windowWidth,
			padTop,
			padBottom,
			padLeft,
			padRight,
			$image,
			preloader,
			originalWidth,
			originalHeight;
		// Get the window width and height.
		windowHeight = $(window).height();
		windowWidth  = $(window).width();

		// Get the top, bottom, right, and left padding
		padTop    = parseInt( that.$element.find('.lightbox-content').css('padding-top')    , 10);
		padBottom = parseInt( that.$element.find('.lightbox-content').css('padding-bottom') , 10);
		padLeft   = parseInt( that.$element.find('.lightbox-content').css('padding-left')   , 10);
		padRight  = parseInt( that.$element.find('.lightbox-content').css('padding-right')  , 10);

		// Load the image, we have to do this because if the image isn't already loaded we get a bad size
		$image    = that.$element.find('.lightbox-content').find('img:first');
		preloader = new Image();
		preloader.onload = function()
		{
			//$image.width = preloader.width;
			//$image.height = preloader.height;
			//return _this.sizeContainer(preloader.width, preloader.height);

			// The image could be bigger than the window, that is an issue.
			if( (preloader.width + padLeft + padRight) >= windowWidth)
			{
				originalWidth = preloader.width;
				originalHeight = preloader.height;
				preloader.width = windowWidth - padLeft - padRight;
				preloader.height = originalHeight / originalWidth * preloader.width;
			}

			if( (preloader.height + padTop + padBottom) >= windowHeight)
			{
				originalWidth = preloader.width;
				originalHeight = preloader.height;
				preloader.height = windowHeight - padTop - padBottom;
				preloader.width = originalWidth / originalHeight * preloader.height;
			}

			that.$element.css({
				'position': 'fixed',
				'width': preloader.width + padLeft + padRight,
				'height': preloader.height + padTop + padBottom,
				'top' : (windowHeight / 2) - ( (preloader.height + padTop + padBottom) / 2),
				'left' : '50%',
				'margin-left' : -1 * (preloader.width + padLeft + padRight) / 2
			});
			that.$element.find('.lightbox-content').css({
				'width': preloader.width,
				'height': preloader.height
			});

			// We have everything sized!
			callbacks.fire();
		};
		preloader.src = $image.attr('src');
	};

/* LIGHTBOX PLUGIN DEFINITION
 * ======================= */

	var old = $.fn.lightbox;

	$.fn.lightbox = function (option)
	{
		return this.each(function ()
		{
			var $this   = $(this);
			var data    = $this.data('lightbox');
			var options = $.extend({}, $.fn.lightbox.defaults, $this.data(), typeof option == 'object' && option);
			if (!data) $this.data('lightbox', (data = new Lightbox(this, options)));

			if (typeof option == 'string')
				data[option]();
			else if (options.show)
				data.show();
		});
	};

	$.fn.lightbox.defaults = {
		backdrop: true,
		keyboard: true,
		show: true
	};

	$.fn.lightbox.Constructor = Lightbox;

/* LIGHTBOX NO CONFLICT
  * ================= */

  $.fn.lightbox.noConflict = function () {
	$.fn.lightbox = old;
	return this;
  }


/* LIGHTBOX DATA-API
 * ================== */

	$(document).on('click.lightbox.data-api', '[data-toggle*="lightbox"]', function (e)
	{
		var $this = $(this);
		var href  = $this.attr('href');
		var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); //strip for ie7
		var option = $target.data('lightbox') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data());

		e.preventDefault();

		$target
			.lightbox(option)
			.one('hide', function () 
			{
				$this.focus();
			});
	})

}(window.jQuery);

$('#myLightbox').lightbox(options)

/*!
* bootstrap-lightbox.js v0.6.1 
* Copyright 2013 Jason Butz
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="lightbox"]',"click.dismiss.lightbox",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".lightbox-body").load(this.options.remote)};t.prototype=e.extend({},e.fn.modal.Constructor.prototype),t.prototype.constructor=t,t.prototype.enforceFocus=function(){var t=this;e(document).on("focusin.lightbox",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},t.prototype.show=function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;this.isShown=!0,this.escape(),this.preloadSize(function(){t.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.focus().trigger("shown")}):t.$element.focus().trigger("shown")})})},t.prototype.hide=function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,this.escape(),e(document).off("focusin.lightbox"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},t.prototype.escape=function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.lightbox",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.lightbox")},t.prototype.preloadSize=function(t){var n=e.Callbacks();t&&n.add(t);var r=this,i,s,o,u,a,f,l,c,h,p;i=e(window).height(),s=e(window).width(),o=parseInt(r.$element.find(".lightbox-content").css("padding-top"),10),u=parseInt(r.$element.find(".lightbox-content").css("padding-bottom"),10),a=parseInt(r.$element.find(".lightbox-content").css("padding-left"),10),f=parseInt(r.$element.find(".lightbox-content").css("padding-right"),10),l=r.$element.find(".lightbox-content").find("img:first"),c=new Image,c.onload=function(){c.width+a+f>=s&&(h=c.width,p=c.height,c.width=s-a-f,c.height=p/h*c.width),c.height+o+u>=i&&(h=c.width,p=c.height,c.height=i-o-u,c.width=h/p*c.height),r.$element.css({position:"fixed",width:c.width+a+f,height:c.height+o+u,top:i/2-(c.height+o+u)/2,left:"50%","margin-left":-1*(c.width+a+f)/2}),r.$element.find(".lightbox-content").css({width:c.width,height:c.height}),n.fire()},c.src=l.attr("src")};var n=e.fn.lightbox;e.fn.lightbox=function(n){return this.each(function(){var r=e(this),i=r.data("lightbox"),s=e.extend({},e.fn.lightbox.defaults,r.data(),typeof n=="object"&&n);i||r.data("lightbox",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.lightbox.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.lightbox.Constructor=t,e.fn.lightbox.noConflict=function(){return e.fn.lightbox=n,this},e(document).on("click.lightbox.data-api",'[data-toggle*="lightbox"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("lightbox")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.lightbox(s).one("hide",function(){n.focus()})})}(window.jQuery);



/**
 * ----------------------------------------------------------------------
 * Webflow: Forms
 */
Webflow.define('forms', function ($, _) {
  'use strict';

  var api = {};
  var $doc = $(document);
  var $forms;
  var loc = window.location;
  var retro = window.XDomainRequest && !window.atob;
  var namespace = '.w-form';
  var siteId;
  var emailField = /e(\-)?mail/i;
  var emailValue = /^\S+@\S+$/;
  var alert = window.alert;

  // MailChimp domains: list-manage.com + mirrors
  var chimpRegex = /list-manage[1-9]?.com/i;

  api.ready = function () {
    // Init forms
    init();

    // Wire events
    listen && listen();
    listen = null;
  };

  api.preview = api.design = function () {
    init();
  };

  function init() {
    siteId = $('html').attr('data-wf-site');

    $forms = $(namespace + ' form');
    $forms.each(build);
  }

  function build(i, el) {
    // Store form state using namespace
    var $el = $(el);
    var data = $.data(el, namespace);
    if (!data) data = $.data(el, namespace, { form: $el }); // data.form

    reset(data);
    var wrap = $el.closest('div.w-form');
    data.done = wrap.find('> .w-form-done');
    data.fail = wrap.find('> .w-form-fail');

    var action = data.action = $el.attr('action');
    data.handler = null;
    data.redirect = $el.attr('data-redirect');

    // MailChimp form
    if (chimpRegex.test(action)) { data.handler = submitMailChimp; return; }

    // Custom form action
    if (action) return;

    // Webflow form
    if (siteId) { data.handler = submitWebflow; return; }

    // Alert for disconnected Webflow forms
    disconnected();
  }

  function listen() {
    // Handle form submission for Webflow forms
    $doc.on('submit', namespace + ' form', function(evt) {
      var data = $.data(this, namespace);
      if (data.handler) {
        data.evt = evt;
        data.handler(data);
      }
    });
  }

  // Reset data common to all submit handlers
  function reset(data) {
    var btn = data.btn = data.form.find(':input[type="submit"]');
    data.wait = data.btn.attr('data-wait') || null;
    data.success = false;
    btn.prop('disabled', false);
    data.label && btn.val(data.label);
  }

  // Disable submit button
  function disableBtn(data) {
    var btn = data.btn;
    var wait = data.wait;
    btn.prop('disabled', true);
    // Show wait text and store previous label
    if (wait) {
      data.label = btn.val();
      btn.val(wait);
    }
  }

  // Find form fields, validate, and set value pairs
  function findFields(form, result) {
    var status = null;
    result = result || {};

    // The ":input" selector is a jQuery shortcut to select all inputs, selects, textareas
    form.find(':input:not([type="submit"])').each(function(i, el) {
      var field = $(el);
      var type = field.attr('type');
      var name = field.attr('data-name') || field.attr('name') || ('Field ' + (i + 1));
      var value = field.val();

      if (type == 'checkbox') {
        value = field.is(':checked');
      } if (type == 'radio') {
        // Radio group value already processed
        if (result[name] === null || typeof result[name] == 'string') {
          return;
        }

        value = form.find('input[name="' + field.attr('name') + '"]:checked').val() || null;
      }

      if (typeof value == 'string') value = $.trim(value);
      result[name] = value;
      status = status || getStatus(field, name, value);
    });

    return status;
  }

  function getStatus(field, name, value) {
    var status = null;
    if (!field.attr('required')) return null;
    if (!value) status = 'Please fill out the required field: ' + name;
    else if (emailField.test(name) || emailField.test(field.attr('type'))) {
      if (!emailValue.test(value)) status = 'Please enter a valid email address for: ' + name;
    }
    return status;
  }

  // Submit form to Webflow
  function submitWebflow(data) {
    reset(data);

    var form = data.form;

    var payload = {
      name: form.attr('data-name') || form.attr('name') || 'Untitled Form',
      source: loc.href,
      test: Webflow.env(),
      fields: {}
    };

    preventDefault(data);

    // Find & populate all fields
    var status = findFields(form, payload.fields);
    if (status) return alert(status);

    // Disable submit button
    disableBtn(data);

    // Read site ID
    // NOTE: If this site is exported, the HTML tag must retain the data-wf-site attribute for forms to work
    if (!siteId) { afterSubmit(data); return; }
    var url = 'https://webflow.com/api/v1/form/' + siteId;

    // Work around same-protocol IE XDR limitation
    if (retro && url.indexOf('https://webflow.com') >= 0) {
      url = url.replace('https://webflow.com/', 'http://data.webflow.com/');
    }

    $.ajax({
      url: url,
      type: 'POST',
      data: payload,
      dataType: 'json',
      crossDomain: true
    }).done(function () {
      data.success = true;
      afterSubmit(data);
    }).fail(function () {
      afterSubmit(data);
    });
  }

  // Submit form to MailChimp
  function submitMailChimp(data) {
    reset(data);

    var form = data.form;
    var payload = {};

    // Skip Ajax submission if http/s mismatch, fallback to POST instead
    if (/^https/.test(loc.href) && !/^https/.test(data.action)) {
      form.attr('method', 'post');
      return;
    }

    preventDefault(data);

    // Find & populate all fields
    var status = findFields(form, payload);
    if (status) return alert(status);

    // Disable submit button
    disableBtn(data);

    // Use special format for MailChimp params
    var fullName;
    _.each(payload, function (value, key) {
      if (emailField.test(key)) payload.EMAIL = value;
      if (/^((full[ _-]?)?name)$/i.test(key)) fullName = value;
      if (/^(first[ _-]?name)$/i.test(key)) payload.FNAME = value;
      if (/^(last[ _-]?name)$/i.test(key)) payload.LNAME = value;
    });

    if (fullName && !payload.FNAME) {
      fullName = fullName.split(' ');
      payload.FNAME = fullName[0];
      payload.LNAME = payload.LNAME || fullName[1];
    }

    // Use the (undocumented) MailChimp jsonp api
    var url = data.action.replace('/post?', '/post-json?') + '&c=?';
    // Add special param to prevent bot signups
    var userId = url.indexOf('u=')+2;
    userId = url.substring(userId, url.indexOf('&', userId));
    var listId = url.indexOf('id=')+3;
    listId = url.substring(listId, url.indexOf('&', listId));
    payload['b_' + userId + '_' + listId] = '';

    $.ajax({
      url: url,
      data: payload,
      dataType: 'jsonp'
    }).done(function (resp) {
      data.success = (resp.result == 'success' || /already/.test(resp.msg));
      if (!data.success) console.info('MailChimp error: ' + resp.msg);
      afterSubmit(data);
    }).fail(function () {
      afterSubmit(data);
    });
  }

  // Common callback which runs after all Ajax submissions
  function afterSubmit(data) {
    var form = data.form;
    var wrap = form.closest('div.w-form');
    var redirect = data.redirect;
    var success = data.success;

    // Redirect to a success url if defined
    if (success && redirect) {
      Webflow.location(redirect);
      return;
    }

    // Show or hide status divs
    data.done.toggle(success);
    data.fail.toggle(!success);

    // Hide form on success
    form.toggle(!success);

    // Reset data and enable submit button
    reset(data);
  }

  function preventDefault(data) {
    data.evt && data.evt.preventDefault();
    data.evt = null;
  }

  var disconnected = _.debounce(function () {
    alert('Oops! This page has a form that is powered by Webflow, but important code was removed that is required to make the form work. Please contact support@webflow.com to fix this issue.');
  }, 100);

  // Export module
  return api;
});
