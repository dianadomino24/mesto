import Popup from './Popup.js'

export default class PopupWithSubmit extends Popup {
    constructor({ popupSelector, submitHandler }) {
        super(popupSelector)
        this._submitHandler = submitHandler
        this._formElement = this._popup.querySelector('.popup__form')
    }

    // close() {
    //     super.close()
    //     // this._formElement.reset()
    // }
    open(cardItem, cardDOMElement) {
        super.open()
        this._cardItem = cardItem
        this._cardDOMElement = cardDOMElement
    }

    setEventListeners() {
        super.setEventListeners()
        this._formElement.addEventListener('submit', (evt) => {
            evt.preventDefault()
            this._submitHandler(this._cardItem, this._cardDOMElement)
        })
    }
}
