import Popup from './Popup.js'

export default class PopupWithImage extends Popup {
    constructor(popupSelector, imgPopup) {
        super(popupSelector)
        this._imgPopup = imgPopup
    }
    open(cardName, cardImg) {
        this._cardName = cardName
        this._cardImg = cardImg
        this._imgPopup.querySelector(
            '.picture-zoom__title'
        ).textContent = this._cardName
        this._imgPopup.querySelector('.picture-zoom__img').src = this._cardImg

        super.open()
    }
}
