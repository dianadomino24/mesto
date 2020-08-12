import Popup from './Popup.js'
import {imgPopup} from '../index.js'

export default class PopupWithImage extends Popup {
    constructor(cardName, cardImg, popupSelector) {
        super(popupSelector);
        this._cardName = cardName;
        this._cardImg = cardImg;
    }
    open() {
        imgPopup.querySelector('.picture-zoom__title').textContent = this._cardName
        imgPopup.querySelector('.picture-zoom__img').src = this._cardImg

        super.open();
    }
}