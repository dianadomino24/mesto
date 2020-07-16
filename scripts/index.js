const popup = document.querySelectorAll('.popup')
const popupProfileOpenButton = document.querySelector('.profile__edit-button')
const popupCloseButton = document.querySelector('.popup__close-button')
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__job')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')

//сюда будем класть текущий открытый попап
let currentPopupBox = null

//imgTriggers у меня перезаписывается при удалении/добавлении карточек places, 
//поэтому я не могу сделать его const.
//или Вы хотите, чтобы я не перезаписывала массив, а написала отдельные ф-ции, которые
//бы нашли в массиве, какую именно картинку надо удалить и таким образом обновили массив? 
// а при добавлении карточки, добавили в массив его картинку?
let imgTriggers = document.querySelectorAll('[data-img-trigger]')
const imgPopup = document.querySelector('.popup_type_picture-zoom')

let popupTriggers = document.querySelectorAll('[data-popup-trigger]')

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
const popupToggle = function () {
    currentPopupBox.classList.toggle('popup_opened')
    //прослушка для кнопок, чтоб закрыть при Esc
    document.addEventListener('keydown', keyHandler)

    //опустошает currentPopupBox при закрытии попапа и убирает прослушку Esc
    if (currentPopupBox && !currentPopupBox.classList.contains('popup_opened')) {
        currentPopupBox = null
        document.removeEventListener('keydown', keyHandler)
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
const closePopupByClickingOverlay = function (event) {
    if (event.target !== event.currentTarget) { return }
    
    cleanInputValues()
    popupToggle()
}

//прослушки для закрытия текущего попапа
function addPopupListeners(currentPopupBox) {
    currentPopupBox.querySelector('.popup__close-button').addEventListener('click', popupToggle);
    currentPopupBox.addEventListener('click', closePopupByClickingOverlay);
}
//открывает текущий попап, ставит прослушки и очищает input values и скрывает уведомления об ошибках
function openCurrentPopup(evt) {
    const currentTrigger = evt.target
    const currentPopupValue = currentTrigger.dataset.popupTrigger

    //ответ к комментарию "можно лучше": в этот момент еще нет попапа с классом opened, 
    // т.к. я сначала по дата атрибуту нахожу попап, а потом уже делаю ему тогл :)
    currentPopupBox = document.querySelector(`[data-popup-name=${CSS.escape(currentPopupValue)}]`)

    cleanInputValues()
    //перенесена в validate.js
    cleanInputErrors(currentPopupBox)

    popupToggle()

    //чтобы после открытия попапа при нажатии Enter не срабатывал toggle(фокус сместится с кнопки-триггера)
    document.activeElement.blur()

    //если открылся попап редактирования профиля, то разблокируем его кнопку сабмита (чтоб она была доступна до изменения инпутов)
    if (currentPopupBox && currentPopupBox.classList.contains('popup_type_edit-profile')) {
        currentPopupBox.querySelector('.popup__save-button').classList.remove('popup__save-button_disabled')
    }

    addPopupListeners(currentPopupBox)
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


//не придумала, как обойтись полностью без этой ф-ции, т.к. при сабмите на вход я получаю форму, 
// и не могу исп-ть ее напрямую в hasInvalidInput, сначала надо найти inputList в форме.

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


// удаляет карточку
function deletePlace(e) {
    const place = e.target.closest('.places__item');
    place.remove();
    updateImgTriggers ();
}

//прослушки для кнопок лайка и удаления карточек
function addPlaceListeners(place) {
    place.querySelector('.place__like-button').addEventListener('click', function(evt) {
        evt.target.classList.toggle('place__like-button_active');
    }) 
    place.querySelector('.place__delete-button').addEventListener('click', deletePlace)
}

// проверяет, есть ли в списке картинки, если нет, то делает видимой надпись о пустом списке
function checkEmptyPlacesList() {
    if (imgTriggers.length === 0) {
        emptyList.classList.add('places__empty-list_visible')
    } else {
        emptyList.classList.remove('places__empty-list_visible')
    }
}

// обновляет массив карточек и проверяет пустой ли список(все карточки удалены)
function updateImgTriggers () {
    imgTriggers = document.querySelectorAll('[data-img-trigger]')

    checkEmptyPlacesList()

    imgTriggers.forEach(trigger => trigger.addEventListener('click', openImgPopup))
}

// добавляет карточку, ставит ей прослушки и обновляет массивы с карточками и изобр.-триггерами
function addPlace(placeName , placePic) {
    const place = placeTemplate.content.cloneNode(true);

    place.querySelector('.place__name').textContent = placeName
    place.querySelector('.place__image').src = placePic

    addPlaceListeners(place)
    
    placesList.prepend(place)
    updateImgTriggers ()  
}


function placeFormSubmitHandler (evt) {
    evt.preventDefault();

    const placeName = placeInputName.value
    const placePic = placeInputPic.value

    addPlace(placeName, placePic);
    
    //после добавления карточки очищаем инпуты
    placeInputName.value = '';
    placeInputPic.value = '';

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

// добавит начальные карточки из массива
initialCards.forEach(element => {
    addPlace(element.name, element.link)
}) 

// откроет попап с приближенной картинкой, исходя из триггер-картинки
function openImgPopup(evt) {
    const currentImgTrigger = evt.target

    const imgName = currentImgTrigger.closest('.place').querySelector('.place__name').textContent
    const imgSrc = currentImgTrigger.src
    
    imgPopup.querySelector('.picture-zoom__title').textContent = imgName
    imgPopup.querySelector('.picture-zoom__img').src = imgSrc

    currentPopupBox = imgPopup

    popupToggle()
    addPopupListeners(currentPopupBox)
}

imgTriggers.forEach(trigger => trigger.addEventListener('click', openImgPopup))

