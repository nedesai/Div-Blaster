////  Page-scoped globals  ////

// Counters
var rocketIdx = 1;
var asteroidIdx = 1;
var shieldIdx = 1;

// Size Constants
var MAX_ASTEROID_SIZE = 50;
var MIN_ASTEROID_SIZE = 15;
var ASTEROID_SPEED = 5;
var ROCKET_SPEED = 10;
var SHIP_SPEED = 25;
var OBJECT_REFRESH_RATE = 50;  //ms
var SCORE_UNIT = 100;  // scoring is in 100-point units

// Size vars
var maxShipPosX, maxShipPosY;

// Global Window Handles (gwh__)
var gwhGame, gwhOver, gwhStatus, gwhScore, gwhAccuracy;

// Global Object Handles
var ship, imgExplode;

/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
var KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
}

function inputFocus(i){
    if(i.value==i.defaultValue){ i.value=""; i.style.color="#000"; }
}
function inputBlur(i){
    if(i.value==""){ i.value=i.defaultValue; i.style.color="#888"; }

    if ($.isNumeric($('#spawnRate').val()))
    {
      if ($('#spawnRate').val() <= 4.0 && $('#spawnRate').val() >= 0.2)
      {
        //do nothing
      }
      else
      {
        alert('Spawning Rate must be a numerical value in the range [0.2,4.0]');
      }
    }
    else
    {
      alert('Spawning Rate must be a numerical value in the range [0.2,4.0]');
    }
}

function inputBlurLives(i){
    if (Math.floor($('#settingsLives').val()) == $('#settingsLives').val() && $.isNumeric($('#settingsLives').val()))
    {
      if ($('#settingsLives').val() <= 10)
      {
        //do nothing
      }
      else
      {
        alert('Lives must be less than or equal to 10');
      }
    }
    else
    {
      alert('Lives must be an interger');
    }
}

////  Functional Code  ////

var game_state = false;  //false is not playing
var itemRateM = 2;
var muteVoice = true;


//window.onload = function() {
//  $('#explodeImg').hide();
//};

// Main
$(document).ready( function() {
  //$('#explodeImg').hide();
  console.log("Ready!");

  if (gup('life') != null)
  {
    if (Math.floor(gup('life')) == gup('life') && $.isNumeric(gup('life')))
    {
      if (gup('life') <= 10)
      {
        lives = gup('life');
      }
      else
      {
        alert('The number of lives cannot exceed 10!');
        lives = 3;
      }
    }
    else
    {
      alert('The lives value is not an integer! Please enter an Integer!');
      lives = 3;
    }
  }
  else
  {
    lives = 3;
  }

  if (gup('itemRate') != null)
  {
    if (Math.floor(gup('itemRate')) == gup('itemRate') && $.isNumeric(gup('itemRate')))
    {
      itemRateM = gup('itemRate');
    } 
    else
    {
      alert('The itemRate ('+gup('itemRate')+') value is not an integer! Please enter an Integer!');
      itemRateM = 10;
    }
  }
  else
  {
    itemRate = 10;
  }
  
  // Set global handles (now that the page is loaded)
  gwhGame = $('.game-window');
  gwhOver = $('.game-over');
  gwhStatus = $('.status-window');
  gwhScore = $('#score-box');
  gwhAccuracy = $('#accuracy-box'); //set accuracy box handle
  ship = $('#enterprise');  // set the global ship handle
  imgExplode = $('#explodeImg');

  // Set global positions
  maxShipPosX = gwhGame.width() - ship.width();
  maxShipPosY = gwhGame.height() - ship.height();

  $(window).keydown(keydownRouter);
  //$(window).keydown(moveShip);
  //$(window).keydown(fireRocket);
  //$(window).keydown(createAsteroid);


  // Periodically check for collisions (instead of checking every position-update)
  setInterval( function() {
    checkCollisions();  // Remove elements if there are collisions
  }, 100);
});

var interval_id;
var hard_work;
$(window).focus(function() {
    if (!interval_id)
        interval_id = setInterval(hard_work, 1000);
});

$(window).blur(function() {
    clearInterval(interval_id);
    interval_id = 0;
});

