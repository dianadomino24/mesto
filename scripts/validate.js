// находит элемент ошибки в ближайшем к текущему инпуту лэйбле  
function findInputError(inputElement, controlSelector,inputErrorClass) {
    return inputElement.closest(controlSelector).querySelector(inputErrorClass)
}

//показывает сообщение об ошибке
function showInputError (inputElement, errorMessage, inputErrorClass, errorActiveClass, controlSelector) {
    const errorElement = findInputError(inputElement, controlSelector,inputErrorClass)
    errorElement.textContent = errorMessage;
    errorElement.classList.add(errorActiveClass);
};

//скрывает сообщение об ошибке
function hideInputError(inputElement, inputErrorClass, errorActiveClass, controlSelector) {
    const errorElement = findInputError(inputElement, controlSelector,inputErrorClass)
    errorElement.classList.remove(errorActiveClass);
    errorElement.textContent = '';
};
//проверяет валидность инпутов, очищенных от пробелов
function isInputWithoutSpacingValid (inputElement, controlSelector, inputErrorClass, errorActiveClass) {
    const inputElementNoSpacing = inputElement.value.trim()
    const errorElement = findInputError(inputElement, controlSelector,inputErrorClass)

    if (inputElementNoSpacing.length == 0) {
        errorElement.textContent = "Заполните это поле.";
        errorElement.classList.add(errorActiveClass);
        return false
    } 

    //если введено меньше 2 символов без учета пробелов в форме профиля (в форме места миним.длина инпута - 1)
    if (inputElementNoSpacing.length < 2 && errorElement.classList.contains('js-popup__input-error_type_profile')) {
        errorElement.textContent = "Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.";
        errorElement.classList.add(errorActiveClass);
        return false
    }
    return true
}

//проверяет валидность инпутов с учетом пробелов
function checkInputValidity (inputElement, inputErrorClass, errorActiveClass, controlSelector) {
    //проверяет валидность инпутов, очищенных от пробелов
    if (!isInputWithoutSpacingValid (inputElement, controlSelector, inputErrorClass, errorActiveClass)) {
        return
    } else {
        if (!inputElement.validity.valid) {
            showInputError(inputElement, inputElement.validationMessage, inputErrorClass, errorActiveClass, controlSelector);
        } else {
            hideInputError(inputElement, inputErrorClass, errorActiveClass, controlSelector);
        }
    }
}
//выкл сабмит по нажатию Enter (чтобы нельзя было засабмитить невалидные инпуты)
// function preventEnterSubmit() {
//     document.addEventListener('keydown', function(evt) {
//         if (evt.key === 'Enter') {
//             evt.preventDefault()
//         }
//     })
// }

//вернет true, если есть невалидный инпут (с учетом проверки пробелов)
function hasInvalidInput(inputList, controlSelector, inputErrorClass, errorActiveClass){
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid || !isInputWithoutSpacingValid(inputElement, controlSelector, inputErrorClass, errorActiveClass)})
}
//(раз)блокирует кнопку submit
function toggleButtonState(inputList, buttonElement, inactiveButtonClass, controlSelector, inputErrorClass, errorActiveClass) {
    if (hasInvalidInput(inputList, controlSelector, inputErrorClass, errorActiveClass)) {
        buttonElement.classList.add(inactiveButtonClass)
    } else {
        buttonElement.classList.remove(inactiveButtonClass)
    }
}

function setEventListeners(formElement, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorActiveClass, controlSelector) {
    const inputList = Array.from(formElement.querySelectorAll(inputSelector));
    const buttonElement = formElement.querySelector(submitButtonSelector)
    
    ////выкл сабмит по нажатию Enter
    // preventEnterSubmit()

    //устанавливает состояние кнопки submit еще до изменения инпутов
    toggleButtonState(inputList, buttonElement, inactiveButtonClass, controlSelector, inputErrorClass, errorActiveClass)
    //прослушки для инпутов
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(inputElement, inputErrorClass, errorActiveClass, controlSelector);
            toggleButtonState(inputList, buttonElement, inactiveButtonClass, controlSelector, inputErrorClass, errorActiveClass)  
        });
    });
};

function enableValidation({
formSelector,
inputSelector,
submitButtonSelector,
inactiveButtonClass,
inputErrorClass,
errorActiveClass,
controlSelector}) {
    const formList = Array.from(document.querySelectorAll(formSelector));
    formList.forEach((formElement) => {
        formElement.addEventListener('submit', function (evt) {
            evt.preventDefault();
        });
        setEventListeners(formElement, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorActiveClass, controlSelector);
    });
};

enableValidation({
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-button',
    inactiveButtonClass: 'popup__save-button_disabled',
    inputErrorClass: '.popup__input-error',
    errorActiveClass: 'popup__input-error_active',
    controlSelector: '.popup__label',
}); 






// //показывает сообщение об ошибке
// function showInputError (inputElement, errorMessage, inputErrorClass, errorActiveClass, controlSelector) {
//     //находим элемент ошибки в ближайшем к текущему инпуту лэйбле  
//     const errorElement = inputElement.closest(controlSelector).querySelector(inputErrorClass)

//     errorElement.textContent = errorMessage;
//     errorElement.classList.add(errorActiveClass);
// };

// //скрывает сообщение об ошибке
// function hideInputError(inputElement, inputErrorClass, errorActiveClass, controlSelector) {
//     //находим элемент ошибки в ближайшем к текущему инпуту лэйбле  
//     const errorElement = inputElement.closest(controlSelector).querySelector(inputErrorClass)

//     errorElement.classList.remove(errorActiveClass);
//     errorElement.textContent = '';
// };

// //проверяем валидность инпутов с учетом пробелов
// function checkInputValidity (inputElement, inputErrorClass, errorActiveClass, controlSelector) {
//     let inputElementNoSpacing = inputElement.value.trim()
//     //если введено меньше 2 символов без учета пробелов
//     if (inputElementNoSpacing.length < 2) {
//         const errorElement = inputElement.closest(controlSelector).querySelector(inputErrorClass);
//         errorElement.classList.add(errorActiveClass);
        
//         if (inputElementNoSpacing.length == 0) {
//             errorElement.textContent = "Заполните это поле.";
//         } else {
//             errorElement.textContent = "Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.";
//         }
//         } else {

//     if (!inputElement.validity.valid) {
//         showInputError(inputElement, inputElement.validationMessage, inputErrorClass, errorActiveClass, controlSelector);
//     } else {
//         hideInputError(inputElement, inputErrorClass, errorActiveClass, controlSelector);
//     }}
// };

// у эвент найти попап, запустить сабмит в зависимости от попапа + импорт ф-ций
// import {placeFormSubmitHandler} from './index.js'
// import {profileFormSubmitHandler} from './index.js'

// function checkEnterSubmit(formElement, buttonElement, inactiveButtonClass) {
//     //если нажали Enter и если кнопка save активна
//     document.addEventListener('keydown', function(evt) {
//         if (evt.key === 'Enter') {
//         //     if (!buttonElement.classList.contains(inactiveButtonClass)) {

//         //         let profilePopup = evt.target.closest('.popup_type_edit-profile')
//         //         let placePopup = evt.target.closest('.popup_type_add-place')
//         //         let profileButton = evt.target.closest('.profile__edit-button')
//         //         let placeButton = evt.target.closest('.profile__add-button')

//         //         if (profilePopup || profileButton) {
//         //             profileFormSubmitHandler(evt)
//         //         } else {
//         //             placeFormSubmitHandler(evt)
//         //         }

//         //     } 
//         evt.preventDefault() 
//         }  
//         })
//     }