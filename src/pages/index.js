import { resetValidation } from "../scripts/validation.js";
import { enableValidation, settings } from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/Api.js";

// ========= API =========
const api = new Api("https://around-api.en.tripleten-services.com/v1", {
  authorization: "52dc38e5-9660-439c-8dd3-704e75b75fe7",
  "Content-Type": "application/json",
});

let currentUserId; // Declare this variable

// ---- PROFILE ELEMENTS ----
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description",
);
const profileAvatarElement = document.querySelector(".profile__avatar");

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

// ---- NEW POST ----
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const inputLink = newPostForm.querySelector("#card__image-input");
const inputCap = newPostForm.querySelector("#profile__caption-input");

// ---- CARDS ----
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// ---- PREVIEW ----
const previewModal = document.querySelector("#preview-post-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn_preview");

// ---- DELETE ----
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

let selectedCard;
let selectedCardId;

// ========= INITIAL LOAD =========
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    currentUserId = userInfo._id;

    profileNameElement.textContent = userInfo.name;
    profileDescriptionElement.textContent = userInfo.about;
    profileAvatarElement.src = userInfo.avatar;

    cards.forEach((item) => {
      cardsList.append(getCardElement(item));
    });
  })
  .catch(console.error);

// ========= MODALS =========
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
}

function closeOnEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

// ========= CARDS =========
function getCardElement(data) {
  const card = cardTemplate.content.querySelector(".card").cloneNode(true);
  const img = card.querySelector(".card__image");
  const title = card.querySelector(".card__title");
  const likeBtn = card.querySelector(".card__like-button");
  const deleteBtn = card.querySelector(".card__button-delete");

  console.log("currentUserId:", currentUserId);
  /*const isLiked =
    Array.isArray(data.likes) &&
    data.isLiked.some((user) => user._id === currentUserId); //.some is not working here

  if (isLiked) {
    likeBtn.classList.add("card__like-button_active");
  }
    
likeBtn.classList.toggle("card__like-button_active", isLiked);*/

  const isInitiallyLiked = data.isLiked;
  //remove isLIked doesnt
  likeBtn.classList.toggle("card__like-button_active", isInitiallyLiked);

  img.src = data.link;
  img.alt = data.name;
  title.textContent = data.name;

  img.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  deleteBtn.addEventListener("click", () => {
    selectedCard = card;
    selectedCardId = data._id;
    openModal(deleteModal);
    console.log("Selected ID:", selectedCardId);
  });

  //likeBtn.addEventListener(("click"), (evt) ==> handleLike(evt, data._id));
  //steps from memory:1) check if card isLiked, was it initallyliked?
  // 3)toggle between like and unlike 4)update card 5) send update to server
  // 6) recall like
  likeBtn.addEventListener("click", () => {
    const isLiked = likeBtn.classList.contains("card__like-button_active");

    api
      .likeStatus({
        id: data._id,
        isLiked: isLiked,
      })
      .then((updatedCard) => {
        likeBtn.classList.toggle(
          "card__like-button_active",
          updatedCard.isLiked,
        );
      })
      .catch(console.error);
  });

  return card;
}

// ========= DELETE =========
const cancelBtn = deleteModal.querySelector(".modal__cancel-btn");

cancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const btn = evt.submitter;
  btn.textContent = "Deleting...";
  btn.disabled = true;

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
      btn.disabled = false;
    })
    .finally(() => {
      btn.textContent = "Delete";
    });
});

deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));

// ========= EDIT PROFILE =========
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

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  btn.textContent = "Saving...";
  btn.disabled = true;

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
      btn.textContent = "Save";
      btn.disabled = false;
    });
});

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal),
);

// ========= NEW POST =========
newPostBtn.addEventListener("click", () => {
  //resetValidation(newPostForm, [inputLink, inputCap], settings);

  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  btn.textContent = "Saving...";
  btn.disabled = true;

  api
    .createNewPost({
      name: inputCap.value,
      link: inputLink.value,
    })
    .then((cardData) => {
      cardsList.prepend(getCardElement(cardData));
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      btn.textContent = "Save";
      btn.disabled = false;
    });
});

// ========= AVATAR =========
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarBtn = document.querySelector("#profile-avatar-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");

avatarBtn.addEventListener("click", () => {
  avatarInput.value = profileAvatarElement.src;
  resetValidation(avatarForm, [avatarInput], settings);
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  btn.textContent = "Saving...";
  btn.disabled = true;

  api
    .editAvatarUserInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarElement.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      btn.textContent = "Save";
      btn.disabled = false;
    });
});

avatarCloseBtn.addEventListener("click", () => closeModal(avatarModal));

// ========= PREVIEW =========
previewCloseBtn.addEventListener("click", () => closeModal(previewModal));

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

console.log("Rendering cards...");
enableValidation(settings);
