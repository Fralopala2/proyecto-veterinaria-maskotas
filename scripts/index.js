function abrirMenuMovil() {
    var menu = document.getElementById("menu-nav");
    menu.classList.toggle("responsive");
    
    // Agregar botones de autenticación al menú móvil si no existen
    if (menu.classList.contains("responsive") && !menu.querySelector('.mobile-auth-buttons')) {
        const authButtons = document.createElement('div');
        authButtons.className = 'mobile-auth-buttons';
        authButtons.innerHTML = `
            <button class="auth-btn login-btn" onclick="openLoginModal(); abrirMenuMovil();">
                <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </button>
            <button class="auth-btn register-btn" onclick="openRegisterModal(); abrirMenuMovil();">
                <i class="fas fa-user-plus"></i> Registrarse
            </button>
        `;
        menu.appendChild(authButtons);
    } else if (!menu.classList.contains("responsive")) {
        // Remover botones cuando se cierra el menú
        const mobileAuthButtons = menu.querySelector('.mobile-auth-buttons');
        if (mobileAuthButtons) {
            mobileAuthButtons.remove();
        }
    }
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
