$(document).ready(function() {

    var topSlider = new Slider("#topSlider1", {
        direction: "horizontal",
        currentSlide: 0,
        changeInterval: 1500
    });

    var topSliderNode = document.getElementById("topSlider1");
    var hammer = new Hammer.Manager(topSliderNode);
    var swipe = new Hammer.Swipe();

    hammer.add(swipe);
    hammer.on('swipeleft', function() {
        topSlider.swipeLeft();
    });

    hammer.on('swiperight', function() {
        topSlider.swipeRight();
    });

});
