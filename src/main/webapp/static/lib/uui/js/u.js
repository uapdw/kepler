/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.1'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.1'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.tooltip')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.tooltip', (data = {}))
        if (!data[selector]) data[selector] = new Tooltip(this, options)
      } else {
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.1'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.popover')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.popover', (data = {}))
        if (!data[selector]) data[selector] = new Popover(this, options)
      } else {
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/* =========================================================
 * bootstrap-datetimepicker.js
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 * Improvements by Sébastien Malot
 * Improvements by Yun Lai
 * Improvements by Kenneth Henderick
 * Project URL : http://www.malot.fr/bootstrap-datetimepicker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

/*
 * Improvement by CuGBabyBeaR @ 2013-09-12
 *
 * Make it work in bootstrap v3
 */

!function ($) {

	function UTCDate() {
		return new Date(Date.UTC.apply(Date, arguments));
	}

	function UTCToday() {
		var today = new Date();
		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), 0);
	}

	// Picker object

	var Datetimepicker = function (element, options) {
		var that = this;

		this.element = $(element);

		// add container for single page application
		// when page switch the datetimepicker div will be removed also.
		this.container = options.container || 'body';

		this.language = options.language || this.element.data('date-language') || "en";
		this.language = this.language in dates ? this.language : "en";
		this.isRTL = dates[this.language].rtl || false;
		this.formatType = options.formatType || this.element.data('format-type') || 'standard';
		this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
		this.isInline = false;
		this.isVisible = false;
		this.isInput = this.element.is('input');
		this.fontAwesome = options.fontAwesome || this.element.data('font-awesome') || false;

		this.bootcssVer = options.bootcssVer || (this.isInput ? (this.element.is('.form-control') ? 3 : 2) : ( this.bootcssVer = this.element.is('.input-group') ? 3 : 2 ));

		this.component = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-calendar, .input-group-addon .glyphicon-calendar, .input-group-addon .fa-calendar, .input-group-addon .fa-clock-o').parent() : this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar .fa-calendar .fa-clock-o').parent()) : false;
		this.componentReset = this.element.is('.date') ? ( this.bootcssVer == 3 ? this.element.find('.input-group-addon .glyphicon-remove .fa-times').parent() : this.element.find('.add-on .icon-remove .fa-times').parent()) : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0) {
			this.component = false;
		}
		this.linkField = options.linkField || this.element.data('link-field') || false;
		this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
		this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
		this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
		this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
		this.initialDate = options.initialDate || new Date();
		this.zIndex = options.zIndex || this.element.data('z-index') || undefined;

		this.icons = {
			leftArrow: this.fontAwesome ? 'fa-arrow-left' : (this.bootcssVer === 3 ? 'glyphicon-arrow-left' : 'icon-arrow-left'),
			rightArrow: this.fontAwesome ? 'fa-arrow-right' : (this.bootcssVer === 3 ? 'glyphicon-arrow-right' : 'icon-arrow-right')
		};
		this.icontype = this.fontAwesome ? 'fa' : 'glyphicon';

		this._attachEvents();

		this.formatViewType = "datetime";
		if ('formatViewType' in options) {
			this.formatViewType = options.formatViewType;
		} else if ('formatViewType' in this.element.data()) {
			this.formatViewType = this.element.data('formatViewType');
		}

		this.minView = 0;
		if ('minView' in options) {
			this.minView = options.minView;
		} else if ('minView' in this.element.data()) {
			this.minView = this.element.data('min-view');
		}
		this.minView = DPGlobal.convertViewMode(this.minView);

		this.maxView = DPGlobal.modes.length - 1;
		if ('maxView' in options) {
			this.maxView = options.maxView;
		} else if ('maxView' in this.element.data()) {
			this.maxView = this.element.data('max-view');
		}
		this.maxView = DPGlobal.convertViewMode(this.maxView);

		this.wheelViewModeNavigation = false;
		if ('wheelViewModeNavigation' in options) {
			this.wheelViewModeNavigation = options.wheelViewModeNavigation;
		} else if ('wheelViewModeNavigation' in this.element.data()) {
			this.wheelViewModeNavigation = this.element.data('view-mode-wheel-navigation');
		}

		this.wheelViewModeNavigationInverseDirection = false;

		if ('wheelViewModeNavigationInverseDirection' in options) {
			this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
		} else if ('wheelViewModeNavigationInverseDirection' in this.element.data()) {
			this.wheelViewModeNavigationInverseDirection = this.element.data('view-mode-wheel-navigation-inverse-dir');
		}

		this.wheelViewModeNavigationDelay = 100;
		if ('wheelViewModeNavigationDelay' in options) {
			this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
		} else if ('wheelViewModeNavigationDelay' in this.element.data()) {
			this.wheelViewModeNavigationDelay = this.element.data('view-mode-wheel-navigation-delay');
		}

		this.startViewMode = 2;
		if ('startView' in options) {
			this.startViewMode = options.startView;
		} else if ('startView' in this.element.data()) {
			this.startViewMode = this.element.data('start-view');
		}
		this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
		this.viewMode = this.startViewMode;

		this.viewSelect = this.minView;
		if ('viewSelect' in options) {
			this.viewSelect = options.viewSelect;
		} else if ('viewSelect' in this.element.data()) {
			this.viewSelect = this.element.data('view-select');
		}
		this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

		this.forceParse = true;
		if ('forceParse' in options) {
			this.forceParse = options.forceParse;
		} else if ('dateForceParse' in this.element.data()) {
			this.forceParse = this.element.data('date-force-parse');
		}
		var template = this.bootcssVer === 3 ? DPGlobal.templateV3 : DPGlobal.template;
		while (template.indexOf('{iconType}') !== -1) {
			template = template.replace('{iconType}', this.icontype);
		}
		while (template.indexOf('{leftArrow}') !== -1) {
			template = template.replace('{leftArrow}', this.icons.leftArrow);
		}
		while (template.indexOf('{rightArrow}') !== -1) {
			template = template.replace('{rightArrow}', this.icons.rightArrow);
		}
		this.picker = $(template)
			.appendTo(this.isInline ? this.element : this.container) // 'body')
			.on({
				click:     $.proxy(this.click, this),
				mousedown: $.proxy(this.mousedown, this)
			});

		if (this.wheelViewModeNavigation) {
			if ($.fn.mousewheel) {
				this.picker.on({mousewheel: $.proxy(this.mousewheel, this)});
			} else {
				console.log("Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option");
			}
		}

		if (this.isInline) {
			this.picker.addClass('datetimepicker-inline');
		} else {
			this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
		}
		if (this.isRTL) {
			this.picker.addClass('datetimepicker-rtl');
			var selector = this.bootcssVer === 3 ? '.prev span, .next span' : '.prev i, .next i';
			this.picker.find(selector).toggleClass(this.icons.leftArrow + ' ' + this.icons.rightArrow);
		}
		$(document).on('mousedown', function (e) {
			// Clicked outside the datetimepicker, hide it
			if ($(e.target).closest('.datetimepicker').length === 0) {
				that.hide();
			}
		});

		this.autoclose = false;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		this.keyboardNavigation = true;
		if ('keyboardNavigation' in options) {
			this.keyboardNavigation = options.keyboardNavigation;
		} else if ('dateKeyboardNavigation' in this.element.data()) {
			this.keyboardNavigation = this.element.data('date-keyboard-navigation');
		}

		this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
		this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

		this.weekStart = ((options.weekStart || this.element.data('date-weekstart') || dates[this.language].weekStart || 0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.daysOfWeekDisabled = [];
		this.setStartDate(options.startDate || this.element.data('date-startdate'));
		this.setEndDate(options.endDate || this.element.data('date-enddate'));
		this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
		this.setMinutesDisabled(options.minutesDisabled || this.element.data('date-minute-disabled'));
		this.setHoursDisabled(options.hoursDisabled || this.element.data('date-hour-disabled'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();

		if (this.isInline) {
			this.show();
		}
	};

	Datetimepicker.prototype = {
		constructor: Datetimepicker,

		_events:       [],
		_attachEvents: function () {
			this._detachEvents();
			if (this.isInput) { // single input
				this._events = [
					[this.element, {
						focus:   $.proxy(this.show, this),
						keyup:   $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput) { // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus:   $.proxy(this.show, this),
						keyup:   $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
				if (this.componentReset) {
					this._events.push([
						this.componentReset,
						{click: $.proxy(this.reset, this)}
					]);
				}
			}
			else if (this.element.is('div')) {  // inline datetimepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			for (var i = 0, el, ev; i < this._events.length; i++) {
				el = this._events[i][0];
				ev = this._events[i][1];
				el.on(ev);
			}
		},

		_detachEvents: function () {
			for (var i = 0, el, ev; i < this._events.length; i++) {
				el = this._events[i][0];
				ev = this._events[i][1];
				el.off(ev);
			}
			this._events = [];
		},

		show: function (e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			if (this.forceParse) {
				this.update();
			}
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.isVisible = true;
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		hide: function (e) {
			if (!this.isVisible) return;
			if (this.isInline) return;
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}

			if (
				this.forceParse &&
					(
						this.isInput && this.element.val() ||
							this.hasInput && this.element.find('input').val()
						)
				)
				this.setValue();
			this.isVisible = false;
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		remove: function () {
			this._detachEvents();
			this.picker.remove();
			delete this.picker;
			delete this.element.data().datetimepicker;
		},

		getDate: function () {
			var d = this.getUTCDate();
			return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
		},

		getUTCDate: function () {
			return this.date;
		},

		setDate: function (d) {
			this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)));
		},

		setUTCDate: function (d) {
			if (d >= this.startDate && d <= this.endDate) {
				this.date = d;
				this.setValue();
				this.viewDate = this.date;
				this.fill();
			} else {
				this.element.trigger({
					type:      'outOfRange',
					date:      d,
					startDate: this.startDate,
					endDate:   this.endDate
				});
			}
		},

		setFormat: function (format) {
			this.format = DPGlobal.parseFormat(format, this.formatType);
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}
			if (element && element.val()) {
				this.setValue();
			}
		},

		setValue: function () {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component) {
					this.element.find('input').val(formatted);
				}
				this.element.data('date', formatted);
			} else {
				this.element.val(formatted);
			}
			if (this.linkField) {
				$('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
			}
		},

		getFormattedDate: function (format) {
			if (format == undefined) format = this.format;
			return DPGlobal.formatDate(this.date, format, this.language, this.formatType);
		},

		setStartDate: function (startDate) {
			this.startDate = startDate || -Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function (endDate) {
			this.endDate = endDate || Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType);
			}
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
			this.daysOfWeekDisabled = daysOfWeekDisabled || [];
			if (!$.isArray(this.daysOfWeekDisabled)) {
				this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
			}
			this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		setMinutesDisabled: function (minutesDisabled) {
			this.minutesDisabled = minutesDisabled || [];
			if (!$.isArray(this.minutesDisabled)) {
				this.minutesDisabled = this.minutesDisabled.split(/,\s*/);
			}
			this.minutesDisabled = $.map(this.minutesDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		setHoursDisabled: function (hoursDisabled) {
			this.hoursDisabled = hoursDisabled || [];
			if (!$.isArray(this.hoursDisabled)) {
				this.hoursDisabled = this.hoursDisabled.split(/,\s*/);
			}
			this.hoursDisabled = $.map(this.hoursDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		place: function () {
			if (this.isInline) return;

			if (!this.zIndex) {
				var index_highest = 0;
				$('div').each(function () {
					var index_current = parseInt($(this).css("zIndex"), 10);
					if (index_current > index_highest) {
						index_highest = index_current;
					}
				});
				this.zIndex = index_highest + 10;
			}

			var offset, top, left, containerOffset;
			if (this.container instanceof $) {
				containerOffset = this.container.offset();
			} else {
				containerOffset = $(this.container).offset();
			}

			if (this.component) {
				offset = this.component.offset();
				left = offset.left;
				if (this.pickerPosition == 'bottom-left' || this.pickerPosition == 'top-left') {
					left += this.component.outerWidth() - this.picker.outerWidth();
				}
			} else {
				offset = this.element.offset();
				left = offset.left;
			}

			if(left+220 > document.body.clientWidth){
            			left = document.body.clientWidth-220;
          		}

			if (this.pickerPosition == 'top-left' || this.pickerPosition == 'top-right') {
				top = offset.top - this.picker.outerHeight();
			} else {
				top = offset.top + this.height;
			}

			top = top - containerOffset.top;
			left = left - containerOffset.left;
			
			top = top + document.body.scrollTop

			this.picker.css({
				top:    top,
				left:   left,
				zIndex: this.zIndex
			});
		},

		update: function () {
			var date, fromArgs = false;
			if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
				date = arguments[0];
				fromArgs = true;
			} else {
				date = (this.isInput ? this.element.val() : this.element.find('input').val()) || this.element.data('date') || this.initialDate;
				if (typeof date == 'string' || date instanceof String) {
				  date = date.replace(/^\s+|\s+$/g,'');
				}
			}

			if (!date) {
				date = new Date();
				fromArgs = false;
			}

			this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType);

			if (fromArgs) this.setValue();

			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function () {
			var dowCnt = this.weekStart,
				html = '<tr>';
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
			}
			html += '</tr>';
			this.picker.find('.datetimepicker-days thead').append(html);
		},

		fillMonths: function () {
			var html = '',
				i = 0;
			while (i < 12) {
				html += '<span class="month">' + dates[this.language].monthsShort[i++] + '</span>';
			}
			this.picker.find('.datetimepicker-months td').html(html);
		},

		fill: function () {
			if (this.date == null || this.viewDate == null) {
				return;
			}
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				dayMonth = d.getUTCDate(),
				hours = d.getUTCHours(),
				minutes = d.getUTCMinutes(),
				startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() + 1 : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() + 1 : Infinity,
				currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
				today = new Date();
			this.picker.find('.datetimepicker-days thead th:eq(1)')
				.text(dates[this.language].months[month] + ' ' + year);
			if (this.formatViewType == "time") {
				var formatted = this.getFormattedDate();
				this.picker.find('.datetimepicker-hours thead th:eq(1)').text(formatted);
				this.picker.find('.datetimepicker-minutes thead th:eq(1)').text(formatted);
			} else {
				this.picker.find('.datetimepicker-hours thead th:eq(1)')
					.text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
				this.picker.find('.datetimepicker-minutes thead th:eq(1)')
					.text(dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
			}
			this.picker.find('tfoot th.today')
				.text(dates[this.language].today)
				.toggle(this.todayBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			/*var prevMonth = UTCDate(year, month, 0,0,0,0,0);
			 prevMonth.setUTCDate(prevMonth.getDate() - (prevMonth.getUTCDay() - this.weekStart + 7)%7);*/
			var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.weekStart) {
					html.push('<tr>');
				}
				clsName = '';
				if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
					clsName += ' new';
				}
				// Compare internal UTC date with local today, not UTC today
				if (this.todayHighlight &&
					prevMonth.getUTCFullYear() == today.getFullYear() &&
					prevMonth.getUTCMonth() == today.getMonth() &&
					prevMonth.getUTCDate() == today.getDate()) {
					clsName += ' today';
				}
				if (prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
					$.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
					clsName += ' disabled';
				}
				html.push('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

			html = [];
			var txt = '', meridian = '', meridianOld = '';
			var hoursDisabled = this.hoursDisabled || [];
			for (var i = 0; i < 24; i++) {
				if (hoursDisabled.indexOf(i) !== -1) continue;
				var actual = UTCDate(year, month, dayMonth, i);
				clsName = '';
				// We want the previous hour for the startDate
				if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (hours == i) {
					clsName += ' active';
				}
				if (this.showMeridian && dates[this.language].meridiem.length == 2) {
					meridian = (i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
					if (meridian != meridianOld) {
						if (meridianOld != '') {
							html.push('</fieldset>');
						}
						html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + '</legend>');
					}
					meridianOld = meridian;
					txt = (i % 12 ? i % 12 : 12);
					html.push('<span class="hour' + clsName + ' hour_' + (i < 12 ? 'am' : 'pm') + '">' + txt + '</span>');
					if (i == 23) {
						html.push('</fieldset>');
					}
				} else {
					txt = i + ':00';
					html.push('<span class="hour' + clsName + '">' + txt + '</span>');
				}
			}
			this.picker.find('.datetimepicker-hours td').html(html.join(''));

			html = [];
			txt = '', meridian = '', meridianOld = '';
			var minutesDisabled = this.minutesDisabled || [];
			for (var i = 0; i < 60; i += this.minuteStep) {
				if (minutesDisabled.indexOf(i) !== -1) continue;
				var actual = UTCDate(year, month, dayMonth, hours, i, 0);
				clsName = '';
				if (actual.valueOf() < this.startDate || actual.valueOf() > this.endDate) {
					clsName += ' disabled';
				} else if (Math.floor(minutes / this.minuteStep) == Math.floor(i / this.minuteStep)) {
					clsName += ' active';
				}
				if (this.showMeridian && dates[this.language].meridiem.length == 2) {
					meridian = (hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
					if (meridian != meridianOld) {
						if (meridianOld != '') {
							html.push('</fieldset>');
						}
						html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + '</legend>');
					}
					meridianOld = meridian;
					txt = (hours % 12 ? hours % 12 : 12);
					//html.push('<span class="minute'+clsName+' minute_'+(hours<12?'am':'pm')+'">'+txt+'</span>');
					html.push('<span class="minute' + clsName + '">' + txt + ':' + (i < 10 ? '0' + i : i) + '</span>');
					if (i == 59) {
						html.push('</fieldset>');
					}
				} else {
					txt = i + ':00';
					//html.push('<span class="hour'+clsName+'">'+txt+'</span>');
					html.push('<span class="minute' + clsName + '">' + hours + ':' + (i < 10 ? '0' + i : i) + '</span>');
				}
			}
			this.picker.find('.datetimepicker-minutes td').html(html.join(''));

			var currentYear = this.date.getUTCFullYear();
			var months = this.picker.find('.datetimepicker-months')
				.find('th:eq(1)')
				.text(year)
				.end()
				.find('span').removeClass('active');
			if (currentYear == year) {
				// getUTCMonths() returns 0 based, and we need to select the next one
				months.eq(this.date.getUTCMonth() + 2).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth + 1).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth).addClass('disabled');
			}

			html = '';
			year = parseInt(year / 10, 10) * 10;
			var yearCont = this.picker.find('.datetimepicker-years')
				.find('th:eq(1)')
				.text(year + '-' + (year + 9))
				.end()
				.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year' + (i == -1 || i == 10 ? ' old' : '') + (currentYear == year ? ' active' : '') + (year < startYear || year > endYear ? ' disabled' : '') + '">' + year + '</span>';
				year += 1;
			}
			yearCont.html(html);
			this.place();
		},

		updateNavArrows: function () {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				day = d.getUTCDate(),
				hour = d.getUTCHours();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()
						&& day <= this.startDate.getUTCDate()
						&& hour <= this.startDate.getUTCHours()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()
						&& day >= this.endDate.getUTCDate()
						&& hour >= this.endDate.getUTCHours()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()
						&& day <= this.startDate.getUTCDate()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()
						&& day >= this.endDate.getUTCDate()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()
						&& month <= this.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()
						&& month >= this.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 3:
				case 4:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		mousewheel: function (e) {

			e.preventDefault();
			e.stopPropagation();

			if (this.wheelPause) {
				return;
			}

			this.wheelPause = true;

			var originalEvent = e.originalEvent;

			var delta = originalEvent.wheelDelta;

			var mode = delta > 0 ? 1 : (delta === 0) ? 0 : -1;

			if (this.wheelViewModeNavigationInverseDirection) {
				mode = -mode;
			}

			this.showMode(mode);

			setTimeout($.proxy(function () {

				this.wheelPause = false

			}, this), this.wheelViewModeNavigationDelay);

		},

		click: function (e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th, legend');
			if (target.is('.' + this.icontype)) {
				target = $(target).parent().closest('span, td, th, legend');
			}
			if (target.length == 1) {
				if (target.is('.disabled')) {
					this.element.trigger({
						type:      'outOfRange',
						date:      this.viewDate,
						startDate: this.startDate,
						endDate:   this.endDate
					});
					return;
				}
				switch (target[0].nodeName.toLowerCase()) {
					case 'th':
						switch (target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch (this.viewMode) {
									case 0:
										this.viewDate = this.moveHour(this.viewDate, dir);
										break;
									case 1:
										this.viewDate = this.moveDate(this.viewDate, dir);
										break;
									case 2:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 3:
									case 4:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								this.element.trigger({
									type:      target[0].className + ':' + this.convertViewModeText(this.viewMode),
									date:      this.viewDate,
									startDate: this.startDate,
									endDate:   this.endDate
								});
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

								// Respect startDate and endDate.
								if (date < this.startDate) date = this.startDate;
								else if (date > this.endDate) date = this.endDate;

								this.viewMode = this.startViewMode;
								this.showMode(0);
								this._setDate(date);
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth(),
								day = this.viewDate.getUTCDate(),
								hours = this.viewDate.getUTCHours(),
								minutes = this.viewDate.getUTCMinutes(),
								seconds = this.viewDate.getUTCSeconds();

							if (target.is('.month')) {
								this.viewDate.setUTCDate(1);
								month = target.parent().find('span').index(target);
								day = this.viewDate.getUTCDate();
								this.viewDate.setUTCMonth(month);
								this.element.trigger({
									type: 'changeMonth',
									date: this.viewDate
								});
								if (this.viewSelect >= 3) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.year')) {
								this.viewDate.setUTCDate(1);
								year = parseInt(target.text(), 10) || 0;
								this.viewDate.setUTCFullYear(year);
								this.element.trigger({
									type: 'changeYear',
									date: this.viewDate
								});
								if (this.viewSelect >= 4) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.hour')) {
								hours = parseInt(target.text(), 10) || 0;
								if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
									if (hours == 12 && target.hasClass('hour_am')) {
										hours = 0;
									} else if (hours != 12 && target.hasClass('hour_pm')) {
										hours += 12;
									}
								}
								this.viewDate.setUTCHours(hours);
								this.element.trigger({
									type: 'changeHour',
									date: this.viewDate
								});
								if (this.viewSelect >= 1) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							} else if (target.is('.minute')) {
								minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
								this.viewDate.setUTCMinutes(minutes);
								this.element.trigger({
									type: 'changeMinute',
									date: this.viewDate
								});
								if (this.viewSelect >= 0) {
									this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
								}
							}
							if (this.viewMode != 0) {
								var oldViewMode = this.viewMode;
								this.showMode(-1);
								this.fill();
								if (oldViewMode == this.viewMode && this.autoclose) {
									this.hide();
								}
							} else {
								this.fill();
								if (this.autoclose) {
									this.hide();
								}
							}
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')) {
							var day = parseInt(target.text(), 10) || 1;
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth(),
								hours = this.viewDate.getUTCHours(),
								minutes = this.viewDate.getUTCMinutes(),
								seconds = this.viewDate.getUTCSeconds();
							if (target.is('.old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this.viewDate.setUTCFullYear(year);
							this.viewDate.setUTCMonth(month, day);
							this.element.trigger({
								type: 'changeDay',
								date: this.viewDate
							});
							if (this.viewSelect >= 2) {
								this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
							}
						}
						var oldViewMode = this.viewMode;
						this.showMode(-1);
						this.fill();
						if (oldViewMode == this.viewMode && this.autoclose) {
							this.hide();
						}
						break;
				}
			}
		},

		_setDate: function (date, which) {
			if (!which || which == 'date')
				this.date = date;
			if (!which || which == 'view')
				this.viewDate = date;
			this.fill();
			this.setValue();
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component) {
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose && (!which || which == 'date')) {
					//this.hide();
				}
			}
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
		},

		moveMinute: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
			return new_date;
		},

		moveHour: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCHours(new_date.getUTCHours() + dir);
			return new_date;
		},

		moveDate: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf());
			//dir = dir > 0 ? 1 : -1;
			new_date.setUTCDate(new_date.getUTCDate() + dir);
			return new_date;
		},

		moveMonth: function (date, dir) {
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1) {
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function () {
					return new_date.getUTCMonth() == month;
				}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function () {
					return new_date.getUTCMonth() != new_month;
				};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i = 0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function () {
					return new_month != new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()) {
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function (date, dir) {
			return this.moveMonth(date, dir * 12);
		},

		dateWithinRange: function (date) {
			return date >= this.startDate && date <= this.endDate;
		},

		keydown: function (e) {
			if (this.picker.is(':not(:visible)')) {
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
			switch (e.keyCode) {
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
					viewMode = this.viewMode;
					if (e.ctrlKey) {
						viewMode += 2;
					} else if (e.shiftKey) {
						viewMode += 1;
					}
					if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir);
						newViewDate = this.moveDate(this.viewDate, dir);
					} else if (viewMode == 1) {
						newDate = this.moveHour(this.date, dir);
						newViewDate = this.moveHour(this.viewDate, dir);
					} else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir);
						newViewDate = this.moveMinute(this.viewDate, dir);
					}
					if (this.dateWithinRange(newDate)) {
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
					viewMode = this.viewMode;
					if (e.ctrlKey) {
						viewMode += 2;
					} else if (e.shiftKey) {
						viewMode += 1;
					}
					if (viewMode == 4) {
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (viewMode == 3) {
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else if (viewMode == 2) {
						newDate = this.moveDate(this.date, dir * 7);
						newViewDate = this.moveDate(this.viewDate, dir * 7);
					} else if (viewMode == 1) {
						if (this.showMeridian) {
							newDate = this.moveHour(this.date, dir * 6);
							newViewDate = this.moveHour(this.viewDate, dir * 6);
						} else {
							newDate = this.moveHour(this.date, dir * 4);
							newViewDate = this.moveHour(this.viewDate, dir * 4);
						}
					} else if (viewMode == 0) {
						newDate = this.moveMinute(this.date, dir * 4);
						newViewDate = this.moveMinute(this.viewDate, dir * 4);
					}
					if (this.dateWithinRange(newDate)) {
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
					if (this.viewMode != 0) {
						var oldViewMode = this.viewMode;
						this.showMode(-1);
						this.fill();
						if (oldViewMode == this.viewMode && this.autoclose) {
							this.hide();
						}
					} else {
						this.fill();
						if (this.autoclose) {
							this.hide();
						}
					}
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged) {
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component) {
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
			}
		},

		showMode: function (dir) {
			if (dir) {
				var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
				if (newViewMode >= this.minView && newViewMode <= this.maxView) {
					this.element.trigger({
						type:        'changeMode',
						date:        this.viewDate,
						oldViewMode: this.viewMode,
						newViewMode: newViewMode
					});

					this.viewMode = newViewMode;
				}
			}
			/*
			 vitalets: fixing bug of very special conditions:
			 jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
			 Method show() does not set display css correctly and datetimepicker is not shown.
			 Changed to .css('display', 'block') solve the problem.
			 See https://github.com/vitalets/x-editable/issues/37

			 In jquery 1.7.2+ everything works fine.
			 */
			//this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.picker.find('>div').hide().filter('.datetimepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
			this.updateNavArrows();
		},

		reset: function (e) {
			this._setDate(null, 'date');
		},

		convertViewModeText:  function (viewMode) {
			switch (viewMode) {
				case 4:
					return 'decade';
				case 3:
					return 'year';
				case 2:
					return 'month';
				case 1:
					return 'day';
				case 0:
					return 'hour';
			}
		}
	};

	var old = $.fn.datetimepicker;
	$.fn.datetimepicker = function (option) {
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function () {
			var $this = $(this),
				data = $this.data('datetimepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datetimepicker', (data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults, options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined) {
					return false;
				}
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};

	$.fn.datetimepicker.defaults = {
		fontAwesome: true,
		bootcssVer: 3,
		language: "zh-CN",
		autoclose: true
	};
	$.fn.datetimepicker.Constructor = Datetimepicker;
	var dates = $.fn.datetimepicker.dates = {
		en: {
			days:        ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort:   ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin:     ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months:      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			meridiem:    ["am", "pm"],
			suffix:      ["st", "nd", "rd", "th"],
			today:       "Today"
		}
	};

	var DPGlobal = {
		modes:            [
			{
				clsName: 'minutes',
				navFnc:  'Hours',
				navStep: 1
			},
			{
				clsName: 'hours',
				navFnc:  'Date',
				navStep: 1
			},
			{
				clsName: 'days',
				navFnc:  'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc:  'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc:  'FullYear',
				navStep: 10
			}
		],
		isLeapYear:       function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
		},
		getDaysInMonth:   function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
		},
		getDefaultFormat: function (type, field) {
			if (type == "standard") {
				if (field == 'input')
					return 'yyyy-mm-dd hh:ii';
				else
					return 'yyyy-mm-dd hh:ii:ss';
			} else if (type == "php") {
				if (field == 'input')
					return 'Y-m-d H:i';
				else
					return 'Y-m-d H:i:s';
			} else {
				throw new Error("Invalid format type.");
			}
		},
		validParts:       function (type) {
			if (type == "standard") {
				return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
			} else if (type == "php") {
				return /[dDjlNwzFmMnStyYaABgGhHis]/g;
			} else {
				throw new Error("Invalid format type.");
			}
		},
		nonpunctuation:   /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
		parseFormat:      function (format, type) {
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts(type), '\0').split('\0'),
				parts = format.match(this.validParts(type));
			if (!separators || !separators.length || !parts || parts.length == 0) {
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate:        function (date, format, language, type) {
			if (date instanceof Date) {
				var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
				dateUTC.setMilliseconds(0);
				return dateUTC;
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii', type);
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
				format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
			}
			if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([-+]\d+)([dmwy])/,
					parts = date.match(/([-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i = 0; i < parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]) {
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
			}
			var parts = date && date.toString().match(this.nonpunctuation) || [],
				date = new Date(0, 0, 0, 0, 0, 0, 0),
				parsed = {},
				setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P'],
				setters_map = {
					hh:   function (d, v) {
						return d.setUTCHours(v);
					},
					h:    function (d, v) {
						return d.setUTCHours(v);
					},
					HH:   function (d, v) {
						return d.setUTCHours(v == 12 ? 0 : v);
					},
					H:    function (d, v) {
						return d.setUTCHours(v == 12 ? 0 : v);
					},
					ii:   function (d, v) {
						return d.setUTCMinutes(v);
					},
					i:    function (d, v) {
						return d.setUTCMinutes(v);
					},
					ss:   function (d, v) {
						return d.setUTCSeconds(v);
					},
					s:    function (d, v) {
						return d.setUTCSeconds(v);
					},
					yyyy: function (d, v) {
						return d.setUTCFullYear(v);
					},
					yy:   function (d, v) {
						return d.setUTCFullYear(2000 + v);
					},
					m:    function (d, v) {
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							if (isNaN(d.getUTCMonth()))
								return d;
							else
								d.setUTCDate(d.getUTCDate() - 1);
						return d;
					},
					d:    function (d, v) {
						return d.setUTCDate(v);
					},
					p:    function (d, v) {
						return d.setUTCHours(v == 1 ? d.getUTCHours() + 12 : d.getUTCHours());
					}
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			setters_map['P'] = setters_map['p'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
			if (parts.length == format.parts.length) {
				for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = format.parts[i];
					if (isNaN(val)) {
						switch (part) {
							case 'MM':
								filtered = $(dates[language].months).filter(function () {
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(function () {
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m.toLowerCase() == p.toLowerCase();
								});
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
							case 'p':
							case 'P':
								val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
								break;
						}
					}
					parsed[part] = val;
				}
				for (var i = 0, s; i < setters_order.length; i++) {
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s]))
						setters_map[s](date, parsed[s])
				}
			}
			return date;
		},
		formatDate:       function (date, format, language, type) {
			if (date == null) {
				return '';
			}
			var val;
			if (type == 'standard') {
				val = {
					// year
					yy:   date.getUTCFullYear().toString().substring(2),
					yyyy: date.getUTCFullYear(),
					// month
					m:    date.getUTCMonth() + 1,
					M:    dates[language].monthsShort[date.getUTCMonth()],
					MM:   dates[language].months[date.getUTCMonth()],
					// day
					d:    date.getUTCDate(),
					D:    dates[language].daysShort[date.getUTCDay()],
					DD:   dates[language].days[date.getUTCDay()],
					p:    (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
					// hour
					h:    date.getUTCHours(),
					// minute
					i:    date.getUTCMinutes(),
					// second
					s:    date.getUTCSeconds()
				};

				if (dates[language].meridiem.length == 2) {
					val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
				}
				else {
					val.H = val.h;
				}
				val.HH = (val.H < 10 ? '0' : '') + val.H;
				val.P = val.p.toUpperCase();
				val.hh = (val.h < 10 ? '0' : '') + val.h;
				val.ii = (val.i < 10 ? '0' : '') + val.i;
				val.ss = (val.s < 10 ? '0' : '') + val.s;
				val.dd = (val.d < 10 ? '0' : '') + val.d;
				val.mm = (val.m < 10 ? '0' : '') + val.m;
			} else if (type == 'php') {
				// php format
				val = {
					// year
					y: date.getUTCFullYear().toString().substring(2),
					Y: date.getUTCFullYear(),
					// month
					F: dates[language].months[date.getUTCMonth()],
					M: dates[language].monthsShort[date.getUTCMonth()],
					n: date.getUTCMonth() + 1,
					t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
					// day
					j: date.getUTCDate(),
					l: dates[language].days[date.getUTCDay()],
					D: dates[language].daysShort[date.getUTCDay()],
					w: date.getUTCDay(), // 0 -> 6
					N: (date.getUTCDay() == 0 ? 7 : date.getUTCDay()),       // 1 -> 7
					S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : ''),
					// hour
					a: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
					g: (date.getUTCHours() % 12 == 0 ? 12 : date.getUTCHours() % 12),
					G: date.getUTCHours(),
					// minute
					i: date.getUTCMinutes(),
					// second
					s: date.getUTCSeconds()
				};
				val.m = (val.n < 10 ? '0' : '') + val.n;
				val.d = (val.j < 10 ? '0' : '') + val.j;
				val.A = val.a.toString().toUpperCase();
				val.h = (val.g < 10 ? '0' : '') + val.g;
				val.H = (val.G < 10 ? '0' : '') + val.G;
				val.i = (val.i < 10 ? '0' : '') + val.i;
				val.s = (val.s < 10 ? '0' : '') + val.s;
			} else {
				throw new Error("Invalid format type.");
			}
			var date = [],
				seps = $.extend([], format.separators);
			for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length) {
					date.push(seps.shift());
				}
				date.push(val[format.parts[i]]);
			}
			if (seps.length) {
				date.push(seps.shift());
			}
			return date.join('');
		},
		convertViewMode:  function (viewMode) {
			switch (viewMode) {
				case 4:
				case 'decade':
					viewMode = 4;
					break;
				case 3:
				case 'year':
					viewMode = 3;
					break;
				case 2:
				case 'month':
					viewMode = 2;
					break;
				case 1:
				case 'day':
					viewMode = 1;
					break;
				case 0:
				case 'hour':
					viewMode = 0;
					break;
			}

			return viewMode;
		},
		headTemplate:     '<thead>' +
							  '<tr>' +
							  '<th class="prev"><i class="{leftArrow}"/></th>' +
							  '<th colspan="5" class="switch"></th>' +
							  '<th class="next"><i class="{rightArrow}"/></th>' +
							  '</tr>' +
			'</thead>',
		headTemplateV3:   '<thead>' +
							  '<tr>' +
							  '<th class="prev"><span class="{iconType} {leftArrow}"></span> </th>' +
							  '<th colspan="5" class="switch"></th>' +
							  '<th class="next"><span class="{iconType} {rightArrow}"></span> </th>' +
							  '</tr>' +
			'</thead>',
		contTemplate:     '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate:     '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datetimepicker">' +
		'<div class="datetimepicker-minutes">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-hours">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-days">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplate +
		'<tbody></tbody>' +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-months">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-years">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplate +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'</div>';
	DPGlobal.templateV3 = '<div class="datetimepicker">' +
		'<div class="datetimepicker-minutes">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-hours">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-days">' +
		'<table class=" table-condensed">' +
		DPGlobal.headTemplateV3 +
		'<tbody></tbody>' +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-months">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'<div class="datetimepicker-years">' +
		'<table class="table-condensed">' +
		DPGlobal.headTemplateV3 +
		DPGlobal.contTemplate +
		DPGlobal.footTemplate +
		'</table>' +
		'</div>' +
		'</div>';
	$.fn.datetimepicker.DPGlobal = DPGlobal;

	/* DATETIMEPICKER NO CONFLICT
	 * =================== */

	$.fn.datetimepicker.noConflict = function () {
		$.fn.datetimepicker = old;
		return this;
	};

	/* DATETIMEPICKER DATA-API
	 * ================== */

	$(document).on(
		'focus.datetimepicker.data-api click.datetimepicker.data-api',
		'[data-provide="datetimepicker"]',
		function (e) {
			var $this = $(this);
			if ($this.data('datetimepicker')) return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datetimepicker('show');
		}
	);
	$(function () {
		$('[data-provide="datetimepicker-inline"]').datetimepicker();
	});

}(window.jQuery);

/**
* Arabic translation for bootstrap-datetimepicker
* Ala' Mohammad <amohammad@birzeit.ecu>
*/
;(function($){
	$.fn.datetimepicker.dates['ar'] = {
		days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"],
		daysShort: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
		daysMin: ["أح", "إث", "ث", "أر", "خ", "ج", "س", "أح"],
		months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
		monthsShort: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
		today: "هذا اليوم",
		suffix: [],
		meridiem: [],
		rtl: true
	};
}(jQuery));

/**
 * Bulgarian translation for bootstrap-datetimepicker
 * Apostol Apostolov <apostol.s.apostolov@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['bg'] = {
		days: ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"],
		daysShort: ["Нед", "Пон", "Вто", "Сря", "Чет", "Пет", "Съб", "Нед"],
		daysMin: ["Н", "П", "В", "С", "Ч", "П", "С", "Н"],
		months: ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"],
		monthsShort: ["Ян", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"],
		today: "днес",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Catalan translation for bootstrap-datetimepicker
 * J. Garcia <jogaco.en@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['ca'] = {
		days: ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"],
		daysShort: ["Diu",  "Dil", "Dmt", "Dmc", "Dij", "Div", "Dis", "Diu"],
		daysMin: ["dg", "dl", "dt", "dc", "dj", "dv", "ds", "dg"],
		months: ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"],
		monthsShort: ["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"],
		today: "Avui",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Czech translation for bootstrap-datetimepicker
 * Matěj Koubík <matej@koubik.name>
 * Fixes by Michal Remiš <michal.remis@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['cs'] = {
		days: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"],
		daysShort: ["Ned", "Pon", "Úte", "Stř", "Čtv", "Pát", "Sob", "Ned"],
		daysMin: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
		months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
		monthsShort: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čnc", "Srp", "Zář", "Říj", "Lis", "Pro"],
		today: "Dnes",
		suffix: [],
		meridiem: [],
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));

/**
 * Danish translation for bootstrap-datetimepicker
 * Christian Pedersen <http://github.com/chripede>
 */
;(function($){
	$.fn.datetimepicker.dates['da'] = {
		days: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
		daysShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
		daysMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"],
		months: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		today: "I Dag",
		suffix: [],
		meridiem: []
	};
}(jQuery));
/**
 * German translation for bootstrap-datetimepicker
 * Sam Zurcher <sam@orelias.ch>
 */
;(function($){
	$.fn.datetimepicker.dates['de'] = {
		days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
		daysShort: ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son"],
		daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
		months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
		monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
		today: "Heute",
		suffix: [],
		meridiem: [],
		weekStart: 1,
		format: "dd.mm.yyyy"
	};
}(jQuery));

/**
 * Estonian translation for bootstrap-datetimepicker
 * Rene Korss <http://rene.korss.ee> 
 */
;(function($){
	$.fn.datetimepicker.dates['ee'] = {
		days:        	["Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev", "Pühapäev"],
		daysShort:   	["P", "E", "T", "K", "N", "R", "L", "P"],
		daysMin:     	["P", "E", "T", "K", "N", "R", "L", "P"],
		months:      	["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"],
		monthsShort: 	["Jaan", "Veebr", "Märts", "Apr", "Mai", "Juuni", "Juuli", "Aug", "Sept", "Okt", "Nov", "Dets"],
		today:       	"Täna",
		suffix:     	[],
		meridiem: 		[],
		weekStart: 		1,
		format: 		"dd.mm.yyyy hh:ii"
	};
}(jQuery));
/**
* Greek translation for bootstrap-datetimepicker
*/
;(function($){
  $.fn.datetimepicker.dates['el'] = {
	    days: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο", "Κυριακή"],
	    daysShort: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"],
	    daysMin: ["Κυ", "Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"],
	    months: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
	    monthsShort: ["Ιαν", "Φεβ", "Μαρ", "Απρ", "Μάι", "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"],
	    today: "Σήμερα",
		suffix: [],
		meridiem: []
  };
}(jQuery));
/**
 * Spanish translation for bootstrap-datetimepicker
 * Bruno Bonamin <bruno.bonamin@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['es'] = {
		days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
		daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
		daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
		months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
		today: "Hoy",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Finnish translation for bootstrap-datetimepicker
 * Jaakko Salonen <https://github.com/jsalonen>
 */
;(function($){
	$.fn.datetimepicker.dates['fi'] = {
		days: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai", "sunnuntai"],
		daysShort: ["sun", "maa", "tii", "kes", "tor", "per", "lau", "sun"],
		daysMin: ["su", "ma", "ti", "ke", "to", "pe", "la", "su"],
		months: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
		monthsShort: ["tam", "hel", "maa", "huh", "tou", "kes", "hei", "elo", "syy", "lok", "mar", "jou"],
		today: "tänään",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * French translation for bootstrap-datetimepicker
 * Nico Mollet <nico.mollet@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['fr'] = {
		days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
		daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
		daysMin: ["D", "L", "Ma", "Me", "J", "V", "S", "D"],
		months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
		monthsShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"],
		today: "Aujourd'hui",
		suffix: [],
		meridiem: ["am", "pm"],
		weekStart: 1,
		format: "dd/mm/yyyy"
	};
}(jQuery));

/**
 * Hebrew translation for bootstrap-datetimepicker
 * Sagie Maoz <sagie@maoz.info>
 */
;(function($){
  $.fn.datetimepicker.dates['he'] = {
      days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת", "ראשון"],
      daysShort: ["א", "ב", "ג", "ד", "ה", "ו", "ש", "א"],
      daysMin: ["א", "ב", "ג", "ד", "ה", "ו", "ש", "א"],
      months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
      monthsShort: ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"],
      today: "היום",
	  suffix: [],
	  meridiem: [],
      rtl: true
  };
}(jQuery));

/**
 * Croatian localisation
 */
;(function($){
	$.fn.datetimepicker.dates['hr'] = {
		days: ["Nedjelja", "Ponedjelja", "Utorak", "Srijeda", "Četrtak", "Petak", "Subota", "Nedjelja"],
		daysShort: ["Ned", "Pon", "Uto", "Srr", "Čet", "Pet", "Sub", "Ned"],
		daysMin: ["Ne", "Po", "Ut", "Sr", "Če", "Pe", "Su", "Ne"],
		months: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
		monthsShort: ["Sije", "Velj", "Ožu", "Tra", "Svi", "Lip", "Jul", "Kol", "Ruj", "Lis", "Stu", "Pro"],
		today: "Danas",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Hungarian translation for bootstrap-datetimepicker
 * darevish <http://github.com/darevish>
 */
;(function($){
	$.fn.datetimepicker.dates['hu'] = {
		days: ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"],
		daysShort: ["Vas", "Hét", "Ked", "Sze", "Csü", "Pén", "Szo", "Vas"],
		daysMin: ["V", "H", "K", "Sze", "Cs", "P", "Szo", "V"],
		months: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
		monthsShort: ["Jan", "Feb", "Már", "Ápr", "Máj", "Jún", "Júl", "Aug", "Sze", "Okt", "Nov", "Dec"],
		today: "Ma",
		suffix: [],
		meridiem: [],
		weekStart: 1
	};
}(jQuery));

/**
 * Bahasa translation for bootstrap-datetimepicker
 * Azwar Akbar <azwar.akbar@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['id'] = {
		days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
		daysShort: ["Mgu", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Mgu"],
		daysMin: ["Mg", "Sn", "Sl", "Ra", "Ka", "Ju", "Sa", "Mg"],
		months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Icelandic translation for bootstrap-datetimepicker
 * Hinrik Örn Sigurðsson <hinrik.sig@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['is'] = {
		days: ["Sunnudagur", "Mánudagur", "Þriðjudagur", "Miðvikudagur", "Fimmtudagur", "Föstudagur", "Laugardagur", "Sunnudagur"],
		daysShort: ["Sun", "Mán", "Þri", "Mið", "Fim", "Fös", "Lau", "Sun"],
		daysMin: ["Su", "Má", "Þr", "Mi", "Fi", "Fö", "La", "Su"],
		months: ["Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maí", "Jún", "Júl", "Ágú", "Sep", "Okt", "Nóv", "Des"],
		today: "Í Dag",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Italian translation for bootstrap-datetimepicker
 * Enrico Rubboli <rubboli@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['it'] = {
		days: ["Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato", "Domenica"],
		daysShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
		daysMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"],
		months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
		monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
		today: "Oggi",
		suffix: [],
		meridiem: [],
		weekStart: 1,
		format: "dd/mm/yyyy hh:ii:ss"
	};
}(jQuery));

/**
 * Japanese translation for bootstrap-datetimepicker
 * Norio Suzuki <https://github.com/suzuki/>
 */
;(function($){
	$.fn.datetimepicker.dates['ja'] = {
		days: ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜", "日曜"],
		daysShort: ["日", "月", "火", "水", "木", "金", "土", "日"],
		daysMin: ["日", "月", "火", "水", "木", "金", "土", "日"],
		months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		today: "今日",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Korean translation for bootstrap-datetimepicker
 * Gu Youn <http://github.com/guyoun>
 * Baekjoon Choi <http://github.com/Baekjoon>
 */
;(function($){
	$.fn.datetimepicker.dates['ko'] = {
		days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
		daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
		daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
		months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		suffix: [],
		meridiem: ["오전", "오후"],
        today: "오늘",
	};
}(jQuery));

/**
 * Lithuanian translation for bootstrap-datetimepicker
 * Šarūnas Gliebus <ssharunas@yahoo.co.uk>
 */

;(function($){
    $.fn.datetimepicker.dates['lt'] = {
        days: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis", "Sekmadienis"],
        daysShort: ["S", "Pr", "A", "T", "K", "Pn", "Š", "S"],
        daysMin: ["Sk", "Pr", "An", "Tr", "Ke", "Pn", "Št", "Sk"],
        months: ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"],
        monthsShort: ["Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rugp", "Rugs", "Spa", "Lap", "Gru"],
        today: "Šiandien",
		suffix: [],
		meridiem: [],
        weekStart: 1
    };
}(jQuery));

/**
 * Latvian translation for bootstrap-datetimepicker
 * Artis Avotins <artis@apit.lv>
 */

;(function($){
    $.fn.datetimepicker.dates['lv'] = {
        days: ["Svētdiena", "Pirmdiena", "Otrdiena", "Trešdiena", "Ceturtdiena", "Piektdiena", "Sestdiena", "Svētdiena"],
        daysShort: ["Sv", "P", "O", "T", "C", "Pk", "S", "Sv"],
        daysMin: ["Sv", "Pr", "Ot", "Tr", "Ce", "Pk", "St", "Sv"],
        months: ["Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jūn", "Jūl", "Aug", "Sep", "Okt", "Nov", "Dec."],
        today: "Šodien",
		suffix: [],
		meridiem: [],
        weekStart: 1
    };
}(jQuery));
/**
 * Malay translation for bootstrap-datetimepicker
 * Ateman Faiz <noorulfaiz@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['ms'] = {
		days: ["Ahad", "Isnin", "Selasa", "Rabu", "Khamis", "Jumaat", "Sabtu", "Ahad"],
		daysShort: ["Aha", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Aha"],
		daysMin: ["Ah", "Is", "Se", "Ra", "Kh", "Ju", "Sa", "Ah"],
		months: ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"],
		today: "Hari Ini",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Norwegian (bokmål) translation for bootstrap-datetimepicker
 * Fredrik Sundmyhr <http://github.com/fsundmyhr>
 */
;(function($){
	$.fn.datetimepicker.dates['nb'] = {
		days: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
		daysShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
		daysMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"],
		months: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
		today: "I Dag",
		suffix: [],
		meridiem: []
	};
}(jQuery));
/**
 * Dutch translation for bootstrap-datetimepicker
 * Reinier Goltstein <mrgoltstein@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['nl'] = {
		days: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"],
		daysShort: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
		daysMin: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
		months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		today: "Vandaag",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Norwegian translation for bootstrap-datetimepicker
 * Rune Warhuus <rune@dinkdonkd.no>
 */
;(function($){
	$.fn.datetimepicker.dates['no'] = {
		days: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"],
		daysShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
		daysMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"],
		months: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
		today: "I Dag",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Polish translation for bootstrap-datetimepicker
 * Robert <rtpm@gazeta.pl>
 */
;(function($){
$.fn.datetimepicker.dates['pl'] = {
        days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
        daysShort: ["Nie", "Pn", "Wt", "Śr", "Czw", "Pt", "So", "Nie"],
        daysMin: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So", "N"],
        months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
        monthsShort: ["Sty", "Lu", "Mar", "Kw", "Maj", "Cze", "Lip", "Sie", "Wrz", "Pa", "Lis", "Gru"],
        today: "Dzisiaj",
		suffix: [],
		meridiem: [],
        weekStart: 1
};
}(jQuery));

/**
 * Brazilian translation for bootstrap-datetimepicker
 * Cauan Cabral <cauan@radig.com.br>
 */
;(function($){
	$.fn.datetimepicker.dates['pt-BR'] = {
        format: 'dd/mm/yyyy',
		days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
		daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
		daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
		months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		today: "Hoje",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Portuguese translation for bootstrap-datetimepicker
 * Original code: Cauan Cabral <cauan@radig.com.br>
 * Tiago Melo <tiago.blackcode@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['pt'] = {
		days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
		daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
		daysMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa", "Do"],
		months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		suffix: [],
		meridiem: ["am","pm"],
		today: "Hoje"
	};
}(jQuery));

/**
 * Romanian translation for bootstrap-datetimepicker
 * Cristian Vasile <cristi.mie@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['ro'] = {
		days: ["Duminică", "Luni", "Marţi", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"],
		daysShort: ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"],
		daysMin: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"],
		months: ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"],
		monthsShort: ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		today: "Astăzi",
		suffix: [],
		meridiem: [],
		weekStart: 1
	};
}(jQuery));

/**
 * Serbian latin translation for bootstrap-datetimepicker
 * Bojan Milosavlević <milboj@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['rs'] = {
		days: ["Nedelja","Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota", "Nedelja"],
		daysShort: ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"],
		daysMin: ["N", "Po", "U", "Sr", "Č", "Pe", "Su", "N"],
		months: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
		today: "Danas",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Serbian cyrillic translation for bootstrap-datetimepicker
 * Bojan Milosavlević <milboj@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['rs'] = {
		days: ["Недеља","Понедељак", "Уторак", "Среда", "Четвртак", "Петак", "Субота", "Недеља"],
		daysShort: ["Нед", "Пон", "Уто", "Сре", "Чет", "Пет", "Суб", "Нед"],
		daysMin: ["Н", "По", "У", "Ср", "Ч", "Пе", "Су", "Н"],
		months: ["Јануар", "Фебруар", "Март", "Април", "Мај", "Јун", "Јул", "Август", "Септембар", "Октобар", "Новембар", "Децембар"],
		monthsShort: ["Јан", "Феб", "Мар", "Апр", "Мај", "Јун", "Јул", "Авг", "Сеп", "Окт", "Нов", "Дец"],
		today: "Данас",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Russian translation for bootstrap-datetimepicker
 * Victor Taranenko <darwin@snowdale.com>
 */
;(function($){
	$.fn.datetimepicker.dates['ru'] = {
		days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
		daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб", "Вск"],
		daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
		months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
		today: "Сегодня",
		suffix: [],
		meridiem: []
	};
}(jQuery));
/**
 * Slovak translation for bootstrap-datetimepicker
 * Marek Lichtner <marek@licht.sk>
 * Fixes by Michal Remiš <michal.remis@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates["sk"] = {
		days: ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"],
		daysShort: ["Ned", "Pon", "Uto", "Str", "Štv", "Pia", "Sob", "Ned"],
		daysMin: ["Ne", "Po", "Ut", "St", "Št", "Pia", "So", "Ne"],
		months: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
		today: "Dnes",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Slovene translation for bootstrap-datetimepicker
 * Gregor Rudolf <gregor.rudolf@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['sl'] = {
		days: ["Nedelja", "Ponedeljek", "Torek", "Sreda", "Četrtek", "Petek", "Sobota", "Nedelja"],
		daysShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob", "Ned"],
		daysMin: ["Ne", "Po", "To", "Sr", "Če", "Pe", "So", "Ne"],
		months: ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij", "Avgust", "September", "Oktober", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"],
		today: "Danes",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Swedish translation for bootstrap-datetimepicker
 * Patrik Ragnarsson <patrik@starkast.net>
 */
;(function($){
	$.fn.datetimepicker.dates['sv'] = {
		days: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"],
		daysShort: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"],
		daysMin: ["Sö", "Må", "Ti", "On", "To", "Fr", "Lö", "Sö"],
		months: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
		monthsShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		today: "I Dag",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Swahili translation for bootstrap-datetimepicker
 * Edwin Mugendi <https://github.com/edwinmugendi>
 * Source: http://scriptsource.org/cms/scripts/page.php?item_id=entry_detail&uid=xnfaqyzcku
 */
;(function($){
    $.fn.datetimepicker.dates['sw'] = {
        days: ["Jumapili", "Jumatatu", "Jumanne", "Jumatano", "Alhamisi", "Ijumaa", "Jumamosi", "Jumapili"],
        daysShort: ["J2", "J3", "J4", "J5", "Alh", "Ij", "J1", "J2"],
        daysMin: ["2", "3", "4", "5", "A", "I", "1", "2"],
        months: ["Januari", "Februari", "Machi", "Aprili", "Mei", "Juni", "Julai", "Agosti", "Septemba", "Oktoba", "Novemba", "Desemba"],
        monthsShort: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"],
        today: "Leo",
		suffix: [],
		meridiem: []
    };
}(jQuery));

/**
 * Thai translation for bootstrap-datetimepicker
 * Suchau Jiraprapot <seroz24@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['th'] = {
		days: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"],
		daysShort: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],
		daysMin: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],
		months: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
		monthsShort: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
		today: "วันนี้",
		suffix: [],
		meridiem: []
	};
}(jQuery));

/**
 * Turkish translation for bootstrap-datetimepicker
 * Serkan Algur <kaisercrazy_2@hotmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['tr'] = {
		days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
		daysShort: ["Pz", "Pzt", "Sal", "Çrş", "Prş", "Cu", "Cts", "Pz"],
		daysMin: ["Pz", "Pzt", "Sa", "Çr", "Pr", "Cu", "Ct", "Pz"],
		months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
		monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
		today: "Bugün",
		suffix: [],
		meridiem: []
	};
}(jQuery));


/**
 * Ukrainian translation for bootstrap-datepicker
 * Igor Polynets
 */
;(function($){
	$.fn.datetimepicker.dates['ua'] = {
		days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четверг", "П'ятниця", "Субота", "Неділя"],
		daysShort: ["Нед", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб", "Нед"],
		daysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
		months: ["Cічень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
		monthsShort: ["Січ", "Лют", "Бер", "Квт", "Трв", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Грд"],
		today: "Сьогодні",
		weekStart: 1
	};
}(jQuery));

/**
 * Ukrainian translation for bootstrap-datetimepicker
 * Andrey Vityuk <andrey [dot] vityuk [at] gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['uk'] = {
		days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"],
		daysShort: ["Нед", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб", "Нед"],
		daysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
		months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
		monthsShort: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
		today: "Сьогодні",
		suffix: [],
		meridiem: []
	};
}(jQuery));
/**
 * Simplified Chinese translation for bootstrap-datetimepicker
 * Yuan Cheung <advanimal@gmail.com>
 */
;(function($){
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
			daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			today: "今天",
			suffix: [],
			meridiem: ["上午", "下午"]
	};
}(jQuery));

/**
 * Traditional Chinese translation for bootstrap-datetimepicker
 * Rung-Sheng Jang <daniel@i-trend.co.cc>
 */
;(function($){
	$.fn.datetimepicker.dates['zh-TW'] = {
	days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
	  daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
		daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
		months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
		today: "今天",
    suffix: [],
		meridiem: ["上午", "下午"]
	};
}(jQuery));

$(document).ready(function () {
    //***********************************BEGIN Grids*****************************       
    $('.grid .tools a.remove').on('click', function () {
        var removable = jQuery(this).parents(".grid");
        if (removable.next().hasClass('grid') || removable.prev().hasClass('grid')) {
            jQuery(this).parents(".grid").remove();
        } else {
            jQuery(this).parents(".grid").parent().remove();
        }
    });

    $('.grid .tools a.reload').on('click', function () {
        var el = jQuery(this).parents(".grid");
        blockUI(el);
        window.setTimeout(function () {
            unblockUI(el);
        }, 1000);
    });

    $('.grid .tools .shrink, .grid .tools .expand').on('click', function () {
        var el = jQuery(this).parents(".grid").children(".grid-body");
        if (jQuery(this).hasClass("shrink")) {
            jQuery(this).removeClass("shrink").addClass("expand");
            el.slideUp(200);
        } else {
            jQuery(this).removeClass("expand").addClass("shrink");
            el.slideDown(200);
        }
    });

    $('.user-info .shrink').on('click', function () {
        jQuery(this).parents(".user-info ").slideToggle();
    });
    //***********************************END Grids*****************************     
});

//+ function(factory) {
//	if (typeof define === "function" && define.amd) {
//		// AMD. Register as an anonymous module.
//		define([], factory);
//	} else {
//
//		// Browser globals
//		factory(jQuery);
//	}
//}(
	+function($) {
	'use strict';

	/**
	 * 字符串去掉左右空格
	 */
	String.prototype.trim = function() {
		return this.replace(/^\s*(\b.*\b|)\s*$/, "$1");
	};

	/**
	 * 字符串替换
	 */
	String.prototype.replaceStr = function(strFind, strRemp) {
		var tab = this.split(strFind);
		return new String(tab.join(strRemp));
	};

	/**
	 * 获得字符串的字节长度
	 */
	String.prototype.lengthb = function() {
	//	var str = this.replace(/[^\x800-\x10000]/g, "***");
		var str = this.replace(/[^\x00-\xff]/g, "**");
		return str.length;
	};

	/**
	 * 将AFindText全部替换为ARepText
	 */
	String.prototype.replaceAll = function(AFindText, ARepText) {
		//自定义String对象的方法
		var raRegExp = new RegExp(AFindText, "g");
		return this.replace(raRegExp, ARepText);
	};

	/**
	 * 按字节数截取字符串 例:"e我是d".nLen(4)将返回"e我"
	 */
	String.prototype.substrCH = function(nLen) {
		var i = 0;
		var j = 0;
		while (i < nLen && j < this.length) {  // 循环检查制定的结束字符串位置是否存在中文字符
			var charCode = this.charCodeAt(j);
			if (charCode > 256 && i == nLen - 1) {
				break;
			} 
	//		else if(charCode >= 0x800 && charCode <= 0x10000){
	//			i = i + 3;
	//		}
			else if (charCode > 256) {  // 返回指定下标字符编码，大于265表示是中文字符
				i = i + 2;
			} //是中文字符，那计数增加2
			else {
				i = i + 1;
			} //是英文字符，那计数增加1
			j = j + 1;
		}
		;
		return this.substr(0, j);
	};

	/**
	 * 校验字符串是否以指定内容开始
	 */
	String.prototype.startWith = function(strChild) {
		return this.indexOf(strChild) == 0;
	};

	/**
	 * 判断字符串是否以指定参数的字符串结尾
	 * 
	 * @param strChild
	 */
	String.prototype.endWith = function(strChild) {
		var index = this.indexOf(strChild);
		if (index == -1)
			return;
		else
			return index == this.length - strChild.length;
	};

	String.prototype.format =  function(data){
	    if(data != null){
	        var string = this;
	        for(var key in data){
	            var reg = new RegExp('\\<\\#\\=' + key + '\\#\\>', 'gi');
	            string = string.replace(reg,data[key]?(data[key]=='null'?"":data[key]):"");
	        }
	    }
	    return string;
	}
	 function patch (element){
	    if(element.toString().length > 1){
	        return element.toString();
	    }else{
	        return "0" + element.toString();
	    }
	}
	Date.prototype.format = function(format){
	    var year = this.getFullYear(),
	        month = this.getMonth() + 1,
	        day = this.getDate(),
	        hour = this.getHours(),
	        minute = this.getMinutes(),
	        second = this.getSeconds();
	        format = format || "yyyy-MM-dd hh:mm:ss";
	    return format.replace(/yyyy/,year).replace(/yy/,year.toString().substr(2,2))
	            .replace(/MM/,patch(month)).replace(/M/,month)
	            .replace(/dd/,patch(day)).replace(/d/,day)
	            .replace(/hh/,patch(hour)).replace(/h/,hour)
	            .replace(/mm/,patch(minute)).replace(/m/,minute)
	            .replace(/ss/,patch(second)).replace(/s/,second);
	};

	/**
	 * 获取AAAAMMJJ类型字符串
	 */
	Date.prototype.getAAAAMMJJ = function() {
		//date du jour
		var jour = this.getDate();
		if (jour < 10)
			(jour = "0" + jour);
		var mois = this.getMonth() + 1;
		if (mois < 10)
			(mois = "0" + mois);
		var annee = this.getYear();
		return annee + "" + mois + "" + jour;
	};

	/**
	 * 获取YYYY-MM-DD类型字符串
	 */
	Date.prototype.getFomatDate = function() {
		var year = this.getFullYear();
		var month = this.getMonth() + 1;
		if (month < 10)
			month = "0" + month;
		var day = this.getDate();
		if (day < 10)
			day = "0" + day;
		return year + "-" + month + "-" + day;
	};

	/**
	 * 获取YYYY-MM-DD HH:MM:SS类型字符串
	 */
	Date.prototype.getFomatDateTime = function() {
		var year = this.getFullYear();
		var month = this.getMonth() + 1;
		if (month < 10)
			month = "0" + month;
		var day = this.getDate();
		if (day < 10)
			day = "0" + day;
		var hours = this.getHours();
		if (hours < 10)
			hours = "0" + hours;
		var minutes = this.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;
		var seconds = this.getSeconds();
		if (seconds < 10)
			seconds = "0" + seconds;
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	};

	/**
	 * 返回obj在数组中的位置
	 */
	Array.prototype.indexOf = function(obj) {
		for ( var i = 0; i < this.length; i++) {
			if (this[i] == obj)
				return i;
		}
		return -1;
	};

	/**
	 * 按照index remove
	 */
	Array.prototype.remove = function(index) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 1);
	};

	/**
	 * 按照数组的元素remove
	 */
	Array.prototype.removeEle = function(ele) {
		for ( var i = 0, count = this.length; i < count; i++) {
			if (this[i] == ele) {
				this.splice(i, 1);
				return;
			}
		}
	};
	/**
	 * 生成UUID
	 */
	Math.UUID = function() {
	    return ((new Date()).getTime()+"").substr(9);
	};
	String.UUID = function() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	      return v.toString(16);
	    });
	};

	/**
	 * 将指定值ele插入到index处
	 */
	Array.prototype.insert = function(index, ele) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 0, ele);
	};

	/**
	 * 得到和索引相对应的数组中的值
	 */
	Array.prototype.values = function(indices) {
		if (indices == null)
			return null;
		var varr = new Array();
		for ( var i = 0; i < indices.length; i++) {
			varr.push(this[indices[i]]);
		}
		return varr;
	};

	/**
	 * 清空数组
	 */
	Array.prototype.clear = function() {
		this.splice(0, this.length);
	};
}(jQuery);
//+function( factory ) {
//	if ( typeof define === "function" && define.amd ) {
//
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery"
//		], factory );
//	} else {
//
//		// Browser globals
//		factory( jQuery );
//	}
//}(
+ function($) {
	'use strict';

	//jQuery.autocomplete = function(input, options) {
	//
	//}




	var Autocomplete = function(element, options) {
		this.$input = $(element)
		this.options = $.extend({}, Autocomplete.DEFAULTS, options)
		this.requestIndex = 0
		this.pending = 0
		// Create a link to self
		var me = this;

		// Create jQuery object for input element
		//	var $input = $(input).attr("autocomplete", "off");

		// Apply inputClass if necessary
		if (this.options.inputClass) this.$input.addClass(this.options.inputClass);

		// Create results
		var results = document.createElement("div");
		// Create jQuery object for results
		this.$results = $(results);
		this.$results.hide().addClass(this.options.resultsClass).css("position", "absolute");
		if (this.options.width > 0) $results.css("width", this.options.width);

		// Add to body element
		$("body").append(results);

		//	input.autocompleter = me;

		this.timeout = null;
		this.prev = "";
		this.active = -1;
		this.cache = {};
		this.keyb = false;
		this.hasFocus = false;
		this.lastKeyPressCode = null;

		// flush cache
//		this.flushCache();
		this._initSource();

//		// if there is a data array supplied
//		if (this.options.data != null) {
//			var sFirstChar = "",
//				stMatchSets = {},
//				row = [];
//
//			// no url was specified, we need to adjust the cache length to make sure it fits the local data store
//			if (typeof this.options.url != "string") this.options.cacheLength = 1;
//
//			// loop through the array and create a lookup structure
//			for (var i = 0; i < this.options.data.length; i++) {
//				// if row is a string, make an array otherwise just reference the array
//				row = ((typeof this.options.data[i] == "string") ? [this.options.data[i]] : this.options.data[i]);
//
//				// if the length is zero, don't add to list
//				if (row[0].length > 0) {
//					// get the first character
//					sFirstChar = row[0].substring(0, 1).toLowerCase();
//					// if no lookup array for this character exists, look it up now
//					if (!stMatchSets[sFirstChar]) stMatchSets[sFirstChar] = [];
//					// if the match is a string
//					stMatchSets[sFirstChar].push(row);
//				}
//			}
//
//			// add the data items to the cache
//			for (var k in stMatchSets) {
//				// increase the cache size
//				this.options.cacheLength++;
//				// add to the cache
//				this.addToCache(k, stMatchSets[k]);
//			}
//		}

		this.$input.keydown(function(e) {
				// track last key pressed
				me.lastKeyPressCode = e.keyCode;
				switch (e.keyCode) {
					case 38: // up
						e.preventDefault();
						me.moveSelect(-1);
						break;
					case 40: // down
						e.preventDefault();
						me.moveSelect(1);
						break;
					case 9: // tab
					case 13: // return
						if (me.selectCurrent()) {
							// make sure to blur off the current field
							me.$input.get(0).blur();
							e.preventDefault();
						}
						break;
					default:
						me.active = -1;
						if (me.timeout) clearTimeout(me.timeout);
						me.timeout = setTimeout(function() {
							me.onChange();
						}, me.options.delay);
						break;
				}
			})
			.focus(function() {
				// track whether the field has focus, we shouldn't process any results if the field no longer has focus
				me.hasFocus = true;
			})
			.blur(function() {
				// track whether the field has focus
				me.hasFocus = false;
				me.hideResults();
			});

		this.hideResultsNow();


		//  this.update(this.options)
	}

	Autocomplete.DEFAULTS = {
		inputClass: "ac_input",
		resultsClass: "ac_results",
		lineSeparator: "\n",
		cellSeparator: "|",
		minChars: 1,
		delay: 400,
		matchCase: 0,
		matchSubset: 1,
		matchContains: 0,
		cacheLength: 1,
		mustMatch: 0,
		extraParams: {},
		loadingClass: "ac_loading",
		selectFirst: false,
		selectOnly: false,
		maxItemsToShow: -1,
		autoFill: false,
		width: 0,
		source:null,
		select: null
	}

	Autocomplete.fn = Autocomplete.prototype;

	// flush cache
	Autocomplete.fn.flushCache = function() {
		this.cache = {};
		this.cache.data = {};
		this.cache.length = 0;
	};

	Autocomplete.fn._initSource = function() {
		var array, url, me = this;
		if ( $.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
//				response( $.ui.autocomplete.filter( array, request.term ) );
				response(me.filterData(request.term, array));
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( me.xhr ) {
					me.xhr.abort();
				}
				me.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response([]);
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	}
	
	Autocomplete.fn._response = function() {
		var index = ++this.requestIndex;

		return $.proxy(function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
//				this.element.removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	}

	Autocomplete.fn.__response = function( content ) {
		if ( content ) 
//			content = this._normalize( content );
//		}
//		this._trigger( "response", null, { content: content } );
//		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
//			this._suggest( content );
//			this._trigger( "open" );
			this.receiveData2(content);
			this.showResults();
//		} else {
//			// use ._close() instead of .close() so we don't cancel future searches
//			this._close();
//		}
	}
	



	Autocomplete.fn.onChange = function() {
		// ignore if the following keys are pressed: [del] [shift] [capslock]
		if (this.lastKeyPressCode == 46 || (this.lastKeyPressCode > 8 && this.lastKeyPressCode < 32)) return this.$results.hide();
		var v = this.$input.val();
		if (v == this.prev) return;
		this.prev = v;
		if (v.length >= this.options.minChars) {
			this.$input.addClass(this.options.loadingClass);
//			this.requestData(v);
			this.pending++;
			this.source( { term: v }, this._response() );
		} else {
			this.$input.removeClass(this.options.loadingClass);
			this.$results.hide();
		}
	};

	Autocomplete.fn.moveSelect = function(step) {
		var lis = $("li", this.$results[0]);
		if (!lis) return;

		this.active += step;

		if (this.active < 0) {
			this.active = 0;
		} else if (this.active >= lis.size()) {
			this.active = lis.size() - 1;
		}

		lis.removeClass("ac_over");

		$(lis[this.active]).addClass("ac_over");
	};

	Autocomplete.fn.selectCurrent = function() {
		var li = $("li.ac_over", this.$results[0])[0];
		if (!li) {
			var $li = $("li", this.$results[0]);
			if (this.options.selectOnly) {
				if ($li.length == 1) li = $li[0];
			} else if (this.options.selectFirst) {
				li = $li[0];
			}
		}
		if (li) {
			this.selectItem(li);
			return true;
		} else {
			return false;
		}
	};

	Autocomplete.fn.selectItem = function(li) {
		var me = this;
		if (!li) {
			li = document.createElement("li");
//			li.extra = [];
			li.selectValue = "";
		}
		var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
		this.lastSelected = v;
		this.prev = v;
		this.$results.html("");
		this.$input.val(v);
		this.hideResultsNow();
		if (this.options.select) setTimeout(function() {
			me.options.select(li._item)
		}, 1);
	};

	// selects a portion of the input string
	Autocomplete.fn.createSelection = function(start, end) {
		// get a reference to the input element
		var field = this.$input.get(0);
		if (field.createTextRange) {
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end);
			selRange.select();
		} else if (field.setSelectionRange) {
			field.setSelectionRange(start, end);
		} else {
			if (field.selectionStart) {
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	};

	// fills in the input box w/the first match (assumed to be the best match)
	Autocomplete.fn.autoFill = function(sValue) {
		// if the last user key pressed was backspace, don't autofill
		if (this.lastKeyPressCode != 8) {
			// fill in the value (keep the case the user has typed)
			this.$input.val(this.$input.val() + sValue.substring(this.prev.length));
			// select the portion of the value not typed by the user (so the next character will erase)
			this.createSelection(this.prev.length, sValue.length);
		}
	};

	Autocomplete.fn.showResults = function() {
		// get the position of the input field right now (in case the DOM is shifted)
		var pos = findPos(this.$input[0]);
		// either use the specified width, or autocalculate based on form element
		var iWidth = (this.options.width > 0) ? this.options.width : this.$input.width();
		// reposition
		this.$results.css({
			width: parseInt(iWidth) + "px",
			top: (pos.y + this.$input[0].offsetHeight) + "px",
			left: pos.x + "px"
		}).show();
	};

	Autocomplete.fn.hideResults = function() {
		var me = this;
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(function() {
			me.hideResultsNow();
		}, 200);
	};

	Autocomplete.fn.hideResultsNow = function() {
		if (this.timeout) clearTimeout(this.timeout);
		this.$input.removeClass(this.options.loadingClass);
		if (this.$results.is(":visible")) {
			this.$results.hide();
		}
		if (this.options.mustMatch) {
			var v = this.$input.val();
			if (v != this.lastSelected) {
				this.selectItem(null);
			}
		}
	};

	Autocomplete.fn.receiveData = function(q, data) {
		if (data) {
			this.$input.removeClass(this.options.loadingClass);
			this.$results.html('');

			// if the field no longer has focus or if there are no matches, do not display the drop down
			if (!this.hasFocus || data.length == 0) return this.hideResultsNow();

			//			if ($.u.IS_IE) {
			// we put a styled iframe behind the calendar so HTML SELECT elements don't show through
			//				this.$results.append(document.createElement('iframe'));
			//			}
			this.$results.append(this.dataToDom(data));
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
			if (this.options.autoFill && (this.$input.val().toLowerCase() == q.toLowerCase())) this.autoFill(data[0][0]);
			this.showResults();
		} else {
			this.hideResultsNow();
		}
	};
	
	Autocomplete.fn.filterData = function(v, items) {
		if (!v) return items;
		var _items = [];
		for (var i =0, count = items.length; i< count; i++){
			var label = items[i].label;
			if (label.indexOf(v) == 0)
				_items.push(items[i]);
		}
		return _items;
	};
	
	
	Autocomplete.fn.receiveData2 = function(items) {
		if (items) {
			this.$input.removeClass(this.options.loadingClass);
			this.$results.html('');

			// if the field no longer has focus or if there are no matches, do not display the drop down
			if (!this.hasFocus || items.length == 0) return this.hideResultsNow();

			//			if ($.u.IS_IE) {
			// we put a styled iframe behind the calendar so HTML SELECT elements don't show through
			//				this.$results.append(document.createElement('iframe'));
			//			}
			this.$results.append(this.dataToDom2(items));
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
//			if (this.options.autoFill && (this.$input.val().toLowerCase() == q.toLowerCase())) this.autoFill(data[0][0]);
			this.showResults();
		} else {
			this.hideResultsNow();
		}		
	}
	Autocomplete.fn.dataToDom2 = function(items) {
		var ul = document.createElement("ul");
		var num = items.length;
		var me = this;

		// limited results to a max number
		if ((this.options.maxItemsToShow > 0) && (this.options.maxItemsToShow < num)) num = this.options.maxItemsToShow;

		for (var i = 0; i < num; i++) {
			var item = items[i];
			if (!item) continue;
			var li = document.createElement("li");
			if (this.options.formatItem) 
				li.innerHTML = this.options.formatItem(item, i, num);
			else 
				li.innerHTML = item.label;
			li.selectValue = item.label;
			li._item = item;
			ul.appendChild(li);
			$(li).hover(
				function() {
					$("li", ul).removeClass("ac_over");
					$(this).addClass("ac_over");
					me.active = indexOf($("li", ul), $(this).get(0));
				},
				function() {
					$(this).removeClass("ac_over");
				}
			).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				me.selectItem(this)
			});
		}
		return ul;
	};	

	Autocomplete.fn.parseData = function(data) {
		if (!data) return null;
		var parsed = [];
		var rows = data.split(this.options.lineSeparator);
		for (var i = 0; i < rows.length; i++) {
			var row = $.trim(rows[i]);
			if (row) {
				parsed[parsed.length] = row.split(this.options.cellSeparator);
			}
		}
		return parsed;
	};

	Autocomplete.fn.dataToDom = function(data) {
		var ul = document.createElement("ul");
		var num = data.length;
		var me = this;

		// limited results to a max number
		if ((this.options.maxItemsToShow > 0) && (this.options.maxItemsToShow < num)) num = this.options.maxItemsToShow;

		for (var i = 0; i < num; i++) {
			var row = data[i];
			if (!row) continue;
			var li = document.createElement("li");
			if (this.options.formatItem) {
				li.innerHTML = this.options.formatItem(row, i, num);
				li.selectValue = row[0];
			} else {
				li.innerHTML = row[0];
				li.selectValue = row[0];
			}
			var extra = null;
			if (row.length > 1) {
				extra = [];
				for (var j = 1; j < row.length; j++) {
					extra[extra.length] = row[j];
				}
			}
			li.extra = extra;
			ul.appendChild(li);
			$(li).hover(
				function() {
					$("li", ul).removeClass("ac_over");
					$(this).addClass("ac_over");
					me.active = indexOf($("li", ul), $(this).get(0));
				},
				function() {
					$(this).removeClass("ac_over");
				}
			).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				me.selectItem(this)
			});
		}
		return ul;
	};

	Autocomplete.fn.requestData = function(q) {
		var me = this;
		if (!this.options.matchCase) q = q.toLowerCase();
		var data = this.options.cacheLength ? this.loadFromCache(q) : null;
		// recieve the cached data
		if (data) {
			this.receiveData(q, data);
			// if an AJAX url has been supplied, try loading the data now
		} else if ((typeof this.options.url == "string") && (this.options.url.length > 0)) {
			$.get(this.makeUrl(q), function(data) {
				data = me.parseData(data);
				me.addToCache(q, data);
				me.receiveData(q, data);
			});
			// if there's been no data found, remove the loading class
		} else {
			this.$input.removeClass(this.options.loadingClass);
		}
	};

	Autocomplete.fn.makeUrl = function(q) {
		var url = this.options.url + "?q=" + encodeURI(q);
		for (var i in this.options.extraParams) {
			url += "&" + i + "=" + encodeURI(this.options.extraParams[i]);
		}
		return url;
	};

	Autocomplete.fn.loadFromCache = function(q) {
		if (!q) return null;
		if (this.cache.data[q]) return this.cache.data[q];
		if (this.options.matchSubset) {
			for (var i = q.length - 1; i >= this.options.minChars; i--) {
				var qs = q.substr(0, i);
				var c = this.cache.data[qs];
				if (c) {
					var csub = [];
					for (var j = 0; j < c.length; j++) {
						var x = c[j];
						var x0 = x[0];
						if (this.matchSubset(x0, q)) {
							csub[csub.length] = x;
						}
					}
					return csub;
				}
			}
		}
		return null;
	};

	Autocomplete.fn.matchSubset = function(s, sub) {
		if (!this.options.matchCase) s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (i == -1) return false;
		return i == 0 || this.options.matchContains;
	};

	Autocomplete.fn.addToCache = function(q, data) {
		if (!data || !q || !this.options.cacheLength) return;
		if (!this.cache.length || this.cache.length > this.options.cacheLength) {
			this.flushCache();
			this.cache.length++;
		} else if (!this.cache[q]) {
			this.cache.length++;
		}
		this.cache.data[q] = data;
	};

	function findPos(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {
			x: curleft,
			y: curtop
		};
	}

	function indexOf($element, e) {
		for (var i = 0; i < $element.length; i++) {
			if ($element[i] == e) return i;
		}
		return -1;
	};



	function Plugin(option) {
		if (this.length != 1) return;
		var $this = $(this)
		var data = $this.data('u.autocomplete')
		var options = typeof option == 'object' && option

		if (!data) $this.data('u.autocomplete', (data = new Autocomplete(this, options)))
			//	else data.update(options);
		return data;
	}

	var old = $.fn.autocomplete

	$.fn.autocomplete = Plugin
	$.fn.autocomplete.Constructor = Autocomplete



	$.fn.autocomplete.noConflict = function() {
		$.fn.autocomplete = old
		return this
	}


}(jQuery);


//+function( factory ) {
//	if ( typeof define === "function" && define.amd ) {
//
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery"
//		], factory );
//	} else {
//
//		// Browser globals
//		factory( jQuery );
//	}
//}(
+function ($){
	'use strict';

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.update(this.options)
  }

  Button.DEFAULTS = {
    classname:'btn btn-default',
    text:null
  }

  Button.fn = Button.prototype;
  Button.fn.click = function(func){
  	this.$element.click(func);
  	return this;
  }
  
  Button.fn.text = function(text){
  	if (text == null)
  		return this.$element.text();
  	else{
  		this.$element.text(text);
  		return this;
  	}
  }
  
  Button.fn.update = function(options){
  	if (options == null) return;
    if (options.text != null)
    	this.$element.text(options.text)
    if (options.classname != null)
    	this.$element.addClass(options.classname);
	if (options.click != null)   
		this.click(options.click);
  }



  function Plugin(option) {
  	if (this.length != 1) return;
	var $this   = $(this)
	var data    = $this.data('u.button')
	var options = typeof option == 'object' && option
	
	if (!data) $this.data('u.button', (data = new Button(this, options)))
	else data.update(options);
	return data;
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }
  

}(jQuery);

//+ function(factory) {
//	if (typeof define === "function" && define.amd) {
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery"
//		], factory);
//	} else {
//
//		// Browser globals
//		factory(jQuery);
//	}
//}(
	+function($) {
	'use strict';
	/**
	 *取浏览器版本信息
	 */
	/**
	* IE浏览器
	*/
	var IS_IE = false;
	/**
	* FirFox浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_FF = false;
	/**
	* OPERA浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_OPERA = false;
	/**
	* CHROME浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_CHROME = false;
	/**
	* SAFARI浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_SAFARI = false;
	/**
	* WEBKIT内核浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_WEBKIT = false;
	/**
	* IE6浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IE6 = false;
	/**
	* IE7浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IE7 = false;
	/**
	* IE8浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IE8 = false;
	/**
	* IE8浏览器;使用兼容模式时也为true
	* @memberOf Lfw
	* @public
	*/
	var IS_IE8_CORE = false;
	/**
	* IE9浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IE9 = false;
	/**
	* IE9浏览器;使用兼容模式时也为true
	* @memberOf Lfw
	* @public
	*/
	var IS_IE9_CORE = false;
	/**
	* IE10浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IE10 = false;
	/**
	* IE10以上浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IE10_ABOVE = false;
	/**
	* IE11浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IE11 = false;
	/**
	* IOS系统浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IOS = false;
	/**
	* IPHONE浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IPHONE = false;
	/**
	* IPAD浏览器
	* @memberOf Lfw
	* @public
	*/
	var IS_IPAD = false;
	/**
	* 标准浏览器(firefox, chrome, ie9以上,safari)
	* @memberOf Lfw
	* @public
	*/
	var IS_STANDARD = false;
	var BROWSER_VERSION = 0;
	function getVersion() {
		var userAgent = navigator.userAgent,
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
			rFirefox = /(firefox)\/([\w.]+)/,
			rOpera = /(opera).+version\/([\w.]+)/,
			rChrome = /(chrome)\/([\w.]+)/,
			rSafari = /version\/([\w.]+).*(safari)/;
		var browser;
		var version;
		var ua = userAgent.toLowerCase();

		function uaMatch(ua) {
			var match = rMsie.exec(ua);
			if (match != null) {
				return {
					browser: "IE",
					version: match[2] || "0"
				};
			}
			var match = rFirefox.exec(ua);
			if (match != null) {
				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			}
			var match = rOpera.exec(ua);
			if (match != null) {
				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			}
			var match = rChrome.exec(ua);
			if (match != null) {
				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			}
			var match = rSafari.exec(ua);
			if (match != null) {
				return {
					browser: match[2] || "",
					version: match[1] || "0"
				};
			}
			if (match != null) {
				return {
					browser: "",
					version: "0"
				};
			}
		}
		var browserMatch = uaMatch(userAgent.toLowerCase()) || {};
		//	if (browserMatch.browser) {  
		//		browser = browserMatch.browser;  
		//		version = browserMatch.version;  
		//	} 
		return browserMatch;
	}

	var ua = navigator.userAgent.toLowerCase(),
		s, o = {};
	var version = getVersion();
	if (s = ua.match(/opera.([\d.]+)/)) {
		IS_OPERA = true;
	} else if (version.browser == "IE" && version.version == 11) {
		IS_IE11 = true;
		IS_IE = true;
	} else if (s = ua.match(/chrome\/([\d.]+)/)) {
		IS_CHROME = true;
		IS_STANDARD = true;
	} else if (s = ua.match(/version\/([\d.]+).*safari/)) {
		IS_SAFARI = true;
		IS_STANDARD = true;
	} else if (s = ua.match(/gecko/)) {
		//add by licza : support XULRunner  
		IS_FF = true;
		IS_STANDARD = true;
	} else if (s = ua.match(/msie ([\d.]+)/)) {
		IS_IE = true;
	}

	/* else if (s=ua.match(/iphone/i)){
	         IS_IOS = true;
	         IS_IPHONE = true;
	}*/
	/*else if (s=ua.match(/ipad/i)){
		         IS_IOS = true;
		         IS_IPAD = true;
		         IS_STANDARD = true;
		}*/
	else if (s = ua.match(/firefox\/([\d.]+)/)) {
		IS_FF = true;
		IS_STANDARD = true;
	}
	/*else if (s=ua.match(/webkit\/([\d.]+)/)) {
		         IS_WEBKIT = true;
		} */
	if (ua.match(/webkit\/([\d.]+)/)) {
		IS_WEBKIT = true;
	}
	if (ua.match(/ipad/i)) {
		IS_IOS = true;
		IS_IPAD = true;
		IS_STANDARD = true;
	}
	if (ua.match(/iphone/i)) {
		IS_IOS = true;
		IS_IPHONE = true;
	}
	//	if (s && s[1]) {
	//	         BROWSER_VERSION = parseFloat( s[1] );
	//	} else {
	//	         BROWSER_VERSION = 0;
	//	}
	BROWSER_VERSION = version ? (version.version ? version.version : 0) : 0;
	if (IS_IE) {
		var intVersion = parseInt(BROWSER_VERSION);
		var mode = document.documentMode;
		if (mode == null) {
			if (intVersion == 6) {
				IS_IE6 = true;
			} else if (intVersion == 7) {
				IS_IE7 = true;
			}
			/*else if (intVersion == 8) {
			         IS_IE8_CORE = true;
			         IS_IE8 = true;
			} else if (intVersion == 9) {
			         IS_IE9 = true;
			         IS_IE9_CORE = true;
			         IS_STANDARD = true;
			}*/
		} else {
			if (mode == 7) {
				IS_IE7 = true;
			} else if (mode == 8) {
				IS_IE8 = true;
			} else if (mode == 9) {
				IS_IE9 = true;
				IS_STANDARD = true;
			} else if (mode == 10) {
				IS_IE10 = true;
				IS_STANDARD = true;
				IS_IE10_ABOVE = true;
			} else {
				IS_STANDARD = true;
			}
			if (intVersion == 8) {
				IS_IE8_CORE = true;
			} else if (intVersion == 9) {
				IS_IE9_CORE = true;
			} else if (version.version == 11) {
				IS_IE11 = true;
			} else {

			}
		}
	}
	
	$.u = $.u || {};
	$.u.IS
 	$.u.IS_IE = IS_IE
 	$.u.IS_FF = IS_FF
 	$.u.IS_OPERA = IS_OPERA
 	$.u.IS_CHROME = IS_CHROME
 	$.u.IS_SAFARI = IS_SAFARI
 	$.u.IS_WEBKIT = IS_WEBKIT
 	$.u.IS_IE6 = IS_IE6
 	$.u.IS_IE7 = IS_IE7
 	$.u.IS_IE8 = IS_IE8
 	$.u.IS_IE8_CORE = IS_IE8_CORE
 	$.u.IS_IE9 = IS_IE9
 	$.u.IS_IE9_CORE = IS_IE9_CORE
 	$.u.IS_IE10 = IS_IE10
 	$.u.IS_IE10_ABOVE = IS_IE10_ABOVE
 	$.u.IS_IE11 = IS_IE11
 	$.u.IS_IOS = IS_IOS
 	$.u.IS_IPHONE = IS_IPHONE
 	$.u.IS_IPAD = IS_IPAD
 	$.u.IS_STANDARD = IS_STANDARD
 	$.u.BROWSER_VERSION = BROWSER_VERSION	

}(jQuery);
//+ function(factory) {
//	if (typeof define === "function" && define.amd) {
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery",
//			"./core"
//		], factory);
//	} else {
//
//		// Browser globals
//		factory(jQuery);
//	}
//}(
	+function($) {
	'use strict';

	/**
	 * 验证器
	 * @class 验证器基类
	 * @constructor
	 * @public
	 */
	function Validator() {};

	/**
	 * 验证总体，返回false代表验证失败，返回一个对象{'value' : value}代表成功
	 * @param {String} value
	 * @public
	 */
	Validator.prototype.validate = function(value) {
		return {'value' : value};
	};

	/**
	 * 验证输入的单个字符
	 * @public
	 */
	Validator.prototype.validateUnit = function(presssKey, aggValue) {
		return true;
	};


	/**
	 * 字符验证器
	 * @class 字符验证器
	 * @param {Number} maxSize 最大允许长度
	 * @public
	 */
	function StringValidator(maxSize, validateReg, nullable) {
		if (maxSize == null || parseInt(maxSize) < 0)
			this.maxSize = -1;
		else
			this.maxSize = maxSize;
		this.validateReg = validateReg;
		this.nullable = nullable;
	};

	/**
	 * 验证总体
	 * @param {String} value
	 * @public
	 */
	StringValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
			
		if (this.maxSize > 0) {
			// 若输入字节长度大于指定长度,则截去超过指定的最大长度的部分
			if (value.lengthb() > this.maxSize)
				value = value.substrCH(this.maxSize);
		}
		if (this.validateReg) {
			var reg = new RegExp(this.validateReg);
			var r = value.match(reg);
			if (r == null || r == false)
				return false;
		}
		return {'value' : value};
	};

	/**
	 * 验证输入的单个字符
	 * @param {String} aggValue输入的字符串
	 * @public
	 */
	StringValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		if (this.maxSize != -1) {
			if (aggValue.lengthb() > this.maxSize)
				return false;
		}
		return true;
	};

	/**
	 * 浮点数验证器，判断传入的是否时浮点数，不足精度的自动补全。不是浮点数的返回空值 如果指定了最大值或者最小值则校验大小范围
	 * @class 浮点数验证器
	 * @param {Number} precision 精度
	 * @param {Number} minValue 最小值
	 * @param {Number} maxValue 最大值
	 * @public
	 */
	function DicimalValidator(precision, minValue, maxValue, nullable) {
		this.precision = getInteger(precision, 2); // 默认精度为2
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.nullable = nullable;
	};

	/**
	 * 验证
	 * @param {String} value
	 * @public
	 */
	DicimalValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
		if (this.minValue != null && parseFloat(value) < this.minValue)
			return false;
		if (this.maxValue != null && parseFloat(value) > this.maxValue)
			return false;
		value = value + "";

		for (var i = 0; i < value.length; i++) {
			if ("-0123456789.".indexOf(value.charAt(i)) == -1)
				return false;
		}

		var value = checkDicimalInvalid(value, this.precision);
		return {'value' : value};
	};

	/**
	 * 校验
	 * @param {aggValue} aggValue
	 * @public
	 */
	DicimalValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		//检测输入的是否为字符
		if ("0123456789.-".indexOf(key) == -1) {
			return false;
		}
		//IE浏览器
		return checkInputDicimal(aggValue, this.precision, this.minValue, this.maxValue);
	};

	/**
	 * 浮点型输入框的实时检测
	 * @param {String} value
	 * @param {Number} precision 精度
	 * @private
	 */
	function checkInputDicimal(value, precision, minValue, maxValue) {
		if (value == null || value == "")
			return false;
		value = value + "";
		//若value是有"."数，则判断其是否为合法浮点数
		var freg = new RegExp(/^-?([0-9]\d*\.\d*|0\.\d*[0-9]\d*|0?\.0+|0)$/);
		if (freg.test(value)) {
			// "."前面的整数位数不能超过15 - precision位
			if (value.indexOf(".") != -1) {
				var intNumber = value.substr(0, value.indexOf("."));
				if (intNumber.length > 15 - precision - 1)
					return false;
			}

			//"."后面的小数位数不能超过精度
			var num = 0,
				start = 0;
			if ((start = value.indexOf(".")) != -1) {
				if ((value.substring(start + 1)).length > parseInt(precision))
					return false;
			}
		} else {
			//若value是没"."整数，则判断其是否为合法整数
			var nreg = new RegExp(/^(-|\+)?\d+$/);
			if (nreg.test(value)) {
				// 没"."整数位数不能超过15 - precision位
				if (value.length > 15 - precision - 1)
					return false;
			} else {
				if ( !(value == "-" || value == "0." || value == "-0.") ) {
					return false;
				}	
			}

		}
		if (minValue && parseFloat(value) < minValue)
			return false;
		if (maxValue && parseFloat(value) > maxValue)
			return false;
		return true;
	};

	/**
	 * 校验浮点类型。对于浮点型输入框帮助用户完成他的无意失误
	 * @param {String} str
	 * @param {Number} precision 精度
	 * @private
	 */
	function checkDicimalInvalid(str, precision) {
		if (str == null || isNaN(str))
			return "";
		// 浮点数总位数不能超过10位
		if (str.length > 15)
			str = str.substring(0, 15);

		// 默认2位精度
		if (precision == null || !isNumberOnly(precision))
			precision = 2;
		else
			precision = parseInt(precision);
		var digit = parseFloat(str);
		var result = (digit * Math.pow(10, precision) / Math.pow(10, precision))
			.toFixed(precision);
		if (result == "NaN")
			return "";

		return result;

	};


	/**
	 * 整数验证器
	 * @class 整数验证器。判断传入的是否是整数，是否介于设定的上下界直接。不符合返回空值。
	 * @param {Number} minValue
	 * @param {Number} maxValue
	 * @constructor
	 * @public
	 */
	function IntegerValidator(minValue, maxValue, nullable) {
		if (!$.u.isNumber(minValue))
			this.minValue = -999999999999999;
		else
			this.minValue = parseInt(minValue);

		if (!$.u.isNumber(maxValue))
			this.maxValue = 999999999999999;
		else
			this.maxValue = parseInt(maxValue);
		this.nullable = nullable;
		
	};

	/**
	 * 验证方法
	 * @param {String} value
	 * @private
	 */
	IntegerValidator.prototype.validate = function(value, isBlur) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}

		// 以0开头的数字将其前面的0去掉
		if (!$.u.IS_IE) {
			while ((value + "").charAt(0) == "0" && value.length > 1) {
				value = value.substring(1);
			}
		}
		if (!isNumber(value)) {
			return false;
		}
		if (isBlur) {
			if (value < this.minValue || value > this.maxValue)
				return false;
		}

		if (checkIntegerIsValid(value, this.minValue, this.maxValue) == true) {
			return {'value' : value};
		} else {
			return false;
		}
	};

	/**
	 * 整数类型校验
	 * @param {String} key 按下的键
	 * @param {String} aggValue输入的字符串
	 * @private
	 */
	IntegerValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		var isInvalid = false;
		// 检测输入的是否为数字
		if ("-0123456789".indexOf(key) == -1)
			isInvalid = false;
		else
			isInvalid = true;

		if (isInvalid == true) {

			// 只输入一个负号时认为合法
			if (aggValue == "-")
				return true;
			else {
				/*valid时考虑最大值和最小值*/
				if (isNumber(aggValue)) {
					//整数最多能输入15位
					if (aggValue.length > 15)
						return false;
					return checkIntegerIsValid(aggValue, this.minValue, this.maxValue);
				}
				return false;
			}
		} else {
			return false;
		}
		return true;
	};


	/**
	 * 校验整数类型
	 * @param {String} value
	 * @param {Number} minValue
	 * @param {Number} maxValue
	 * @return {Boolean} 是否合法
	 * @private
	 */
	function checkIntegerIsValid(value, minValue, maxValue) {
		// 确定传入参数的合法性
		if (!isNumber(value))
			return false;

		value = parseInt(value);
		if (!isNumber(minValue)) {
			minValue = -99999999999999;
		}

		if (!isNumber(maxValue)) {
			maxValue = 999999999999999;
		}
		// 整数不能超过范围
		if ((value > maxValue) || (value < minValue))
			return false;
		else
			return true;
	};


	/**
	 * email验证器
	 * @class email验证器。将传入值解析，若传入正确，则返回正确格式的日期，否则返回空值。
	 * @constructor
	 * @public
	 */
	function EmailValidator(maxSize, nullable) {
		if (maxSize == null || parseInt(maxSize) < 0)
			this.maxSize = -1;
		else
			this.maxSize = maxSize;
		this.nullable = nullable;
	};


	/**
	 * 验证方法
	 * @param {String} value
	 * @public
	 */
	EmailValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
		if (this.maxSize > 0) {
			// 若输入字节长度大于指定长度,则截去超过指定的最大长度的部分
			if (value.lengthb() > this.maxSize)
				value = value.substrCH(this.maxSize);
		}
		//	var reg = /^([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
		var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		var r = value.match(reg);
		if (r == null) {
			return false;
		} else if (r == false) {
			return false;
		}
		return {'value' : value};
	};

	/**
	 * 校验方法
	 * @param {String} aggValue输入的字符串
	 * @public
	 */
	EmailValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		// 校验最大长度
		if (this.maxSize != -1) {
			if (aggValue.lengthb() > this.maxSize)
				return false;
		}
		return true;
	};



	/**
	 * email验证器
	 * @class email验证器。将传入值解析，若传入正确，则返回正确格式的日期，否则返回空值。
	 * @constructor
	 * @public
	 */
	function PhoneValidator(maxSize, nullable) {
		if (maxSize == null || parseInt(maxSize) < 0)
			this.maxSize = -1;
		else
			this.maxSize = maxSize;
		this.nullable = nullable;
	};


	/**
	 * 验证方法
	 * @param {String} value
	 * @public
	 */
	PhoneValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
		if (this.maxSize > 0) {
			// 若输入字节长度大于指定长度,则截去超过指定的最大长度的部分
			if (value.lengthb() > this.maxSize)
				value = value.substrCH(this.maxSize);
		}

		// 电话号码正则表达式（支持(+2-3位国家号-)手机号码，+2-3位国家号-，3-4位区号-，7-8位直播号码，-1－4位分机号） 
		//var reg = /^(\d{11})|^(([0\+]\d{2,3}-)?(0\d{2,3}-)?(\d{7,8})(-(\d{1,4})?$/;
		var reg = /^([0\+]\d{2,3}-)?(\d{11})$|^([0\+]\d{2,3}-)?(0\d{2,3}-)?(\d{7,8})(-(\d{1,4}))?$/;

		var r = value.match(reg);
		if (r == null) {
			return false;
		} else if (r == false) {
			return false;
		}
		return {'value' : value};
	};

	/**
	 * 校验方法
	 * @param {String} aggValue输入的字符串
	 * @public
	 */
	PhoneValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		// 校验最大长度
		if (this.maxSize != -1) {
			if (aggValue.lengthb() > this.maxSize)
				return false;
		}
		return true;
	};

	/**
	 * 验证传入的字符是否是整数(0-9包括"-"),且整数必须介于javascript规定的最大值最小值之间
	 * @param str 输入值 
	 * @return {Boolean}
	 */
	function isNumber(str) {
		// 将输入的str转化为字符串.否则js认为000 == "0"为true
		str = str + "";
		if (str == "0")
			return true;

		var patrn = /(^-[1-9]\d*$)|^([1-9]\d*$)/;
		if (patrn.exec(str) == null)
			return false;
		else {
			if (parseInt(str) >= -9007199254740992
					&& parseInt(str) <= 9007199254740992)
				return true;
			else
				return false;
		}
	};

	/**
	 * 获取整型值
	 * @param value 输入值
	 * @param {Int} defaultValue 默认值
	 * @return {Int} 返回parseInt后的输入值，未能正确解析时，返回defaultValue
	 */
	function getInteger(value, defaultValue) {
		if (isNaN(parseInt(value)))
			return defaultValue;
		return parseInt(value);
	};

	/**
	 * 
	 * 验证传入的str是否是数字 alert(validate("1.22")) //true alert(validate("111")) //true
	 * alert(validate("1..22")) //false alert(validate("1.2a2")) //false
	 * alert(validate("1.")) //false
	 * @param str 输入值
	 * @return {Boolean}  
	 */
	function isDigital(str) {
		var re = /^((-?)([1-9]+[0-9]*|0{1}))(\.\d+)?$/;
		return re.test(str);
	};

	$.u.isNumber = isNumber;

	$.u.Validator = Validator;
	$.u.StringValidator = StringValidator;
	$.u.DicimalValidator = DicimalValidator;
	$.u.IntegerValidator = IntegerValidator;
	$.u.EmailValidator = EmailValidator;
	$.u.PhoneValidator = PhoneValidator;

	
}(jQuery);


