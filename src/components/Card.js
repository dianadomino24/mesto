export default class Card {
    constructor(
        { data, handleCardClick, handleLikeClick, handleDeleteIconClick },
        cardTemplate,
        myLikeId
    ) {
        this._cardTemplate = cardTemplate
        this._cardName = data.name
        this._cardImg = data.link
        this._cardId = data._id
        this._likes = data.likes
        this._myLikeId = myLikeId
        this._data = data
        this._handleCardClick = handleCardClick
        this._handleDeleteIconClick = handleDeleteIconClick
        this._handleLikeClick = handleLikeClick
    }

    _getTemplate() {
        const cardElement = this._cardTemplate.content.cloneNode(true)
        return cardElement
    }

    // заблокирует кнопку удаления карточки для чужих (не моих) карточек
    disableDelete() {
        this._element
            .querySelector('.place__delete-button')
            .classList.add('place__delete-button_disabled')
    }
    _deleteCard(evt, element) {
        //сохраняет дом элемент, который надо будет удалить из разметки
        const placeEvt = evt.target.closest('.places__item')
        //вызывает попап с подтверждением удаления
        this._handleDeleteIconClick(element, placeEvt)
    }

    _setEventListeners() {
        const likeCardButton = this._element.querySelector(
            '.place__like-button'
        )
        likeCardButton.addEventListener('click', () => {
            this._handleLikeClick(
                likeCardButton,
                this._element,
                this._likeCounter
            )
        })

        const deleteCardButton = this._element.querySelector(
            '.place__delete-button'
        )
        deleteCardButton.addEventListener('click', (evt) => {
            this._deleteCard(evt, this._element)
        })
        //откроет попап с картинкой
        const imgPopupTrigger = this._element.querySelector('.place__image')
        imgPopupTrigger.addEventListener('click', () => {
            this._handleCardClick(this._cardName, this._cardImg)
        })
    }

    generateCard() {
        this._element = this._getTemplate()

        this._element.querySelector('.place__image').src = this._cardImg
        this._element.querySelector('.place__name').textContent = this._cardName
        this._element._id = this._cardId
        //для отрисовки залайканных мной карточек (черного сердечка)
        this._likeCounter = this._element.querySelector('.place__like-counter')
        this._likeCounter.textContent = this._likes.length

        this._element.likes = this._likes

        //если id лайка мой, то сердечно черное
        const likeCardButton = this._element.querySelector(
            '.place__like-button'
        )
        if (this._likes.some((like) => like._id === this._myLikeId)) {
            likeCardButton.classList.toggle('place__like-button_active')
        }

        this._setEventListeners()
        return this._element
    }
}