function start_game() {
  $("#splash-window").hide();
  game_state = true;
  $(function() {
    rand_asteroids();
  });

  var livesHeight = 0;
  for (var i = lives; i > 1; --i)
  {
    var shipLifeStr = "<div id='shiplife-" + i + "' class='shiplives'></div>";
    gwhGame.append(shipLifeStr);
    // Create and rocket handle based on newest index
    var curLife = $('#shiplife-'+i);
    // Set vertical position
    curLife.css('top', livesHeight+"px");
    curLife.css('right', "0px");
    curLife.css({position: 'absolute'});
    curLife.append("<img src='img/fighter.png' id='avatarImg' height='25px' />");
    livesHeight += 25;
  }
  $('.ship').css("top", "530px");
  $('.ship').css("left", "122px");
  $('.imgExpl').css("top", "530px");
  $('.imgExpl').css("left", "122px");
}

$(document).ready(function() {
  if (muteVoice == false)
  {
    $("#intro-audio").get(0).play();
  }
});

/*var audioIntro = document.createElement('audio');
audioIntro.setAttribute('src', 'audio/intro.wav');
audioIntro.setAttribute('autoplay', 'autoplay');

$.get();

audioIntro.play();*/

function go_back() {
  game_state = false;
  gwhOver.hide();
  gwhScore.html("0");
  numRockets = 0;
  asteroidDestroyed = 0;

  if (gup('life') != null)
  {
    if (Math.floor(gup('life')) == gup('life') && $.isNumeric(gup('life')))
    {
      if (gup('life') <= 10)
      {
        lives = gup('life');
      }
      else
      {
        lives = 3;
      }
    }
    else
    {
      lives = 3;
    }
  }
  else
  {
    lives = 3;
  }

  $('#accuracy-box').html("0%");
  $("#splash-window").show();
  if (muteVoice == false)
  {
    $("#intro-audio").get(0).play();
  }
  var shipStr = "<div id='enterprise' class='ship'><img class='avatar' src='img/fighter.png' height='50px'/></div>";
  gwhGame.append(shipStr);
  ship = $('#enterprise');
  ship.css("top", "530px");
  ship.css("left", "122px");
  $('.imgExpl').css("top", "530px");
  $('.imgExpl').css("left", "122px");
}

function open_settings() {
    $('#settings-panel').toggle();
    if (muteVoice)
    {
      $('#muteVoiceCheck').prop('checked', true);
    }
    else
    {
      $('#muteVoiceCheck').prop('checked', false);
    }
    $('#open-settings').text( function(i, text) {
        return text == "Open Setting Panel" ? "Close Setting Panel" : "Open Setting Panel";
      });
};

function update_settings() {
    //if ()
    $('#settings-panel').hide();
    $('#open-settings').text( function(i, text) {
        return text == "Open Setting Panel" ? "Close Setting Panel" : "Open Setting Panel";
      });
    
    if ($.isNumeric($('#spawnRate').val()))
    {
      if ($('#spawnRate').val() <= 4.0 && $('#spawnRate').val() >= 0.2)
      {
        spawn_rate = parseFloat($('#spawnRate').val());
      }
      else
      {
        spawn_rate = 1.0;
      }
    }
    else
    {
      spawn_rate = 1.0;
    }

    if($("#muteVoiceCheck").is(':checked'))
    {
      muteVoice = true;  // checked
    }
    else
    {
      muteVoice = false;  // unchecked
    }
    if ($.isNumeric($('#settingsLives').val()))
    {
      if ($('#settingsLives').val() <= 10)
      {
        lives = $('#settingsLives').val();
      }
      else
      {
        lives = 3;
      }
    }
    else
    {
      lives = 3;
    }
};

var timeoutID;

function rand_asteroids() {
    var get_rand = function() {
        if (numAsteroids == itemRateM)
        {
          createShield();
        }
        else
        {
          createAsteroid();
        }
        var rand_num = (Math.random() * (((spawn_rate + (spawn_rate*0.5)) * 1000.0) - ((spawn_rate - (spawn_rate*0.5)) * 1000.0))) + ((spawn_rate - (spawn_rate*0.5)) * 1000.0);
        timeoutID = setTimeout(get_rand, rand_num);
        console.log(rand_num / 1000);

    }
    get_rand();
}

/*(function loop() {
    var rand_num = (Math.random() * ((spawn_rate + (spawn_rate*0.5)) - (spawn_rate - (spawn_rate*0.5)))) + (spawn_rate - (spawn_rate*0.5));
    setTimeout(function() {
            createAsteroid();
            loop();  
    }, rand_num);
}());*/