//+function( factory ) {
//if ( typeof define === "function" && define.amd ) {
//
//  // AMD. Register as an anonymous module.
//  define([
//    "jquery",
//    "./validator",
//    "./masker"
//  ], factory );
//} else {
//
//  // Browser globals
//  factory( jQuery );
//}
//}(
	+function ($){
  'use strict';

  var Input = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Input.DEFAULTS, options)
    this.update(this.options)
  }

  Input.DEFAULTS = {
    type:'text',
    value:'',
    classname:'form-control',
    visible:true,
    enabled:true,
    nullable:true,
    tip:'',
    tiptarget:'',
    mask:null,

    maxlength:null,
    validatereg:'',
    errormsg:'validate fail',
    errormsgtarget:'',

    precision:2,
    min:null,
    max:null
  }

  Input.fn = Input.prototype;
  Input.fn.click = function(func){
    this.$element.click(func);
    return this;
  }
  
  Input.fn.value = function(value){
    if (value == undefined) {
      return this.trueValue;
    } else{
      this.trueValue = value;
      return this;
    }
  }
  
  Input.fn.update = function(op){
    if (op == null) return;
   // this.$element.addClass(op.classname);
    this.composeHtml(op);
    this.registerEvents(op);
    
  }

  Input.fn.composeHtml = function(op){
    var ip;
    if(this.$element.is('input')) {
      ip = this.$element;
    } else if(this.$element.find('input').length > 0) {
      ip = this.$element.find('input');
    } else {
      this.$element.append('<input></input>');
      ip = this.$element.find('input');
    }

    ip.addClass(op.classname).val(op.value);

    if(op.visible) {
      ip.css('display', 'block');
    } else {
      ip.css('display', 'none');
    }

    if(!op.enabled) {
      ip.attr('disabled', 'disabled');
    }

    if(op.tip) {
      if(op.tiptarget) {
        $(op.tiptarget).text(op.tip);
      } else {
        ip.attr('title', op.tip);
      }
    }

    if(op.placeholder) {
      ip.attr('placeholder', op.placeholder);
    }


    if(op.type == 'text' || op.type == 'int' || op.type == 'float' || op.type == 'email' ) {
      ip.attr('type', 'text');
    }

    if(op.type == 'text') {
      if(op.maxlength) {
        ip.attr('maxlength', op.maxlength);
      }
    }

    if(op.type == 'password') {
      ip.attr('type', op.type);
    }
  }

  Input.fn.registerEvents = function(op){
    var input = this.$element.find('input');
    var oThis = this;
    input.keypress(function(e){
      if(e.keyCode == 13) {
        // 回车
        return ;
      }
      var charInput = String.fromCharCode(e.keyCode);
      var aggValue = (oThis.value() ? oThis.value() : '') + charInput;
      var rsl = true;
      var validator = oThis.getValidator(op);
      if(validator) {
        rsl = validator.validateUnit(charInput, aggValue);
      }
      if(!rsl){
        e.preventDefault();
      }
    });

    input.keyup(function(e){
      oThis.value($(this).val());
    });



    input.blur(function(e) {
      if(op.type == 'text' || op.type == 'email' || op.type == 'phone' || op.type == 'int') {
        var validator = oThis.getValidator(op);
        var rsl = validator.validate(oThis.value());
        if(!rsl) {
          $(this).parent().addClass('has-error');
          if(op.errormsgtarget) {
            $(op.errormsgtarget).text(op.errormsg);
          }
        } else {
          $(this).parent().removeClass('has-error');
          oThis.value(rsl.value);
          $(this).val(oThis.value());
        }
      }

      var masker = oThis.getMasker(op);
      if(masker) {
        var showValue = masker.format(oThis.value()).value;
        $(this).val(showValue);
      }
    });

    input.focus(function(e) {
      $(this).parent().removeClass('has-error');
      $(this).val(oThis.value());
    });


  }

  Input.fn.getValidator = function(op){
    if(!this.validator) {
      if(op.type == 'text') {
        this.validator = new $.u.StringValidator(op.maxlength, op.validatereg, op.nullable);
      } else if(op.type == 'int') {
        this.validator = new $.u.IntegerValidator(op.min, op.max, op.nullable);
      } else if(op.type == 'float') {
        this.validator = new $.u.DicimalValidator(op.precision, op.min, op.max, op.nullable);
      } else if(op.type == 'email') {
        this.validator = new $.u.EmailValidator(null, op.nullable);
      } else if(op.type == 'phone') {
        this.validator = new $.u.PhoneValidator(null, op.nullable);
      }
    }
    return this.validator;
  }

  Input.fn.getMasker = function(op){
    if(!this.masker) {
      if(op.type == 'int' || op.type == 'float') {
         this.masker = new $.u.NumberMasker(op.mask);
      } else if(op.type == 'percent') {
        this.masker = new $.u.PrecentMasker(op.mask);
      }
    }
    return this.masker;
  }



  function Plugin(option) {
    if (this.length != 1) return;
    var $this   = $(this)
    var data    = $this.data('u.input')
    var options = typeof option == 'object' && option
    
    if (!data) $this.data('u.input', (data = new Input(this, options)))
    else data.update(options);
    return data;
  }

  var old = $.fn.input

  $.fn.input             = Plugin
  $.fn.input.Constructor = Input


  $.fn.input.noConflict = function () {
    $.fn.input = old
    return this
  }
  

}(jQuery);

