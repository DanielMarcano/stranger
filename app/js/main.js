$(function() {

  randomMainImg();

  createWaypoints();

  $('.navbar-link').click(function(event) {
    collapseMenu();
    scrollView(event.target);
  });

  $('.about-pager').click(function(event) {
    event.preventDefault();
    $(event.target).blur();
    toggleContent();
  });

  // To move between bio's info boxes
  $('[class^="move"]').click(function(event) {
    moveInfo(event);
  });

  $('textarea, input').focusin(function(event) {
    if ($('.isMobile').css('opacity') == 1) {
      setTimeout(function() {
        $('body').scrollTop($(event.target).offset().top - 80);
      }, 600);
    }
  });

  $('textarea').keyup(limitCharacters);

  $('.category').click(function(event) {
    event.stopPropagation();
    showCategory(event);
  });

  $('.back').click(function(event) {
    event.preventDefault();
    hideCategory();
  });

});

function showCategory(selector) {
  $('.gallery').empty();
  var category = $(selector.currentTarget).attr('data-category');
  getImages(category);
  var title = $(selector.currentTarget).find('h3').text();
  var shadow = $(selector.currentTarget).find('h3').css('text-shadow');
  var color = $(selector.currentTarget).find('h3').css('color');
  $('.selected-category').text(title)
                         .css('text-shadow', shadow)
                         .css('color', color);
  $('.category-row').css('pointer-events', 'none');
  $('.category-row').fadeOut(1000, function() {
    $('.gallery-row').fadeIn();
    $('.gallery-row').css('pointer-events', 'all');
    $('body').scrollTop($('#art').offset().top - 50);
  });
}

function hideCategory() {
  $('.gallery-row').css('pointer-events', 'none');
  $('.gallery-row').fadeOut(1000, function() {
    $('.category-row').fadeIn();
    $('.category-row').css('pointer-events', 'all');
    $('body').scrollTop($('#art').offset().top - 50);
  });
}

function limitCharacters() {
  var text = $('textarea').val();
  var length = text.length;
  if (length >= 250) {
    var newText = text.slice(0, 250);
    $('textarea').val(newText);
    $('.counter').css('color', 'grey');
  } else {
    $('.counter').css('color', 'black');
  }
  length = ($('textarea').val()).length;
  $('.limit').text(length);
}

function createWaypoints() {
  // It first "hides" all of them
  $('#about, #art, #contact').css('opacity', '0');

  // Then creates the waypoints
  var about = new Waypoint({
    element: $('#about'),
    handler: function() {
      $('#about').animate({
        opacity: 1
      }, 1000);
    },
    offset: 80
  });

  var art = new Waypoint({
    element: $('#art'),
    handler: function() {
      $('#art').animate({
        opacity: 1
      }, 1000);
    },
    offset: 80
  });

  var contact = new Waypoint({
    element: $('#contact'),
    handler: function() {
      $('#contact').animate({
        opacity: 1
      }, 1000);

    },
    offset: 80
  });
}

// Moves between the bio's info pages
function moveInfo(event) {
  var direction = $(event.target).attr('data-direction');
  var actual = $(event.target).attr('data-actual');
  $('[class^="move"]').css('pointer-events', 'none');
  $(actual).fadeOut(1000, function() {
    $(direction).fadeIn(1000);
    $('[class^="move"]').css('pointer-events', 'all');
  });
}

// Shows a random main image
function randomMainImg() {
  var path = 'images/sculpture';
  var images = ["6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "16.jpg"];
  var src = path + images[Math.floor(Math.random() * images.length)];
  $('.img-main').attr('src', src)
                  .css('animation-play-state', 'running')
                  .animate({
                    opacity: 1
                  }, 2000);

}

// Toggles the content of the about section (between bio and cv)
function toggleContent() {
  var bioSelectors = ".bio-row, .pager-row";
  var cvSelectors = ".cv-row, .pager-row";
  var pager = $('.about-pager');
  pager.css('pointer-events', 'none');
  if (pager.hasClass('to-bio')) {
    $(cvSelectors).fadeOut(1000, function() {
      pager.text('CV')
      .removeClass('to-bio')
      .addClass('to-cv')
      .css('pointer-events', 'all');

      $(bioSelectors).fadeIn(1000);
    });
  } else {
    $(bioSelectors).fadeOut(1000, function() {
      pager.text('Bio')
      .removeClass('to-cv')
      .addClass('to-bio')
      .css('pointer-events', 'all');

      $(cvSelectors).fadeIn(1000);
    });
  }
  $('body').scrollTop($('#about').offset().top - 50);
}

// Shows a modal which contains the clicked image
function showModal(event) {
  console.log($(event.target).attr('src'));
  console.log(event);
  console.log(event.target);
  // $('.modal-title').text($(event.target).attr('alt'));
  $('.img-modal').attr('src', $(event.target).attr('src'));
}

// Scrolls the page to the selected section
function scrollView(selector) {
  var warpLength = 1500;
  enableDisable(warpLength);
  var direction = $(selector).attr('href');
  var text = $(selector).attr('data-text');
  $('.warp-text').text(text);
  $('.navbar-link').css('pointer-events', 'none');
  $('.warp').show();
  $('html, body').animate({
    scrollTop: $(direction).offset().top - 50
  }, warpLength, function() {
    $('.warp').hide();
    $('.navbar-link').css('pointer-events', 'all');
  });
}

function enableDisable(delay) {
  Waypoint.disableAll();
  setTimeout(function() {
    Waypoint.enableAll();
  }, delay - 200);
}

// Solves Bootstrap malfunction with navbar, and collapses it when necessary
function collapseMenu() {
  $('.navbar-collapse').removeClass('in')
  .removeAttr('aria-expanded')
  .attr('aria-expanded', 'false');
}

function getImages(selectedCategory) {
  $.ajax({
    url: 'images.php',
    dataType: 'json',
    cache: false,
    type: 'POST',
    data: {
      category: selectedCategory
    },
    success: function(data) {
      insertImages(data.images);
    }
  });
}

function insertImages(images) {
  $.each(images, function(key, value) {
    $('.gallery').append('<div class="img-container"><img src="images/' + value + '" alt="" data-toggle="modal" data-target="#artGallery"></div>');
  });

  $('[data-toggle="modal"]').click(function(event) {
    showModal(event);
  });
}

// Beginning of tests with HammerJS
