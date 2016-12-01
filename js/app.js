var opts = {
  delay: 1500,
  transitionDuration: 400,
  cover: false,
  autoplay: false,
  preload: true,
  slides: []
},
loadSection = function (section, transition) {
  //  check data exists
  $.ajax({
    url: '/data/' + section + '.json',
    type: 'HEAD'
  })
  .done(function(data, status,xhr) {
    if (xhr.status >= 200 && xhr.status < 400) {
      //  get section data
      $.getJSON('/data/'+section+'.json', function(sectionData){
      //  random key from slides
        var rando = Math.round((sectionData.slides.length-1)*Math.random());
        //  set slides
        opts.slides = sectionData.slides;
        //  put rando in first to be bg
        if (typeof opts.slides[rando] == "object" && rando > 0) {
          var slide = opts.slides[rando];
          opts.slides.splice(rando,1);
          opts.slides.unshift(slide);
        }
        //  attach vegas to body
        if (typeof $("body")[0]._vegas == "object") {
          //  update options with new slide set
          $("body").vegas("options", opts);
          //  remove old slide
          $(".vegas-slide").remove();
          //  advance to first new one
          $("body").vegas("options", "transition", transition);
          $("body").vegas("next");
          //  for browser - find a better way to do this...
          if ($("body").hasClass("not-phone")) {
            $("body").vegas("options", "transition", "fade");
          }
        } else {
          $("body").vegas(opts);
        }
        //  update link
        $("a.gumroad-button").attr("href", sectionData.href);
        //  update button text
        $("a.gumroad-button").html(sectionData.buttonText);
        //  store section
        $("body").attr("data-section", section);
      });
    }
  });
},
changeSection = function(direction) {
  var section = $("body").attr('data-section');
  switch(direction) {
    case "up":
      section++;
      transition = "slideLeft";
      break;
    case "down":
      section--;
      transition = "slideRight";
      break;
  }
  loadSection(section, transition);
},
changeSlide = function (direction) {
  if (opts.slides.length>1) {
    var slide = $("body").attr('data-slide');
    switch(direction) {
      case "up":
        slide = (slide === opts.slides.length) ? 0 : slide++;
        transition = "slideUp";
        break;
      case "down":
        slide = (slide === 0) ? opts.slides.length - 1 : slide--;
        transition = "slideDown";
        break;
    }
    $("body").vegas("options", "transition", transition);
    $("body").vegas("jump", slide);
    $("body").attr('data-slide', slide);
  }
};

$(document).ready(function($) {
  //  mobile
  if ($.os.phone) {
    //  tap to advance
    $("body").on("singleTap", function (e) {
      $("body").vegas("options", "transition", "slideLeft");
      $("body").vegas("next");
    });
    //  double tap to buy
    $("body").on("doubleTap", function (e) {
      $("a.gumroad-button").trigger("click");
    });
    //  advance section on swipe
    $("body").on("swipeRight", function (e) {
      changeSection("down");
    });
    $("body").on("swipeLeft", function (e) {
      changeSection("up");
    });
    //  change slides on up/down swipe
    $("body").on("swipeUp", function (e) {
      changeSlide('up');
    });
    $("body").on("swipeDown", function (e) {
      changeSlide('down');
    });
    //  mobile styles
    $("body").addClass("phone");

    //  tease us with the arrows so we get the idea
    window.setTimeout(function () {
      $("div.arrow").addClass('hidden');
    }, 6000);

  //  browser events
  } else {
    //  navigate on arrow click
    $("div.leftArrow").on("click", function (e) {
      changeSection("down");
    });
    $("div.rightArrow").on("click", function (e) {
      changeSection("up");
    });
    $("div.upArrow").on("click", function (e) {
      changeSlide('up');
    });
    $("div.downArrow").on("click", function (e) {
      changeSlide('down');
    });
    //  browser styles
    $("body").addClass("not-phone");

    //  change some options
    opts.delay = 2300;
    /*
    opts.init = function (globalSettings) {
        console.log("Init");
    };
    opts.play = function (index, slideSettings) {
        console.log("Play");
    };
    opts.walk = function (index, slideSettings) {
        console.log("Slide index " + index + " image " + slideSettings.src);
    };
    */
  }

  loadSection(0);
  //  transition in the arrows so we get the idea
  window.setTimeout(function () {
    $("div.arrow").removeClass('hidden');
  }, 2000);
});
