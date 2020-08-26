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

const avatarForm = document.querySelector('.popup__form_type_avatar')
const avatarInput = document.querySelector('.popup__input_type_avatar')
const editAvatarButton = document.querySelector('.profile__image')
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar')

const popupCardDelete = document.querySelector('.popup_type_card-delete')
const placeForm = document.querySelector('.popup__form_type_place')
const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')
const addPlaceButton = document.querySelector('.profile__add-button')
const popupPlace = document.querySelector('.popup_type_add-place')
const cardTemplate = document.querySelector('.place-template')

const profileNameSelector = '.profile__name'
const profileJobSelector = '.profile__job'
const profileAvatarSelector = '.profile__image'
const profileForm = document.querySelector('.popup__form_type_profile')
const popupProfile = document.querySelector('.popup_type_edit-profile')

const profileSubmitButton = document.querySelector('.popup__save-button_type_profile')
const placeSubmitButton = document.querySelector('.popup__save-button_type_place')
const avatarSubmitButton = document.querySelector('.popup__save-button_type_avatar')
const cardDeleteSubmitButton = document.querySelector('.popup__save-button_type_card-delete')

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
const userInfoEx = new UserInfo({
    name: profileNameSelector, 
    about: profileJobSelector, 
    avatar: profileAvatarSelector})

//при загрузке стр запрашивает у сервера имя и инф о пользователе и отображает их в профиле
const serverUserInfo = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-14/users/me',
    headers:  {
        authorization: '3829caf2-6683-412f-9e00-d0870fcd1817',
        'Content-Type': 'application/json'
    }
})
serverUserInfo.getItems()
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

// выяснила, что все мои лайки помечаются сервером таким id,
// он нужен для выделения залайканых мной карточек
// но пока не разобралась, как получить его до рендера карточек и постановки лайка любой из них 
// (чтобы получить этот id, надо же отправить лайк-запрос, а при изначальном рендере карточек на стр этот запрос не производится) !!!!!!!!!
const myLikeId = "6a4f081c3216c2763bffb74c"

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
                    _id: item._id,
                    likes: item.likes,
                },
                //вызовет открытие попапа с картинкой
                handleCardClick,
    
                handleLikeClick,

                handleDeleteIconClick,

                myLikeId
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
    serverUserInfo.getItems()
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

// заменит текст кнопок при процессе загрузки на сервер
function renderLoading(isLoading, button, text) {
    if (isLoading) {
        button.textContent = 'Сохранение...'
    } else {
        button.textContent = text
    }
}


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
            renderLoading(true, profileSubmitButton, 'Сохранить')
            //отправит имя и профессию из формы на сервер 
            serverUserInfo.changeItem({
                name: inputName.value.trim(),
                about: inputJob.value.trim()
            })
            .then(() => {
                //установим новые данные профиля (если введены values с пробелами, то обрежем лишние пробелы)
                userInfoEx.setUserInfo({name: inputName.value.trim(), about: inputJob.value.trim()}) 
                popupWithFormEx.close()
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                renderLoading(false, profileSubmitButton, 'Сохранить')
            })
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

// при клике на корзину создаст попап с формой подтверждения удаления карточки
function handleDeleteIconClick(card, placeEvt) {
    const popupWithSubmit = new PopupWithSubmit({
        popupSelector: '.popup_type_card-delete', 
        item: card,
        place: placeEvt,
        // при подтверждении удаления удалить карточку с сервера и из разметки
        submitHandler: (card, place) => {
            // удаляет карточку с сервера
            return serverCards.deleteItem(card._id)
            .then( () => {
                //вызывает удаление карточки из разметки
                place.remove()
                card = null
                popupWithSubmit.close()
            })
            .catch((err) => {
                console.log(err)
            })
        }
    })
    popupWithSubmit.open()
    // сместит фокус с корзины, чтобы при сабмите она снова не сработала
    document.activeElement.blur()
    // popupCardDelete.querySelector('.popup__save-button').focus()
    popupWithSubmit.setEventListeners()
}

// при клике на лайк
function handleLikeClick(likeCardButton, card, likeCounter) {
    // если у карточки уже стоит лайк, удалим его с сервера и из разметки
    if (likeCardButton.classList.contains('place__like-button_active')) {
        serverCards.deleteItemViaTitle('likes', card._id)
            .then((card) => {
                likeCounter.textContent = card.likes.length
                likeCardButton.classList.toggle('place__like-button_active')
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
            serverCards.replaceItemViaTitle('likes', card._id)
            .then((card) => {
                likeCounter.textContent = card.likes.length
                likeCardButton.classList.toggle('place__like-button_active')
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

//  при сабмите формы с местами отправит данные создаваемой карточки на сервер, 
// в ответе получит созданную сервером карточку 
// и добавит ее в разметку
function placeFormSubmitHandler () {
    renderLoading(true, placeSubmitButton, 'Создать')
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
    .finally(() => {
        renderLoading(false, placeSubmitButton, 'Создать')
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
// очищает уведомл об ошибках, открывает попап, блокирует кнопку сабмита и ставит прослушки
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

// при сабмите формы смены аватара отправит картинку на сервер и заменит в разметке
function avatarFormSubmitHandler() {
    renderLoading(true, avatarSubmitButton, 'Сохранить')
    serverUserInfo.changeItemViaTitle({avatar: avatarInput.value}, 'avatar')
    .then((userData) => {
        document.querySelector(profileAvatarSelector).style.backgroundImage = `url('${userData.avatar}')`
        })
    .catch((err) => {
        console.log(err)
    })
    .finally(() => {
        renderLoading(false, avatarSubmitButton, 'Сохранить')
    })
}

// вызовет создание класса с формой для смены аватара
editAvatarButton.addEventListener('click' , () => {
    //валидирует форму 
    const formValidator = new FormValidator(formSelectorsObj, avatarForm) 
    formValidator.enableValidation()
    
    //создает экземпляр попапа с формой
    const popupWithFormEx = new PopupWithForm(
        '.popup_type_edit-avatar', 
        //колбек сабмита
        () => {
            //если инпуты валидны, то запускает ф-цию сабмита
            if (!formValidator.hasInvalidInput()) {
                avatarFormSubmitHandler()
                popupWithFormEx.close()
            }
    })
    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupEditAvatar)

    popupWithFormEx.open()

    // заблокируем кнопку сабмита при открытии попапа
    popupEditAvatar.querySelector('.popup__save-button').classList.add('popup__save-button_disabled')

    //прослушки для закрытия попапа и сабмита формы
    popupWithFormEx.setEventListeners()
})