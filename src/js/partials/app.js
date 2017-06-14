$(document).ready(function() {

    var topSlider = new Slider("#topSlider1", {
        direction: "horizontal",
        currentSlide: 0,
        changeInterval: 1500
    });

    // $("#topSlider1").hammer().bind("swipeleft", topSlider.prevSlide);
    // $("#topSlider1").hammer().bind("swiperight", topSlider.nextSlide);

    var elem = document.getElementById("topSlider1");

    var mc = new Hammer(elem);
    mc.on("swipeleft", function() {
        topSlider.swipeLeft();
    });
    mc.on("swiperight", function() {
        topSlider.swipeRight();
    });

    // Hammer(topSlider).on("swipeleft", function() {
    //     topSlider.prevSlide();
    // });

    // Hammer(topSlider).on("swiperight", function() {
    //     topSlider.nextSlide();
    // });

});
