$(function() {

  //ALERTA funciones con botones amarillos las debo arreglar de nuevo...

  $('[data-toggle="modal"] img').click(function(event) {
    showModal(event);
  });

  randomMainImg();

  $(".img-main").click(hideAndChange);

  createWaypoints();

  $("#contactForm").submit(function(event) {
    if ($(".isMobile").css("opacity") == 1) {

      setTimeout(function() {
        $("body").scrollTop($("#contact").offset().top - 50);
      }, 600);
    }

    validateForm(event);
  });

  $(".navbar-link").click(function(event) {
    collapseMenu();
    scrollView(event.target);
  });

  $(".about-pager").click(function(event) {
    event.preventDefault();
    $(event.target).blur();
    toggleContent();
  });

  $('[class^="move"]').click(function(event) {
    moveInfo(event);
  });

  $("textarea, input").focusin(function(t) {
    if ($(".isMobile").css("opacity") == 1) {
      setTimeout(function() {
        $("body").scrollTop($(t.target).offset().top - 80);
      }, 600);
    }
  });

  $("textarea").keyup(limitCharacters);

  $(".category").click(function(event) {
    event.stopPropagation();
    showCategory(event);
  });

  $(".back").click(function(event) {
    event.preventDefault();
    hideCategory();
  });


});

/**
** Warp
**/

function scrollView(t) {
  enableDisable(1500);
  var e = $(t).attr("href"),
  n = $(t).attr("data-text");
  $(".warp-text").text(n), $(".navbar-link").css("pointer-events", "none"), $(".warp").show(), $("html, body").animate({
    scrollTop: $(e).offset().top - 50
  }, 1500, function() {
    $(".warp").hide(), $(".navbar-link").css("pointer-events", "all")
  })
}

function enableDisable(t) {
  Waypoint.disableAll(), setTimeout(function() {
    Waypoint.enableAll()
  }, t - 200)
}

function createWaypoints() {
  $("#about, #art, #contact").css("opacity", "0");
  new Waypoint({
    element: $("#about"),
    handler: function() {
      $("#about").animate({
        opacity: 1
      }, 1e3)
    },
    offset: "10%"
  }), new Waypoint({
    element: $("#art"),
    handler: function() {
      $("#art").animate({
        opacity: 1
      }, 1e3)
    },
    offset: "10%"
  }), new Waypoint({
    element: $("#contact"),
    handler: function() {
      $("#contact").animate({
        opacity: 1
      }, 1e3)
    },
    offset: "10%"
  })
}

/**
** #About
**/

function randomMainImg(t) {
  var e = ["4", "7", "8", "9", "10", "11", "12", "47"];
  if (t) {
    var n = e.indexOf(t);
    e.splice(n, 1)
  }
  var i = "images/sculptures/" + e[Math.floor(Math.random() * e.length)] + ".jpg";
  $(".img-main").attr("src", i).css({
    "animation-play-state": "running",
    "animation-iteration-count": "infinite"
  }).animate({
    opacity: 1
  }, 2e3, function() {
    $(this).css("animation-play-state", "paused"), $(".img-main").css("pointer-events", "all")
  })
}

function hideAndChange() {
  $(".img-main").css("pointer-events", "none"), $(".img-main").animate({
    opacity: 0
  }, 600, function() {
    randomMainImg($(this).attr("src").replace(/[^0-9]/g, ""))
  })
}

/**
** #Art
**/

function showCategory(t) {
  $(".gallery").empty(), getImages($(t.currentTarget).attr("data-category"));
  var e = $(t.currentTarget).find("h3").text(),
  n = $(t.currentTarget).find("h3").css("text-shadow");
  $(".selected-category").text(e).css("text-shadow", n), $(".category-row").css("pointer-events", "none").fadeOut(1e3, function() {
    $(".gallery-row").fadeIn().css("pointer-events", "all"), $("body").scrollTop($("#art").offset().top - 49)
  })
}

function hideCategory() {
  $(".gallery-row").css("pointer-events", "none").fadeOut(1e3, function() {
    $(".category-row").fadeIn().css("pointer-events", "all"), $("body").scrollTop($("#art").offset().top - 50)
  })
}

/**
** #About
**/

function moveInfo(t) {
  var e = $(t.target).attr("data-direction"),
  n = $(t.target).attr("data-actual");
  $('[class^="move"]').css("pointer-events", "none"), $(n).fadeOut(1e3, function() {
    $(e).fadeIn(1e3), $('[class^="move"]').css("pointer-events", "all")
  })
}

