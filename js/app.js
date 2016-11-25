var opts = {
  delay: 1500,
  autoplay: false,
  slides: []
},
getSection = function () {
  return parseInt($("body").attr("data-section"));
},
setSection = function (section) {
  if (testSection(section)) {
    $("body").attr("data-section", section);
  }
},
loadSection = function (section) {
  //  check data exists
  $.ajax({
    url: '/data/' + section + '.json',
    type: 'HEAD'
  })
  .done(function(data, status,xhr) {
    if (xhr.status >= 200 && xhr.status < 400) {
      //  get section data
      $.getJSON('/data/'+section+'.json', function(sectionSlides){
      //  random key from slides
        var rando = Math.round((sectionSlides.length-1)*Math.random());
        //  set slides
        opts.slides = sectionSlides;
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
          $("body").vegas("jump", 1);
          //  remove old slide
          var slides = $(".vegas-slide");
          if (slides.length > 1) {
            $(".vegas-slide").first().remove();
          }
        } else {
          $("body").vegas(opts);
        }
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
      break;
    case "down":
      section--;
      break;
  }
  loadSection(section);
};

$(document).ready(function($) {
  //  init with first section
  loadSection(0);
  //  mobile
  if ($.os.phone) {
      //  mobile events
    $("body").on("singleTap", function (e) {
      $("body").vegas("next");
    });
    $("body").on("doubleTap", function (e) {
      $("a.gumroad-button").trigger("click");
    });
    $("body").on("swipeRight", function (e) {
      changeSection("down");
    });
    $("body").on("swipeLeft", function (e) {
      changeSection("up");
    });
  //  browser events
  } else {
    //  mouseover events
    $("a.gumroad-button").on("mouseover", function (e) {
      $("body").vegas("play");
    }).on("mouseout", function (e) {
      $("body").vegas("pause");
    });
  }
});
//  advance section on arrow click/swipe