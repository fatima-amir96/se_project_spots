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

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", () => {
  const profileNameElement = document.querySelector(".profile__name");
  const profileDescriptionElement = document.querySelector(
    ".profile__description"
  );

  editProfileNameInput.value = profileNameEle.textContent;
  editProfileDescriptionInput.value = profileDescriptionEle.textContent;

  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const profileNameEle = document.querySelector(".profile__name");
  const profileDescriptionEle = document.querySelector(".profile__description");

  profileNameEle.textContent = editProfileNameInput.value;
  profileDescriptionEle.textContent = editProfileDescriptionInput.value;

  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const inputLink = newPostForm.querySelector("#card__image-input");
  const inputCap = newPostForm.querySelector("#profile__caption-input");

  console.log("New Post Link:", inputLink.value);
  console.log("New Post Caption:", inputCap.value);

  closeModal(newPostModal);
});
