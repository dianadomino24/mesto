const popup = document.querySelectorAll('.popup')
const popupProfileOpenButton = document.querySelector('.profile__edit-button')
const popupCloseButton = document.querySelector('.popup__close-button')
const saveProfileButton = document.querySelector('.popup__save-button')
const profileName = document.querySelector('.profile__name')
const profileJob = document.querySelector('.profile__job')
const inputName = document.querySelector('.popup__input_type_name')
const inputJob = document.querySelector('.popup__input_type_job')

const popupTriggers = document.querySelectorAll('[data-popup-trigger]')

// переключает класс попап
const popupToggle = function (currentPopup) {
    console.log(currentPopup)
    currentPopup.classList.toggle('popup_opened')
}

const popupToggleFromEvent = function (event) {
    console.log(event.target)
    currentPopup = event.target.closest('.popup')
    console.log(currentPopup)
    popupToggle(currentPopup)
}

function cleanInputValues(currentPopup) {
    let inputs = currentPopup.querySelectorAll('.input')
    inputs.forEach( input => {input.value = ''})
}

const cleanInputValuesFromEvent = function (event) {
    console.log(event.target)
    currentPopup = event.target.closest('.popup')
    console.log(currentPopup)
    cleanInputValues(currentPopup)
}

// popupOpenButton.addEventListener('click', function() {
//     popupToggle()
//     inputName.value = profileName.textContent
//     inputJob.value = profileJob.textContent
// } )


// popupCloseButton.addEventListener('click', function() {
//     popupToggle()
//     cleanInputValues()
// } )

// закрывает попап при нажатии на фон
// popup.addEventListener('click', function (event) {
//     if (event.target.className == 'popup popup_opened') {
//         popup.className = 'popup'
//     }
// })
// либо
const closePopupByClickingOverlay = function (event) {
    console.log(event.target)
    if (event.target !== event.currentTarget) { return }
    popupToggleFromEvent(event)
    cleanInputValuesFromEvent(event)
}
// popup.addEventListener('click', closePopupByClickingOverlay)


function addPopupListeners(currentPopup) {
    console.log(currentPopup)
    currentPopup.querySelector('.popup__close-button').addEventListener('click', popupToggleFromEvent);
    currentPopup.addEventListener('click', closePopupByClickingOverlay);
    // currentPopup.querySelector('.popup__save-button').addEventListener('click', formSubmitHandler);
}
  
//   function deleteTodo(e) {
//     const todo = e.target.closest('.todo');
  
//     todo.remove();
//   }
  
//   function editTodo(e) {
//     const todo = e.target.closest('.todo');
  
//     setTodotoForm(todo);
//   }



popupTriggers.forEach(el => el.addEventListener('click', function() {
    let currentPopupValue = el.dataset.popupTrigger
    console.log(currentPopupValue)
    let currentPopup = document.querySelector(`[data-popup-name=${CSS.escape(currentPopupValue)}]`)
    console.log(currentPopup)
    popupToggle(currentPopup)
    cleanInputValues(currentPopup)
    addPopupListeners(currentPopup)
})) 


let formProfile = document.querySelector('.popup__form_type_profile')
popupProfileOpenButton.addEventListener('click', function() {
    inputName.value = profileName.textContent
    inputJob.value = profileJob.textContent
})

// Обработчик «отправки» формы
function formSubmitHandler (evt) {
    evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

    if (inputName.value !== inputName.placeholder && inputName.value.length > 0 && inputName.value.trim() !== '') {
        profileName.textContent = inputName.value.trim()
    }
    if (inputJob.value !== inputJob.placeholder && inputJob.value.length > 0 && inputJob.value.trim() !== '') {
        profileJob.textContent = inputJob.value.trim()
    }
    popupToggleFromEvent(event)
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formProfile.addEventListener('submit', formSubmitHandler);





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

