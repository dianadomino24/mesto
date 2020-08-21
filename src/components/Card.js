export default class Card {
    constructor ({cardName, cardImg, cardTemplate, handleCardClick, handleCardDelete}) {
        this._cardTemplate= cardTemplate;
        this._cardName = cardName;
        this._cardImg = cardImg;
        this._handleCardClick = handleCardClick;
        this._handleCardDelete = handleCardDelete;
	}

    _getTemplate() {
        const cardElement = this._cardTemplate.content.cloneNode(true);
        return cardElement;
    }


    // пока не разобралась, как перенести checkEmpty в index.js или отдельный класс без сильного связывания
    // не понимаю, как эта ф-ция узнает, что карточка удалена, если удаление - внутр метод Card

    // проверяет, есть ли в списке картинки, если нет, то делает видимой надпись о пустом списке
    //в placesList всегда есть минимум 1 элемент - надпись о пустом списке
    checkEmptyPlacesList() {
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
    // заблокирует кнопку удаления карточки для чужих (не моих) карточек
    disableDelete() {
        this._element.querySelector('.place__delete-button').classList.add('place__delete-button_disabled')
    }
    _deleteCard(evt) {
        const place = evt.target.closest('.places__item');
        place.remove()
        this.checkEmptyPlacesList()
        this._element = null
    }

    _likeCard(likeCardButton) {
        likeCardButton.classList.toggle('place__like-button_active')
    }

    _setEventListeners() {
        const likeCardButton = this._element.querySelector('.place__like-button')
        likeCardButton.addEventListener('click', () => { 
            this._likeCard(likeCardButton)
        })
        
        const deleteCardButton = this._element.querySelector('.place__delete-button')
        deleteCardButton.addEventListener('click', (evt) => {
            //вызывает удаление карточки с сервера
            // this._handleCardDelete(this._cardName, this._cardImg)
            this._deleteCard(evt)
        })
        //откроет попап с картинкой 
        const imgPopupTrigger = this._element.querySelector('.place__image')
        imgPopupTrigger.addEventListener('click', () => {
            this._handleCardClick(this._cardName, this._cardImg)
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


