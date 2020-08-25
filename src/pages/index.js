import './index.css'

import Section from '../components/Section.js'
import Card from '../components/Card.js'
import {cleanInputErrors, FormValidator} from '../components/FormValidator.js'
// import {initialCardsArr} from '../components/utils.js'
import UserInfo from '../components/UserInfo.js'
import PopupWithForm from '../components/PopupWithForm.js'
import PopupWithImage from '../components/PopupWithImage.js'
import PopupWithSubmit from '../components/PopupWithSubmit.js'
import Api from '../components/Api.js'



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


//отвечает за управление отображением информации о пользователе на странице
const userInfoEx = new UserInfo({name: profileNameSelector, about: profileJobSelector})

//при загрузке стр запрашивает у сервера имя и инф о пользователе и отображает их в профиле
const setServerUserInfo = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-14/users/me',
    headers:  {
        authorization: '3829caf2-6683-412f-9e00-d0870fcd1817'
    }
})
setServerUserInfo.getItems()
.then((userData) => {
    userInfoEx.setUserInfo(userData)
})
.catch((err) => {
    console.log(err)
})

//кейсы для определения направления добавления карточек
const PREPEND = 1
const APPEND = 2 
// кейсы для определения, кем добавлена карточка
const MINE = 3
const THEIRS = 4

//создает,добавлет в разметку и возвращает карточку места либо из начального массива, либо из формы
function cardCreate (renderedArr, direction, whose) {
    //добавляет созданную карточку в разметку стр
    const renderedCard = new Section({
        items: renderedArr,
        renderer: (item) => {
            //создает карточку
            const card = new Card({
                data: {
                    name: item.name, 
                    link: item.link, 
                    _id: item._id
                },
                //вызовет открытие попапа с картинкой
                handleCardClick,
    
                handleLikeClick,

                handleDeleteIconClick
            },
            cardTemplate)

            const cardElement = card.generateCard()
            //определит, чьи карточки и выкл кнопку удаления у чужих
            switch(whose) {
                case MINE:
                    break
                case THEIRS: 
                    card.disableDelete()
                    break
                default:
                    alert( "error whose" );
            }

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

// класс для карточек с сервера
const serverCards = new Api ({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-14/cards',
    headers: {
        authorization: '3829caf2-6683-412f-9e00-d0870fcd1817',
        'Content-Type': 'application/json'
    }
})

// добавит начальные карточки с сервера
function renderInitialCards() {
    // запросит у сервера мой id 
    setServerUserInfo.getItems()
    .then((userData) => {
        //будет хранить мой id  
        const MyUserId = userData._id
        
        // запросит начальные карточки с сервера
        serverCards.getItems()
        .then((cardsList) => {
            // для каждой карточки запросит id хозяина и сравнит с моим, 
            // создаст карточку, учитывая состояние кнопки удаления карточки
            cardsList.forEach((card) => {            
                if (card.owner._id === MyUserId) {
                    const myCard = cardCreate([card], APPEND, MINE)
                    myCard.renderItems()
                } else {
                    const initialCard = cardCreate([card], APPEND, THEIRS)
                    initialCard.renderItems()
                }
            })
        })
        .catch((err) => {
            console.log(err)
        })
    })
}
renderInitialCards()

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
            //отправит имя и профессию из формы на сервер 
            fetch('https://mesto.nomoreparties.co/v1/cohort-14/users/me', {
                method: 'PATCH',
                headers: {
                    authorization: '3829caf2-6683-412f-9e00-d0870fcd1817',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${inputName.value.trim()}`,
                    about: `${inputJob.value.trim()}`
                })
            });
            //установим новые данные профиля (если введены values с пробелами, то обрежем лишние пробелы)
            userInfoEx.setUserInfo({name: inputName.value.trim(), about: inputJob.value.trim()}) 
            popupWithFormEx.close()
        }
    })
    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupProfile)

    popupWithFormEx.open()

    //при открытии попапа редактирования профиля заполняет values инпутов данными из профиля
    const profileInfo = userInfoEx.getUserInfo()
    inputName.value = profileInfo.name
    inputJob.value = profileInfo.about

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


function handleDeleteIconClick(card, placeEvt) {
    // создает попап с формой подтверждения удаления карточки
    const popupWithSubmit = new PopupWithSubmit({
        popupSelector: '.popup_type_card-delete', 
        item: card,
        place: placeEvt,

        submitHandler: (card, place) => {
            // удаляет карточку с сервера
            return serverCards.deleteItem(card._id)
            .then(
                //вызывает удаление карточки из разметки
                place.remove()
            )
            .catch((err) => {
                console.log(err)
            })
        }
    })
    popupWithSubmit.open()
    popupWithSubmit.setEventListeners()
}

function handleLikeClick() {

}

//  при сабмите формы с местами отправит данные создаваемой карточки на сервер, 
// в ответе получит созданную сервером карточку 
// и добавит ее в разметку
function placeFormSubmitHandler () {
    serverCards.createItem({
        name: placeInputName.value,
        link: placeInputPic.value})
    .then(card => {
        const cardFromForm = cardCreate([card], PREPEND, MINE)
        cardFromForm.renderItems()
        })
    .catch((err) => {
        console.log(err)
    })
}


// function placeFormSubmitHandler () {
//     // отправит данные создаваемой карточки на сервер
//     fetch('https://mesto.nomoreparties.co/v1/cohort-14/cards', {
//                 method: 'POST',
//                 headers: {
//                     authorization: '3829caf2-6683-412f-9e00-d0870fcd1817',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     name: `${placeInputName.value}`,
//                     link: `${placeInputPic.value}`
//                 })
//             });
//     //создаст карточку 
//     const cardFromForm = cardCreate(
//         [{
//             name: placeInputName.value, 
//             link: placeInputPic.value
//         }],
//         PREPEND, MINE)
//     cardFromForm.renderItems()
// }

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
