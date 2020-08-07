export default class Popup {
    constructor(popupSelector) {
        this._popup = document.querySelector(popupSelector)
    }
    open(){

    }
    close() {

    }
    _handleEscClose() {

    }
    setEventListeners() {
        popupCloseButton.addEventListener('click', () => {
            this._close()
        })
    }
}