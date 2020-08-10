import Section from './Section.js'
import {Card} from './Card.js'
import {cleanInputErrors, FormValidator} from './FormValidator.js'
import {initialCardsArr} from './utils.js'
// import PopupWithImage from './PopupWithImage.js'
import UserInfo from './UserInfo.js'
import PopupWithForm from './PopupWithForm.js'
import PopupWithImage from './PopupWithImage.js'


const profileEditButton = document.querySelector('.profile__edit-button')
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
export const placesListSelector = '.places__list'

const placeForm = document.querySelector('.popup__form_type_place')
const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')


const cardTemplate = document.querySelector('.place-template')


// добавит начальные карточки из массива (initialCards в utils.js)
const initialCardsList = new Section({
    items: initialCardsArr,
    renderer: (item) => {
        const card = new Card({
            cardName: item.name, 
            cardImg: item.link, 
            cardTemplate, 
            handleCardClick
        })

        const cardElement = card.generateCard()
        initialCardsList.addItem(cardElement)
    },
},
placesListSelector
) 

initialCardsList.renderItems()


const profileNameSelector = '.profile__name'
const profileJobSelector = '.profile__job'

const userInfoEx = new UserInfo({name: profileNameSelector, job: profileJobSelector})


// initialCards.forEach(element => {
//     const card = new Card (element.name, element.link, cardTemplate)
//     const cardElement = card.generateCard()
//     placesList.append(cardElement)
// }) 



// //валидирует формы и запускает сабмит в зависимости от типа формы
// function formValidationAndSubmit(formSelectorsObj) {
//     const formList = Array.from(document.querySelectorAll(formSelectorsObj.formSelector));
//     formList.forEach((formElement) => {
//         const formValidator = new FormValidator(formSelectorsObj, formElement)
//         formValidator.enableValidation()


        
//         formElement.addEventListener('submit', function (evt) {
//             evt.preventDefault()

//             if (!formValidator.hasInvalidInput()) {
//                 if (formElement == formProfile) {
//                     profileFormSubmitHandler(evt)
                    
//                 } else if (formElement == placeForm) {
//                     placeFormSubmitHandler(evt)
                    
//                 }
//             }
//         })
//     })
// }

const profileForm = document.querySelector('.popup__form_type_profile')
const popupProfile = document.querySelector('.popup_type_edit-profile')

profileEditButton.addEventListener('click', () => {
    //при открытии попапа редактирования профиля заполняет values инпутов данными из профиля
    const profileInfo = userInfoEx.getUserInfo()
    inputName.value = profileInfo.name
    inputJob.value = profileInfo.job

    //валидирует формы 
    const formValidator = new FormValidator(formSelectorsObj, profileForm) 
    formValidator.enableValidation()
    

    //создает экземпляр попапа с формой и открывает его
    const popupWithFormEx = new PopupWithForm(
        '.popup_type_edit-profile', 
        //колбэк сабмита
        () => {
        //если инпуты валидны
        if (!formValidator.hasInvalidInput()) {
             //установит данные формы на стр (если введены values с пробелами, то обрежем лишние пробелы)
            userInfoEx.setUserInfo({name: inputName.value.trim(), job: inputJob.value.trim()})
            popupWithFormEx.close()
        }
    })
    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupProfile)

    popupWithFormEx.open()

    // //чтобы после открытия попапа при нажатии Enter не срабатывало закрытие формы (фокус сместится с кнопки-триггера) ???????????????????????????????????????
    // document.activeElement.blur()


    //разблокирует кнопку сабмита у попапа профиля
    popupProfile.querySelector('.popup__save-button').classList.remove('popup__save-button_disabled')

    //прослушки для закрытия попапа и сабмита формы
    popupWithFormEx.setEventListeners()
})





// //при открытии попапа редактирования профиля заполняет values инпутов данными из профиля
// popupProfileOpenButton.addEventListener('click', function() {
//     const profileInfo = userInfoEx.getUserInfo()

//     inputName.value = profileInfo.name
//     inputJob.value = profileInfo.job
// })

// function profileFormSubmitHandler (evt) {
//     evt.preventDefault();

//      // если введены values с пробелами, то обрежем лишние пробелы
//     userInfoEx.setUserInfo({name: inputName.value.trim(), job: inputJob.value.trim()})

//     popupToggle()
// }


const formSelectorsObj = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: '.popup__input-error',
    errorActiveClass: 'popup__input-error_active',
    controlSelector: '.popup__label',
}
// formValidationAndSubmit(formSelectorsObj); 


// // ?????????????????????????????????????????????????????????????????????????????????????????????????????
// //закроет попап при нажатии на Esc
// function keyHandler(evt) {
//     if (evt.key === 'Escape' && currentPopupBox != null ){
//         cleanInputValues()
//         popupToggle()
//     }
// }
// //открывает/закрывает текущий попап из коробки
// function popupToggle() {
//     if (currentPopupBox) {
//         currentPopupBox.classList.toggle('popup_opened')
//     }

//     //опустошает currentPopupBox при закрытии попапа и убирает прослушку Esc
//     if (currentPopupBox && !currentPopupBox.classList.contains('popup_opened')) {
//         currentPopupBox = null
//         document.removeEventListener('keydown', keyHandler)
//     } else {
//         //прослушка для кнопок, чтоб закрыть при Esc
//         document.addEventListener('keydown', keyHandler)
//     }
// }

