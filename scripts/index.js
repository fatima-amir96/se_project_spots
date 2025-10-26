const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
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
  modal.classList.add("modal_is-opened"); // use class consistent with your CSS
}
function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}
/*const newPostForm = newPostModal.querySelector(".modal__form");
const newPostlinkInput = newPosteModal.querySelector("#profile__name-input");
const newPostCapInput = newPostModal.querySelector(
  "#profile__description-input"
);*/

editProfileBtn.addEventListener("click", () => {
  const profileNameEle = document.querySelector(".profile__name");
  const profileDescriptionEle = document.querySelector(".profile__description");

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

  const inputLink = newPostForm.querySelector("#new-post-link-input");
  const inputCap = newPostForm.querySelector("#new-post-caption-input");

  console.log("New Post Link:", inputLink.value);
  console.log("New Post Caption:", inputCap.value);

  closeModal(newPostModal);
});
