import './index.css'

import Section from '../components/Section.js'
import Card from '../components/Card.js'
import { cleanInputErrors, FormValidator } from '../components/FormValidator.js'
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

const profileSubmitButton = document.querySelector(
    '.popup__save-button_type_profile'
)
const placeSubmitButton = document.querySelector(
    '.popup__save-button_type_place'
)
const avatarSubmitButton = document.querySelector(
    '.popup__save-button_type_avatar'
)
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

const token = '3829caf2-6683-412f-9e00-d0870fcd1817'
const cohort = 'cohort-14'

//кейсы для определения направления добавления карточек
const PREPEND = 1
const APPEND = 2
// кейсы для определения, кем добавлена карточка
const MINE = 3
const THEIRS = 4


//отвечает за управление отображением информации о пользователе на странице
const userInfoEx = new UserInfo({
    name: profileNameSelector,
    about: profileJobSelector,
    avatar: profileAvatarSelector,
})

//при загрузке стр запрашивает у сервера имя и инф о пользователе и карточках
const serverInfo = new Api({
    baseUrl: `https://mesto.nomoreparties.co/v1/${cohort}/`,
    headers: {
        authorization: token,
        'Content-Type': 'application/json',
    },
})


// проверяет, есть ли в списке картинки, если нет, то делает видимой надпись о пустом списке
//в placesList всегда есть минимум 1 элемент - надпись о пустом списке
function checkEmptyPlacesList() {
    //надпись о пустом списке
    const emptyList = document.querySelector('.places__empty-list')
    //список карточек
    const placesList = document.querySelector('.places__list')

    if (placesList.children.length === 1) {
        emptyList.classList.add('places__empty-list_visible')
    } else {
        emptyList.classList.remove('places__empty-list_visible')
    }
}

//создает,добавлет в разметку и возвращает карточку места либо из начального массива, либо из формы
function cardCreate(renderedArr, direction, whose, myLikeId) {
    //добавляет созданную карточку в разметку стр
    const renderedCard = new Section(
        {
            items: renderedArr,
            renderer: (item) => {
                //создает карточку
                const card = new Card(
                    {
                        data: {
                            name: item.name,
                            link: item.link,
                            _id: item._id,
                            likes: item.likes,
                            owner: item.owner
                        },
                        //вызовет открытие попапа с картинкой
                        handleCardClick,

                        handleLikeClick,

                        handleDeleteIconClick,

                    },
                    cardTemplate,
                    myLikeId
                )

                const cardElement = card.generateCard()
                //определит, чьи карточки и выкл кнопку удаления у чужих
                switch (whose) {
                    case MINE:
                        break
                    case THEIRS:
                        card.disableDelete()
                        break
                    default:
                        alert('error whose')
                }

                //определит, в каком порядке добавлять карточки
                switch (direction) {
                    case PREPEND:
                        renderedCard.addItemPrepend(cardElement)
                        break
                    case APPEND:
                        renderedCard.addItemAppend(cardElement)
                        break
                    default:
                        alert('error')
                }

                // проверяет, есть ли в списке карточки, если нет, то делает видимой надпись о пустом списке
                checkEmptyPlacesList()
            },
        },
        placesListSelector
    )
    return renderedCard
}

// для отрисовки стр запросим данные пользователя и карточек, 
// когда оба промиса вернут данные, выведем их в разметку
Promise.all([ 
    serverInfo.getItems('users/me'),
    serverInfo.getItems('cards')
])
    .then((values) => {  
        const [userData, initialCards] = values; 
        // отображает данные пользователья в профиле
        userInfoEx.setUserInfo(userData)
        const myLikeId = userData._id
        // создаст карточку, учитывая состояние кнопки удаления карточки (мои с корзиной)
        initialCards.forEach((card) => {
            cardCreate([card], APPEND, card.owner._id === userData._id ? MINE : THEIRS, myLikeId).renderItems();
                    // более длинная версия написанного выше 
                    // if (card.owner._id === MyUserId) {
                    //     const myCard = cardCreate([card], APPEND, MINE)
                    //     myCard.renderItems()
                    // } else {
                    //     const initialCard = cardCreate([card], APPEND, THEIRS)
                    //     initialCard.renderItems()
                    // }
        })
    })
    .catch((err) => {
        console.log(err);
    })


