(function ($, Drupal) {

Fett.position = {
  once: 0,
  targets: {}
};

// Initialize
Fett.position.init = function(){
  var self = this;
  $('.window').once('fett-position').first().each(function(){
    self.$window = $(this);
    self.$document = $('.document').length ? $('.document') : $(document);
    self.sizes();
    if(!self.once){
      self.once = 1;
      var $window = $(window);
      var windowW = $window.width();
      var windowH = $window.height();
      var timeout;
      $window.off('resize.fett-position').on('resize.fett-position', function(){
        var newWindowW = $window.width();
        var newWindowH = $window.height();
        if(newWindowW!==windowW || newWindowH!==windowH){ //IE 8 fix
          windowW = newWindowW;
          windowH = newWindowH;
          clearTimeout(timeout);
          timeout = setTimeout(function(){
            self.sizes();
            self.scrolling(self.windowTopPosition());
          }, 300);
        }
      });
      self.scroll();
    }

  });
}

// Size
Fett.position.sizes = function(){
  var self = this;
  self.windowH = self.$window.height();
  self.windowW = self.$window.width();
  self.documentH = self.$document.height();
  for(var i in self.targets) {
    self.targets[i].size();
  }
}

// Window top position
Fett.position.windowTopPosition = function(){
  var self = this;
  // return self.$window[0].scrollTop + self.$window.offset().top;
  return self.$window[0].scrollTop;
}

// Scroll
Fett.position.scroll = function(){
  var self = this;
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  var lastPosition = -1;
  (function animate(time){
    var windowTopPos = self.windowTopPosition();
    if (lastPosition !== windowTopPos) {
      self.scrolling(windowTopPos);
    }
    lastPosition = windowTopPos;
    // TWEEN.update();
    requestAnimFrame(animate);
  })();
}

// Scrolling
Fett.position.scrolling = function(windowTopP){
  var self = this;
  self.windowTopPos = typeof windowTopP != 'undefined' ? windowTopP : (self.windowTopPos || 0);
  self.windowBottomPos = windowTopP + self.windowH;
  for(var i in self.targets) {
    var viewPos = self.scrollingPosition(self.targets[i].$element);
    if(viewPos.visible){
      self.targets[i].play(viewPos);
    }else{
      self.targets[i].pause(viewPos);
    }
  }
}

// Scrolling Position
Fett.position.scrollingPosition = function($element) {
  var self = this;
  var blockH = $element.outerHeight();
  var blockW = $element.outerWidth();
  var blockTopPos = $element.data('positionTop');
  var blockLeftPos = $element.data('positionLeft');
  var blockBottomPos = blockTopPos + blockH;
  var percent = 0;
  var position = 'left';

  var canScrollDown = blockBottomPos + self.windowH < self.documentH;
  var canScrollUp = blockTopPos > self.windowH;
  var direction;
  var number = 0, min = 0, max = 0;

  function rangeToPercent(number, min, max){
    return Math.min(Math.max(Math.round(((number - min) / (max - min)) * 100), 0), 100);
  }

  if(canScrollDown && canScrollUp){
    direction = 'middle';
    number = self.windowBottomPos;
    min = blockTopPos;
    max = Math.min((blockTopPos + self.windowH), blockBottomPos);
  }
  else if(canScrollDown){
    direction = 'top';
    number = self.windowTopPos;
    min = blockTopPos;
    max = blockBottomPos;
  }
  else{
    direction = 'bottom';
    number = self.windowBottomPos;
    min = blockTopPos;
    max = Math.min((blockTopPos + self.windowH), blockBottomPos);
  }

  percent = rangeToPercent(number, min, max);

  if((blockLeftPos + (blockW / 2)) > (self.windowW / 2) - 2 && (blockLeftPos + (blockW / 2)) < (self.windowW / 2) + 2){
    // alert('middle');
    position = 'center';
  }
  else if(blockLeftPos >= (self.windowW / 2) - 2){
    position = 'right';
  }

  return {
    top: blockTopPos,
    left: blockLeftPos,
    right: blockLeftPos + blockW,
    bottom: blockBottomPos,
    height: blockH,
    percent: percent,
    direction: direction,
    windowH: self.windowH,
    windowTopPos: self.windowTopPos,
    windowBottomPos: self.windowBottomPos,
    position: position,
    visible: blockTopPos<self.windowBottomPos && blockBottomPos>self.windowTopPos
  };
}

// Players
Fett.position.track = function(id, $view, options) {
  var self = this, key, $element;
  var defaults = {
    // Called the first time an element is viewable.
    onPlay: function(viewPos){},
    // Called when element is no longer viewable.
    onPause: function(viewPos, is_init){},
    // Called when element comes back into view.
    onResume: function(viewPos){},
    // Called on scroll when element is viewable.
    onVisible: function(viewPos){},
    // Called when elements are sized on init and window resize.
    onSize: function(){},
  };
  options = $.extend({}, defaults, options);
  $view.each(function(index, value){
    key = id + index;
    $element = $(this);
    Fett.position.targets[key] = new (function(){
      var played = false;
      var started = false;
      var init = false;
      $.extend(this, options);
      this.$element = $element;
      $element.addClass('target').data('target-ind', Fett.position.targets.length);
      this.play = function(viewPos){
        if(!played){
          played = true;
          if(!started){
            started = true;
            this.onPlay(viewPos);
          }else{
            this.onResume(viewPos);
          }
        }
        this.onVisible(viewPos);
      };
      this.pause = function(viewPos){
        if(played || (!played && !init)){
          played = false;
          init = false;
          this.onPause(viewPos);
        }
      };
      this.size = function(){
        this.onSize();
        this.$element.data('positionTop', ((this.$element.offset().top + self.$window[0].scrollTop) - self.$window.offset().top) | 0);
        this.$element.data('positionLeft', (this.$element.offset().left - self.$window.offset().left) | 0);
      }
    })();

  });
}

Drupal.behaviors.fett_position = {
  attach: function (context, settings) {
    setTimeout(function(){
      Fett.position.init();
    }, 10);
  }
}

})(jQuery, Drupal);
