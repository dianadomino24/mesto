export default class Popup {
    constructor(popupSelector) {
        this._popup = document.querySelector(popupSelector)
        this._closeButton = this._popup.querySelector('.popup__close-button')
        this._formElement = this._popup.querySelector('.popup__form')
    }
    open(){ 
        if (this._formElement) {
            this._formElement.reset()
        }
        this._popup.classList.add('popup_opened')
    }

    close() {
        this._popup.classList.remove('popup_opened')
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