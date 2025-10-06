// Funciones para manejar los modales de autenticación

// Variables globales
let countries = [];
let cities = [];

// Configuración de API
const API_CONFIG = {
  SERVER_IP: '107.21.199.133',
  getApiUrl: function(endpoint) {
    const isGitHubPages = window.location.hostname === 'fralopala2.github.io';
    const isHTTPS = window.location.protocol === 'https:';
    
    // Si estamos en GitHub Pages o HTTPS, intentar HTTPS primero
    const protocol = (isGitHubPages || isHTTPS) ? 'https:' : 'http:';
    return `${protocol}//${this.SERVER_IP}${endpoint}`;
  }
};

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
  "https://api.allorigins.win/get?url=",
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?quest=",
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
        throw new Error(
          `Todos los proxies fallaron. Último error: ${error.message}`
        );
      }
    }
  }
}

// Cargar países desde la API (optimizado para usar datos de respaldo primero)
async function loadCountries() {
  const countrySelect = document.getElementById("registerCountry");

  try {
    console.log("🚀 Carga rápida: Usando datos de respaldo primero...");

    if (countrySelect) {
      countrySelect.innerHTML = '<option value="">Cargando países...</option>';
    }

    // OPTIMIZACIÓN: Usar datos de respaldo primero para velocidad
    if (typeof loadFallbackCountries === "function") {
      console.log("✅ Cargando datos de respaldo inmediatamente");
      loadFallbackCountries();
      return; // Salir temprano, ya no necesitamos cargar desde API
    }

    // Solo si no hay datos de respaldo, intentar API (este código quedará como backup)
    let data;
    try {
      console.log("Intentando cargar países con HTTPS...");
      const httpsResponse = await fetch(
        API_CONFIG.getApiUrl("/api/get-countries.php"),
        { timeout: 3000 } // Timeout de 3 segundos
      );
      if (httpsResponse.ok) {
        data = await httpsResponse.json();
        console.log("✅ Países cargados con HTTPS directo");
      } else {
        throw new Error("HTTPS no disponible");
      }
    } catch (httpsError) {
      console.log("HTTPS falló:", httpsError.message);
      throw httpsError; // No usar proxies, ir directo a datos de respaldo
    }
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
      countrySelect.innerHTML =
        '<option value="">Error cargando países</option>';
    }

    // Usar datos de respaldo como último recurso
    console.log("Intentando cargar datos de respaldo...");
    if (typeof loadFallbackCountries === "function") {
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

// Mapeo de códigos de país (algunos países usan códigos diferentes en diferentes APIs)
const COUNTRY_CODE_MAP = {
  ES: "ESP", // España
  US: "USA", // Estados Unidos
  FR: "FRA", // Francia
  DE: "DEU", // Alemania
  IT: "ITA", // Italia
  GB: "GBR", // Reino Unido
  PT: "PRT", // Portugal
};

// Cargar ciudades basadas en el país seleccionado (optimizado)
async function loadCities() {
  const countryCode = document.getElementById("registerCountry").value;
  const citySelect = document.getElementById("registerCity");

  if (!countryCode) {
    citySelect.innerHTML =
      '<option value="">Primero selecciona un país</option>';
    return;
  }

  console.log(`🚀 Carga rápida de ciudades para: ${countryCode}`);
  citySelect.innerHTML = '<option value="">Cargando ciudades...</option>';

  // OPTIMIZACIÓN: Usar datos de respaldo directamente
  if (typeof loadFallbackCities === "function") {
    console.log("✅ Usando datos de respaldo inmediatamente");
    loadFallbackCities(countryCode);
    return; // Salir temprano
  }

  // Este código solo se ejecuta si no hay datos de respaldo
  try {
    const mappedCountryCode = COUNTRY_CODE_MAP[countryCode] || countryCode;
    const response = await fetch(
      API_CONFIG.getApiUrl(`/api/get-cities.php?country=${mappedCountryCode}`),
      { 
        mode: 'cors',
        timeout: 2000 // Timeout de 2 segundos
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const citiesArray = data.cities || data.data || [];
      
      if (data.success && Array.isArray(citiesArray) && citiesArray.length > 0) {
        cities = citiesArray;
        citySelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
        citiesArray.forEach(city => {
          const option = document.createElement("option");
          option.value = city.ID;
          option.textContent = city.Name;
          citySelect.appendChild(option);
        });
        console.log(`✅ ${citiesArray.length} ciudades cargadas exitosamente`);
        return;
      }
    }
    throw new Error("No se pudieron cargar las ciudades");
  } catch (error) {
    console.error("Error cargando ciudades desde API:", error);
    
    // Usar datos de respaldo como fallback
    if (typeof loadFallbackCities === "function") {
      console.log("✅ Usando datos de respaldo para ciudades");
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

    // Mostrar loading
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    try {
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
      submitBtn.disabled = true;

      console.log("Iniciando registro de usuario...");
      console.log("Datos del formulario:", Object.fromEntries(formData));

      // Intentar registro real en la base de datos AWS
      const isHTTPS = window.location.protocol === "https:";
      let result;

      console.log("Enviando datos a la API de AWS...");
      console.log("Protocolo:", isHTTPS ? "HTTPS" : "HTTP");

      if (isHTTPS) {
        // En HTTPS (GitHub Pages), intentar múltiples estrategias
        console.log("Intentando registro desde GitHub Pages...");

        let registrationSuccess = false;

        // Estrategia 1: Intentar HTTPS primero, luego HTTP
        try {
          console.log("Estrategia 1: Intentando HTTPS...");
          const httpsResponse = await fetch(
            "https://107.21.199.133/api/register-user.php",
            {
              method: "POST",
              body: formData,
              mode: "cors",
            }
          );

          if (httpsResponse.ok) {
            result = await httpsResponse.json();
            registrationSuccess = true;
            console.log("✅ Éxito con HTTPS directo");
          } else {
            throw new Error(`HTTPS error: ${httpsResponse.status}`);
          }
        } catch (httpsError) {
          console.log("HTTPS falló, intentando HTTP:", httpsError.message);

          try {
            const directResponse = await fetch(
              "http://107.21.199.133/api/register-user.php",
              {
                method: "POST",
                body: formData,
                mode: "cors",
              }
            );

            if (directResponse.ok) {
              result = await directResponse.json();
              registrationSuccess = true;
              console.log("✅ Éxito con fetch directo");
            } else {
              throw new Error(`HTTP ${directResponse.status}`);
            }
          } catch (directError) {
            console.log("❌ Fetch directo falló:", directError.message);

            // Estrategia 2: Usar proxy con URLSearchParams
            try {
              console.log("Estrategia 2: Usando proxy CORS...");

              // Convertir FormData a URLSearchParams
              const params = new URLSearchParams();
              for (const [key, value] of formData.entries()) {
                params.append(key, value);
              }

              console.log("Parámetros a enviar:", params.toString());

              const proxyResponse = await fetch(
                "https://api.allorigins.win/raw?url=" +
                  encodeURIComponent(
                    "http://107.21.199.133/api/register-user.php"
                  ),
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: params,
                }
              );

              console.log(
                "Respuesta del proxy:",
                proxyResponse.status,
                proxyResponse.statusText
              );

              if (proxyResponse.ok) {
                const responseText = await proxyResponse.text();
                console.log("Texto de respuesta:", responseText);

                // Intentar parsear como JSON
                try {
                  result = JSON.parse(responseText);
                  registrationSuccess = true;
                  console.log("✅ Éxito con proxy CORS");
                } catch (parseError) {
                  console.error("Error parsing JSON:", parseError);
                  console.log("Respuesta cruda:", responseText);
                  throw new Error("Respuesta del servidor no válida");
                }
              } else {
                throw new Error(
                  `Proxy error: ${proxyResponse.status} ${proxyResponse.statusText}`
                );
              }
            } catch (proxyError) {
              console.error("❌ Proxy también falló:", proxyError.message);
              throw new Error(
                "🚨 El servidor AWS no está disponible en este momento. " +
                  "Esto puede deberse a que la instancia EC2 esté apagada o la IP haya cambiado. " +
                  "Por favor, contacta al administrador del sistema."
              );
            }
          }
        }
      } else {
        // En HTTP local, usar directamente
        console.log("Modo local - usando conexión directa...");
        const response = await fetch(
          "http://107.21.199.133/api/register-user.php",
          {
            method: "POST",
            body: formData,
          }
        );

        console.log(
          "Respuesta del servidor:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error del servidor:", errorText);
          throw new Error(
            `Error del servidor: ${response.status} ${response.statusText}`
          );
        }

        result = await response.json();
      }

      console.log("Resultado del registro:", result);

      if (result && result.success) {
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
        const errorMessage = result?.message || "Error al crear la cuenta";
        console.error("Error en el registro:", errorMessage);
        showNotification(errorMessage, "error");
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

// Manejar el formulario de login
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      showNotification("Por favor completa todos los campos", "error");
      return;
    }

    try {
      // Mostrar loading
      const submitBtn = document.querySelector("#loginForm button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
      submitBtn.disabled = true;

      // Intentar login
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      // Obtener URL de API según el entorno
      const apiUrl = API_CONFIG.getApiUrl('/api/login-user.php');

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        mode: 'cors'
      });

      const result = await response.json();

      if (result.success) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        showNotification("¡Bienvenido " + result.user.username + "!", "success");
        closeLoginModal();
        
        // Actualizar interfaz para mostrar usuario logueado
        updateUIForLoggedUser(result.user);
        
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Error en login:', error);
      showNotification("Error: " + error.message, "error");
    } finally {
      // Restaurar botón
      const submitBtn = document.querySelector("#loginForm button[type='submit']");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
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

// Función para actualizar la interfaz cuando el usuario está logueado
function updateUIForLoggedUser(user) {
  const authButtons = document.querySelector('.auth-buttons');
  if (authButtons) {
    authButtons.innerHTML = `
      <div class="user-info">
        <span class="welcome-text">¡Hola, ${user.username}!</span>
        <button class="auth-btn logout-btn" onclick="logout()">
          <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>
    `;
  }
}

// Función para cerrar sesión
function logout() {
  localStorage.removeItem('currentUser');
  showNotification("Sesión cerrada correctamente", "info");
  
  // Restaurar botones originales
  const authButtons = document.querySelector('.auth-buttons');
  if (authButtons) {
    authButtons.innerHTML = `
      <button class="auth-btn login-btn" onclick="openLoginModal()">
        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
      </button>
      <button class="auth-btn register-btn" onclick="openRegisterModal()">
        <i class="fas fa-user-plus"></i> Registrarse
      </button>
    `;
  }
}

// Verificar si hay usuario logueado al cargar la página
function checkLoggedUser() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      updateUIForLoggedUser(user);
    } catch (e) {
      console.error('Error parsing user data:', e);
      localStorage.removeItem('currentUser');
    }
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', checkLoggedUser);

// Función de utilidad para desarrolladores - ver registros pendientes
function showPendingRegistrations() {
  const pending = JSON.parse(
    localStorage.getItem("pendingRegistrations") || "[]"
  );
  console.log("Registros pendientes:", pending);
  return pending;
}

// Función de utilidad para desarrolladores - limpiar registros pendientes
function clearPendingRegistrations() {
  localStorage.removeItem("pendingRegistrations");
  console.log("Registros pendientes eliminados");
}

// Hacer las funciones disponibles globalmente para debugging
window.showPendingRegistrations = showPendingRegistrations;
window.clearPendingRegistrations = clearPendingRegistrations;
