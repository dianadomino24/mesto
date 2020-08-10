import Popup from './Popup.js'

export default class PopupWithForm extends Popup {
    constructor(popupSelector, submitHandler) {
        super(popupSelector);
        this._formElement = this._popup.querySelector('.popup__form');
        this._submitHandler = submitHandler;
    }
    _getInputValues() {
        this._inputList = this._formElement.querySelectorAll('.form__input');
        this._formValues = {};
        this._inputList.forEach(input => this._formValues[input.name] = input.value);
        
        return this._formValues;
    }
    setEventListeners() {
        super.setEventListeners()
        this._formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this._submitHandler(this._getInputValues())
        } )
    }
    close() {
        super.close()
        this._formElement.reset()
    }

}