function toggleContent() {
  var t = $(".about-pager");
  t.css("pointer-events", "none"), t.hasClass("to-bio") ? $(".cv-row, .pager-row").fadeOut(1e3, function() {
    t.text("CV").removeClass("to-bio").addClass("to-cv").css("pointer-events", "all"), $(".bio-row, .pager-row").fadeIn(1e3)
  }) : $(".bio-row, .pager-row").fadeOut(1e3, function() {
    t.text("Bio").removeClass("to-cv").addClass("to-bio").css("pointer-events", "all"), $(".cv-row, .pager-row").fadeIn(1e3)
  }), $("body").scrollTop($("#about").offset().top - 50)
}


/**
** Gallery functions
**/

function getImages(t) {
  $.ajax({
    url: "images.php",
    dataType: "json",
    cache: !1,
    type: "POST",
    data: {
      category: t
    },
    success: function(t) {
      insertImages(t.images, t.category)
    }
  })
}

function insertImages(t, e) {
  (t = Object.values(t)).sort(function(t, e) {
    return t - e
  }), $.each(t, function(t, n) {
    //<p class="zoom">+</p>
    $(".gallery").append('<div class="img-container" data-toggle="modal" data-target="#artGallery"><img data-src="images/' + e + "/" + n + '.jpg" alt="Cristóbal Ochoa" title="Cristóbal Ochoa"></div>')
  }), $('[data-toggle="modal"] img').click(function(t) {
    showModal(t)
  }), $(".img-container img").unveil(0, function() {
    $(this).parent().css("opacity", "1")
  })
}

function showModal(event) {
  if ($(event.currentTarget).attr("src")) {
    $(".img-modal").attr("src", $(event.currentTarget).attr("src"));
  } else if ($(event.currentTarget).attr("data-src")) {
    $(".img-modal").attr("src", $(event.currentTarget).attr("data-src"));
  }
}

/**
** Form functions
**/

function limitCharacters() {
  var t = $("textarea").val();
  var e = t.length;
  if (e >= 250) {
    var n = t.slice(0, 250);
    $("textarea").val(n);
    $(".counter").css("color", "grey");
  } else {
    $(".counter").css("color", "black");
  }
  e = $("textarea").val().length;
  $(".limit").text(e);
}

function validateForm(event) {
  event.preventDefault();
  if (!isEmpty("input") && !isEmpty("textarea")) {
    sendMessage();
  }
}

function isEmpty(element) {
  if ($(element).val() === "") {
    $(element).css("border", "1px solid red");
    return true;
  } else {
    $(element).css("border", "1px solid #ccc");
    return false;
  }
}

function sendMessage() {
  var formData = createData();
  $.ajax({
    url: "email.php",
    dataType: "json",
    cache: false,
    contentType: false,
    processData: false,
    type: "POST",
    data: formData,
    success: function(data) {
      $(".mailResponse").text(data.message).fadeIn(2000, function() {
        $(this).fadeOut();
      });
    },
    error: function(data) {
      console.log("Error in sendMessage: ");
      console.log(data);
    }
  });
}

function createData() {
  var formData = new FormData();
  formData.append("email", $("#email").val());
  formData.append("message", $("#message").val());
  return formData;
}

/**
** Hacks
**/

function collapseMenu() {
  $(".navbar-collapse").removeClass("in").removeAttr("aria-expanded").attr("aria-expanded", "false");
}