//+ function(factory) {
//	if (typeof define === "function" && define.amd) {
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery",
//			"./core",
//			"./JsExtensions"
//		], factory);
//	} else {
//
//		// Browser globals
//		factory(jQuery);
//	}
//}(
	+function($) {
	'use strict';

	/**
	 * 抽象格式化类
	 */
	function AbstractMasker() {	
	};

	AbstractMasker.prototype.format = function(obj){
		if(obj == null)
			return null;
			
		var fObj = this.formatArgument(obj);
		return this.innerFormat(fObj);
	};
		
	/**
	 * 统一被格式化对象结构
	 * 
	 * @param obj
	 * @return
	 */
	AbstractMasker.prototype.formatArgument = function(obj){
		
	};
		
	/**
	 * 格式化
	 * 
	 * @param obj
	 * @return
	 */
	AbstractMasker.prototype.innerFormat = function(obj){
		
	};

	/**
	 * 拆分算法格式化虚基类
	 */
	AbstractSplitMasker.prototype = new AbstractMasker;
	function AbstractSplitMasker() {	
	};
	AbstractSplitMasker.prototype.elements = new Array ;
	AbstractSplitMasker.prototype.format = function(obj){
		if(obj == null)
			return null;
			
		var fObj = this.formatArgument(obj);
		return this.innerFormat(fObj);
	};
		
	/**
	 * 统一被格式化对象结构
	 * 
	 * @param obj
	 * @return
	 */
	AbstractSplitMasker.prototype.formatArgument = function(obj){
		return obj;
	};
		
	/**
	 * 格式化
	 * 
	 * @param obj
	 * @return
	 */
	AbstractSplitMasker.prototype.innerFormat = function(obj){
		if(obj == null || obj == "")
		   return new FormatResult(obj);
		this.doSplit();
		var result = "";
		//dingrf 去掉concat合并数组的方式，换用多维数组来实现 提高效率
		result = this.getElementsValue(this.elements, obj);
	//	for(var i = 0; i < this.elements.length ; i++){
	//		if(i != undefined){
	//			var element = this.elements[i];
	//			var elementValue = element.getValue(obj);
	//			if(elementValue != undefined)
	//				result = result + elementValue;
	//		}
	//	}
		return new FormatResult(result);
	};

	/**
	 * 合并多维数组中的elementValue
	 * @param {} element
	 * @param {} obj
	 * @return {}
	 */
	AbstractSplitMasker.prototype.getElementsValue = function(element, obj){
		var result = "";
		if (element instanceof Array){
			for(var i = 0; i < element.length ; i++){
				result = result + this.getElementsValue(element[i], obj);
			}	
		}
		else{
			if(element.getValue)
				result = element.getValue(obj);
		}
		return result;	
	};

	AbstractSplitMasker.prototype.getExpress = function() {
		
	};

	AbstractSplitMasker.prototype.doSplit = function(){
		var express = this.getExpress();
		if(this.elements == null || this.elements.length == 0)
			this.elements = this.doQuotation(express, this.getSeperators(), this.getReplaceds(), 0);
	};


	/**
	 * 处理引号
	 * 
	 * @param express
	 * @param seperators
	 * @param replaced
	 * @param curSeperator
	 * @param obj
	 * @param result
	 */
	AbstractSplitMasker.prototype.doQuotation = function(express, seperators, replaced, curSeperator){
		if(express.length == 0)
			return null;
		var elements = new Array();
		var pattern = new RegExp('".*?"',"g");
		var fromIndex = 0;
		var result ;
		do
		{
			result = pattern.exec(express);
			if(result != null){
			  var i = result.index;
			  var j = pattern.lastIndex ;
			  if(i != j){
					if(fromIndex < i){
						var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator);
						if(childElements != null && childElements.length > 0){
	//						elements = elements.concat(childElements);
							elements.push(childElements);
						}
					}
			  }
				elements.push(new StringElement(express.substring(i + 1, j-1)));
				fromIndex = j;
			}
		}
		while (result!=null);
		
		if(fromIndex < express.length ){
			var childElements = this.doSeperator(express.substring(fromIndex, express.length ), seperators, replaced, curSeperator);
			if(childElements != null && childElements.length > 0)
	//			elements = elements.concat(childElements);
				elements.push(childElements);
		}
		return elements;
	};
		
	/**
	 * 处理其它分隔符
	 * 
	 * @param express
	 * @param seperators
	 * @param replaced
	 * @param curSeperator
	 * @param obj
	 * @param result
	 */
	AbstractSplitMasker.prototype.doSeperator = function(express, seperators, replaced, curSeperator){
		if(curSeperator >= seperators.length){
			var elements = new Array;
			elements.push(this.getVarElement(express));
			return elements;
		}
			
		if(express.length == 0)
			return null;
		var fromIndex = 0;
		var elements = new Array();
		var pattern = new RegExp(seperators[curSeperator],"g");
		var result ;
		do
		{
			result = pattern.exec(express);
			if(result != null){
				var i =  result.index ;
				var j = pattern.lastIndex;
				if(i != j){
					if(fromIndex < i){
						var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator + 1);
						if(childElements != null && childElements.length > 0)
	//						elements = elements.concat(childElements);
							elements.push(childElements);
					}

					if(replaced[curSeperator] != null){
						elements.push(new StringElement(replaced[curSeperator]));
					}else{
						elements.push(new StringElement(express.substring(i, j)));
					}
					fromIndex = j;
				}
			}
		}
		while (result!=null);
		
		if(fromIndex < express.length ){
			var childElements = this.doSeperator(express.substring(fromIndex, express.length ), seperators, replaced, curSeperator + 1);
			if(childElements != null && childElements.length > 0)
	//			elements = elements.concat(childElements);
				elements.push(childElements);
		}
		return elements;
	};


	/**
	 * 地址格式
	 */
	AddressMasker.prototype = new AbstractSplitMasker;
	function AddressMasker(formatMeta) {
		this.formatMeta = formatMeta;
	};

	AddressMasker.prototype.getExpress = function() {
		return this.formatMeta.express;
	};

	AddressMasker.prototype.getReplaceds = function() {
		return [this.formatMeta.separator];
	};

	AddressMasker.prototype.getSeperators = function() {
		return ["(\\s)+?"];
	};

	AddressMasker.prototype.getVarElement = function(express) {
		var ex = {};
		
		if(express == ("C")) 
				ex.getValue = function(obj){
					return obj.country;
				};
	 
			
			if(express == ("S"))
			ex.getValue = function(obj){
				return obj.state;
			};
			 
		
		if(express == ("T"))
			ex.getValue = function(obj){
				return obj.city;
			};
			 
		
		if(express == ("D"))
			ex.getValue = function(obj){
				return obj.section;
			};
			 
		
		if(express == ("R"))
			ex.getValue = function(obj){
				return obj.road;
			};
			 
		if(express == ("P"))
			ex.getValue = function(obj){
				return obj.postcode;
			};

		if(typeof(ex.getValue) == undefined)
			return new StringElement(express);
		else
			return ex;
	};
	 
	AddressMasker.prototype.formatArgument = function(obj){
			return obj;
	};

	/**
	 * <b> 数字格式化  </b>
	 *
	 * <p> 格式化数字 
	 *
	 * </p>
	 *
	 * Create at 2009-3-20 上午08:50:32
	 * 
	 * @author bq 
	 * @since V6.0
	 */
	NumberMasker.prototype = new AbstractMasker;
	NumberMasker.prototype.formatMeta = null;

	/**
	*格式化对象
	*/
	NumberMasker.prototype.innerFormat = function (obj){
	  var dValue, express, seperatorIndex, strValue;
	  dValue = obj.value;
	  if (dValue > 0) {
	    express = this.formatMeta.positiveFormat;
	    strValue = dValue + '';
	  }
	   else if (dValue < 0) {
	    express = this.formatMeta.negativeFormat;
	    strValue = (dValue + '').substr(1, (dValue + '').length - 1);
	  }
	   else {
	    express = this.formatMeta.positiveFormat;
	    strValue = dValue + '';
	  }
	  seperatorIndex = strValue.indexOf('.');
	  strValue = this.setTheSeperator(strValue, seperatorIndex);
	  strValue = this.setTheMark(strValue, seperatorIndex);
	  var color = null;
	  if(dValue < 0 && this.formatMeta.isNegRed){
	  	color = "FF0000";
	  }	
	  return new FormatResult(express.replaceAll('n', strValue) ,color);
	 
	};
	/**
	*设置标记
	*/
	NumberMasker.prototype.setTheMark = function (str, seperatorIndex){
	  var endIndex, first, index;
	  if (!this.formatMeta.isMarkEnable)
	    return str;
	  if(seperatorIndex <= 0)
		seperatorIndex = str.length;
	  first = str.charCodeAt(0);
	  endIndex = 0;
	  if(first == 45)
	  	endIndex = 1;
	  index = seperatorIndex - 3;
	  while (index > endIndex) {
	    str = str.substr(0, index - 0) + this.formatMeta.markSymbol + str.substr(index, str.length - index);
	    index = index - 3;
	  }
	  return str;
	};
	NumberMasker.prototype.setTheSeperator = function(str, seperatorIndex){
	  var ca;
	  if (seperatorIndex > 0) {
	    ca = NumberMasker.toCharArray(str);
		//ca[seperatorIndex] = NumberMasker.toCharArray(this.formatMeta.pointSymbol)[0];
	    ca[seperatorIndex] = this.formatMeta.pointSymbol;
	    str =  ca.join('');
	  }
	  return str;
	};
	/**
	 * 将字符串转换成char数组
	 * @param {} str
	 * @return {}
	 */
	NumberMasker.toCharArray = function(str){
		var str = str.split("");
		var charArray = new Array();
		for(var i=0 ; i< str.length ;i++){
		    charArray.push(str[i]);
		}
		return charArray;
	};

	NumberMasker.DftFormatMeta = {
		isNegRed:true,
		isMarkEnable:true,
		markSymbol:",",
		pointSymbol:".",
		positiveFormat:"n",
		negativeFormat:"-n"
	}

	/**
	*构造方法
	*/
	function NumberMasker(formatMeta){
		this.formatMeta   = $.extend({}, NumberMasker.DftFormatMeta, formatMeta)
	};
	/**
	*默认构造方法
	*/
	NumberMasker.prototype.formatArgument = function(obj){
		var numberObj = {};
		numberObj.value = obj;
		return numberObj;
	}; 

	//NumberMasker.prototype.format = function(obj){
	//	
	//};

	/**
	 * 货币格式
	 */
	CurrencyMasker.prototype = new NumberMasker;
	CurrencyMasker.prototype.formatMeta = null;
	function CurrencyMasker(formatMeta){
		this.formatMeta = formatMeta;
	};
	/**
	 * 重载格式方法
	 * @param {} obj
	 * @return {}
	 */
	CurrencyMasker.prototype.innerFormat = function(obj){
		var fo = (new NumberFormat(this.formatMeta)).innerFormat(obj);
		fo.value = fo.value.replace("$", this.formatMeta.curSymbol);
		return fo;
	};

	DateTimeMasker.prototype = new AbstractSplitMasker;
	/**
	 * 英文短日期
	 */
	DateTimeMasker.enShortMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	/**
	 * 英文长日期 
	 */
	DateTimeMasker.enLongMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	DateTimeMasker.prototype.formatMeta = null;
	function DateTimeMasker(formatMeta){
		this.formatMeta = formatMeta;
	};
		
	DateTimeMasker.prototype.doOne = function(express){
		if(express.length == 0)
			return new "";
		var obj = new Object;
		if(express == "yyyy"){
			obj.getValue = function(o) {
				return DateTimeMasker.getyyyy(o);
			};
		}
		 if(express == "yy"){
			obj.getValue = function(o) {
				return DateTimeMasker.getyy(o);
			};
		}
		if(express == "MMMM"){
			obj.getValue = function(o) {
				return DateTimeMasker.getMMMM(o);
			};
		}
			
		if(express == "MMM"){
			obj.getValue = function(o) {
				return DateTimeMasker.getMMM(o);
			};
		}
				
		if(express == "MM"){
			obj.getValue = function(o) {
				return DateTimeMasker.getMM(o);
			};
		}
				
		if(express == "M"){
			obj.getValue = function(o) {
				return DateTimeMasker.getM(o);
			};
		}
		
		if(express == "dd"){
			obj.getValue = function(o) {
				return DateTimeMasker.getdd(o);
			};
		}
		
		if(express == "d"){
			obj.getValue = function(o) {
				return DateTimeMasker.getd(o);
			};
		}
		
		if(express == "hh"){
			obj.getValue = function(o) {
				return DateTimeMasker.gethh(o);
			};
		}
		
		if(express == "h"){
			obj.getValue = function(o) {
				return DateTimeMasker.geth(o);
			};
		}
		
		if(express == "mm"){
			obj.getValue = function(o) {
				return DateTimeMasker.getmm(o);
			};
		}
		
		if(express == "m"){
			obj.getValue = function(o) {
				return DateTimeMasker.getm(o);
			};
		}
		
		if(express == "ss"){
			obj.getValue = function(o) {
				return DateTimeMasker.getss(o);
			};
		}
		
		if(express == "s"){
			obj.getValue = function(o) {
				return DateTimeMasker.gets(o);
			};
		}
		
		if(express == "HH"){
			obj.getValue = function(o) {
				return DateTimeMasker.getHH(o);
			};
		}
		
		if(express == "H"){
			obj.getValue = function(o) {
				return DateTimeMasker.getH(o);
			};
		}
		if(express == "t"){
			obj.getValue = function(o) {
				return DateTimeMasker.gett(o);
			};
		}
		
		if(express == "st"){
			obj.getValue = function(o){
				return DateTimeMasker.gets(o)+DateTimeMasker.gett(o);
			};
		}
		
		if(express == "mt"){
			obj.getValue = function(o){
				return DateTimeMasker.getm(o)+DateTimeMasker.gett(o);
			};
		}
		
		if(express == "yyyyMMdd"){
			obj.getValue = function(o){
				return DateTimeMasker.getyyyy(o) + DateTimeMasker.getMM(o) + DateTimeMasker.getdd(o);
			};
		}
		
		if(typeof(obj.getValue) == "undefined"){
			obj.getValue = function(o){
				return DateTimeMasker.getyyyy(o) + "-" + DateTimeMasker.getMM(o) + "-" + DateTimeMasker.getdd(o);
			};	
		}
		
		return obj;
	};
		
	DateTimeMasker.getyyyy = function(date){
		return date.getFullYear();
	};
		
	DateTimeMasker.getyy = function(date){
		return (""+date.getFullYear()).substring(2);
	};
		
	DateTimeMasker.getM = function(date){
		return ""+(date.getMonth() + 1);
	};
		
	DateTimeMasker.getMM = function(date){
		var month = date.getMonth() + 1;
		if(month < 10)
			return "0" + month;
		return month;
	};
		
	DateTimeMasker.getMMM = function(date){
		return this.enShortMonth[date.getMonth()];
	};
		
	DateTimeMasker.getMMMM = function(date){
		return this.enLongMonth[date.getMonth()];
	};
		
	DateTimeMasker.getdd = function(date){
		var day = date.getDate();
		if(day < 10)
			return "0" + day;
		return date.getDate()+"";
	};
		
	DateTimeMasker.getd = function(date){
		return date.getDate()+"";
	};
		
	DateTimeMasker.gethh = function(date){
		var hh = date.getHours();
		if(hh < 10)
			return "0" + hh;
		
		return (date.getHours())+"";
	};
		
	DateTimeMasker.geth = function(date){
		return (date.getHours())+"";
	};
		
	DateTimeMasker.getHH = function(date){
		var HH = date.getHours();
		
		if(HH >= 12)
			HH = HH - 12;
		
		if(HH < 10)
			return "0" + HH;
		return (HH)+"";
	};
		
	DateTimeMasker.getH = function(date){
		var HH = date.getHours();
		
		if(HH >= 12)
			HH = HH - 12;
		
		return (HH)+"";
	};
		
	DateTimeMasker.getmm = function(date){
		var mm = date.getMinutes();
		if(mm < 10)
			return "0" + mm;
		
		return  (date.getMinutes())+"";
	};
		
	DateTimeMasker.getm = function(date){
		return ""+(date.getMinutes());
	};
		
	DateTimeMasker.getss = function(date){
		var ss = date.getSeconds();
		if(ss < 10)
			return "0" + ss;
		
		return (ss)+"";
	};
		
	DateTimeMasker.gets = function(date){
		return (date.getSeconds())+"";
	};
		
	DateTimeMasker.gett = function(date){
		var hh = date.getHours();
		if(hh <= 12)
			return "AM";
		else
			return "PM";
	};
		
	DateTimeMasker.prototype.getExpress = function() {
		return this.formatMeta.format;
	};

	DateTimeMasker.prototype.getReplaceds = function() {
		return [" ",this.formatMeta.speratorSymbol,":"];
	};

	DateTimeMasker.prototype.getSeperators = function() {
		return ["(\\s)+?","-",":"];
	};

	DateTimeMasker.prototype.getVarElement = function(express) {
		return this.doOne(express);
	};

	DateTimeMasker.prototype.formatArgument = function(obj){ 
		if (obj == 0) return "";
		if(obj == null || obj =="")
			return obj;
		if((typeof obj) == "string"){
			var dateArr = obj.split(" ");
			if(dateArr.length >0){
				var arr0 = dateArr[0].split("-");
				var date = new Date();
				//先把日期设置为1日，解决bug:当前日期为2011-08-31时，选择日期为2011-09-X，会把日期格式化为2011-10-X
				date.setDate(1);
				date.setFullYear(parseInt(arr0[0],10));
				date.setMonth(parseInt(arr0[1],10) -1);
				date.setDate(parseInt(arr0[2],10));
				if(dateArr.length == 2 && dateArr[1] != undefined){
					var arr1 = dateArr[1].split(":");
					date.setHours(parseInt(arr1[0],10));
					date.setMinutes(parseInt(arr1[1],10));
					date.setSeconds(parseInt(arr1[2],10));
					if(arr1.length > 3)
						date.setMilliseconds(parseInt(arr1[3],10));
				}
			}
			return date;
		}
		return (obj);
	};

	/**
	 * 日期格式化
	 */
	DateMasker.prototype = new DateTimeMasker;
	function DateMasker(formatMeta){
	   this.formatMeta = formatMeta; 
	};
	/**
	 * 时间格式化
	 */
	TimeMasker.prototype = new DateTimeMasker;
	function TimeMasker(formatMeta){
		 this.formatMeta = formatMeta;
	};

	PrecentMasker.prototype = new AbstractMasker;
	function PrecentMasker(){
		
	};


	PrecentMasker.prototype.formatArgument = function(obj){
		return obj;
	};

	PrecentMasker.prototype.innerFormat = function(obj){
		var val = "";
		if(obj != ""){
			// 获取obj保留几位小数位,obj小数位-2为显示小数位
			var objStr = String(obj);
			var objPrecision = objStr.length -objStr.indexOf(".") -1;
			var showPrecision = objPrecision-2;
			if(showPrecision < 0){
				showPrecision = 0; 
			}
			val = parseFloat(obj) * 100;
			val = (val * Math.pow(10, showPrecision) / Math.pow(10, showPrecision)).toFixed(showPrecision);
			val = val + "%";
		}
		return {value:val};
	};

	
	/**
	 * 将结果输出成HTML代码
	 * @param {} result
	 * @return {String}
	 */
	function toColorfulString(result){
	  var color;
	  if (!result) {
	    return '';
	  }
	  if (result.color == null) {
	    return result.value;
	  }
	  color = result.color;
	  return '<font color="' + color + '">' + result.value + '<\/font>';
	};

	/**
	 * 格式解析后形成的单个格式单元  
	 * 适用于基于拆分算法的AbstractSplitFormat，表示拆分后的变量单元
	 */
	StringElement.prototype = new Object();
	function StringElement(value) {
		this.value = value;
	};
	StringElement.prototype.value = "";

	StringElement.prototype.getValue = function(obj) {
		return this.value;
	};
	/**
	*格式结果
	*/
	FormatResult.prototype = new Object ;
	/**
	*默认构造方法
	*/
	function FormatResult(value, color){
	  this.value = value;
	  this.color = color;
	};


	$.u.AbstractMasker = AbstractMasker;
	$.u.NumberMasker = NumberMasker;
	$.u.CurrencyMasker = CurrencyMasker;
	$.u.DateTimeMasker = DateTimeMasker;
	$.u.DateMasker = DateMasker;
	$.u.TimeMasker = TimeMasker;
	$.u.PrecentMasker = PrecentMasker;

}(jQuery);
+ function($) {
	"use strict";

	var PageProxy = function(options, page) {
		this.isCurrent = function() {
			return page == options.currentPage;
		}

		this.isFirst = function() {
			return page == 1;
		}

		this.isLast = function() {
			return page == options.totalPages;
		}

		this.isPrev = function() {
			return page == (options.currentPage - 1);
		}

		this.isNext = function() {
			return page == (options.currentPage + 1);
		}

		this.isLeftOuter = function() {
			return page <= options.outerWindow;
		}

		this.isRightOuter = function() {
			return (options.totalPages - page) < options.outerWindow;
		}

		this.isInsideWindow = function() {
			if (options.currentPage < options.innerWindow + 1) {
				return page <= ((options.innerWindow * 2) + 1);
			} else if (options.currentPage > (options.totalPages - options.innerWindow)) {
				return (options.totalPages - page) <= (options.innerWindow * 2);
			} else {
				return Math.abs(options.currentPage - page) <= options.innerWindow;
			}
		}

		this.number = function() {
			return page;
		}
	}

	var View = {
		firstPage: function(pagin, options, currentPageProxy) {
			var li = $('<li>').append($('<a href="#">')
				.html(options.first)
				.bind('click.bs-pagin', function() {
					pagin.firstPage();
					return false;
				}));

			if (currentPageProxy.isFirst()) {
				li.addClass("disabled");
			}

			return li;
		},

		prevPage: function(pagin, options, currentPageProxy) {
			var li = $('<li>').append(
				$('<a href="#">')
				.attr("rel", "prev")
				.html(options.prev)
				.bind('click.bs-pagin', function() {
					pagin.prevPage();
					return false;
				}));

			if (currentPageProxy.isFirst()) {
				li.addClass("disabled");
			}

			return li;
		},

		nextPage: function(pagin, options, currentPageProxy) {
			var li = $('<li>').append(
				$('<a href="#">')
				.attr("rel", "next")
				.html(options.next)
				.bind('click.bs-pagin', function() {
					pagin.nextPage();
					return false;
				}));

			if (currentPageProxy.isLast()) {
				li.addClass("disabled");
			}

			return li;
		},

		lastPage: function(pagin, options, currentPageProxy) {
			var li = $('<li>').append(
				$('<a href="#">')
				.html(options.last)
				.bind('click.bs-pagin', function() {
					pagin.lastPage();
					return false;
				}));

			if (currentPageProxy.isLast()) {
				li.addClass("disabled");
			}

			return li;
		},

		gap: function(pagin, options) {
			return $('<li>').addClass("disabled")
				.append($('<a href="#">').html(options.gap));
		},

		page: function(pagin, options, pageProxy) {
				var li = $('<li>').append(function() {
					var link = $('<a href="#">');
					if (pageProxy.isNext()) {
						link.attr("rel", "next")
					}
					if (pageProxy.isPrev()) {
						link.attr("rel", "prev")
					}
					link.html(pageProxy.number());
					link.bind('click.bs-pagin', function() {
						pagin.page(pageProxy.number());
						return false;
					});
					return link;
				});

				if (pageProxy.isCurrent()) {
					li.addClass("active");
				}

				return li;
			}

	}


	var Pagination = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Pagination.DEFAULTS, options);

		this.$ul = this.$element; //.find("ul");
		this.render();
	}

	Pagination.DEFAULTS = {
		currentPage: null,
		totalPages: null,
		innerWindow: 2,
		outerWindow: 0,
		first: '&laquo;',
		prev: '&lsaquo;',
		next: '&rsaquo;',
		last: '&raquo;',
		gap: '..',
		truncate: false,
		page: function(page) {
			return true
		}
	}

	Pagination.prototype.update = function(options) {
		this.$ul.empty();
		this.options = $.extend({}, this.options, options);
		this.render();
	}	
	Pagination.prototype.render = function() {
		var options = this.options;

		if (!options.totalPages) {
			this.$element.hide();
			return;
		} else {
			this.$element.show();
		}

		var currentPageProxy = new PageProxy(options, options.currentPage);

		if (!currentPageProxy.isFirst() || !options.truncate) {
			if (options.first) {
				this.$ul.append(View.firstPage(this, options, currentPageProxy));
			}

			if (options.prev) {
				this.$ul.append(View.prevPage(this, options, currentPageProxy));
			}
		}

		var wasTruncated = false;
		for (var i = 1, length = options.totalPages; i <= length; i++) {
			var pageProxy = new PageProxy(options, i);
			if (pageProxy.isLeftOuter() || pageProxy.isRightOuter() || pageProxy.isInsideWindow()) {
				this.$ul.append(View.page(this, options, pageProxy));
				wasTruncated = false;
			} else {
				if (!wasTruncated && options.outerWindow > 0) {
					this.$ul.append(View.gap(this, options));
					wasTruncated = true;
				}
			}
		}

		if (!currentPageProxy.isLast() || !options.truncate) {
			if (options.next) {
				this.$ul.append(View.nextPage(this, options, currentPageProxy));
			}

			if (options.last) {
				this.$ul.append(View.lastPage(this, options, currentPageProxy));
			}
		}
	}

	Pagination.prototype.page = function(page, totalPages) {
		var options = this.options;

		if (totalPages === undefined) {
			totalPages = options.totalPages;
		}

		if (page > 0 && page <= totalPages) {
			if (options.page(page)) {
				this.$ul.empty();
				options.currentPage = page;
				options.totalPages = totalPages;
				this.render();
			}
		}

		return false;
	}

	Pagination.prototype.firstPage = function() {
		return this.page(1);
	}

	Pagination.prototype.lastPage = function() {
		return this.page(this.options.totalPages);
	}

	Pagination.prototype.nextPage = function() {
		return this.page(this.options.currentPage + 1);
	}

	Pagination.prototype.prevPage = function() {
		return this.page(this.options.currentPage - 1);
	}


	function Plugin(option) {
		var $this = $(this)
		var data = $this.data('u.pagination')
		var options = typeof option == 'object' && option

		if (!data) $this.data('u.pagination', (data = new Pagination(this, options)))
		else data.update(options);
		return data;
	}


	var old = $.fn.pagination;

	$.fn.pagination = Plugin
	$.fn.pagination.Constructor = Pagination


	$.fn.pagination.noConflict = function() {
		$.fn.pagination = old;
		return this;
	}

}(jQuery);
/**
 * @author zjh
 */
