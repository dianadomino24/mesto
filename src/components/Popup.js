export default class Popup {
    constructor(popupSelector) {
        this._popup = document.querySelector(popupSelector)
        this._closeButton = this._popup.querySelector('.popup__close-button')
        this._formElement = this._popup.querySelector('.popup__form')
    }
    open(){ 
        // if (this._formElement) {
            this._formElement.reset()
        // } 
        this._popup.classList.add('popup_opened')
    }

    close() {
        this._popup.classList.remove('popup_opened')

        //если не обнулять formElement при закрытии, то с каждым след-им сабмитом создаются неск.карточек вместо одной
        // (наверное, срабатывает сабмит предыдущих экземпляров формы, при этом снять eventListener с сабмита не получается, 
        // т.к. ему нужен event для ф-ции колбека, который пропадет, если в addEventList записать только имя ф-ции).
        //такое обнуление приводит к ошибкам в консоли в PopupWithForm _getInputValues (условие if (this._formElement не помогает))
        //если оставить переопределение метода close в попапе формы (reset формы при закрытии) (как это требовалось в задании спринта), 
        // а не при открытии (как Вы советовали), то этих проблем с множественным созданием карточек не возникает.
        // this._formElement = null
    }
    //закрывает при нажатии esc
    _handleEscClose(evt) {
            if (evt.key === 'Escape') {
                this.close()
            }
    }
    //закрывает попап при нажатии на фон
    _closePopupByClickingOverlay(event) {
        if (event.target !== event.currentTarget) { return }
        this.close()
    }

    setEventListeners() {
        this._closeButton.addEventListener('click', () => {
            this.close()
        })
        document.addEventListener('keydown', (evt) => this._handleEscClose(evt))
        this._popup.addEventListener('mousedown', (event) => {
            this._closePopupByClickingOverlay(event)
        })
        
    }
}