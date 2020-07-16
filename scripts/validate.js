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

//кейсы проверки валидности 
const VALID = 0
const INVALID_EMPTY = 1
const INVALID_TOOSHORT = 2

//проверяет длину инпутов, очищенных от пробелов
function isInputWithoutSpacingInvalid (inputElement) {
    const inputElementNoSpacing = inputElement.value.trim()

    if (inputElementNoSpacing.length == 0) {
        return INVALID_EMPTY
    } 
    //если введено меньше 2 символов без учета пробелов в форме профиля (в форме места миним.длина инпута - 1)
    if (inputElementNoSpacing.length < 2 && (inputElement.classList.contains('popup__input_type_name') || inputElement.classList.contains('popup__input_type_job'))) {
        return INVALID_TOOSHORT
    }
    return VALID
}

//проверяет валидность инпутов с учетом пробелов и выводит на стр соответствующие ошибки
function checkInputValidity (inputElement, inputErrorClass, errorActiveClass, controlSelector) {  
    const errorElement = findInputError(inputElement, controlSelector,inputErrorClass)

    switch (isInputWithoutSpacingInvalid(inputElement)) {
        case INVALID_EMPTY:
            errorElement.textContent = "Заполните это поле.";
            errorElement.classList.add(errorActiveClass);
            break;

        case INVALID_TOOSHORT:
            errorElement.textContent = "Текст должен быть не короче 2 симв. Длина текста сейчас: 1 символ.";
            errorElement.classList.add(errorActiveClass);
            break;

        case VALID:
            if (!inputElement.validity.valid) {
                showInputError(inputElement, inputElement.validationMessage, inputErrorClass, errorActiveClass, controlSelector);
            } else {
                hideInputError(inputElement, inputErrorClass, errorActiveClass, controlSelector);
            }
            break;

        default:
            alert( "error" );
    }
}

//вернет true, если есть невалидный инпут (с учетом проверки пробелов)
function hasInvalidInput(inputList){
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid || isInputWithoutSpacingInvalid(inputElement)})
}

//(раз)блокирует кнопку submit
function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add(inactiveButtonClass)
    } else {
        buttonElement.classList.remove(inactiveButtonClass)
    }
}

//скрывает уведомления об ошибках в инпутах (используется на открытом попапе в index.js)
function cleanInputErrors(currentPopupBox) {
    const inputErrors = currentPopupBox.querySelectorAll('.popup__input-error')
    
    if (inputErrors) {
        inputErrors.forEach(error => error.classList.remove('popup__input-error_active'))
    }
}

function setEventListeners(formElement, inputSelector, submitButtonSelector, inactiveButtonClass, inputErrorClass, errorActiveClass, controlSelector) {
    const inputList = Array.from(formElement.querySelectorAll(inputSelector));
    const buttonElement = formElement.querySelector(submitButtonSelector)
    
    //устанавливает состояние кнопки submit еще до изменения инпутов
    toggleButtonState(inputList, buttonElement, inactiveButtonClass)
    //прослушки для инпутов
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            checkInputValidity(inputElement, inputErrorClass, errorActiveClass, controlSelector);
            toggleButtonState(inputList, buttonElement, inactiveButtonClass)  
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
            evt.preventDefault()
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
