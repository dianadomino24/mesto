export default class Popup {
    constructor(popupSelector) {
        this._popup = document.querySelector(popupSelector)
        this._closeButton = this._popup.querySelector('.popup__close-button')
    }
    open(){
        this._popup.classList.add('popup_opened')
    }
    //очищает input values 
    _cleanInputValues() {
        let inputs = this._popup.querySelectorAll('.input')
        if (inputs) {
            inputs.forEach( input => {input.value = ''})
        }
    }
    close() {
        this._cleanInputValues()
        this._popup.classList.remove('popup_opened')
        //  убирает прослушку Esc
        document.removeEventListener('keydown', this._keyHandlerEsc)
        
    }
    //закрвает при нажатии esc
    _handleEscClose() {
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') {
                this.close()
            }
        })
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
        this._handleEscClose()
        this._popup.addEventListener('mousedown', (event) => {
            this._closePopupByClickingOverlay(event)
        })
    }
}