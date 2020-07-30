import {placesList} from './index.js'
export const initialCards = [
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

//для надписи о том, что все карточки удалены
const emptyList = document.querySelector('.places__empty-list')

// проверяет, есть ли в списке картинки, если нет, то делает видимой надпись о пустом списке
//в placesList всегда есть минимум 1 элемент - надпись о пустом списке
export function checkEmptyPlacesList() {
    if (placesList.children.length === 1) {
        emptyList.classList.add('places__empty-list_visible')
    } else {
        emptyList.classList.remove('places__empty-list_visible')
    }
}