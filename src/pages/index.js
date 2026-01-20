import { resetValidation, disableButton } from "../scripts/validation.js";
import { enableValidation, settings } from "../scripts/validation.js";
import "../pages/index.css";
import {
  logoImage,
  profileAvatar,
  plusIcon,
  editIcon,
  closeButton,
} from "../scripts/images.js";

//pass setting object to validation function, passed in this file
// open and close modal, modals open when esc key is pressed, when user clicks outside modal
// =========c o n s t================

// WEBPack
const avatarElement = document.querySelector(".profile__avatar");
if (avatarElement) {
  avatarElement.src = profileAvatar;
}
const logoElement = document.querySelector(".header__logo");
if (logoElement) {
  logoElement.src = logoImage;
}
const siteImages = [
  { name: "editElement", link: editIcon },
  { name: "plusElement", link: plusIcon },
  { name: "closeElement", link: closeButton },
];

siteImages.forEach((item) => {
  if (item.name === "closeElement") {
    // Handle ALL close buttons - use querySelectorAll
    const closeButtons = document.querySelectorAll(".modal__close-btn");
    closeButtons.forEach((button) => {
      const img = button.querySelector("img");
      if (img) {
        img.src = item.link;
      }
    });
  } else {
    // Handle edit and plus buttons as before
    const button = document.querySelector(
      `.profile__${item.name === "editElement" ? "edit-btn" : "add-btn"}`,
    );
    if (button) {
      const img = button.querySelector("img");
      if (img) {
        img.src = item.link;
      }
    }
  }
});

///////
const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// ---- PROFILE ELEMENTS ----
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description",
);
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile__name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile__description-input",
);

// ---- NEW POST ELEMENTS ----
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const inputLink = newPostForm.querySelector("#card__image-input");
const inputCap = newPostForm.querySelector("#profile__caption-input");

// ---- CARDS ----
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// ---- PREVIEW MODAL ----
const previewModal = document.querySelector("#preview-post-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn_preview");

const cardSubmitButton = newPostForm.querySelector(
  settings.submitButtonSelector,
);
// =========m o d a l================

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
}

// ========c a r d=================

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImgElement = cardElement.querySelector(".card__image");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  const cardDeleteBtnEl = cardElement.querySelector(".card__button-delete");

  // Fill card
  cardImgElement.src = data.link;
  cardImgElement.alt = data.name;
  cardTitleElement.textContent = data.name;

  // Like button toggle
  cardLikeBtnEl.addEventListener("click", () => {
    cardLikeBtnEl.classList.toggle("card__like-button_active");
  });

  // Delete card
  cardDeleteBtnEl.addEventListener("click", () => {
    cardElement.remove();
  });

  // Open preview modal
  cardImgElement.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// ========l i s t e n e r================

// ---- EDIT PROFILE ----
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameElement.textContent;
  editProfileDescriptionInput.value = profileDescriptionElement.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileNameElement.textContent = editProfileNameInput.value;
  profileDescriptionElement.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
});

// ---- NEW POST ----
newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const inputValues = {
    name: inputCap.value,
    link: inputLink.value,
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  closeModal(newPostModal);
  newPostForm.reset();
  disableButton(cardSubmitButton, settings);
});

// ---- PREVIEW CLOSE ----
previewCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

function closeOnEscape(evt) {
  if (evt.key !== "Escape") return;
  const openedModal = document.querySelector(".modal_is-opened");
  if (openedModal) closeModal(openedModal);
}
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {
    if (evt.target === modal) closeModal(modal);
  });
});

// ========i n i t a l - c a r d s=================

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

console.log("Rendering cards...");
enableValidation(settings);
