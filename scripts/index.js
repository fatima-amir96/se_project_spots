// ======c a l l===================

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

const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
/*const editProfileForm = document.forms["editProfileForm"]*/
const editProfileNameInput = editProfileModal.querySelector(
  "#profile__name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile__description-input"
);

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-post-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn_preview");

// ======f u n c t i o n===================

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitleElement = cardElement.querySelector(".card__title");
  const cardImgElement = cardElement.querySelector(".card__image");

  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  console.log("Found like button:", cardLikeBtnEl);

  cardLikeBtnEl.addEventListener("click", () => {
    console.log("Like button clicked!");
    cardLikeBtnEl.classList.toggle("card__like-button_active");
  });

  const cardDeleteBtnEl = cardElement.querySelector(".card__button-delete");
  cardDeleteBtnEl.addEventListener("click", () => {
    cardDeleteBtnEl.closest(".card").remove();
  });

  function openModal(modal) {
    modal.classList.add("modal_is-opened");
  }
  function closeModal(modal) {
    modal.classList.remove("modal_is-opened");
  }

  // ======l i s t e n e r===================

  editProfileBtn.addEventListener("click", () => {
    editProfileNameInput.value = profileNameElement.textContent;
    editProfileDescriptionInput.value = profileDescriptionElement.textContent;

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

  newPostBtn.addEventListener("click", () => {
    openModal(newPostModal);
  });

  newPostCloseBtn.addEventListener("click", () => {
    closeModal(newPostModal);
  });

  const inputLink = newPostForm.querySelector("#card__image-input");
  const inputCap = newPostForm.querySelector("#profile__caption-input");

  newPostForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    console.log("New Post Link:", inputLink.value); // then use them
    console.log("New Post Caption:", inputCap.value); // then use them

    const inputValues = {
      name: inputCap.value,
      link: inputLink.value,
    };
    const cardElement = getCardElement(inputValues);

    cardsList.prepend(cardElement);

    closeModal(newPostModal);
  });
  cardImgElement.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;

    openModal(previewModal);
  });

  previewCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
  });

  cardImgElement.src = data.link;
  cardImgElement.alt = data.name;
  cardTitleElement.textContent = data.name;

  return cardElement;
}

// =========================
initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardsList.append(cardElement);
});

console.log("Rendering cards...");
