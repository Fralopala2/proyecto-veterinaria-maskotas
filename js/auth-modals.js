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
    console.log("Iniciando carga de países...");

    // Detectar si estamos en HTTPS (GitHub Pages) o HTTP (local)
    const isHTTPS = window.location.protocol === "https:";
    let apiURL;

    if (isHTTPS) {
      // Usar proxy CORS para GitHub Pages (sin dominio)
      apiURL =
        "https://api.allorigins.win/get?url=" +
        encodeURIComponent("http://54.167.110.190/api/get-countries.php");
    } else {
      // URL directa para desarrollo local
      apiURL = "http://54.167.110.190/api/get-countries.php";
    }

    console.log(`Usando URL: ${apiURL}`);

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log("Respuesta recibida:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    console.log("Datos recibidos:", data);

    // Si usamos proxy, extraer el contenido real
    if (isHTTPS && data.contents) {
      data = JSON.parse(data.contents);
    }

    if (data.success && data.countries) {
      countries = data.countries;
      const countrySelect = document.getElementById("registerCountry");

      if (!countrySelect) {
        throw new Error("No se encontró el elemento select de países");
      }

      countrySelect.innerHTML = '<option value="">Selecciona un país</option>';

      countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.Code;
        option.textContent = country.Name;
        countrySelect.appendChild(option);
      });

      console.log(`${countries.length} países cargados exitosamente`);
      showNotification("Países cargados correctamente", "success");
    } else {
      throw new Error(data.message || "No se recibieron países del servidor");
    }
  } catch (error) {
    console.error("Error cargando países:", error);

    // Mensaje específico para problema de Mixed Content
    let errorMessage = error.message;
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      errorMessage =
        "Error de conexión: Posible problema de Mixed Content (HTTPS/HTTP). Verifica la configuración SSL del servidor.";
    }

    showNotification(`Error al cargar países: ${errorMessage}`, "error");

    // Mostrar mensaje en el select también
    const countrySelect = document.getElementById("registerCountry");
    if (countrySelect) {
      countrySelect.innerHTML =
        '<option value="">Error: Verifica configuración SSL</option>';
    }

    // Mostrar advertencia de contenido mixto si estamos en HTTPS
    if (window.location.protocol === "https:") {
      const warning = document.getElementById("mixedContentWarning");
      if (warning) {
        warning.style.display = "block";
      }
    }
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
    console.log(`Cargando ciudades para país: ${countryCode}`);
    citySelect.innerHTML = '<option value="">Cargando ciudades...</option>';

    // Detectar protocolo y usar URL apropiada
    const isHTTPS = window.location.protocol === "https:";
    let apiURL;

    if (isHTTPS) {
      // Usar proxy CORS para GitHub Pages
      apiURL =
        "https://api.allorigins.win/get?url=" +
        encodeURIComponent(
          `http://54.167.110.190/api/get-cities.php?country=${countryCode}`
        );
    } else {
      // URL directa para desarrollo local
      apiURL = `http://54.167.110.190/api/get-cities.php?country=${countryCode}`;
    }

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    console.log("Ciudades recibidas:", data);

    // Si usamos proxy, extraer el contenido real
    if (isHTTPS && data.contents) {
      data = JSON.parse(data.contents);
    }

    if (data.success) {
      cities = data.cities;
      citySelect.innerHTML = '<option value="">Selecciona una ciudad</option>';

      cities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.ID;
        option.textContent = city.Name;
        citySelect.appendChild(option);
      });

      console.log(`${cities.length} ciudades cargadas para ${countryCode}`);
    } else {
      throw new Error(data.message || "Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error cargando ciudades:", error);
    citySelect.innerHTML = '<option value="">Error cargando ciudades</option>';

    let errorMessage = error.message;
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      errorMessage =
        "Error de conexión: Verifica configuración SSL del servidor";
    }

    showNotification(`Error al cargar ciudades: ${errorMessage}`, "error");
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

      // Usar URL apropiada según el protocolo
      const isHTTPS = window.location.protocol === "https:";
      let apiURL;

      if (isHTTPS) {
        // Para POST con FormData, necesitamos un proxy diferente
        apiURL =
          "https://cors-anywhere.herokuapp.com/http://54.167.110.190/api/register-user.php";
      } else {
        apiURL = "http://54.167.110.190/api/register-user.php";
      }

      const response = await fetch(apiURL, {
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
