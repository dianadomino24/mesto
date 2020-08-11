import Popup from './Popup.js'
import {imgPopup} from '../index.js'

export default class PopupWithImage extends Popup {
    constructor(evt, popupSelector) {
        super(popupSelector);
        this._currentImgTrigger = evt.target;
    }
    open() {
        const imgName = this._currentImgTrigger.closest('.place').querySelector('.place__name').textContent
        const imgSrc = this._currentImgTrigger.src
        
        imgPopup.querySelector('.picture-zoom__title').textContent = imgName
        imgPopup.querySelector('.picture-zoom__img').src = imgSrc

        super.open();
    }
}