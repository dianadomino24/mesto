// находим элемент ошибки в ближайшем к текущему инпуту лэйбле  
function findInputError(inputElement, controlSelector,inputErrorClass) {
    return inputElement.closest(controlSelector).querySelector(inputErrorClass)
}

//показывает сообщение об ошибке
function showInputError (inputElement, errorMessage, inputErrorClass, errorActiveClass, controlSelector) {
    let errorElement = findInputError(inputElement, controlSelector,inputErrorClass)

    errorElement.textContent = errorMessage;
    errorElement.classList.add(errorActiveClass);
};

//скрывает сообщение об ошибке
function hideInputError(inputElement, inputErrorClass, errorActiveClass, controlSelector) {
    let errorElement = findInputError(inputElement, controlSelector,inputErrorClass)
    errorElement.classList.remove(errorActiveClass);
    errorElement.textContent = '';
};

//проверяем валидность инпутов с учетом пробелов
function checkInputValidity (inputElement, inputErrorClass, errorActiveClass, controlSelector) {
    if (!isInputWithoutSpacingValid (inputElement, controlSelector, inputErrorClass, errorActiveClass)) {
        return
    } else {
    // let inputElementNoSpacing = inputElement.value.trim()
    // //если введено меньше 2 символов без учета пробелов
    // if (inputElementNoSpacing.length < 2) {
    //     let errorElement = findInputError(inputElement, controlSelector,inputErrorClass)
    //     errorElement.classList.add(errorActiveClass);
        
    //     if (inputElementNoSpacing.length == 0) {
    //         errorElement.textContent = "Заполните это поле.";
    //     } else  
    //     if (errorElement.classList.contains('js-popup__input-error_type_profile')) {
    //         errorElement.textContent = "Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.";
    //     }
    //     } else {

    if (!inputElement.validity.valid) {
        showInputError(inputElement, inputElement.validationMessage, inputErrorClass, errorActiveClass, controlSelector);
    } else {
        hideInputError(inputElement, inputErrorClass, errorActiveClass, controlSelector);
    }
}
}


function setEventListeners(formElement, inputSelector, submitButtonSelector, inactiveButtonClass,
    inputErrorClass,
    errorActiveClass,
    controlSelector) {

    const inputList = Array.from(formElement.querySelectorAll(inputSelector));
    const buttonElement = formElement.querySelector(submitButtonSelector)
    
    preventEnterSubmit()

    //состояние кнопки submit
    toggleButtonState(inputList, buttonElement, inactiveButtonClass, controlSelector, inputErrorClass, errorActiveClass)

        inputList.forEach((inputElement) => {
            inputElement.addEventListener('input', function () {
                checkInputValidity(inputElement, inputErrorClass, errorActiveClass, controlSelector);
                toggleButtonState(inputList, buttonElement, inactiveButtonClass, controlSelector, inputErrorClass, errorActiveClass)
                
            });
        });
        // preventEnterSubmit()
    // }
};

function preventEnterSubmit() {
    document.addEventListener('keydown', function(evt) {
        if (evt.key === 'Enter') {
            evt.preventDefault()
    }
})
}


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
        
    //     function preventEnterSubmit(evt) {
    //         if (evt.key === 'Enter'){
    //             evt.preventDefault()
    //         }
    //     }
    // }

// function activateEnterSubmit (evt) {
//     if (evt.key === 'Enter') {
//         return true
//     }
// }

// let formEl = null

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
        setEventListeners(formElement, inputSelector, submitButtonSelector, inactiveButtonClass,
            inputErrorClass,
            errorActiveClass,
            controlSelector);
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

// export {enableValidation};

//вызов валидации и передача ему селекторов
// enableValidation({
//     formSelector: '.popup__form',
//     inputSelector: '.popup__input',
//     submitButtonSelector: '.popup__save-button',
//     inactiveButtonClass: 'popup__save-button_disabled',
//     inputErrorClass: '.popup__input-error',
//     errorActiveClass: 'popup__input-error_active',
//     controlSelector: '.popup__label',
// });


//(раз)блокирует кнопку submit
// function toggleButtonState(formElement, buttonElement, inactiveButtonClass) {
//     if (!formElement.checkValidity()) {
//         buttonElement.classList.add(inactiveButtonClass)
//     } else {
//         buttonElement.classList.remove(inactiveButtonClass)
//     }
// }

function isInputWithoutSpacingValid (inputElement, controlSelector, inputErrorClass, errorActiveClass) {
    let inputElementNoSpacing = inputElement.value.trim()
    let errorElement = findInputError(inputElement, controlSelector,inputErrorClass)

    if (inputElementNoSpacing.length == 0) {
        errorElement.textContent = "Заполните это поле.";
        errorElement.classList.add(errorActiveClass);
        return false
    } 

    //если введено меньше 2 символов без учета пробелов в форме профиля
    if (inputElementNoSpacing.length < 2 && errorElement.classList.contains('js-popup__input-error_type_profile')) {
        errorElement.textContent = "Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.";
        errorElement.classList.add(errorActiveClass);
        return false
    }
    return true

}

//проверяет, есть ли невалидный инпут
function hasInvalidInput(inputList, controlSelector, inputErrorClass, errorActiveClass){
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid || !isInputWithoutSpacingValid (inputElement, controlSelector, inputErrorClass, errorActiveClass)})
}
//(раз)блокирует кнопку submit
function toggleButtonState(inputList, buttonElement, inactiveButtonClass, controlSelector, inputErrorClass, errorActiveClass) {
    if (hasInvalidInput(inputList, controlSelector, inputErrorClass, errorActiveClass)) {
        buttonElement.classList.add(inactiveButtonClass)
    } else {
        buttonElement.classList.remove(inactiveButtonClass)
    }
}



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
