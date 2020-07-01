// import { initialCards } from "./utils";

const popup = document.querySelectorAll('.popup')
const popupProfileOpenButton = document.querySelector('.profile__edit-button')
const popupCloseButton = document.querySelector('.popup__close-button')
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__job')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')

let placesItems = document.querySelectorAll('.places__item')
let imgTriggers = document.querySelectorAll('[data-img-trigger]')
const imgPopup = document.querySelector('.popup_type_picture-zoom')

let popupTriggers = document.querySelectorAll('[data-popup-trigger]')

const placesList = document.querySelector('.places__list')
const placeForm = document.querySelector('.popup__form_type_place')
const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')
const placeTemplate = document.querySelector('.place-template')
const emptyList = document.querySelector('.places__empty-list')

//не разобралась, как сделать импорт utils. надеюсь, в следующ.спринте реализую:)
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


// переключает класс попап
const popupToggle = function (currentPopup) {
    currentPopup.classList.toggle('popup_opened')
}

//по событию вычисляет у какого попапа переключить класс
const popupToggleFromEvent = function (event) {
    let currentPopup = event.target.closest('.popup')
    popupToggle(currentPopup)
}
//очищает values input
function cleanInputValues(currentPopup) {
    let inputs = currentPopup.querySelectorAll('.input')
    inputs.forEach( input => {input.value = ''})
}
//по событию вычисляет у какого попапа очистить values
const cleanInputValuesFromEvent = function (event) {
    let currentPopup = event.target.closest('.popup')
    cleanInputValues(currentPopup)
}
//закрывает попап при нажатии на фон
const closePopupByClickingOverlay = function (event) {
    if (event.target !== event.currentTarget) { return }
    popupToggleFromEvent(event)
    cleanInputValuesFromEvent(event)
}
//прослушки для закрытия текущего попапа
function addPopupListeners(currentPopup) {
    currentPopup.querySelector('.popup__close-button').addEventListener('click', popupToggleFromEvent);
    currentPopup.addEventListener('click', closePopupByClickingOverlay);
}
//открывает текущий попап
function openCurrentPopup(evt) {
    let currentTrigger = evt.target
    let currentPopupValue = currentTrigger.dataset.popupTrigger
    let currentPopup = document.querySelector(`[data-popup-name=${CSS.escape(currentPopupValue)}]`)

    popupToggle(currentPopup)
    cleanInputValues(currentPopup)
    addPopupListeners(currentPopup)
}
//при клике на триггер запускает открытие соответствующего триггеру попапа
popupTriggers.forEach(trigger => trigger.addEventListener('click', openCurrentPopup))


let formProfile = document.querySelector('.popup__form_type_profile')
//при открытии попапа редактирования профиля заполняет values инпутов данными из профиля
popupProfileOpenButton.addEventListener('click', function() {
    inputName.value = profileName.textContent
    inputJob.value = profileJob.textContent
})


function profileFormSubmitHandler (evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

    // если в инпуты ничего не введено(или пробелы), то просто закроем попап без сохранения values
    // если введены values с пробелами, то обрежем лишние пробелы
    if (inputName.value.trim() !== '') {
        profileName.textContent = inputName.value.trim()
    }
    if (inputJob.value.trim() !== '') {
        profileJob.textContent = inputJob.value.trim()
    }
    popupToggleFromEvent(event)
}
// Обработчик «отправки» формы
formProfile.addEventListener('submit', profileFormSubmitHandler);

//прослушки для кнопок лайка и удаления карточек
function addPlaceListeners(place) {
    place.querySelector('.place__like-button').addEventListener('click', function(evt) {
        evt.target.classList.toggle('place__like-button_active');
    }) 
    place.querySelector('.place__delete-button').addEventListener('click', deletePlace)
}

// проверяет, есть ли в списке карточки, если нет, то делает видимой надпись о пустом списке
function updatePlacesItems() {
    placesItems = document.querySelectorAll('.places__item')
    if (placesItems.length === 0) {
        emptyList.classList.add('places__empty-list_visible')
    } else {
        emptyList.classList.remove('places__empty-list_visible')
    }
}

// обновляем массив карточек
function updateImgTriggers () {
    imgTriggers = document.querySelectorAll('[data-img-trigger]')
    imgTriggers.forEach(trigger => trigger.addEventListener('click', openImgPopup))
}

// удаляет карточку
function deletePlace(e) {
    const place = e.target.closest('.places__item');
    place.remove();
    updatePlacesItems()
    updateImgTriggers ();
}

// добавляет карточку, ставит ей прослушки и обновляет массивы с карточками и изобр.-триггерами
function addPlace(placeName , placePic) {
    const place = placeTemplate.content.cloneNode(true);

    place.querySelector('.place__name').textContent = placeName
    place.querySelector('.place__image').src = placePic

    addPlaceListeners(place)
    
    placesList.prepend(place)
    updatePlacesItems()
    updateImgTriggers ()  
}


function placeFormSubmitHandler (evt) {
    evt.preventDefault();

    let placeName = placeInputName.value
    let placePic = placeInputPic.value

    // если не введено название, оно заменится на "Название"
    if (placeName.trim() === '') {
        placeName = "Название"
    }
    addPlace(placeName, placePic);
    
    placeInputName.value = '';
    placeInputPic.value = '';
    
    popupToggleFromEvent(event)
}

placeForm.addEventListener('submit', placeFormSubmitHandler) 

// добавит начальные карточки из массива
initialCards.forEach(element => {
    addPlace(element.name, element.link)
}) 

// откроет попап с приближенной картинкой, исходя из триггер-картинки
function openImgPopup(evt) {
    let currentImgTrigger = evt.target

    let imgName = currentImgTrigger.closest('.place').querySelector('.place__name').textContent
    let imgSrc = currentImgTrigger.src
    
    imgPopup.querySelector('.picture-zoom__title').textContent = imgName
    imgPopup.querySelector('.picture-zoom__img').src = imgSrc

    popupToggle(imgPopup)
    addPopupListeners(imgPopup)
}

imgTriggers.forEach(trigger => trigger.addEventListener('click', openImgPopup))
