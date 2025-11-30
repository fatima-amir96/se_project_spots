console.log("working");

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// ---------------- ERROR HANDLING ----------------

const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  errorMessageElement.textContent = errorMessage;

  inputElement.classList.add(config.inputErrorClass);
  errorMessageElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  errorMessageElement.textContent = "";

  inputElement.classList.remove(config.inputErrorClass);
  errorMessageElement.classList.remove(config.errorClass);
};

const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// ---------------- BUTTON HANDLING ----------------

const hasInvalidInput = (inputList) =>
  inputList.some((input) => !input.validity.valid);

const toggleButtonState = (inputList, buttonElement, config) => {
  const invalid = hasInvalidInput(inputList);

  buttonElement.disabled = invalid;
  buttonElement.classList.toggle(config.inactiveButtonClass, invalid);
};

const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

// ---------------- RESET VALIDATION ----------------

const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((input) => hideInputError(formElement, input, config));

  const submitButton = formElement.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, submitButton, config);
};

// ---------------- SET EVENT LISTENERS ----------------

const setEventListeners = (formElement, config) => {
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );

  // Initial button state
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

// ---------------- ENABLE VALIDATION ----------------

const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

enableValidation(settings);
