import {openImgPopup, placesList} from './index.js'

//для надписи о том, что все карточки удалены
const emptyList = document.querySelector('.places__empty-list')


export class Card {
    constructor (cardName, cardImg, cardTemplate) {
        this._cardTemplate= cardTemplate;
        this._cardName = cardName;
        this._cardImg = cardImg;
	}

    _getTemplate() {
        const cardElement = this._cardTemplate.content.cloneNode(true);
        return cardElement;
    }


    // проверяет, есть ли в списке картинки, если нет, то делает видимой надпись о пустом списке
    //в placesList всегда есть минимум 1 элемент - надпись о пустом списке
    checkEmptyPlacesList() {
        if (placesList.children.length === 1) {
            emptyList.classList.add('places__empty-list_visible')
        } else {
            emptyList.classList.remove('places__empty-list_visible')
        }
    }

    _deleteCard(evt) {
        const place = evt.target.closest('.places__item');
        place.remove()
        this.checkEmptyPlacesList()
        this._element = null
    }

    _likeCard(evt) {
        evt.target.classList.toggle('place__like-button_active')
    }

    // _openImgPopup(evt) {
    //     openImgPopup(evt) 
    // }

    _setEventListeners() {
        const likeCardButton = this._element.querySelector('.place__like-button')
        likeCardButton.addEventListener('click', (evt) => { 
            this._likeCard(evt)
        })
        
        const deleteCardButton = this._element.querySelector('.place__delete-button')
        deleteCardButton.addEventListener('click', (evt) => {
            this._deleteCard(evt)
        })

        // открывает попап с увеличенным изображением и подписью
        const imgTrigger = this._element.querySelector('.place__image')
        imgTrigger.addEventListener('click', (evt) => {
            openImgPopup(evt)
            // this._openImgPopup(evt)
        })
    }

    generateCard() {
        this._element = this._getTemplate();
        
        this._element.querySelector('.place__image').src = this._cardImg;
        this._element.querySelector('.place__name').textContent = this._cardName;
        

        this._setEventListeners()

        return this._element;
    }
}


