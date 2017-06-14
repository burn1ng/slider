$(document).ready(function() {

    var topSlider = new Slider("#topSlider1", {
        direction: "horizontal",
        currentSlide: 0,
        changeInterval: 1500
    });

    // $("#topSlider1").hammer().bind("swipeleft", topSlider.prevSlide);
    // $("#topSlider1").hammer().bind("swiperight", topSlider.nextSlide);

    var topSliderNode = document.getElementById('#topSlider1');
    var mc = new Hammer(topSliderNode);
    mc.on("swipeleft", function(ev) {
        topSlider.prevSlide();
    });
    mc.on("swiperight", function(ev) {
        topSlider.nextSlide();
    });

    // Hammer(topSlider).on("swipeleft", function() {
    //     topSlider.prevSlide();
    // });

    // Hammer(topSlider).on("swiperight", function() {
    //     topSlider.nextSlide();
    // });

});