// function showCategory(selector) {
//   $('.gallery').empty();
//   var category = $(selector.currentTarget).attr('data-category');
//   getImages(category);
//   var title = $(selector.currentTarget).find('h3').text();
//   var shadow = $(selector.currentTarget).find('h3').css('text-shadow');
//   var color = $(selector.currentTarget).find('h3').css('color');
//   $('.selected-category').text(title)
//   .css('text-shadow', shadow)
//   .css('color', color);
//   $('.category-row').css('pointer-events', 'none');
//   $('.category-row').fadeOut(1000, function() {
//     $('.gallery-row').fadeIn();
//     $('.gallery-row').css('pointer-events', 'all');
//     $('body').scrollTop($('#art').offset().top - 50);
//   });
// }
//
// function hideCategory() {
//   $('.gallery-row').css('pointer-events', 'none');
//   $('.gallery-row').fadeOut(1000, function() {
//     $('.category-row').fadeIn();
//     $('.category-row').css('pointer-events', 'all');
//     $('body').scrollTop($('#art').offset().top - 50);
//   });
// }
//
// function limitCharacters() {
//   var text = $('textarea').val();
//   var length = text.length;
//   if (length >= 250) {
//     var newText = text.slice(0, 250);
//     $('textarea').val(newText);
//     $('.counter').css('color', 'grey');
//   } else {
//     $('.counter').css('color', 'black');
//   }
//   length = ($('textarea').val()).length;
//   $('.limit').text(length);
// }
//
// function createWaypoints() {
//   // It first "hides" all of them
//   $('#about, #art, #contact').css('opacity', '0');
//
//   // Then creates the waypoints
//   var about = new Waypoint({
//     element: $('#about'),
//     handler: function() {
//       $('#about').animate({
//         opacity: 1
//       }, 1000);
//     },
//     offset: 80
//   });
//
//   var art = new Waypoint({
//     element: $('#art'),
//     handler: function() {
//       $('#art').animate({
//         opacity: 1
//       }, 1000);
//     },
//     offset: 80
//   });
//
//   var contact = new Waypoint({
//     element: $('#contact'),
//     handler: function() {
//       $('#contact').animate({
//         opacity: 1
//       }, 1000);
//
//     },
//     offset: 80
//   });
// }
//
// // Moves between the bio's info pages
// function moveInfo(event) {
//   var direction = $(event.target).attr('data-direction');
//   var actual = $(event.target).attr('data-actual');
//   $('[class^="move"]').css('pointer-events', 'none');
//   $(actual).fadeOut(1000, function() {
//     $(direction).fadeIn(1000);
//     $('[class^="move"]').css('pointer-events', 'all');
//   });
// }
//
// // Shows a random main image
// function randomMainImg() {
//   var path = 'images/sculptures/';
//   var images = ["6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "16.jpg"];
//   var src = path + images[Math.floor(Math.random() * images.length)];
//   $('.img-main').attr('src', src)
//   .css('animation-play-state', 'running')
//   .animate({
//     opacity: 1
//   }, 2000);
//
// }
//
// // Toggles the content of the about section (between bio and cv)
// function toggleContent() {
//   var bioSelectors = ".bio-row, .pager-row";
//   var cvSelectors = ".cv-row, .pager-row";
//   var pager = $('.about-pager');
//   pager.css('pointer-events', 'none');
//   if (pager.hasClass('to-bio')) {
//     $(cvSelectors).fadeOut(1000, function() {
//       pager.text('CV')
//       .removeClass('to-bio')
//       .addClass('to-cv')
//       .css('pointer-events', 'all');
//
//       $(bioSelectors).fadeIn(1000);
//     });
//   } else {
//     $(bioSelectors).fadeOut(1000, function() {
//       pager.text('Bio')
//       .removeClass('to-cv')
//       .addClass('to-bio')
//       .css('pointer-events', 'all');
//
//       $(cvSelectors).fadeIn(1000);
//     });
//   }
//   $('body').scrollTop($('#about').offset().top - 50);
// }
//
// // Shows a modal which contains the clicked image
// function showModal(event) {
//   console.log($(event.target).attr('src'));
//   console.log(event);
//   console.log(event.target);
//   // $('.modal-title').text($(event.target).attr('alt'));
//   $('.img-modal').attr('src', $(event.target).attr('src'));
// }
//
// // Scrolls the page to the selected section
// function scrollView(selector) {
//   var warpLength = 1500;
//   enableDisable(warpLength);
//   var direction = $(selector).attr('href');
//   var text = $(selector).attr('data-text');
//   $('.warp-text').text(text);
//   $('.navbar-link').css('pointer-events', 'none');
//   $('.warp').show();
//   $('html, body').animate({
//     scrollTop: $(direction).offset().top - 50
//   }, warpLength, function() {
//     $('.warp').hide();
//     $('.navbar-link').css('pointer-events', 'all');
//   });
// }
//
// function enableDisable(delay) {
//   Waypoint.disableAll();
//   setTimeout(function() {
//     Waypoint.enableAll();
//   }, delay - 200);
// }
//
// // Solves Bootstrap malfunction with navbar, and collapses it when necessary
// function collapseMenu() {
//   $('.navbar-collapse').removeClass('in')
//   .removeAttr('aria-expanded')
//   .attr('aria-expanded', 'false');
// }
//
// function getImages(selectedCategory) {
//   $.ajax({
//     url: 'images.php',
//     dataType: 'json',
//     cache: false,
//     type: 'POST',
//     data: {
//       category: selectedCategory
//     },
//     success: function(data) {
//       insertImages(data.images);
//     }
//   });
// }
//
// function insertImages(images) {
//   $.each(images, function(key, value) {
//     $('.gallery').append('<div class="img-container"><img src="images/' + value + '" alt="" data-toggle="modal" data-target="#artGallery"></div>');
//   });
//
//   $('[data-toggle="modal"]').click(function(event) {
//     showModal(event);
//   });
// }
//
// // Beginning of tests with HammerJS
