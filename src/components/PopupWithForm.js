import Popup from './Popup.js'

export default class PopupWithForm extends Popup {
    constructor(popupSelector, submitHandler) {
        super(popupSelector);
        this._formElement = this._popup.querySelector('.popup__form');
        this._submitHandler = submitHandler;
    }
    //собирает данные всех полей формы и возвращает массив с ними
    _getInputValues() {
        this._formValues = {};
        this._inputList = this._formElement.querySelectorAll('.form__input');
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
    // close() {
    //     // this._formElement.reset()
    //     // this._formElement = null 
    //     super.close()
         //если не обнулять formElement при закрытии, то срабатывает сабмит предыдущих экземпляров формы, 
        // при этом снять eventListener с сабмита не получается, 
        // т.к. ему нужен event для ф-ции колбека, который пропадет, если в addEventList записать только имя ф-ции).
        //такое обнуление приводит к ошибкам в консоли в PopupWithForm _getInputValues (условие if (this._formElement не помогает))
    // }
}