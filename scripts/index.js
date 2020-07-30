import {Card} from './Card.js'


const popupProfileOpenButton = document.querySelector('.profile__edit-button')
const popupCloseButton = document.querySelector('.popup__close-button')
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__job')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')

//сюда будем класть текущий открытый попап
let currentPopupBox = null

const imgPopup = document.querySelector('.popup_type_picture-zoom')

const popupTriggers = document.querySelectorAll('[data-popup-trigger]')

const placesList = document.querySelector('.places__list')
const placeForm = document.querySelector('.popup__form_type_place')
const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')
const placeTemplate = document.querySelector('.place-template')

//для надписи о том, что все карточки удалены
const emptyList = document.querySelector('.places__empty-list')

//закроет попап при нажатии на Esc
function keyHandler(evt) {
    if (evt.key === 'Escape' && currentPopupBox != null ){
        cleanInputValues()
        popupToggle()
    }
}
//открывает/закрывает текущий попап из коробки
function popupToggle() {
    currentPopupBox.classList.toggle('popup_opened')

    //опустошает currentPopupBox при закрытии попапа и убирает прослушку Esc
    if (currentPopupBox && !currentPopupBox.classList.contains('popup_opened')) {
        currentPopupBox = null
        document.removeEventListener('keydown', keyHandler)
    } else {
        //прослушка для кнопок, чтоб закрыть при Esc
        document.addEventListener('keydown', keyHandler)
    }
}

//очищает values input
function cleanInputValues() {
    let inputs = currentPopupBox.querySelectorAll('.input')
        if (inputs) {
            inputs.forEach( input => {input.value = ''})
        }
}

//закрывает попап при нажатии на фон
function closePopupByClickingOverlay(event) {
    if (event.target !== event.currentTarget) { return }
    
    cleanInputValues()
    popupToggle()
}


const popupList = Array.from(document.querySelectorAll('.popup'))
//прослушки для закрытия открытого попапа
function addPopupListeners(popupList) {
    popupList.forEach(popup => {
        popup.querySelector('.popup__close-button').addEventListener('click', popupToggle)
        popup.addEventListener('mousedown', closePopupByClickingOverlay)
    })
}

addPopupListeners(popupList)


//если открылся попап редактирования профиля, то разблокируем его кнопку сабмита (чтоб она была доступна до изменения инпутов)
//для попапа добавл.карточек заблокируем кнопку
function submitButtonStateBeforeInput(currentPopupBox) {
    if (currentPopupBox && currentPopupBox.classList.contains('popup_type_edit-profile')) {
        currentPopupBox.querySelector('.popup__save-button').classList.remove('popup__save-button_disabled')
    }
    if (currentPopupBox && currentPopupBox.classList.contains('popup_type_add-place')) {
        currentPopupBox.querySelector('.popup__save-button').classList.add('popup__save-button_disabled')
    }
}

// //прослушки для закрытия текущего попапа
// function addPopupListeners(currentPopupBox) {
//     currentPopupBox.querySelector('.popup__close-button').addEventListener('click', popupToggle);
//     currentPopupBox.addEventListener('mousedown', closePopupByClickingOverlay);
// }

//открывает текущий попап, ставит прослушки и очищает input values и скрывает уведомления об ошибках
function openCurrentPopup(evt) {
    const currentTrigger = evt.target
    const currentPopupValue = currentTrigger.dataset.popupTrigger

    currentPopupBox = document.querySelector(`[data-popup-name=${CSS.escape(currentPopupValue)}]`)

    cleanInputValues()
    //перенесена в validate.js
    cleanInputErrors(currentPopupBox)

    popupToggle()

    //чтобы после открытия попапа при нажатии Enter не срабатывал toggle(фокус сместится с кнопки-триггера)
    document.activeElement.blur()

    //установит состоянии кнопки при открытии попапа до введения инпута
    submitButtonStateBeforeInput(currentPopupBox)

    // addPopupListeners(currentPopupBox)
}

