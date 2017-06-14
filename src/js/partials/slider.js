function Slider(selector, options) {

    var __self = this;

    // DOM Nodes
    var sliderNode = document.querySelector(selector),
        sliderImagesNode = sliderNode.querySelector('.slider__images-wrap'),
        prevSliderNode = sliderNode.querySelector('.slider__pager_previous'),
        nextSliderNode = sliderNode.querySelector('.slider__pager_next'),
        paginationNode = sliderNode.querySelector('.slider__pagination');

    var currentSlideIndex = options.currentSlide || 0,
        imagesCount = sliderImagesNode.children.length,        
        slideSize = sliderImagesNode[(options.direction === 'vertical') ? 'offsetHeight' : 'offsetWidth'];

    this.prevSlide = function () {
        if (currentSlideIndex === 0) {
            currentSlideIndex = imagesCount - 1;
            return;
        }
        currentSlideIndex--;
    };

    this.nextSlide = function () {
        if (currentSlideIndex === imagesCount - 1) {
            currentSlideIndex = 0;
            return;
        }
        currentSlideIndex++;
    };

    this.swipeLeft = function () {
        __self.nextSlide();
        __self.__render();
    }

    this.swipeRight = function () {
        __self.prevSlide();
        __self.__render();
    }

    this.__render = function () {
        var directionStyle = (options.direction === 'vertical') ? 'marginTop' : 'marginLeft';

        sliderImagesNode.style[directionStyle] = -(currentSlideIndex * slideSize) + 'px';
        
        if(paginationNode.querySelector('.active') !== null) {
            paginationNode.querySelector('.active').classList.remove('active');
        }
        paginationNode.children[currentSlideIndex].querySelector('a').classList.add('active');
    };

    prevSliderNode.onclick = function(e) {
        e.preventDefault();
        __self.prevSlide();
        __self.__render();
    };

    nextSliderNode.onclick = function(e) {
        e.preventDefault();
        __self.nextSlide();
        __self.__render();
    };

    paginationNode.onclick = function(e) {
        e.preventDefault();

        var link = e.target;

        if (link.tagName !== 'A') { return; }

        currentSlideIndex = +link.dataset['slider__item'];

        __self.__render();
    };

    this.__createPaginationItems = function() {
    	var template = paginationNode.querySelector('.slider__pagination-item_tmpl');    	

    	var fragment = document.createDocumentFragment();    	

    	for(let i = 0; i < imagesCount; i++) {
    		var pageItemClone = template.cloneNode(true);    		
    		pageItemClone.classList.remove('slider__pagination-item_tmpl');
    		//pageItemClone.querySelector('a').textContent = i;
    		pageItemClone.querySelector('a').dataset['slider__item'] = i;
    		fragment.appendChild(pageItemClone);
    	}
    	paginationNode.appendChild(fragment);    	

        template.remove();
    }

    this.__init = function () {
        if (options.direction === 'vertical') {
            sliderImagesNode.style.whiteSpace = 'normal';
        }

        this.__createPaginationItems();
        this.__render();
    };

    this.__init();

}