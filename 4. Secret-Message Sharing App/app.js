const { hash } = window.location;
const message = atob(hash.replace("#", ""));

if (message) {
  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#message-show").classList.remove("hide");

  document.querySelector("h1").innerHTML = message;
}

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  document.querySelector("#message-form").classList.add("hide");
  document.querySelector("#link-form").classList.remove("hide");

  const messageInput = document.querySelector("#message-input");
  const encypted = btoa(messageInput.value);

  const linkInput = document.querySelector("#link-input");
  linkInput.value = `${window.location}#${encypted}`;
  linkInput.select(); //Selects the input and all the text inside it
});
