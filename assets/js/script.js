const init = function() {
    const imagesList = document.querySelectorAll('.gallery__item');
    imagesList.forEach( img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

    runJSSlider();
}

document.addEventListener('DOMContentLoaded', init);

const runJSSlider = function() {
    const imagesSelector = '.gallery__item';
    const sliderRootSelector = '.js-slider';

    const imagesList = document.querySelectorAll(imagesSelector);
    const sliderRootElement = document.querySelector(sliderRootSelector);

    initEvents(imagesList, sliderRootElement);
    initCustomEvents(imagesList, sliderRootElement, imagesSelector);
}

const initEvents = function(imagesList, sliderRootElement) {
    imagesList.forEach( function(item)  {
        item.addEventListener('click', function(e) {
            fireCustomEvent(e.currentTarget, 'js-slider-img-click');
        });

    });

    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
    // na elemencie [.js-slider__nav--next]
    const navNext = sliderRootElement.querySelector('.js-slider__nav--next');

    navNext.addEventListener('click' , function(e) {
        fireCustomEvent(e.target , 'js-slider-img-next');
        e.stopPropagation();
    })


    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
    // na elemencie [.js-slider__nav--prev]
    const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');

    navPrev.addEventListener('click' , function(e) {
        fireCustomEvent(e.target , 'js-slider-img-prev');
        e.stopPropagation();
    })


    // todo:
    // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
    // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
    const zoom = sliderRootElement.querySelector('.js-slider__zoom');

    zoom.addEventListener('click' , function(e) {
        if(e.target === e.currentTarget) {
            fireCustomEvent(e.target , 'js-slider-close');
        }
    })

}


const fireCustomEvent = function(element, name) {
    console.log(element.className, '=>', name);

    const event = new CustomEvent(name, {
        bubbles: true,
    });

    element.dispatchEvent( event );
}


const initCustomEvents = function(imagesList, sliderRootElement, imagesSelector) {
    imagesList.forEach(function(img) {
        img.addEventListener('js-slider-img-click', function(event) {
            onImageClick(event, sliderRootElement, imagesSelector);
        });
    });

    sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
    sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
    sliderRootElement.addEventListener('js-slider-close', onClose);
}


const onImageClick = function(event, sliderRootElement, imagesSelector) {
    // todo:
    // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
    // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
    // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
    // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
    // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
    // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany


    sliderRootElement.classList.add('js-slider--active');

    const src = event.target.children[0].getAttribute('src');
    sliderRootElement.querySelector('img').setAttribute('src' , src);

    const groupName = event.target.dataset.sliderGroupName;

    const identicalGroupName = document.querySelectorAll(imagesSelector + '[data-slider-group-name=' + groupName +']');


    const sliderThumb = document.querySelector('.js-slider__thumbs');

    for(let i=0; i<identicalGroupName.length; i++) {
        sliderThumb.appendChild(identicalGroupName[i].cloneNode(true));
    }

    sliderRootElement.querySelector('img').classList.add('js-slider__thumbs-image--current');
}


const onImageNext = function(event) {
    console.log(this, 'onImageNext');
    // [this] wskazuje na element [.js-slider]

    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]

    const currentElement = document.querySelector('.js-slider__thumbs-image--current');

    const currentElementSrc = currentElement.getAttribute('src')
    const sliderThumb = document.querySelector('.js-slider__thumbs');
    const sliderThumbImgList = sliderThumb.querySelectorAll(`img`);

    sliderThumbImgList.forEach( function(el) {
        if(el.getAttribute('src') === currentElementSrc) {
            const currentElement = el;
            currentElement.classList.add('js-slider__thumbs-image--current');

            const nextElement = currentElement.parentElement.nextElementSibling;
            const mainImg = document.querySelector('.js-slider__image');

            if(nextElement === 'null') {
                const firstImgInGroupSrc = document.querySelector('.js-slider__thumbs .gallery__item:first-child img').getAttribute('src');
                mainImg.setAttribute('src' , firstImgInGroupSrc);
            }

            else{
                const nextElementImgSrc = nextElement.querySelector('img').getAttribute('src');
                mainImg.setAttribute('src' , nextElementImgSrc);
            }


            // const nextElement = currentElementInThumb.parentElement.nextElementSibling;
            // const mainImg = document.querySelector('.js-slider__image')
            // console.log(nextElement)

            // if(nextElement !== 'null') {
            //     const nextElementImg = nextElement.querySelector('img');
            //     const nextElementImgSrc = nextElementImg.getAttribute('src')
            //     mainImg.setAttribute('src' , nextElementImgSrc);
            // }

            // else if(nextElement === 'null') {
            //     const firstImgInGroupSrc = document.querySelector('.js-slider__thumbs .gallery__item:first-child img').getAttribute('src');
            //     mainImg.setAttribute('src' , firstImgInGroupSrc);
            // }
       }
   })

}

const onImagePrev = function(event) {
    console.log(this, 'onImagePrev');
    // [this] wskazuje na element [.js-slider]

    // todo:
    // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
    // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
    // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    // 5. podmienić atrybut [src] dla [.js-slider__image]

    const currentElement = document.querySelector('.js-slider__thumbs-image--current');

    const currentElementSrc = currentElement.getAttribute('src')
    const sliderThumb = document.querySelector('.js-slider__thumbs');
    const sliderThumbImgList = sliderThumb.querySelectorAll(`img`);

    sliderThumbImgList.forEach( function(el) {

        if(el.getAttribute('src') === currentElementSrc) {
            const currentElementInThumb = el;
            console.log(currentElementInThumb)
            const previousElement = currentElementInThumb.parentElement.previousElementSibling;
            const previousElementImg = previousElement.querySelector('img');
            const previousElementImgSrc = previousElementImg.getAttribute('src');
            const mainImg = document.querySelector('.js-slider__image');

            if( previousElement !== 'null' && !previousElement.classList.contains('js-slider__thumbs-item--prototype') ) {
                mainImg.setAttribute('src' , previousElementImgSrc);
            }

            else if(previousElement.classList.contains('js-slider__thumbs-item--prototype')) {
                const lastImgInGroupSrc = document.querySelector('.js-slider__thumbs .gallery__item:last-child img').getAttribute('src');
                mainImg.setAttribute('src' , lastImgInGroupSrc);
            }
       }
   })
}

const onClose = function(event) {
    console.log(this, 'onClose')
    // todo:
    // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
    // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]

    document.querySelector('.js-slider--active').classList.remove('js-slider--active');

    const children = document.querySelector('.js-slider__thumbs').children;
    const arr = Array.from(children);

    arr.forEach( function(el) {
        if( !el.classList.contains('js-slider__thumbs-item--prototype') ) {
            document.querySelector('.js-slider__thumbs').removeChild(el);
        }
    } )
}
