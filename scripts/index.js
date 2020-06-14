const popup = document.querySelector('.popup')
const popupOpenButton = document.querySelector('.profile__edit-button')
const popupCloseButton = popup.querySelector('.popup__close-button')
const saveProfileButton = popup.querySelector('.popup__save-button')
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__job')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')

// переключает класс попап
const popupToggle = function () {
    popup.classList.toggle('popup_opened')
}

function cleanInputValues() {
    inputName.value = ''
    inputJob.value = ''
}

popupOpenButton.addEventListener('click', function() {
    popupToggle()
    inputName.value = profileName.textContent
    inputJob.value = profileJob.textContent
} )

popupCloseButton.addEventListener('click', function() {
    popupToggle()
    cleanInputValues()
} )

// закрывает попап при нажатии на фон
// popup.addEventListener('click', function (event) {
//     if (event.target.className == 'popup popup_opened') {
//         popup.className = 'popup'
//     }
// })
// либо
const closePopupByClickingOverlay = function (event) {
    if (event.target !== event.currentTarget) { return }
    popupToggle()
    cleanInputValues()
}
popup.addEventListener('click', closePopupByClickingOverlay)


let formElement = document.querySelector('.popup__form')

// Обработчик «отправки» формы
function formSubmitHandler (evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

    if (inputName.value !== inputName.placeholder && inputName.value.length > 0 && inputName.value.trim() !== '') {
        profileName.textContent = inputName.value.trim()
    }
    if (inputJob.value !== inputJob.placeholder && inputJob.value.length > 0 && inputJob.value.trim() !== '') {
        profileJob.textContent = inputJob.value.trim()
    }
    popupToggle()
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formElement.addEventListener('submit', formSubmitHandler);





// const inputs = document.querySelectorAll('.input')
// сохраняет values для всех inputs по порядку html
// const profileInputs = document.querySelectorAll('.profile__input')
// const saveProfileChanges = function() {
//     for (let i = 0; i < inputs.length; i++) {
//         let input = inputs[i]
//         if (input.value !== input.placeholder && input.value.length > 0 && input.value.trim() !== '') {
//             profileInputs[i].textContent = input.value
//             input.placeholder = input.value
//         }
//         input.value = ''
//     }
//     popupToggle()
// }

// //если бы надо было заменять placeholder и обнулять value 
// const saveProfileChanges = function() {
//     if (inputName.value !== inputName.placeholder && inputName.value.length > 0 && inputName.value.trim() !== '') {
//         profileName.textContent = inputName.value
//         inputName.placeholder = inputName.value
//     }
//     if (inputJob.value !== inputJob.placeholder && inputJob.value.length > 0 && inputJob.value.trim() !== '') {
//         profileJob.textContent = inputJob.value
//         inputJob.placeholder = inputJob.value
//     }
//     popupToggle()
//     cleanInputValues()
// }