const loadingText = 'Сохранение...'
const defaultSaveText = 'Сохранить'
const defaultCreateText = 'Создать'
const defaultYesText = 'Да'
// заменит текст кнопок при ожидании процесса загрузки данных на сервер
function renderLoading(isLoading, button, text) {
    if (isLoading) {
        button.textContent = loadingText
    } else {
        button.textContent = text
    }
}

//будет валидировать форму профиля
const formProfileValidator = new FormValidator(formSelectorsObj, profileForm)

//создает экземпляр попапа с формой профиля
const popupWithProfileForm = new PopupWithForm(
    '.popup_type_edit-profile',
    //колбэк сабмита
    () => {
        //если инпуты валидны
        if (!formProfileValidator.hasInvalidInput()) {
            renderLoading(true, profileSubmitButton, defaultSaveText)
            //отправит имя и профессию из формы на сервер
            serverInfo.changeItem(
                    {
                        name: inputName.value.trim(),
                        about: inputJob.value.trim(),
                    },
                    'users/me'
                )
                .then(() => {
                    //установим новые данные профиля (если введены values с пробелами, то обрежем лишние пробелы)
                    userInfoEx.setUserInfo({
                        name: inputName.value.trim(),
                        about: inputJob.value.trim(),
                    })
                    
                })
                .then(() => {
                    popupWithProfileForm.close()
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    renderLoading(false, profileSubmitButton, defaultSaveText)
                })
        }
    }
)
popupWithProfileForm.setEventListeners()

//при нажатии на кнопку редакт-я профиля:
// запускает валидацию,очищает уведомл об ошибках, 
// открывает попап, разблокирует кнопку сабмита и ставит прослушки
profileEditButton.addEventListener('click', () => {
    //валидирует форму
    formProfileValidator.enableValidation()

    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupProfile)

    popupWithProfileForm.open()
    
    //разблокирует кнопку сабмита у попапа профиля
    popupProfile
        .querySelector('.popup__save-button')
        .classList.remove('popup__save-button_disabled')

    //при открытии попапа редактирования профиля заполняет values инпутов данными из профиля
    const profileInfo = userInfoEx.getUserInfo()
    inputName.value = profileInfo.name
    inputJob.value = profileInfo.about
    
    //прослушки для закрытия попапа и сабмита формы
    // popupWithProfileForm.setEventListeners()
})



//при клике по картинке создаст экземпл попапа с картинкой, откроет его и поставит прослушки
function handleCardClick(cardName, cardImg) {
    const popupWithImgEx = new PopupWithImage(
        cardName,
        cardImg,
        '.popup_type_picture-zoom',
        imgPopup
    )
    popupWithImgEx.setEventListeners()
    popupWithImgEx.open()
}


// при клике на корзину создаст попап с формой подтверждения удаления карточки
function handleDeleteIconClick(card, placeEvt) {
    const popupWithSubmit = new PopupWithSubmit({
        popupSelector: '.popup_type_card-delete',
        item: card,
        place: placeEvt,
        // при подтверждении удаления удалить карточку с сервера и из разметки
        submitHandler: (card, place) => {
            renderLoading(true, cardDeleteSubmitButton, defaultYesText)
            // удаляет карточку с сервера
            return serverInfo
                .deleteItem('cards', card._id)
                .then(() => {
                    //вызывает удаление карточки из разметки
                    place.remove()
                    card = null
                    checkEmptyPlacesList()
                })
                .then(() => {
                    popupWithSubmit.close()
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    renderLoading(false, cardDeleteSubmitButton, defaultYesText)
                })
        },
    })
    popupWithSubmit.setEventListeners()
    popupWithSubmit.open()
    // сместит фокус с корзины, чтобы при сабмите она снова не сработала
    document.activeElement.blur()
    // popupCardDelete.querySelector('.popup__save-button').focus()
}