// //очищает values input
// function cleanInputValues() {
//     let inputs = currentPopupBox.querySelectorAll('.input')
//         if (inputs) {
//             inputs.forEach( input => {input.value = ''})
//         }
// }

// //закрывает попап при нажатии на фон
// function closePopupByClickingOverlay(event) {
//     if (event.target !== event.currentTarget) { return }
    
//     cleanInputValues()
//     popupToggle()
// }


// const popupList = Array.from(document.querySelectorAll('.popup'))
// //прослушки для закрытия открытого попапа
// function addPopupListeners(popupList) {
//     popupList.forEach(popup => {
//         popup.querySelector(popupCloseButtonSelector).addEventListener('click', popupToggle)
//         popup.addEventListener('mousedown', closePopupByClickingOverlay)
//     })
// }

// addPopupListeners(popupList)
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

//если открылся попап редактирования профиля, то разблокируем его кнопку сабмита (чтоб она была доступна до изменения инпутов)
// //для попапа добавл.карточек заблокируем кнопку
// function submitButtonStateBeforeInput(currentPopupBox) {
//     if (currentPopupBox && currentPopupBox.classList.contains('popup_type_edit-profile')) {
//         currentPopupBox.querySelector('.popup__save-button').classList.remove('popup__save-button_disabled')
//     }
//     if (currentPopupBox && currentPopupBox.classList.contains('popup_type_add-place')) {
//         currentPopupBox.querySelector('.popup__save-button').classList.add('popup__save-button_disabled')
//     }
// }

// //открывает текущий попап, ставит прослушки и очищает input values и скрывает уведомления об ошибках
// function openCurrentPopup(evt) {
//     const currentTrigger = evt.target
//     const currentPopupValue = currentTrigger.dataset.popupTrigger

//     currentPopupBox = document.querySelector(`[data-popup-name=${CSS.escape(currentPopupValue)}]`)

//     cleanInputValues()
    
//     cleanInputErrors(currentPopupBox)

//     popupToggle()

//     //чтобы после открытия попапа при нажатии Enter не срабатывал toggle(фокус сместится с кнопки-триггера)
//     document.activeElement.blur()

//     //установит состоянии кнопки при открытии попапа до введения инпута
//     submitButtonStateBeforeInput(currentPopupBox)

// }

// //при клике на триггер запускает открытие соответствующего триггеру попапа
// popupTriggers.forEach(trigger => trigger.addEventListener('click', openCurrentPopup))


const addPlaceButton = document.querySelector('.profile__add-button')
const popupPlace = document.querySelector('.popup_type_add-place')

addPlaceButton.addEventListener('click', () => {
    //валидирует формы 
    const formValidator = new FormValidator(formSelectorsObj, placeForm) 
    formValidator.enableValidation()
    
    //создает экземпляр попапа с формой и открывает его
    const popupWithFormEx = new PopupWithForm(
        '.popup_type_add-place', 
        //колбек сабмита
        () => {
            //если инпуты валидны, то запускает ф-цию забмита
            if (!formValidator.hasInvalidInput()) {
                placeFormSubmitHandler()
                popupWithFormEx.close()
            }
    })
    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupPlace)

    popupWithFormEx.open()

    // //чтобы после открытия попапа при нажатии Enter не срабатывало закрытие формы (фокус сместится с кнопки-триггера) ???????????????????????????????????????
    // document.activeElement.blur()

    // для попапа добавл.карточек заблокируем кнопку сабмита при открытии попапа
    popupPlace.querySelector('.popup__save-button').classList.add('popup__save-button_disabled')

    //прослушки для закрытия попапа и сабмита формы
    popupWithFormEx.setEventListeners()
})




//добавляет новые карточки из попапа
function placeFormSubmitHandler () {
    const renderedCard = new Section({
        items: [{
            name: placeInputName.value, 
            link: placeInputPic.value
        }],
        renderer: (item) => {
            const card = new Card({
                cardName: item.name, 
                cardImg: item.link, 
                cardTemplate, 
                handleCardClick
            })

            const cardElement = card.generateCard()
            renderedCard.addItem(cardElement)
            // проверяет, есть ли в списке карточки, если нет, то делает видимой надпись о пустом списке
            card.checkEmptyPlacesList() 
        },
    },
    placesListSelector
    )
    renderedCard.renderItems()
}

function handleCardClick(evt) {
    const popupWithImgEx = new PopupWithImage(evt, '.popup_type_picture-zoom')
    popupWithImgEx.open()
    popupWithImgEx.setEventListeners()
}

// // откроет попап с приближенной картинкой, исходя из триггер-картинки
// export function openImgPopup(evt) {
//     const currentImgTrigger = evt.target

//     const imgName = currentImgTrigger.closest('.place').querySelector('.place__name').textContent
//     const imgSrc = currentImgTrigger.src
    
//     imgPopup.querySelector('.picture-zoom__title').textContent = imgName
//     imgPopup.querySelector('.picture-zoom__img').src = imgSrc

//     currentPopupBox = imgPopup

//     popupToggle()
// }
