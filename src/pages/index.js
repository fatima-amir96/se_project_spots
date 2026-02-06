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
import Api from "../utils/Api.js";

// =========c o n s t================

// A P I //
const api = new Api("https://around-api.en.tripleten-services.com/v1", {
  authorization: "52dc38e5-9660-439c-8dd3-704e75b75fe7",
  "Content-Type": "application/json",
});

let currentUserId;

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log(cards);
    console.log(userInfo);

    currentUserId = userInfo._id;

    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileAvatar.src = userInfo.avatar;
    profileNameElement.textContent = userInfo.name;
    profileDescriptionElement.textContent = userInfo.about;
  })
  .catch((err) => {
    console.error("Error getting cards:", err);
  });

//we need a get user info function using api AND to implement Post/ cards.
// Currently Cards are broken images but do upload and save using form

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

//-- Delete Form --
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

let selectedCard;
let selectedCardId;

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const deleteBtn = evt.submitter;
  deleteBtn.textContent = "Deleting...";
  deleteBtn.disabled = true;

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      deleteBtn.textContent = "Delete";
      deleteBtn.disabled = false;
    });
}

deleteForm.addEventListener("submit", handleDeleteSubmit);

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModal.addEventListener("click", (evt) => {
  if (evt.target === deleteModal) {
    closeModal(deleteModal);
  }
});

// =========OPEN / CLOSE================

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
  cardLikeBtnEl.addEventListener("click", (evt) => {
    likeStatus(evt, data._id);
  });
  cardLikeBtnEl.addEventListener("click", (evt) => {
    evt.target.classList.toggle("card__like-button_active");
  });

  // Delete card
  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  // Open preview modal
  cardImgElement.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  //todo if card is liked set active class on the card

  return cardElement;
}

function likeStatus(evt, cardId) {
  const likeBtn = evt.target;
  const isLiked = likeBtn.classList.contains("card__like-button_active");

  const apiCall = isLiked ? api.removeLike(cardId) : api.addLike(cardId);

  apiCall
    .then(() => {
      likeBtn.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

// ========A V A T A R=============== | NEW |

// NEW Avatar Modals
const avatarModalBtn = document.querySelector("#profile-avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const profileAvatarElement = document.querySelector(".profile__avatar");

//-- open/close --
avatarModalBtn.addEventListener("click", () => {
  avatarInput.value = profileAvatarElement.src;
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

//--- Form ---
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  submitBtn.disabled = true;

  api
    .editAvatarUserInfo({
      avatar: avatarInput.value,
    })
    .then((data) => {
      profileAvatarElement.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
      console.log("Avatar response:", data);
    })

    .catch((err) => {
      console.error(`Error updating avatar: ${err}`);
    })
    .finally(() => {
      submitBtn.textContent = "Save";
      submitBtn.disabled = false;
    });
});

// -- Submit --
function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  submitBtn.disabled = true;

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
      submitBtn.disabled = false;
    });
}
// add event lisener

// ========l i s t e n e r s================
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

editProfileForm.addEventListener("submit", handleEditProfileFormSubmit);

editProfileCloseBtn.addEventListener("click", () => {
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

/*initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});*/

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

console.log("Rendering cards...");
enableValidation(settings);
