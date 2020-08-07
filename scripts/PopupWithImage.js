import Popup from './Popup.js'
import {imgPopup} from './utils.js'

export default class PopupWithImage extends Popup {
    constructor(evt, popupSelector) {
        super(popupSelector);
        currentImgTrigger = evt.target;
    }
    open() {
        const imgName = currentImgTrigger.closest('.place').querySelector('.place__name').textContent
        const imgSrc = currentImgTrigger.src
        
        imgPopup.querySelector('.picture-zoom__title').textContent = imgName
        imgPopup.querySelector('.picture-zoom__img').src = imgSrc

        super.open();
    }
}