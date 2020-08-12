import './styles/index.css'

import Section from './scripts/Section.js'
import Card from './scripts/Card.js'
import {cleanInputErrors, FormValidator} from './scripts/FormValidator.js'
import {initialCardsArr} from './scripts/utils.js'
import UserInfo from './scripts/UserInfo.js'
import PopupWithForm from './scripts/PopupWithForm.js'
import PopupWithImage from './scripts/PopupWithImage.js'


const profileEditButton = document.querySelector('.profile__edit-button')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')

const placesListSelector = '.places__list'
const imgPopup = document.querySelector('.popup_type_picture-zoom')

const placeForm = document.querySelector('.popup__form_type_place')
const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')
const addPlaceButton = document.querySelector('.profile__add-button')
const popupPlace = document.querySelector('.popup_type_add-place')
const cardTemplate = document.querySelector('.place-template')

const profileNameSelector = '.profile__name'
const profileJobSelector = '.profile__job'
const profileForm = document.querySelector('.popup__form_type_profile')
const popupProfile = document.querySelector('.popup_type_edit-profile')

// объект настроек с селекторами и классами формы
const formSelectorsObj = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: '.popup__input-error',
    errorActiveClass: 'popup__input-error_active',
    controlSelector: '.popup__label',
}

//кейсы для определения направления добавления карточек
const PREPEND = 1
const APPEND = 2 

//отвечает за управление отображением информации о пользователе на странице
const userInfoEx = new UserInfo({name: profileNameSelector, job: profileJobSelector})

//создает,добавлет в разметку и возвращает карточку места либо из начального массива, либо из формы
function cardCreate (renderedArr, direction) {
    //добавляет созданную карточку в разметку стр
    const renderedCard = new Section({
        items: renderedArr,
        renderer: (item) => {
            //создает карточку
            const card = new Card({
                cardName: item.name, 
                cardImg: item.link, 
                cardTemplate, 
                //вызовет открытие попапа с картинкой
                handleCardClick
            })

            const cardElement = card.generateCard()
            //определит, в каком порядке добавлять карточки
            switch (direction) {
                case PREPEND:
                    renderedCard.addItemPrepend(cardElement);
                    break;
                case APPEND: 
                    renderedCard.addItemAppend(cardElement)
                    break
                default:
                    alert( "error" );
            }
            
            // проверяет, есть ли в списке карточки, если нет, то делает видимой надпись о пустом списке
            card.checkEmptyPlacesList() 
        },
    },
    placesListSelector
    )
    return renderedCard
}

// добавит начальные карточки из массива (initialCards в utils.js)
const initialCardsList = cardCreate(initialCardsArr, APPEND)
initialCardsList.renderItems()



//при нажатии на кнопку редакт-я профиля:
// запускает валидацию, создает экземпляр попапа с формой, 
// очищает уведомл об ошибках, открывает попап, разблокирует кнопку сабмита и ставит прослушки
profileEditButton.addEventListener('click', () => {
    //валидирует форму
    const formValidator = new FormValidator(formSelectorsObj, profileForm) 
    formValidator.enableValidation()
    
    //создает экземпляр попапа с формой
    const popupWithFormEx = new PopupWithForm(
        '.popup_type_edit-profile', 
        //колбэк сабмита
        () => {
        //если инпуты валидны
        if (!formValidator.hasInvalidInput()) {
             //установит имя и профессию из формы в профиль (если введены values с пробелами, то обрежем лишние пробелы)
            userInfoEx.setUserInfo({name: inputName.value.trim(), job: inputJob.value.trim()})
            popupWithFormEx.close()
        }
    })
    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupProfile)

    popupWithFormEx.open()

    //при открытии попапа редактирования профиля заполняет values инпутов данными из профиля
    const profileInfo = userInfoEx.getUserInfo()
    inputName.value = profileInfo.name
    inputJob.value = profileInfo.job

    //разблокирует кнопку сабмита у попапа профиля
    popupProfile.querySelector('.popup__save-button').classList.remove('popup__save-button_disabled')

    //прослушки для закрытия попапа и сабмита формы
    popupWithFormEx.setEventListeners()
})


//при клике по картинке создаст экземпл попапа с картинкой, откроет его и поставит прослушки
function handleCardClick(cardName, cardImg) {
    const popupWithImgEx = new PopupWithImage(cardName, cardImg, '.popup_type_picture-zoom', imgPopup)
    popupWithImgEx.open()
    popupWithImgEx.setEventListeners()
}


//добавляет новые карточки при сабмите формы с местами
function placeFormSubmitHandler () {
    const cardFromForm = cardCreate(
        [{
            name: placeInputName.value, 
            link: placeInputPic.value
        }],
        PREPEND)
    cardFromForm.renderItems()
}

//при нажатии на кнопку добавления места:
// запускает валидацию, создает экземпляр попапа с формой, 
// очищает уведомл об ошибках, открывает попап, разблокирует кнопку сабмита и ставит прослушки
addPlaceButton.addEventListener('click', () => {
    //валидирует форму 
    const formValidator = new FormValidator(formSelectorsObj, placeForm) 
    formValidator.enableValidation()
    
    //создает экземпляр попапа с формой
    const popupWithFormEx = new PopupWithForm(
        '.popup_type_add-place', 
        //колбек сабмита
        () => {
            //если инпуты валидны, то запускает ф-цию сабмита
            if (!formValidator.hasInvalidInput()) {
                placeFormSubmitHandler()
                popupWithFormEx.close()
            }
    })
    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupPlace)

    popupWithFormEx.open()

    // для попапа добавл.карточек заблокируем кнопку сабмита при открытии попапа
    popupPlace.querySelector('.popup__save-button').classList.add('popup__save-button_disabled')

    //прослушки для закрытия попапа и сабмита формы
    popupWithFormEx.setEventListeners()
})
