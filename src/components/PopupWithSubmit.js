// const { default: Popup } = require("./Popup"); ???

import Popup from './Popup.js'

export default class PopupWithSubmit extends Popup {
    constructor(popupSelector, submitHandler) {
        super(popupSelector);
        this._submitHandler = submitHandler;
        this._formElement = this._popup.querySelector('.popup__form');
    }

    setEventListeners() {
        super.setEventListeners()
        this._formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this._submitHandler()
        } )
    }
}