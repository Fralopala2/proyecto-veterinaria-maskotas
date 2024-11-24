function abrirMenuMovil() {
    var menu = document.getElementById("menu-nav");
    menu.classList.toggle("responsive");
}

// Mostrar la ventana emergente de cookies después de 5 segundos
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      const cookiePopup = document.getElementById("cookie-popup");
      if (!localStorage.getItem("cookiesAccepted")) {
        cookiePopup.classList.remove("hidden");
      }
    }, 5000);
  
    const acceptCookiesButton = document.getElementById("accept-cookies");
    acceptCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true");
      const cookiePopup = document.getElementById("cookie-popup");
      cookiePopup.classList.add("hidden");
    });
  
    const rejectCookiesButton = document.getElementById("reject-cookies");
    rejectCookiesButton.addEventListener("click", function () {
      localStorage.setItem("cookiesRejected", "true");
      const cookiePopup = document.getElementById("cookie-popup");
      cookiePopup.classList.add("hidden");
    });
});