//creating variable to count number of rockets fired
var numRockets = 0;
var spawn_rate = 1.0; //default spawn rate for asteroids
var lives = 3;
var shipHasShield = false;

function keydownRouter(e) {
  switch (e.which) {
    //case KEYS.shift:
      //createAsteroid();
      //break;
    case KEYS.spacebar:
      ++numRockets;
      fireRocket();
      break;
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      moveShip(e.which);
      break;
    default:
      console.log("Invalid input!");
  }
}

//creating variable to count number of asteroids destroyed
var asteroidDestroyed = 0;

// Check for any collisions and remove the appropriate object if needed
function checkCollisions() {
  // First, check for rocket-asteroid checkCollisions
  /* NOTE: We dont use a global handle here because we need to refresh this
   * list of elements when we make the reference.
   */
  $('.rocket').each( function() {
    var curRocket = $(this);  // define a local handle for this rocket
    $('.asteroid').each( function() {
      var curAsteroid = $(this);  // define a local handle for this asteroid

      // For each rocket and asteroid, check for collisions
      if (isColliding(curRocket,curAsteroid)) {
        // If a rocket and asteroid collide, destroy both
        ++asteroidDestroyed;
        curRocket.remove();
        curAsteroid.remove();

        // Score points for hitting an asteroid! Smaller asteroid --> higher score
        var points = Math.ceil(MAX_ASTEROID_SIZE-curAsteroid.width()) * SCORE_UNIT;
        //making variable to display the accuracy percentage
        var accuracyCalc = (asteroidDestroyed / numRockets) * 100;
        // Update the visible score
        gwhScore.html(parseInt($('#score-box').html()) + points);
        //update the accuracy
        gwhAccuracy.html( accuracyCalc.toFixed() + "%");
      }
    });
    $('.shield').each( function() {
      var curShield = $(this);  // define a local handle for this asteroid

      // For each rocket and asteroid, check for collisions
      if (isColliding(curRocket,curShield)) {
        // If a rocket and asteroid collide, destroy both
        ++asteroidDestroyed;
        curRocket.remove();
        curShield.remove();

        //making variable to display the accuracy percentage
        var accuracyCalc = (asteroidDestroyed / numRockets) * 100;
        //update the accuracy
        gwhAccuracy.html( accuracyCalc.toFixed() + "%");
      }
    });
  });


  // Next, check for asteroid-ship interactions
  $('.asteroid').each( function() {
    var curAsteroid = $(this);
    if (isColliding(curAsteroid, ship)) {
      if (shipHasShield)
      {
        $('#s').remove()
      }
      else
      {
        $('.shield').remove();
      }
      if (lives > 1)
      {
        if (shipHasShield == false)
        {
          imgExplode.toggle();
          setTimeout(function(){
            imgExplode.hide();
          }, 1000); 
        }
      }

      if (muteVoice == false)
      {
        if (shipHasShield == false)
        {
          var audioExpl = document.createElement('audio');
          audioExpl.setAttribute('src', 'audio/explode.wav');
          audioExpl.setAttribute('autoplay', 'autoplay');

          $.get();

          audioExpl.play();
        }
      }

      if (lives > 1)
      {
        if (shipHasShield)
        {
          curAsteroid.remove();
          shipHasShield = false;
        }
        else
        {
          $('#shiplife-'+lives).remove();
          --lives;
          $('.rocket').remove();  // remove all rockets
          $('.asteroid').remove();  // remove all asteroids
          $('.ship').css("top", "530px");
          $('.ship').css("left", "122px");
          $('.imgExpl').css("top", "530px");
          $('.imgExpl').css("left", "122px");
        }
      }
      else
      {
        if (shipHasShield == false)
        {
          // Remove all game elements
          ship.detach();
          $('.rocket').remove();  // remove all rockets
          $('.asteroid').remove();  // remove all asteroids

          // Show "Game Over" screen
          game_state = false;
          clearTimeout(timeoutID);
          gwhOver.toggle();
          $('#endScoreBox').append($("#score-box").text());
          if (muteVoice == false)
          {
            var audioOver = document.createElement('audio');
            audioOver.setAttribute('src', 'audio/gameover.wav');
            audioOver.setAttribute('autoplay', 'autoplay');

            $.get();

            audioOver.play();
          }
        }
        else
        {
          curAsteroid.remove();
          shipHasShield = false;
        }
      }
    }
  });

  $('.shield').each( function() {
    var curShield1 = $(this);
    if (isColliding(curShield1, ship)) {
      curShield1.remove();
      if (shipHasShield == false)
      {
        shipHasShield = true;
        shieldDivStr = "<div id='s' class='shield'></div>";
        ship.append(shieldDivStr);
        shipShield = $('#s'); 
        shipShieldSize = 60;   
        shipShield.css('width', shipShieldSize+"px");
        shipShield.css('height', shipShieldSize+"px");
        shipShield.append("<img src='img/shield.png' height='" + shipShieldSize + "'/>");
        shipShield.css('top', '0px');
        shipShield.css('left', '0px');
        shipShield.css({position: 'absolute'});
      }
    }
  });
}

