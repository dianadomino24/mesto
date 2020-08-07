export const initialCardsArr = [
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


export const popupProfileOpenButton = document.querySelector('.profile__edit-button')
export const popupCloseButtonSelector = '.popup__close-button'
export const profileName = document.querySelector('.profile__name')
export const profileJob = document.querySelector('.profile__job')
export const inputName = document.querySelector('.popup__input_type_name')
export const inputJob = document.querySelector('.popup__input_type_job')

//сюда будем класть текущий открытый попап
let currentPopupBox = null

export const imgPopup = document.querySelector('.popup_type_picture-zoom')

export const popupTriggers = document.querySelectorAll('[data-popup-trigger]')

export const placesList = document.querySelector('.places__list')
export const placeForm = document.querySelector('.popup__form_type_place')
export const placeInputName = placeForm.querySelector('.popup__input_type_place-name')
export const placeInputPic = placeForm.querySelector('.popup__input_type_place-pic')

export const formProfile = document.querySelector('.popup__form_type_profile')