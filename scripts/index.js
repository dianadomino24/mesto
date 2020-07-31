import {Card} from './Card.js'
// import {Popup} from './Popup.js'
import {cleanInputErrors, FormValidator} from './FormValidator.js'
import {initialCards} from './utils.js'


const popupProfileOpenButton = document.querySelector('.profile__edit-button')
const popupCloseButtonSelector = '.popup__close-button'
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__job')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')

//сюда будем класть текущий открытый попап
let currentPopupBox = null

const imgPopup = document.querySelector('.popup_type_picture-zoom')

const popupTriggers = document.querySelectorAll('[data-popup-trigger]')

export const placesList = document.querySelector('.places__list')
const placeForm = document.querySelector('.popup__form_type_place')
const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')

const formProfile = document.querySelector('.popup__form_type_profile')

//валидирует формы и запускает сабмит в зависимости от типа формы
function formValidationAndSubmit(formSelectorsObj) {
    const formList = Array.from(document.querySelectorAll(formSelectorsObj.formSelector));
    formList.forEach((formElement) => {
        const formValidator = new FormValidator(formSelectorsObj, formElement)
        formValidator.enableValidation()

        formElement.addEventListener('submit', function (evt) {
            evt.preventDefault()

            if (!formValidator.hasInvalidInput()) {
                if (formElement == formProfile) {
                    profileFormSubmitHandler(evt)
                    return
                } else if (formElement == placeForm) {
                    placeFormSubmitHandler(evt)
                    return
                }
            }
        })
    })
}

const formSelectorsObj = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: '.popup__input-error',
    errorActiveClass: 'popup__input-error_active',
    controlSelector: '.popup__label',
}
formValidationAndSubmit(formSelectorsObj); 



//закроет попап при нажатии на Esc
function keyHandler(evt) {
    if (evt.key === 'Escape' && currentPopupBox != null ){
        cleanInputValues()
        popupToggle()
    }
}
//открывает/закрывает текущий попап из коробки
function popupToggle() {
    if (currentPopupBox) {
        currentPopupBox.classList.toggle('popup_opened')
    }

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
        popup.querySelector(popupCloseButtonSelector).addEventListener('click', popupToggle)
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

//открывает текущий попап, ставит прослушки и очищает input values и скрывает уведомления об ошибках
function openCurrentPopup(evt) {
    const currentTrigger = evt.target
    const currentPopupValue = currentTrigger.dataset.popupTrigger

    currentPopupBox = document.querySelector(`[data-popup-name=${CSS.escape(currentPopupValue)}]`)

    cleanInputValues()
    
    cleanInputErrors(currentPopupBox)

    popupToggle()

    //чтобы после открытия попапа при нажатии Enter не срабатывал toggle(фокус сместится с кнопки-триггера)
    document.activeElement.blur()

    //установит состоянии кнопки при открытии попапа до введения инпута
    submitButtonStateBeforeInput(currentPopupBox)

}

//при клике на триггер запускает открытие соответствующего триггеру попапа
popupTriggers.forEach(trigger => trigger.addEventListener('click', openCurrentPopup))


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

//добавляет новые карточки из попапа 
function addPlace(placesList, cardElement) {
    placesList.prepend(cardElement)
}

const cardTemplate = document.querySelector('.place-template')
// добавит начальные карточки из массива (initialCards в utils.js)
initialCards.forEach(element => {
    const card = new Card (element.name, element.link, cardTemplate)
    const cardElement = card.generateCard()
    placesList.append(cardElement)
}) 


function placeFormSubmitHandler (evt) {
    evt.preventDefault();

    const placeName = placeInputName.value
    const placePic = placeInputPic.value

    const card = new Card (placeName, placePic, cardTemplate)
    const cardElement = card.generateCard()

    addPlace(placesList, cardElement)

    card.checkEmptyPlacesList() 

    popupToggle()
}


// откроет попап с приближенной картинкой, исходя из триггер-картинки
export function openImgPopup(evt) {
    const currentImgTrigger = evt.target

    const imgName = currentImgTrigger.closest('.place').querySelector('.place__name').textContent
    const imgSrc = currentImgTrigger.src
    
    imgPopup.querySelector('.picture-zoom__title').textContent = imgName
    imgPopup.querySelector('.picture-zoom__img').src = imgSrc

    currentPopupBox = imgPopup

    popupToggle()
}


