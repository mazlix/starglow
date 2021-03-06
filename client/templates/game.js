// App globals {
//scenery {
backgrounds = [
  "/assets/scenes/1/background@2x.png",
  "/assets/scenes/2/background@2x.png",
  "/assets/scenes/3/background@2x.png",
  "/assets/scenes/4/background@2x.png",
  "/assets/scenes/5/background@2x.png",
  "/assets/scenes/6/background@2x.png",
];
foregrounds = [
  "/assets/scenes/1/foreground@2x.png",
  "/assets/scenes/2/foreground@2x.png",
  "/assets/scenes/3/foreground@2x.png",
  "/assets/scenes/4/foreground@2x.png",
  "/assets/scenes/5/foreground@2x.png",
  "/assets/scenes/6/foreground@2x.png",
]
//}

currentScene = 0;
NUMBER_OF_SCENES = backgrounds.length;
// }

// File globals {
var down = false;
//var ready = true;
//var throttleSpeed = 100; //milliseconds

var prevX = 0;
var prevY = 0;
//SOUNDS {
var backgroundMusicURL = "/assets/sounds/glowstar-soundtrak-2.wav"
var starPlacedSFXUFL = "/assets/sounds/twinkle.wav"
var backgroundMusic = new Howl({
  urls: [backgroundMusicURL],
  loop: true
})

// FOR DEBUG ONLY {
window.bgm = backgroundMusic;
bgm.mute();
console.log("%cType bgm.unmute() to unmute the background music which I've temporarily made mute by default", "font-size: x-large")
// }

var starPlacedSFX = new Howl({
  urls: [starPlacedSFXUFL],
  loop: true
});
var starPlacedSFXFade = new Howl({
  urls: [starPlacedSFXUFL],
  loop: true
})
//}

// }

var distanceSquared = function(x1,x2,y1,y2) {
  return ((x1 - x2)*(x1 - x2)+((y1 - y2) *(y1 - y2)));
}

// OnLoad...
$(function() {

  Session.set('star', '/assets/stars/gold-burst-star.png');
  backgroundMusic.play();
  setScene(_.random(0, NUMBER_OF_SCENES));
  //$("#backgroundImage").attr('src', backgrounds[0]);
  //$("#foregroundImage").attr('src', foregrounds[0]);
  //$("#background").css('background-size', "100% 100%");
});

var placeStar = function(x,y) {
  //newStar = $("<div class='stamp'></div>").appendTo("#background").css('top', y).css('left', x);
  newStar = $("<img class='stamp' src='' />").appendTo("#background").css('top', y).css('left', x);
  newStar.attr('src', Session.get('star'));
  newStar.animate({
    width: '60px',
    height: '60px',
    top: '-=12px',
    left: '-=12px'
  }, 200, function() {
    $(this).animate({
    width: '40px',
    height: '40px',
    top: '+=12px',
    left: '+=12px'
    }, 200)
  });
};

Template.game.events({
  'touchend.fingers': function(evt) {
    if(down == true) {
      down = false;
      starPlacedSFX.stop();
      pos = starPlacedSFX.pos
      starPlacedSFXFade.pos(pos)
      starPlacedSFXFade.play();
      starPlacedSFXFade.fadeOut(0, 1000, function() {
        starPlacedSFXFade.stop();
        starPlacedSFXFade.volume(0.5);
      });
    }
  },
  'touchstart.fingers #background': function(evt) {
    down = true;
    starPlacedSFX.stop();
    starPlacedSFX.volume(0.5);
    starPlacedSFX.play();

    //loop sound
    evt.preventDefault();
    //coords of click
    evt = evt.originalEvent.touches[0];
    var x = evt.pageX - $('#background').offset().left;
    var y = evt.pageY - $('#background').offset().top;
    if(distanceSquared(prevX, x, prevY, y) > 2000 ) {
      placeStar(x,y)
      prevX = x;
      prevY = y;
    }
  },
  'touchmove.fingers #background': function(evt) {
    evt.preventDefault();
    if(down) {
 
      //coords of click
      evt = evt.originalEvent.touches[0];
      var x = evt.pageX - $('#background').offset().left;
      var y = evt.pageY - $('#background').offset().top;
      //console.log(x,y)

      //birthStar

      if(distanceSquared(prevX, x, prevY, y) > 2000 ) {

        placeStar(x,y)
        prevX = x;
        prevY = y;
      }

    }
  }
})
