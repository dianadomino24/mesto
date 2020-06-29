const popup = document.querySelectorAll('.popup')
const popupProfileOpenButton = document.querySelector('.profile__edit-button')
const popupCloseButton = document.querySelector('.popup__close-button')
const saveProfileButton = document.querySelector('.popup__save-button')
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__job')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')
let placesItems = document.querySelectorAll('.places__item')

let imgTriggers = document.querySelectorAll('[data-img-trigger]')
const imgPopup = document.querySelector('.popup_type_picture-zoom')


let popupTriggers = document.querySelectorAll('[data-popup-trigger]')
console.log(popupTriggers)



// переключает класс попап
const popupToggle = function (currentPopup) {
    currentPopup.classList.toggle('popup_opened')
}

const popupToggleFromEvent = function (event) {
    let currentPopup = event.target.closest('.popup')
    popupToggle(currentPopup)
}

function cleanInputValues(currentPopup) {
    let inputs = currentPopup.querySelectorAll('.input')
    inputs.forEach( input => {input.value = ''})
}

const cleanInputValuesFromEvent = function (event) {
    let currentPopup = event.target.closest('.popup')
    cleanInputValues(currentPopup)
}

const closePopupByClickingOverlay = function (event) {
    if (event.target !== event.currentTarget) { return }
    popupToggleFromEvent(event)
    cleanInputValuesFromEvent(event)
}

function addPopupListeners(currentPopup) {
    currentPopup.querySelector('.popup__close-button').addEventListener('click', popupToggleFromEvent);
    currentPopup.addEventListener('click', closePopupByClickingOverlay);
}

popupTriggers.forEach(trigger => trigger.addEventListener('click', openCurrentPopup))

function openCurrentPopup(evt) {
    console.log(evt.target)
    let currentTrigger = evt.target
    let currentPopupValue = currentTrigger.dataset.popupTrigger
    let currentPopup = document.querySelector(`[data-popup-name=${CSS.escape(currentPopupValue)}]`)

    popupToggle(currentPopup)
    cleanInputValues(currentPopup)
    addPopupListeners(currentPopup)
}


let formProfile = document.querySelector('.popup__form_type_profile')
popupProfileOpenButton.addEventListener('click', function() {
    inputName.value = profileName.textContent
    inputJob.value = profileJob.textContent
})

// Обработчик «отправки» формы
function profileFormSubmitHandler (evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

    if (inputName.value !== inputName.placeholder && inputName.value.length > 0 && inputName.value.trim() !== '') {
        profileName.textContent = inputName.value.trim()
    }
    if (inputJob.value !== inputJob.placeholder && inputJob.value.length > 0 && inputJob.value.trim() !== '') {
        profileJob.textContent = inputJob.value.trim()
    }
    popupToggleFromEvent(event)
}

formProfile.addEventListener('submit', profileFormSubmitHandler);




const initialCards = [
    {
        name: 'Архыз',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
    },
    {
        name: 'Челябинская область',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
    },
    {
        name: 'Иваново',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
    },
    {
        name: 'Камчатка',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
    },
    {
        name: 'Холмогорский район',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
    },
    {
        name: 'Байкал',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    }
];



const placesList = document.querySelector('.places__list')
const placeForm = document.querySelector('.popup__form_type_place')
const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')
const placeTemplate = document.querySelector('.place-template')
const emptyList = document.querySelector('.places__empty-list')

function addPlace(placeName , placePic) {
    const place = placeTemplate.content.cloneNode(true);

    place.querySelector('.place__name').textContent = placeName
    place.querySelector('.place__image').src = placePic

    addPlaceListeners(place)
    
    placesList.prepend(place)
    updatePlacesItems()
    updateImgTriggers ()
    
}

function addPlaceListeners(place) {
    place.querySelector('.place__like-button').addEventListener('click', function(evt) {
        evt.target.classList.toggle('place__like-button_active');
    }) 
    place.querySelector('.place__delete-button').addEventListener('click', deletePlace)
}


function deletePlace(e) {
    const place = e.target.closest('.places__item');
    console.log(place)
    place.remove();
    updatePlacesItems()
    updateImgTriggers ();
}


//проверяет, есть ли в списке карточки, если нет, то делает видимой надпись о пустом списке
function updatePlacesItems() {
    placesItems = document.querySelectorAll('.places__item')
    if (placesItems.length === 0) {
        emptyList.classList.add('places__empty-list_visible')
    } else {
        emptyList.classList.remove('places__empty-list_visible')
    }
}




placeForm.addEventListener('submit', placeFormSubmitHandler) 

function placeFormSubmitHandler (evt) {
    evt.preventDefault();

    let placeName = placeInputName.value
    let placePic = placeInputPic.value

    //если не введена ссылка, то попап закроется. Если не введено название, оно заменится на "Название"
    if (placePic.trim() === '') {
        popupToggleFromEvent(event)
        return
    }
    else if (placeName.trim() === '') {
        placeName = "Название"
    }
    addPlace(placeName, placePic);
    
    placeInputName.value = '';
    placeInputPic.value = '';
    
    popupToggleFromEvent(event)
    // updateImgTriggers ()
}

initialCards.forEach(element => {
    addPlace(element.name, element.link)
}) 







imgTriggers.forEach(trigger => trigger.addEventListener('click', openImgPopup))

function openImgPopup(evt) {
    let currentImgTrigger = evt.target

    let imgName = currentImgTrigger.closest('.place').querySelector('.place__name').textContent
    let imgSrc = currentImgTrigger.src
    
    imgPopup.querySelector('.picture-zoom__title').textContent = imgName
    imgPopup.querySelector('.picture-zoom__img').src = imgSrc

    popupToggle(imgPopup)
    addPopupListeners(imgPopup)
    
}



//обновляем массив карточек
function updateImgTriggers () {
    imgTriggers = document.querySelectorAll('[data-img-trigger]')
    imgTriggers.forEach(trigger => trigger.addEventListener('click', openImgPopup))
}



// if (currentPopup.nodeName == 'TEMPLATE') {
//     currentPopup = currentPopup.content
// }


// const inputs = document.querySelectorAll('.input')
// сохраняет values для всех inputs по порядку html
// const profileInputs = document.querySelectorAll('.profile__input')
// const saveProfileChanges = function() {
//     for (let i = 0; i < inputs.length; i++) {
//         let input = inputs[i]
//         if (input.value !== input.placeholder && input.value.length > 0 && input.value.trim() !== '') {
//             profileInputs[i].textContent = input.value
//             input.placeholder = input.value
//         }
//         input.value = ''
//     }
//     popupToggle()
// }

// //если бы надо было заменять placeholder и обнулять value 
// const saveProfileChanges = function() {
//     if (inputName.value !== inputName.placeholder && inputName.value.length > 0 && inputName.value.trim() !== '') {
//         profileName.textContent = inputName.value
//         inputName.placeholder = inputName.value
//     }
//     if (inputJob.value !== inputJob.placeholder && inputJob.value.length > 0 && inputJob.value.trim() !== '') {
//         profileJob.textContent = inputJob.value
//         inputJob.placeholder = inputJob.value
//     }
//     popupToggle()
//     cleanInputValues()
// }