//при клике на триггер запускает открытие соответствующего триггеру попапа
popupTriggers.forEach(trigger => trigger.addEventListener('click', openCurrentPopup))


const formProfile = document.querySelector('.popup__form_type_profile')

//при открытии попапа редактирования профиля заполняет values инпутов данными из профиля
popupProfileOpenButton.addEventListener('click', function() {
    inputName.value = profileName.textContent
    inputJob.value = profileJob.textContent
})

function profileFormSubmitHandler (evt) {
    evt.preventDefault();

    // если введены values с пробелами, то обрежем лишние пробелы
    profileName.textContent = inputName.value.trim()
    profileJob.textContent = inputJob.value.trim()

    popupToggle()
}


//проверка валидности формы с учетом пробелов
function isFormInvalid(form) {
    inputList = Array.from(form.querySelectorAll('.popup__input'))
    return hasInvalidInput(inputList)
}

// обработчик сабмита не позволит сохранить невалидную форму по нажатию Enter
formProfile.addEventListener('submit', function(evt) {
    if (!isFormInvalid(formProfile)) {
        profileFormSubmitHandler(evt)
        return
    }
    evt.preventDefault()
}
);

// проверяет, есть ли в списке картинки, если нет, то делает видимой надпись о пустом списке
//в placesList всегда есть минимум 1 элемент - надпись о пустом списке
function checkEmptyPlacesList() {
    if (placesList.children.length === 1) {
        emptyList.classList.add('places__empty-list_visible')
    } else {
        emptyList.classList.remove('places__empty-list_visible')
    }
}

// удаляет карточку
function deletePlace(e) {
    const place = e.target.closest('.places__item');
    place.remove();
    checkEmptyPlacesList()
}

//прослушки для кнопок лайка и удаления карточек
function addPlaceListeners(place) {
    //прослушка для картинки, чтоб открыть попап с картинкой
    const placeImgTrigger = place.querySelector('.place__image')
    placeImgTrigger.addEventListener('click', openImgPopup)

    place.querySelector('.place__like-button').addEventListener('click', function(evt) {
        evt.target.classList.toggle('place__like-button_active');
    }) 
    place.querySelector('.place__delete-button').addEventListener('click', deletePlace)
}

// создает карточку, ставит ей прослушки
function createPlace(placeName , placePic) {
    const place = placeTemplate.content.cloneNode(true);

    place.querySelector('.place__name').textContent = placeName
    place.querySelector('.place__image').src = placePic

    addPlaceListeners(place)
    return place
}

function addPlace(placesList, place) {
    placesList.prepend(place)
}

function placeFormSubmitHandler (evt) {
    evt.preventDefault();

    const placeName = placeInputName.value
    const placePic = placeInputPic.value

    const place = createPlace(placeName, placePic);
    
    addPlace(placesList, place)

    checkEmptyPlacesList() 

    popupToggle()
}

//обработчик сабмита не позволит сохранить невалидную форму по нажатию Enter
placeForm.addEventListener('submit', function(evt) {
    if (!isFormInvalid(placeForm)) {
        placeFormSubmitHandler(evt)
        return
    }
    evt.preventDefault()
}) 



const cardTemplate = document.querySelector('.place-template')
// добавит начальные карточки из массива (initialCards в utils.js)
initialCards.forEach(element => {
    const card = new Card (element.name, element.link, cardTemplate)
    const cardElement = card.generateCard()
    placesList.append(cardElement)
}) 


// откроет попап с приближенной картинкой, исходя из триггер-картинки
export function openImgPopup(evt) {
    const currentImgTrigger = evt.target

    const imgName = currentImgTrigger.closest('.place').querySelector('.place__name').textContent
    const imgSrc = currentImgTrigger.src
    
    imgPopup.querySelector('.picture-zoom__title').textContent = imgName
    imgPopup.querySelector('.picture-zoom__img').src = imgSrc

    currentPopupBox = imgPopup

    popupToggle()
    // addPopupListeners(currentPopupBox)
}

