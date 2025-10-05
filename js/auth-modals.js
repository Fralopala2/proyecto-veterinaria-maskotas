// Funciones para manejar los modales de autenticación

// Variables globales
let countries = [];
let cities = [];

// Funciones para abrir/cerrar modales
function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
  document.body.style.overflow = "auto";
}

function openRegisterModal() {
  document.getElementById("registerModal").style.display = "block";
  document.body.style.overflow = "hidden";
  loadCountries(); // Cargar países al abrir el modal
}

function closeRegisterModal() {
  document.getElementById("registerModal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Funciones para cambiar entre modales
function switchToRegister() {
  closeLoginModal();
  openRegisterModal();
}

function switchToLogin() {
  closeRegisterModal();
  openLoginModal();
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function (event) {
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");

  if (event.target === loginModal) {
    closeLoginModal();
  }
  if (event.target === registerModal) {
    closeRegisterModal();
  }
};

// Cargar países desde la API
async function loadCountries() {
  try {
    const response = await fetch("https://54.167.110.190/api/get-countries.php");
    const data = await response.json();

    if (data.success) {
      countries = data.countries;
      const countrySelect = document.getElementById("registerCountry");
      countrySelect.innerHTML = '<option value="">Selecciona un país</option>';

      countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.Code;
        option.textContent = country.Name;
        countrySelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error cargando países:", error);
    showNotification("Error al cargar países", "error");
  }
}

// Cargar ciudades basadas en el país seleccionado
async function loadCities() {
  const countryCode = document.getElementById("registerCountry").value;
  const citySelect = document.getElementById("registerCity");

  if (!countryCode) {
    citySelect.innerHTML =
      '<option value="">Primero selecciona un país</option>';
    return;
  }

  try {
    citySelect.innerHTML = '<option value="">Cargando ciudades...</option>';

    const response = await fetch(`https://54.167.110.190/api/get-cities.php?country=${countryCode}`);
    const data = await response.json();

    if (data.success) {
      cities = data.cities;
      citySelect.innerHTML = '<option value="">Selecciona una ciudad</option>';

      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.ID;
        option.textContent = city.Name;
        citySelect.appendChild(option);
      });
    } else {
      citySelect.innerHTML =
        '<option value="">Error cargando ciudades</option>';
    }
  } catch (error) {
    console.error("Error cargando ciudades:", error);
    citySelect.innerHTML = '<option value="">Error cargando ciudades</option>';
  }
}

// Manejar el formulario de registro
document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      showNotification(
        "La contraseña debe tener al menos 6 caracteres",
        "error"
      );
      return;
    }

    try {
      // Mostrar loading
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
      submitBtn.disabled = true;

      const response = await fetch("https://54.167.110.190/api/register-user.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showNotification(
          "¡Cuenta creada exitosamente! Bienvenido a MASK!OTAS",
          "success"
        );
        closeRegisterModal();
        this.reset();

        // Opcional: Auto-login o redirigir
        setTimeout(() => {
          // Aquí podrías redirigir a una página de perfil o dashboard
        }, 2000);
      } else {
        showNotification(result.message || "Error al crear la cuenta", "error");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      showNotification("Error de conexión. Inténtalo de nuevo.", "error");
    } finally {
      // Restaurar botón
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

// Manejar el formulario de login (placeholder - necesitarías implementar la API)
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Por ahora solo mostrar mensaje
    showNotification("Función de login en desarrollo", "info");

    // Aquí implementarías la lógica de login cuando tengas la API correspondiente
  });

// Función para mostrar notificaciones
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Agregar al DOM
  document.body.appendChild(notification);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "fa-check-circle";
    case "error":
      return "fa-exclamation-circle";
    case "warning":
      return "fa-exclamation-triangle";
    default:
      return "fa-info-circle";
  }
}
