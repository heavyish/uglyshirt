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
      $.getJSON('/data/'+section+'.json', function(sectionData){
      //  random key from slides
        var rando = Math.round((sectionData.slides.length-1)*Math.random());
        //  set slides
        opts.slides = sectionData.slides;  console.log(sectionData);
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
          $("body").vegas("next");
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
    //  advance section on swipe
    $("body").on("swipeRight", function (e) {
      changeSection("down");
    });
    $("body").on("swipeLeft", function (e) {
      changeSection("up");
    });
    //  mobile styles
    $("body").addClass("phone");
  //  browser events
  } else {
    //  mouseover events
    $("a.gumroad-button").on("mouseover", function (e) {
      $("body").vegas("play");
    }).on("mouseout", function (e) {
      $("body").vegas("pause");
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
  }
});
