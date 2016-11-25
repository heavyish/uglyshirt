var opts = {
  delay: 1500,
  autoplay: false,
  slides: []
},
loadSection = function (section) {
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
    $("body").vegas(opts);
  });
}

$(document).ready(function($) {
  var section = 0;
  //  init with first section
  loadSection(0);
  //  mobile events
  if ($.os.phone) {
    $("body").on("click", function (e) {
      $("body").vegas("next");
    })
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