// Check if two objects are colliding
function isColliding(o1, o2) {
  // Define input direction mappings for easier referencing
  o1D = { 'left': parseInt(o1.css('left')),
          'right': parseInt(o1.css('left')) + o1.width(),
          'top': parseInt(o1.css('top')),
          'bottom': parseInt(o1.css('top')) + o1.height()
        };
  o2D = { 'left': parseInt(o2.css('left')),
          'right': parseInt(o2.css('left')) + o2.width(),
          'top': parseInt(o2.css('top')),
          'bottom': parseInt(o2.css('top')) + o1.height()
        };

  // If horizontally overlapping...
  if ( (o1D.left < o2D.left && o1D.right > o2D.left) ||
       (o1D.left < o2D.right && o1D.right > o2D.right) ||
       (o1D.left < o2D.right && o1D.right > o2D.left) ) {

    if ( (o1D.top > o2D.top && o1D.top < o2D.bottom) ||
         (o1D.top < o2D.top && o1D.top > o2D.bottom) ||
         (o1D.top > o2D.top && o1D.bottom < o2D.bottom) ) {

      // Collision!
      return true;
    }
  }
  return false;
}

// Return a string corresponding to a random HEX color code
function getRandomColor() {
  // Return a random color. Note that we don't check to make sure the color does not match the background
  return '#' + (Math.random()*0xFFFFFF<<0).toString(16);
}

// Handle asteroid creation events
var numAsteroids = 0;
function createAsteroid() {
  console.log('Spawning asteroid...');
  ++numAsteroids;
  var asteroidDivStr;
  var curAsteroid;
  var astrSize;

  // NOTE: source - http://www.clipartlord.com/wp-content/uploads/2016/04/aestroid.png
  asteroidDivStr = "<div id='a-" + asteroidIdx + "' class='asteroid'></div>";
  // Add the rocket to the screen
  gwhGame.append(asteroidDivStr);
  // Create and asteroid handle based on newest index
  curAsteroid = $('#a-'+asteroidIdx);

  asteroidIdx++;  // update the index to maintain uniqueness next time

  // Set size of the asteroid (semi-randomized)
  astrSize = MIN_ASTEROID_SIZE + (Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE));
  curAsteroid.css('width', astrSize+"px");
  curAsteroid.css('height', astrSize+"px");
  curAsteroid.append("<img src='img/asteroid.png' height='" + astrSize + "'/>");

  /* NOTE: This position calculation has been moved lower since verD -- this
  **       allows us to adjust position more appropriately.
  **/
  // Pick a random starting position within the game window
  var startingPositionA = Math.random() * (gwhGame.width()-astrSize);  // Using 50px as the size of the asteroid (since no instance exists yet)

  // Set the instance-specific properties
  curAsteroid.css('left', startingPositionA+"px");

  // Make the asteroids fall towards the bottom
  setInterval( function() {
    curAsteroid.css('top', parseInt(curAsteroid.css('top'))+ASTEROID_SPEED);
    // Check to see if the asteroid has left the game/viewing window
    if (parseInt(curAsteroid.css('top')) > (gwhGame.height() - curAsteroid.height())) {
      curAsteroid.remove();
    }
  }, OBJECT_REFRESH_RATE);
}

