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

// Lista de proxies CORS para intentar
const CORS_PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

// Función para intentar cargar datos con múltiples proxies
async function fetchWithProxy(url) {
  const isHTTPS = window.location.protocol === "https:";
  
  if (!isHTTPS) {
    // Si estamos en HTTP (local), usar URL directa
    const response = await fetch(url);
    return await response.json();
  }

  // Si estamos en HTTPS, intentar con proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxy = CORS_PROXIES[i];
    try {
      console.log(`Intentando proxy ${i + 1}/${CORS_PROXIES.length}: ${proxy}`);
      
      const proxyURL = proxy + encodeURIComponent(url);
      const response = await fetch(proxyURL);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      let data = await response.json();
      
      // Extraer contenido según el tipo de proxy
      if (data.contents) {
        // allorigins.win format
        data = JSON.parse(data.contents);
      } else if (data.body) {
        // Algunos proxies usan 'body'
        data = JSON.parse(data.body);
      }
      
      console.log(`Éxito con proxy ${i + 1}`);
      return data;
      
    } catch (error) {
      console.log(`Proxy ${i + 1} falló:`, error.message);
      if (i === CORS_PROXIES.length - 1) {
        throw new Error(`Todos los proxies fallaron. Último error: ${error.message}`);
      }
    }
  }
}

// Cargar países desde la API
async function loadCountries() {
  const countrySelect = document.getElementById("registerCountry");
  
  try {
    console.log("Iniciando carga de países...");
    
    if (countrySelect) {
      countrySelect.innerHTML = '<option value="">Cargando países...</option>';
    }

    const data = await fetchWithProxy("http://54.167.110.190/api/get-countries.php");
    console.log("Datos recibidos:", data);

    if (data.success && data.countries) {
      countries = data.countries;

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
      
      // Ocultar advertencia si existe
      const warning = document.getElementById("mixedContentWarning");
      if (warning) {
        warning.style.display = "none";
      }
      
    } else {
      throw new Error(data.message || "No se recibieron países del servidor");
    }
  } catch (error) {
    console.error("Error cargando países:", error);
    showNotification(`Error al cargar países: ${error.message}`, "error");

    // Mostrar mensaje en el select también
    if (countrySelect) {
      countrySelect.innerHTML = '<option value="">Error cargando países</option>';
    }

    // Usar datos de respaldo como último recurso
    console.log("Intentando cargar datos de respaldo...");
    if (typeof loadFallbackCountries === 'function') {
      loadFallbackCountries();
    } else {
      // Mostrar advertencia de contenido mixto si estamos en HTTPS
      if (window.location.protocol === "https:") {
        const warning = document.getElementById("mixedContentWarning");
        if (warning) {
          warning.style.display = "block";
        }
      }
    }
  }
}

// Cargar ciudades basadas en el país seleccionado
async function loadCities() {
  const countryCode = document.getElementById("registerCountry").value;
  const citySelect = document.getElementById("registerCity");

  if (!countryCode) {
    citySelect.innerHTML = '<option value="">Primero selecciona un país</option>';
    return;
  }

  try {
    console.log(`Cargando ciudades para país: ${countryCode}`);
    citySelect.innerHTML = '<option value="">Cargando ciudades...</option>';

    const data = await fetchWithProxy(`http://54.167.110.190/api/get-cities.php?country=${countryCode}`);
    console.log("Ciudades recibidas:", data);

    // La API puede devolver 'cities' o 'data' dependiendo del endpoint
    const citiesArray = data.cities || data.data || [];
    
    if (data.success && Array.isArray(citiesArray)) {
      cities = citiesArray;
      
      if (cities.length > 0) {
        citySelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
        
        cities.forEach((city) => {
          // Manejar diferentes formatos de respuesta de la API
          const cityId = city.ID || city.id;
          const cityName = city.Name || city.city_name || city.name;
          
          if (city && cityId && cityName) {
            const option = document.createElement("option");
            option.value = cityId;
            option.textContent = cityName;
            citySelect.appendChild(option);
          }
        });
        
        console.log(`${cities.length} ciudades cargadas para ${countryCode}`);
      } else {
        // No hay ciudades para este país
        citySelect.innerHTML = '<option value="999">Ciudad no especificada</option>';
        console.log(`No se encontraron ciudades para ${countryCode}`);
      }
    } else {
      throw new Error(data.message || `No se encontraron ciudades para ${countryCode}`);
    }
  } catch (error) {
    console.error("Error cargando ciudades:", error);
    
    // Usar datos de respaldo
    if (typeof loadFallbackCities === 'function') {
      loadFallbackCities(countryCode);
    } else {
      citySelect.innerHTML = '<option value="">Error cargando ciudades</option>';
      showNotification(`Error al cargar ciudades: ${error.message}`, "error");
    }
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