// при клике на лайк
function handleLikeClick(likeCardButton, card, likeCounter) {
    // если у карточки уже стоит лайк, удалим его с сервера и из разметки
    if (likeCardButton.classList.contains('place__like-button_active')) {
        serverInfo
            .deleteItem('cards/likes', card._id)
            .then((card) => {
                likeCounter.textContent = card.likes.length
                likeCardButton.classList.toggle('place__like-button_active')
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        serverInfo
            .replaceItem('cards/likes', card._id)
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
function placeFormSubmitHandler() {
    // до получения ответа от сервера покажет пользователю надпись о процессе загрузки
    renderLoading(true, placeSubmitButton, defaultCreateText)
    // узнает у сервера мой id (использ-ся для создания карточек)
    serverInfo.getItems('users/me')
    .then((userData) => {
        const myLikeId = userData._id
        // отправит новую карточку на сервер
        serverInfo.createItem(
            {
                name: placeInputName.value,
                link: placeInputPic.value,
            },
            'cards'
        )
        // создаст ее в разметке
        .then((card) => {
            const cardFromForm = cardCreate([card], PREPEND, MINE, myLikeId)
            cardFromForm.renderItems()
        })
        .then(() => {
            popupWithCardForm.close()
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            renderLoading(false, placeSubmitButton, defaultCreateText)
        })
    })
        
}

//будет валидировать форму карточки
const formCardValidator = new FormValidator(formSelectorsObj, placeForm)

//создает экземпляр попапа с формой для добавления карточки
const popupWithCardForm = new PopupWithForm(
    '.popup_type_add-place',
    //колбек сабмита
    () => {
        //если инпуты валидны, то запускает ф-цию сабмита
        if (!formCardValidator.hasInvalidInput()) {
            placeFormSubmitHandler()
            
        }
    }
)
popupWithCardForm.setEventListeners()

//при нажатии на кнопку добавления места:
// запускает валидацию, создает экземпляр попапа с формой,
// очищает уведомл об ошибках, открывает попап, блокирует кнопку сабмита и ставит прослушки
addPlaceButton.addEventListener('click', () => {
    //валидирует форму
    formCardValidator.enableValidation()

    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupPlace)

    // для попапа добавл.карточек заблокируем кнопку сабмита при открытии попапа
    popupPlace
        .querySelector('.popup__save-button')
        .classList.add('popup__save-button_disabled')

    popupWithCardForm.open()
    //прослушки для закрытия попапа и сабмита формы
    // popupWithCardForm.setEventListeners()
})

// при сабмите формы смены аватара отправит картинку на сервер и заменит в разметке
function avatarFormSubmitHandler() {
    renderLoading(true, avatarSubmitButton, defaultSaveText)
    serverInfo
        .changeItem({ avatar: avatarInput.value }, 'users/me/avatar')
        .then((userData) => {
            document.querySelector(
                profileAvatarSelector
            ).style.backgroundImage = `url('${userData.avatar}')`
        })
        .then(() => {
            popupWithAvatarForm.close()
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            renderLoading(false, avatarSubmitButton, defaultSaveText)
        })
}

//будет валидировать форму смены аватара
const formAvatarValidator = new FormValidator(formSelectorsObj, avatarForm)

//создает экземпляр попапа с формой аватара
const popupWithAvatarForm = new PopupWithForm(
    '.popup_type_edit-avatar',
    //колбек сабмита
    () => {
        //если инпуты валидны, то запускает ф-цию сабмита
        if (!formAvatarValidator.hasInvalidInput()) {
            avatarFormSubmitHandler()
        }
    }
)
popupWithAvatarForm.setEventListeners()

// вызовет создание класса с формой для смены аватара
editAvatarButton.addEventListener('click', () => {
    //валидирует форму
    formAvatarValidator.enableValidation()

    //убирает уведомления об ошибках от предыдущих инпутов
    cleanInputErrors(popupEditAvatar)

    // заблокируем кнопку сабмита при открытии попапа
    popupEditAvatar
        .querySelector('.popup__save-button')
        .classList.add('popup__save-button_disabled')

    
    popupWithAvatarForm.open()
    //прослушки для закрытия попапа и сабмита формы
    // popupWithAvatarForm.setEventListeners()
})
