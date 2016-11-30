var opts = {
  delay: 1500,
  transitionDuration: 400,
  cover: false,
  autoplay: false,
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

        $("a.gumroad-button").attr("href", sectionData.href);
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
};

$(document).ready(function($) {
  //  mobile
  if ($.os.phone) {
      //  tap to buy
    $("body").on("tap", function (e) {
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
      if (opts.slides.length>1) {
        $("body").vegas("options", 'transition', 'slideUp');
        $("body").vegas("next");
      }
    });
    $("body").on("swipeDown", function (e) {
      if (opts.slides.length>1) {
        $("body").vegas("options", 'transition', 'slideDown');
        $("body").vegas("previous");
      }
    });
    //  mobile styles
    $("body").addClass("phone");
  //  browser events
  } else {
    //  mouseover events
    $("a.gumroad-button").on("mouseover", function (e) {
      $("body").vegas("pause");
    }).on("mouseout", function (e) {
      $("body").vegas("play");
    });
    //  advance section on arrow click
    $("div.leftArrow").on("click", function (e) {
      changeSection("down");
    });
    $("div.rightArrow").on("click", function (e) {
      changeSection("up");
    });
    //  browser styles
    $("body").addClass("not-phone");

    //  change some options
    opts.autoplay = true;
    opts.delay = 2300;
    opts.init = function (globalSettings) {
        console.log("Init");
    };
    opts.play = function (index, slideSettings) {
        console.log("Play");
    };
    opts.walk = function (index, slideSettings) {
        console.log("Slide index " + index + " image " + slideSettings.src);
    };
  }

  loadSection(0);
});