function createShield() {
  console.log('Spawning shield...');
  var shieldDivStr;
  var curShield;
  var shieldSize;

  shieldDivStr = "<div id='s-" + shieldIdx + "' class='shield'></div>";
  gwhGame.append(shieldDivStr);
  curShield = $('#s-'+shieldIdx);
  shieldIdx++;
  shieldSize = 60;   
  curShield.css('width', shieldSize+"px");
  curShield.css('height', shieldSize+"px");
  curShield.append("<img src='img/shield.png' height='" + shieldSize + "'/>");
  curShield.css({position: 'absolute'});

  /* NOTE: This position calculation has been moved lower since verD -- this
  **       allows us to adjust position more appropriately.
  **/
  // Pick a random starting position within the game window
  var startingPositionS = Math.random() * (gwhGame.width()-shieldSize);  // Using 50px as the size of the asteroid (since no instance exists yet)

  // Set the instance-specific properties
  curShield.css('left', startingPositionS+"px");

  numAsteroids = 0;

  // Make the asteroids fall towards the bottom
  setInterval( function() {
    curShield.css('top', parseInt(curShield.css('top'))+ASTEROID_SPEED);
    // Check to see if the asteroid has left the game/viewing window
    if (parseInt(curShield.css('top')) > (gwhGame.height() - curShield.height())) {
      curShield.remove();
    }
  }, OBJECT_REFRESH_RATE);
}

// Handle "fire" [rocket] events
function fireRocket() {
  if (game_state == true)
  {
    console.log('Firing rocket...');

    if (muteVoice == false)
    {
      var audioRocket = document.createElement('audio');
      audioRocket.setAttribute('src', 'audio/rocket.wav');
      audioRocket.setAttribute('autoplay', 'autoplay');

      $.get();

      audioRocket.play();      
    }

    //making variable to display the accuracy percentage
    var accuracyCalc = (asteroidDestroyed / numRockets) * 100;

    //update the accuracy on the html
    gwhAccuracy.html( accuracyCalc.toFixed() + '%');

    // NOTE: source - https://www.raspberrypi.org/learning/microbit-game-controller/images/missile.png
    var rocketDivStr = "<div id='r-" + rocketIdx + "' class='rocket'><img src='img/rocket.png'/></div>";
    // Add the rocket to the screen
    gwhGame.append(rocketDivStr);
    // Create and rocket handle based on newest index
    var curRocket = $('#r-'+rocketIdx);
    rocketIdx++;  // update the index to maintain uniqueness next time

    // Set vertical position
    curRocket.css('top', ship.css('top'));
    // Set horizontal position
    var rxPos = parseInt(ship.css('left')) + (ship.width()/2);  // In order to center the rocket, shift by half the div size (recall: origin [0,0] is top-left of div)
    curRocket.css('left', rxPos+"px");

    // Create movement update handler
    setInterval( function() {
      curRocket.css('top', parseInt(curRocket.css('top'))-ROCKET_SPEED);
      // Check to see if the rocket has left the game/viewing window
      if (parseInt(curRocket.css('top')) < curRocket.height()) {
        //curRocket.hide();
        curRocket.remove();
      }
    }, OBJECT_REFRESH_RATE);
  }
}

// Handle ship movement events
function moveShip(arrow) {
  switch (arrow) {
    case KEYS.left:  // left arrow
      var newPos = parseInt(ship.css('left'))-SHIP_SPEED;
      var explPos = parseInt(imgExplode.css('left'))-SHIP_SPEED;
      if (newPos < 0 || explPos < 0) {
        newPos = 0;
        explPos = 0;
      }
      ship.css('left', newPos);
      imgExplode.css('left', explPos);
    break;
    case KEYS.right:  // right arrow
      var newPos = parseInt(ship.css('left'))+SHIP_SPEED;
      var explPos = parseInt(imgExplode.css('left'))+SHIP_SPEED;
      if (newPos > maxShipPosX || explPos > maxShipPosX) {
        newPos = maxShipPosX;
        explPos = maxShipPosX;
      }
      ship.css('left', newPos);
      imgExplode.css('left', explPos);
    break;
    case KEYS.up:  // up arrow
      var newPos = parseInt(ship.css('top'))-SHIP_SPEED;
      var explPos = parseInt(imgExplode.css('top'))-SHIP_SPEED;
      if (newPos < 0 || explPos < 0) {
        newPos = 0;
        explPos = 0;
      }
      ship.css('top', newPos);
      imgExplode.css('top', explPos);
    break;
    case KEYS.down:  // down arrow
      var newPos = parseInt(ship.css('top'))+SHIP_SPEED;
      var explPos = parseInt(imgExplode.css('top'))+SHIP_SPEED;
      if (newPos > maxShipPosY || explPos > maxShipPosY) {
        newPos = maxShipPosY;
        explPos = maxShipPosY;
      }
      ship.css('top', newPos);
      imgExplode.css('top', explPos);
    break;
  }
}