+function ($) {

    "use strict";

    // TREE CONSTRUCTOR AND PROTOTYPE

    /**
     * 树组件
     * @class Tree
     * @constructor
     * @example
     * 	js代码
     * 	$(function(){
			$('#ex-tree-basic').tree({
				data: treeData,
				loadingHTML: '<div class="static-loader">Loading...</div>',
				multiSelect: true,
				cacheItems: true,
				useChkBox:true
			});
		})
		
		html代码
		<div class="tree" id="ex-tree-basic"></div>
     */
    var Tree = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.tree.defaults, options);
        //渲染，改成build建造方法
        this.build(options);
        //叶子节点点击的时候
        this.$element.on('click', '.tree-item', $.proxy( function(ev) { this.selectChildren(ev.currentTarget); } ,this));
        //父节点点击的时候
        this.$element.on('click', '.tree-folder-header', $.proxy( function(ev) { this.selectParent(ev.currentTarget); }, this));
        //复选框点击的时候
        this.$element.on('click',':checkbox',$.proxy(function(ev){this.checkParent(ev.currentTarget);},this));
        //右键点击树节点的时候，目前先暂定任意节点
        this.$element.on('mousedown','.tree-folder-name,.tree-item-name',$.proxy(function(ev){this.popMenu(ev.currentTarget,ev);},this));
        //添加鼠标右键事件监听
        this.$element.on('contextmenu','.tree-folder-header,.tree-item-name',$.proxy(function(ev){this.initContextmenu(ev);},this));

    };

    Tree.prototype = {
    	
        constructor: Tree,

        //建造方法，包括对参数ajaxUrl的判断，如果包含有该参数，则ajax方式获取，而不是data属性
        build: function(options){
            var self = this;
            if(options.ajaxUrl==""||options.ajaxUrl==null){
                self.render();
            }else{
                $.ajax({
                    type:"POST",
                    url:options.ajaxUrl,
                    dataType:"text",
                    data:options.reqParam,
                    success:function(data){
                        options.data = eval(data);
                        self.render();
                    },error:function(){

                    }
                });
            }
        },

        //渲染方法
        render: function () {
            this.populate(this.options.data, this.$element);
            this.$element.find('.tree-folder').show();
            this.$element.find('.tree-item').show();
        },
        populate: function (data, $el) {
            var self = this;
            $.each(data, function(index, value) {
                var $entity ;
                //如果还有子节点
                if(!self.isEmpty(value.children) || value.type == 'parent'){
                    $entity = self.createParent();
                    $entity.find('.tree-folder-name').html(value.title);
                    $entity.find('.tree-folder-header').data(value.id);
                    $entity.attr("id",value.id);
                    self.populate(value.children, $entity.find(".tree-folder-content:eq(0)"));
                    $entity.find(".tree-folder-content:eq(0)").hide();
                    //这里加上检测是否有自定义图标
                    if(value.icon){
                        $entity.children('.tree-folder-header').children("i").addClass(value.icon)
                            .prop("icon",value.icon);
                    }
                }else{
                    $entity = self.createChildren();
                    $entity.find('.tree-item-name').html(value.title);
                    $entity.attr("href",value.href);
                    $entity.attr("id",value.id);
                    $entity.data(value.id);
                    //这里加上检测是否有自定义图标，对于子节点，还有个bug
                    if(value.icon){
                        $entity.children("i").addClass(value.icon).prop("icon",value.icon);
                    }
                }
                $el.append($entity);
            });
        },
        isEmpty: function(obj){
            if(!obj){
                return true;
            }
            for (var i in obj ) {
                if(obj.hasOwnProperty(i)){
                    return false;
                }
            }
            return true;
        },
        createParent: function(){
            var $node;
            //如果采用复选框
            if(this.options.useChkBox){
                $node = $('<div class="tree-folder checkbox" style="display:none;">' +
                    '<input type="checkbox">'+
                    '<div class="tree-folder-header">' +
                    '<i class="glyphicon glyphicon-folder-close"></i>'+
                    '<div class="tree-folder-name"></div></div><div class="tree-folder-content"></div>'+
                    '<div class="tree-loader" style="display:none"></div></div>');
            }else{
                $node = $('<div class="tree-folder" style="display:none;">'+
                    '<div class="tree-folder-header"><i class="glyphicon glyphicon-folder-close"></i>'+
                    '<div class="tree-folder-name"></div></div><div class="tree-folder-content"></div>'+
                    '<div class="tree-loader" style="display:none"></div></div>');
            }

            return $node;
        },
        createChildren:function(){
            var $node;
            //如果采用复选框
            if(this.options.useChkBox){
                $node = $('<div class="tree-item checkbox" style="display:none;">'+
                    '<input type="checkbox">' +
                    '<div class="tree-item-name"></div></div>');
            }else{
                $node = $('<div class="tree-item" style="display:none;">'+
                    '<i class="glyphicon glyphicon-list-alt"></i><div class="tree-item-name"></div></div>');
            }

            return $node;
        },
        selectChildren: function (el) {
        	
            var $el = $(el);
            var $all = this.$element.find('.tree-selected');
            var data = [];
            
            //检测是否有外部函数
            var eventOnSelect = this.options.onSelect;
        	if(eventOnSelect){
        		eventOnSelect($el);
        		return;
        	}
        	//***************************
        	
            if (this.options.multiSelect) {
                $.each($all, function(index, value) {
                    var $val = $(value);
                    if($val[0] !== $el[0]) {
                        data.push( $(value).data() );
                    }
                });
            } else if ($all[0] !== $el[0]) {
                $all.removeClass('tree-selected')
                    .find('i').removeClass('glyphicon-ok').addClass('glyphicon-list-alt');
                data.push($el.data());
            }

            if($el.hasClass('tree-selected')) {
                $el.removeClass('tree-selected');
                $el.find('i').removeClass('glyphicon-ok').addClass('glyphicon-list-alt');
                //这里检测是否有icon属性
                if($el.find("i").prop("icon")){
                    $el.find("i").addClass($el.find("i").prop("icon"));
                }
            } else {
                $el.addClass ('tree-selected');
                $el.find('i').removeClass('glyphicon-list-alt').addClass('glyphicon-ok');
                if (this.options.multiSelect) {
                    data.push( $el.data() );
                }
            }
            //console.info("icon = " + $el.find("i").prop("icon"));

            if(data.length) {
                this.$element.trigger('selected', {info: data});
            }

        },

        selectParent: function (el) {
            var $el = $(el);
            var $par = $el.parent();

            if($el.find('.glyphicon-folder-close').length) {
                if ($par.find('.tree-folder-content').children().length) {
                    $par.find('.tree-folder-content:eq(0)').show();
                }

                $par.find('.glyphicon-folder-close:eq(0)')
                    .removeClass('glyphicon-folder-close')
                    .addClass('glyphicon-folder-open');

                this.$element.trigger('opened', {element:$el, data: $el.data()});
            } else {
                if(this.options.cacheItems) {
                    $par.find('.tree-folder-content:eq(0)').hide();
                } else {
                    $par.find('.tree-folder-content:eq(0)').empty();
                }

                $par.find('.glyphicon-folder-open:eq(0)')
                    .removeClass('glyphicon-folder-open')
                    .addClass('glyphicon-folder-close');
                this.$element.trigger('closed', {element:$el, data: $el.data()});
            }
        },

        selectedItems: function () {
            var $sel = this.$element.find('.tree-selected');
            var data = [];

            $.each($sel, function (index, value) {
                data.push($(value).data());
            });
            return data;
        }

        //新加函数，勾选父节点的复选框时，下面所有的子节点的复选框都要同样的勾选状态
        ,checkParent:function(el,ev){
            var $el = $(el);
            var isChecked = $el.prop("checked");
            $el.parent().find(":checkbox").prop("checked",isChecked);
        }

        //新加函数，弹出菜单
        ,popMenu:function(el,ev){
            var mouseMenu = this.options.mouseMenu;
            var $el = $(el);
            if(mouseMenu==null){
                return false;
            }
            if(ev.which==3){
                mouseMenu.hide();
                mouseMenu.css({
                    "position":"absolute",
                    "top":ev.clientY,			//这里需要再调试
                    "left":ev.clientX
                });
                mouseMenu.show("fast");
                //加上一个标记
                var $p = null;						//临时节点，存储parent
                if($el.hasClass("tree-folder-name")){
                    $p = $el.parent().parent();
                }else if($el.hasClass("tree-item-name")){
                    $p = $el.parent();
                }
                $el.prop("node",$p.attr("id"));
                console.info($el + ".node = " + $el.prop("node"));
            }
        },

        //鼠标右键事件监听
        initContextmenu: function(ev){
            this.$element.trigger('rightClick', ev);
        },
        //根据节点创建右键菜单
        createRightMenu: function(data){
            var self = this;
            $('.tree-right-menu').remove();
            var $element = $(data.element);
            var ev = data.event;
            var menuData = data.data;
            var menuHtml = new Array();
            menuHtml.push('<ul class="dropdown-menu tree-right-menu">');
            $.each(menuData, function(){
                menuHtml.push('<li action="'+this.action+'"><a>'+this.title+'</a></li>');
            });
            menuHtml.push('</ul>');
            $(menuHtml.join('')).appendTo($('body')).show()
                .css({position:'fixed', left: ev.pageX, top: ev.pageY})
                .on('mouseleave', function(){
                    $(this).remove();
                }).find('li').on('click', function(){
                    var $this = $(this);
                    if($element.hasClass('tree-item-name')){
                        self.$element.trigger($this.attr('action'), $element.parent());
                    }else{
                        self.$element.trigger($this.attr('action'), $element);
                    }
                    $this.parent().remove();
                });
        },
        //添加一个节点
        addChildren: function(data){
            var self = this;
            var node = $(data.node);
            var $entity = null;
            var menu = data.menu;
            if(data.type && data.type == 'parent'){
                $entity = self.createParent();
                $entity.find('.tree-folder-name').html(menu.title);
                $entity.find('.tree-folder-header').data(menu);
                $entity.on('click', {element: $(this)}, function(e){
                    self.selectParent(e.data.element);
                });
            }else{
                $entity = self.createChildren();
                $entity.find('.tree-item-name').html(menu.title);
                $entity.data(menu);
                $entity.on('click',{element: $(this)}, function(e){
                    self.selectChildren(e.data.element);
                });
            }
            $entity.show().on('contextmenu', function(ev){
                self.initContextmenu(ev);
            });
            node.parent().find('>.tree-folder-content').append($entity).show();
            if(node.find('.glyphicon-folder-close').length > 0){
                node.trigger('click');
            }
        },
        //删除一个节点
        removeChildren: function(data){
            $(data).remove();
        }
        //提供一个显示文本框用于重新设置标题的接口

    };


    // TREE PLUGIN DEFINITION

    $.fn.tree = function (option, value) {
        var methodReturn;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('koala.tree');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('koala.tree', (data = new Tree(this, options)));
            if (typeof option === 'string') methodReturn = data[option](value);
        });

        //如果有右键菜单，就把原来的右键除掉
        if(option.mouseMenu!=null){
            $(document).bind("contextmenu",function(){return false;});
        }

        //添加判断是否可拖放
        if(option.draggable){
//			var $node = $(this).find(".tree-folder,.tree-item");
            var $node = $(".tree");
            $node.sortable({
                items:".tree-folder,.tree-item"
                //,axis:"y"
				,containment: $(this).parent()
            });
            $node.disableSelection();
        }

        return (methodReturn === undefined) ? $set : methodReturn;

    };

    //默认内置属性列表
    $.fn.tree.defaults = {
    	/**
    	 * 是否允许树节点多选
    	 * @property multiSelect
    	 * @type Boolean
    	 * @default false
    	 */
        multiSelect: false,
        /**
    	 * 载入数据时显示的html dom
    	 * @property loadingHTML
    	 * @type String
    	 * @default '<div>Loading...</div>'
    	 */
        loadingHTML: '<div>Loading...</div>',
        /**
    	 * 当父节点折叠时，子节点是否保存，如果设置为true，则单纯隐藏，设置为false，则清空其子节点
    	 * @property cacheItems
    	 * @type Boolean
    	 * @default true
    	 */
        cacheItems: true,
        /**
    	 * 是否带复选框
    	 * @property useChkBox
    	 * @type Boolean
    	 * @default false
    	 */
        useChkBox:false,
        /**
    	 * 节点可否拖放
    	 * @property draggable
    	 * @type Boolean
    	 * @default false
    	 */
        draggable:false,
//        /**
//    	 * 节点可否编辑
//    	 * @property multiSelect
//    	 * @type Boolean
//    	 * @default false
//    	 */
//        editable:false,
        /**
    	 * 右键弹出菜单，为下拉框的jQuery
    	 * @property mouseMenu
    	 * @type jQuery对象
    	 * @default null
    	 */
        mouseMenu:null,
        /**
    	 * 异步加载的url，一旦设置这个，取代原生的json data
    	 * @property ajaxUrl
    	 * @type String
    	 * @default ""
    	 */
        ajaxUrl:"",
        /**
    	 * 与ajaxUrl对应的请求参数，为一个{}对象
    	 * @property reqParam
    	 * @type js对象{}
    	 * @default null
    	 */
        reqParam:null,
        /**
    	 * 静态数据源，格式：
    	 * @property data
    	 * @type js对象{}
    	 * @default null
    	 */
        data:null
    };

    $.fn.tree.Constructor = Tree;

}(window.jQuery);
//+ function(factory) {
//	if (typeof define === "function" && define.amd) {
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery",
//			"./core"
//		], factory);
//	} else {
//
//		// Browser globals
//		factory(jQuery);
//	}
//}(
	+function($) {
	'use strict';

	/**
	 * 验证器
	 * @class 验证器基类
	 * @constructor
	 * @public
	 */
	function Validator() {};

	/**
	 * 验证总体，返回false代表验证失败，返回一个对象{'value' : value}代表成功
	 * @param {String} value
	 * @public
	 */
	Validator.prototype.validate = function(value) {
		return {'value' : value};
	};

	/**
	 * 验证输入的单个字符
	 * @public
	 */
	Validator.prototype.validateUnit = function(presssKey, aggValue) {
		return true;
	};


	/**
	 * 字符验证器
	 * @class 字符验证器
	 * @param {Number} maxSize 最大允许长度
	 * @public
	 */
	function StringValidator(maxSize, validateReg, nullable) {
		if (maxSize == null || parseInt(maxSize) < 0)
			this.maxSize = -1;
		else
			this.maxSize = maxSize;
		this.validateReg = validateReg;
		this.nullable = nullable;
	};

	/**
	 * 验证总体
	 * @param {String} value
	 * @public
	 */
	StringValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
			
		if (this.maxSize > 0) {
			// 若输入字节长度大于指定长度,则截去超过指定的最大长度的部分
			if (value.lengthb() > this.maxSize)
				value = value.substrCH(this.maxSize);
		}
		if (this.validateReg) {
			var reg = new RegExp(this.validateReg);
			var r = value.match(reg);
			if (r == null || r == false)
				return false;
		}
		return {'value' : value};
	};

	/**
	 * 验证输入的单个字符
	 * @param {String} aggValue输入的字符串
	 * @public
	 */
	StringValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		if (this.maxSize != -1) {
			if (aggValue.lengthb() > this.maxSize)
				return false;
		}
		return true;
	};

	/**
	 * 浮点数验证器，判断传入的是否时浮点数，不足精度的自动补全。不是浮点数的返回空值 如果指定了最大值或者最小值则校验大小范围
	 * @class 浮点数验证器
	 * @param {Number} precision 精度
	 * @param {Number} minValue 最小值
	 * @param {Number} maxValue 最大值
	 * @public
	 */
	function DicimalValidator(precision, minValue, maxValue, nullable) {
		this.precision = getInteger(precision, 2); // 默认精度为2
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.nullable = nullable;
	};

	/**
	 * 验证
	 * @param {String} value
	 * @public
	 */
	DicimalValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
		if (this.minValue != null && parseFloat(value) < this.minValue)
			return false;
		if (this.maxValue != null && parseFloat(value) > this.maxValue)
			return false;
		value = value + "";

		for (var i = 0; i < value.length; i++) {
			if ("-0123456789.".indexOf(value.charAt(i)) == -1)
				return false;
		}

		var value = checkDicimalInvalid(value, this.precision);
		return {'value' : value};
	};

	/**
	 * 校验
	 * @param {aggValue} aggValue
	 * @public
	 */
	DicimalValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		//检测输入的是否为字符
		if ("0123456789.-".indexOf(key) == -1) {
			return false;
		}
		//IE浏览器
		return checkInputDicimal(aggValue, this.precision, this.minValue, this.maxValue);
	};

	/**
	 * 浮点型输入框的实时检测
	 * @param {String} value
	 * @param {Number} precision 精度
	 * @private
	 */
	function checkInputDicimal(value, precision, minValue, maxValue) {
		if (value == null || value == "")
			return false;
		value = value + "";
		//若value是有"."数，则判断其是否为合法浮点数
		var freg = new RegExp(/^-?([0-9]\d*\.\d*|0\.\d*[0-9]\d*|0?\.0+|0)$/);
		if (freg.test(value)) {
			// "."前面的整数位数不能超过15 - precision位
			if (value.indexOf(".") != -1) {
				var intNumber = value.substr(0, value.indexOf("."));
				if (intNumber.length > 15 - precision - 1)
					return false;
			}

			//"."后面的小数位数不能超过精度
			var num = 0,
				start = 0;
			if ((start = value.indexOf(".")) != -1) {
				if ((value.substring(start + 1)).length > parseInt(precision))
					return false;
			}
		} else {
			//若value是没"."整数，则判断其是否为合法整数
			var nreg = new RegExp(/^(-|\+)?\d+$/);
			if (nreg.test(value)) {
				// 没"."整数位数不能超过15 - precision位
				if (value.length > 15 - precision - 1)
					return false;
			} else {
				if ( !(value == "-" || value == "0." || value == "-0.") ) {
					return false;
				}	
			}

		}
		if (minValue && parseFloat(value) < minValue)
			return false;
		if (maxValue && parseFloat(value) > maxValue)
			return false;
		return true;
	};

	/**
	 * 校验浮点类型。对于浮点型输入框帮助用户完成他的无意失误
	 * @param {String} str
	 * @param {Number} precision 精度
	 * @private
	 */
	function checkDicimalInvalid(str, precision) {
		if (str == null || isNaN(str))
			return "";
		// 浮点数总位数不能超过10位
		if (str.length > 15)
			str = str.substring(0, 15);

		// 默认2位精度
		if (precision == null || !isNumberOnly(precision))
			precision = 2;
		else
			precision = parseInt(precision);
		var digit = parseFloat(str);
		var result = (digit * Math.pow(10, precision) / Math.pow(10, precision))
			.toFixed(precision);
		if (result == "NaN")
			return "";

		return result;

	};


	/**
	 * 整数验证器
	 * @class 整数验证器。判断传入的是否是整数，是否介于设定的上下界直接。不符合返回空值。
	 * @param {Number} minValue
	 * @param {Number} maxValue
	 * @constructor
	 * @public
	 */
	function IntegerValidator(minValue, maxValue, nullable) {
		if (!$.u.isNumber(minValue))
			this.minValue = -999999999999999;
		else
			this.minValue = parseInt(minValue);

		if (!$.u.isNumber(maxValue))
			this.maxValue = 999999999999999;
		else
			this.maxValue = parseInt(maxValue);
		this.nullable = nullable;
		
	};

	/**
	 * 验证方法
	 * @param {String} value
	 * @private
	 */
	IntegerValidator.prototype.validate = function(value, isBlur) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}

		// 以0开头的数字将其前面的0去掉
		if (!$.u.IS_IE) {
			while ((value + "").charAt(0) == "0" && value.length > 1) {
				value = value.substring(1);
			}
		}
		if (!isNumber(value)) {
			return false;
		}
		if (isBlur) {
			if (value < this.minValue || value > this.maxValue)
				return false;
		}

		if (checkIntegerIsValid(value, this.minValue, this.maxValue) == true) {
			return {'value' : value};
		} else {
			return false;
		}
	};

	/**
	 * 整数类型校验
	 * @param {String} key 按下的键
	 * @param {String} aggValue输入的字符串
	 * @private
	 */
	IntegerValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		var isInvalid = false;
		// 检测输入的是否为数字
		if ("-0123456789".indexOf(key) == -1)
			isInvalid = false;
		else
			isInvalid = true;

		if (isInvalid == true) {

			// 只输入一个负号时认为合法
			if (aggValue == "-")
				return true;
			else {
				/*valid时考虑最大值和最小值*/
				if (isNumber(aggValue)) {
					//整数最多能输入15位
					if (aggValue.length > 15)
						return false;
					return checkIntegerIsValid(aggValue, this.minValue, this.maxValue);
				}
				return false;
			}
		} else {
			return false;
		}
		return true;
	};


	/**
	 * 校验整数类型
	 * @param {String} value
	 * @param {Number} minValue
	 * @param {Number} maxValue
	 * @return {Boolean} 是否合法
	 * @private
	 */
	function checkIntegerIsValid(value, minValue, maxValue) {
		// 确定传入参数的合法性
		if (!isNumber(value))
			return false;

		value = parseInt(value);
		if (!isNumber(minValue)) {
			minValue = -99999999999999;
		}

		if (!isNumber(maxValue)) {
			maxValue = 999999999999999;
		}
		// 整数不能超过范围
		if ((value > maxValue) || (value < minValue))
			return false;
		else
			return true;
	};


	/**
	 * email验证器
	 * @class email验证器。将传入值解析，若传入正确，则返回正确格式的日期，否则返回空值。
	 * @constructor
	 * @public
	 */
	function EmailValidator(maxSize, nullable) {
		if (maxSize == null || parseInt(maxSize) < 0)
			this.maxSize = -1;
		else
			this.maxSize = maxSize;
		this.nullable = nullable;
	};


	/**
	 * 验证方法
	 * @param {String} value
	 * @public
	 */
	EmailValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
		if (this.maxSize > 0) {
			// 若输入字节长度大于指定长度,则截去超过指定的最大长度的部分
			if (value.lengthb() > this.maxSize)
				value = value.substrCH(this.maxSize);
		}
		//	var reg = /^([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|-|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
		var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		var r = value.match(reg);
		if (r == null) {
			return false;
		} else if (r == false) {
			return false;
		}
		return {'value' : value};
	};

	/**
	 * 校验方法
	 * @param {String} aggValue输入的字符串
	 * @public
	 */
	EmailValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		// 校验最大长度
		if (this.maxSize != -1) {
			if (aggValue.lengthb() > this.maxSize)
				return false;
		}
		return true;
	};



	/**
	 * email验证器
	 * @class email验证器。将传入值解析，若传入正确，则返回正确格式的日期，否则返回空值。
	 * @constructor
	 * @public
	 */
	function PhoneValidator(maxSize, nullable) {
		if (maxSize == null || parseInt(maxSize) < 0)
			this.maxSize = -1;
		else
			this.maxSize = maxSize;
		this.nullable = nullable;
	};


	/**
	 * 验证方法
	 * @param {String} value
	 * @public
	 */
	PhoneValidator.prototype.validate = function(value) {
		if(!value) {
			if(this.nullable) {
				return {'value' : ''};
			} else {
				return false;
			}
		}
		if (this.maxSize > 0) {
			// 若输入字节长度大于指定长度,则截去超过指定的最大长度的部分
			if (value.lengthb() > this.maxSize)
				value = value.substrCH(this.maxSize);
		}

		// 电话号码正则表达式（支持(+2-3位国家号-)手机号码，+2-3位国家号-，3-4位区号-，7-8位直播号码，-1－4位分机号） 
		//var reg = /^(\d{11})|^(([0\+]\d{2,3}-)?(0\d{2,3}-)?(\d{7,8})(-(\d{1,4})?$/;
		var reg = /^([0\+]\d{2,3}-)?(\d{11})$|^([0\+]\d{2,3}-)?(0\d{2,3}-)?(\d{7,8})(-(\d{1,4}))?$/;

		var r = value.match(reg);
		if (r == null) {
			return false;
		} else if (r == false) {
			return false;
		}
		return {'value' : value};
	};

	/**
	 * 校验方法
	 * @param {String} aggValue输入的字符串
	 * @public
	 */
	PhoneValidator.prototype.validateUnit = function(key, aggValue, currValue) {
		// 校验最大长度
		if (this.maxSize != -1) {
			if (aggValue.lengthb() > this.maxSize)
				return false;
		}
		return true;
	};

	/**
	 * 验证传入的字符是否是整数(0-9包括"-"),且整数必须介于javascript规定的最大值最小值之间
	 * @param str 输入值 
	 * @return {Boolean}
	 */
	function isNumber(str) {
		// 将输入的str转化为字符串.否则js认为000 == "0"为true
		str = str + "";
		if (str == "0")
			return true;

		var patrn = /(^-[1-9]\d*$)|^([1-9]\d*$)/;
		if (patrn.exec(str) == null)
			return false;
		else {
			if (parseInt(str) >= -9007199254740992
					&& parseInt(str) <= 9007199254740992)
				return true;
			else
				return false;
		}
	};

	/**
	 * 获取整型值
	 * @param value 输入值
	 * @param {Int} defaultValue 默认值
	 * @return {Int} 返回parseInt后的输入值，未能正确解析时，返回defaultValue
	 */
	function getInteger(value, defaultValue) {
		if (isNaN(parseInt(value)))
			return defaultValue;
		return parseInt(value);
	};

	/**
	 * 
	 * 验证传入的str是否是数字 alert(validate("1.22")) //true alert(validate("111")) //true
	 * alert(validate("1..22")) //false alert(validate("1.2a2")) //false
	 * alert(validate("1.")) //false
	 * @param str 输入值
	 * @return {Boolean}  
	 */
	function isDigital(str) {
		var re = /^((-?)([1-9]+[0-9]*|0{1}))(\.\d+)?$/;
		return re.test(str);
	};

	$.u.isNumber = isNumber;

	$.u.Validator = Validator;
	$.u.StringValidator = StringValidator;
	$.u.DicimalValidator = DicimalValidator;
	$.u.IntegerValidator = IntegerValidator;
	$.u.EmailValidator = EmailValidator;
	$.u.PhoneValidator = PhoneValidator;

	
}(jQuery);
//+ function(factory) {
//	if (typeof define === "function" && define.amd) {
//
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery"
//		], factory);
//	} else {
//
//		// Browser globals
//		factory(jQuery);
//	}
//}(
	+function($) {
	'use strict';

	var VerticalLayout = function(element, options) {
		this.$element = $(element)
		this.items = []
		var _self = this;
		$.each(this.$element.children(), function(i, item){
			_self.addItem(item, {id:$(item).attr('id') || 'item_' + i});
		})
		this.options = $.extend({}, VerticalLayout.DEFAULTS, options)
		this.update(this.options)
		this.resize();
		$(window).resize(function(){
			_self.resize();	
		});
	}

	VerticalLayout.DEFAULTS = {}

	VerticalLayout.fn = VerticalLayout.prototype;
	VerticalLayout.fn.getItem = function(item) {
		if (typeof item === 'number')
			return this.items[item]
		else if (typeof item === 'string') {
			for (it in this.items) {
				if (it.id == item) return it
			}
		}
		return null
	}

	VerticalLayout.fn.addItem = function(element, options) {
		var newItem = new VerticalItem(this, element, options)
		this.items.push(newItem)
		this.$element.append(newItem.$element);
	}

	VerticalLayout.fn.delItem = function(item) {
		var _item = null
		if (typeof item == 'number')
			_item = this.items.splice(item, 0)
		else if (typeof item == 'string') {
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].id == item) {
					_item = this.items.splice(i, 0)
					break
				}
			}
		}
		if (_item == null) return
		this.$element.remove(_item.$element)
		_item.destroySelf()
	}

	/**
	 * 重置高度
	 */
	VerticalLayout.fn.resize = function() {
		if (this.items.length == 0) return
		var arrKnownHeightItem = []
		var arrUnknownHeightItem = []
		for (var i=0, n= this.items.length; i < n; i++) {
			var item = this.items[i];
			if (item.calculate()) 
				arrUnknownHeightItem.push(item)
			else 
				arrKnownHeightItem.push(item)
		}
		var totalHeight = this.$element.height();
		for (var i = 0, n = arrKnownHeightItem.length; i < n; i++) {
			totalHeight -= arrKnownHeightItem[i].$element.outerHeight(true)
		}
		var height = totalHeight / (arrUnknownHeightItem.length || 1)
		height = parseInt(height);

		for (var i = 0, n = arrUnknownHeightItem.length; i < n; i++) {
			if (i == n - 1)
				height = (totalHeight - height * i)
			if (height < 0)
				height = 0;
			arrUnknownHeightItem[i].height(height);
		}
	}

	VerticalLayout.fn.update = function(options) {
		if (options == null) return
	}

	var VerticalItem = function(layout, element, options) {
		if (!layout) throw "layout can not be null when create VerticalItem ";
		if (!options) throw "options can not be null when create VerticalItem ";
		if (!options.id) throw "id can not be null when create VerticalItem ";
		if (element == null) 
			this.$element = $('<div></div>')
		else
			this.$element = $(element)
			
		this.id = options.id
		this.layout = layout
		this._calculate = this.$element.attr('calculate') != 'false'
		this.options = $.extend({}, VerticalItem.DEFAULTS, options)
		this.update(this.options)
	}
	VerticalItem.DEFAULTS = {

	}

	VerticalItem.fn = VerticalItem.prototype

	VerticalItem.fn.update = function(options) {
		if (!options) return
		if (options.height) this.height(options.height)
		if (options.calculate) this.calculate(options.calculate)
	}

	VerticalItem.fn.destroySelf = function() {

	}

	VerticalItem.fn.height = function(height) {
		this.$element.height(height)
	}

	VerticalItem.fn.calculate = function(calc) {
		if (calc == null) return this._calculate;
		this._calculate = calc;
		this.layout.resize();
	}


	function Plugin(option) {
		if (this.length != 1) return;
		var $this = $(this)
		var data = $this.data('u.vlayout')
		var options = typeof option == 'object' && option

		if (!data) $this.data('u.vlayout', (data = new VerticalLayout(this, options)))
		else data.update(options);
		return data;
	}

	var old = $.fn.verticalLayout

	$.fn.verticalLayout = Plugin
	$.fn.verticalLayout.Constructor = VerticalLayout


	$.fn.verticalLayout.noConflict = function() {
		$.fn.verticalLayout = old
		return this
	}


}(jQuery);
//(function(factory) {
//
//	if (typeof define === "function" && define.amd) {
//
//		// AMD. Register as an anonymous module.
//		define([
//			"jquery"
//		], factory);
//	} else {
//
//		// Browser globals
//		factory(jQuery);
//	}
//
//}(
	+function($) {
	'use strict';

	var YearText = function(element,options){
	    this.$element = $(element);
	    
	    this.options   = $.extend({}, YearText.DEFAULTS, options);
		this.isInput(element,this.yearTextDom);
		this.update(options);
	}
    
    YearText.DEFAULTS = {
    	visible:true,
    	enable:true,
    	value:'',
    	tip:'',
    	nullable:false
    	
    }
    YearText.fn = YearText.prototype;
    
    YearText.fn.update = function(options){
    	
    	if(!options)return;
    	if(options.visible){
    		this.$element.css("display","block");
    	}else {
    		this.$element.css("display","none");
    	}
    	
    	if(options.enable){
    		this.$element.find("input").eq(0).attr("readonly","readonly");
    	}else{
    		this.$element.find("input").eq(0).removeAttr("readonly");
    	}
    	
    	if(options.value){
    		this.$element.find("input").eq(0).attr("value",options.value)
    	}
    	
    	if(options.tip){
    		this.$element.find("input").eq(0).attr("title",options.tip)
    	}
    }
    
  YearText.fn.isInput = function(ele, fn) {
    
	if (ele.find("input").length == 0) {
		var input = document.createElement("input");
		input.type = "text";
        input.id = "yearInput";
        ele.append(input);

		var span = document.createElement("span");
		span.innerHTML="按钮";
		ele.append(span);
        
        var p = document.getElementById("yearInput");
        var eT = p.offsetTop, 
            eL = p.offsetLeft,
            eH = p.offsetHeight;
          
     if(typeof fn =="function"){
     	 
		  //ele.find("span").first().click(function(){fn(input,eT,eL,eH)})
		  
		  $(document).on("click",function(e){
		  	  var ev = e || window.event;
		  	  var target = ev.target || ev.srcElement;
		  	 
		  	  if(target.innerHTML!=ele.find("span").first().html()&&($("#canlendar")&&target.id!=$("#canlendar").attr("id")) ){
		  	  	$("#canlendar").css("display","none");
		  	  }else{
		  	  	 ele.find("span").first().click(function(){fn(input,eT,eL,eH)})
		  	  }
		  	  
		  }); 
						   	
     }
    	       
	} else { 
		if (typeof fn == "function") {
			var eleIn = ele.find("input").eq(0);
			
			var eT = eleIn.offsetTop, 
            eL = eleIn.offsetLeft,
            eH = eleIn.offsetHeight;
			
		//	eleIn.focus(function(){fn(this,eT,eL,eH)});
			  
			 $(document).on("click",function(e){
			 	var ev = e || window.event;
		  	    var target = ev.target || ev.srcElement;
		  	  
			 	if(target.type!=eleIn.attr("type")&&($("#canlendar")&&target.id!=$("#canlendar").attr("id"))){
			 		$("#canlendar").css("display","none");
			 	}else{
			 		eleIn.focus(function(){fn(this,eT,eL,eH)});
			 	}
		  	 
		  });  
			
		}
	}
}
  
  YearText.fn.yearTextDom = function(ele,top,left,higth) {
  		
	if (document.getElementById('canlendar')){
		document.getElementById('canlendar').style.display="block";
		return;
	}
	var calendar = document.createElement("div");
	calendar.id = "canlendar";
	
	calendar.style.top = top + higth+"px"; 
	calendar.style.left = left + "px"; 
	
	var h3 = document.createElement("h3");
	var prev = document.createElement("span");
	prev.innerHTML = "上";
	prev.className = "prev";
	var title = document.createElement("span");
	var next = document.createElement("span");
	next.innerHTML = "下";
	next.className = "next";
	h3.appendChild(prev);
	h3.appendChild(title);
	h3.appendChild(next);
	calendar.appendChild(h3);
	document.body.appendChild(calendar);
	 
	
	var content = document.createElement("div");
	content.className = "content";
	calendar.appendChild(content);
	var d = new Date();
	var year = d.getFullYear();
	createYear(year);
	prev.onclick = function(e) {
		var y = document.getElementsByClassName("content")[0].lastChild;
		if (y.nodeType == 1) {
			var year = y.currentDate;
			createYear(year + 1);
		}
		stopBubble(e);
		
	}
	next.onclick = function(e) {
		var y = document.getElementsByClassName("content")[0].firstChild;
		if (y.nodeType == 1) {
			var year = y.currentDate;
			createYear(year - 12);
		}
		stopBubble(e);
	}
	
	//阻止事件冒泡函数
   function stopBubble(e)
   {
    if (e && e.stopPropagation)
        e.stopPropagation()
    else
        window.event.cancelBubble=true
    }

	
	function createYear(y) {
		content.innerHTML = "";
		title.innerHTML = y + "-" + (y + 11);
		for (var j = 0; j < 12; j++) {
			var oSpan = document.createElement("span");
			var p = y + j;
			oSpan.innerHTML = p;
			oSpan.currentDate = p;
			content.appendChild(oSpan);
			oSpan.onclick = function() {
				ele.value = this.currentDate;
				document.body.removeChild(calendar);
			}
		}
	}
	
}
  
	function Plugin(options) {
		if (this.length != 1) return;
		var $this = $(this) ;
		var data = $this.data('u.yearText')

		if (!data) {
			$this.data('u.yearText', (data = new YearText(this,options)))
         }else{
         	data = new YearText(this,options);
         }
		return data;
	}

	var old = $.fn.yearText;

	$.fn.yearText = Plugin;
	$.fn.yearText.Constructor = YearText;


	// BUTTON NO CONFLICT
	// ==================

	$.fn.yearText.noConflict = function() {
		$.fn.yearText = old
		return this
	}

}(jQuery);