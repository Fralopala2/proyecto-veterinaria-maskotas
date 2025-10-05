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

// Cargar países desde la API
async function loadCountries() {
  const countrySelect = document.getElementById("registerCountry");

  try {
    console.log("Iniciando carga de países...");

    if (countrySelect) {
      countrySelect.innerHTML = '<option value="">Cargando países...</option>';
    }

    // Intentar HTTPS primero, luego HTTP con proxy
    let data;
    try {
      console.log("Intentando cargar países con HTTPS...");
      const httpsResponse = await fetch(
        "https://54.167.110.190/api/get-countries.php"
      );
      if (httpsResponse.ok) {
        data = await httpsResponse.json();
        console.log("✅ Países cargados con HTTPS directo");
      } else {
        throw new Error("HTTPS no disponible");
      }
    } catch (httpsError) {
      console.log("HTTPS falló, usando proxy:", httpsError.message);
      data = await fetchWithProxy(
        "http://54.167.110.190/api/get-countries.php"
      );
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

// Cargar ciudades basadas en el país seleccionado
async function loadCities() {
  const countryCode = document.getElementById("registerCountry").value;
  const citySelect = document.getElementById("registerCity");

  if (!countryCode) {
    citySelect.innerHTML =
      '<option value="">Primero selecciona un país</option>';
    return;
  }

  // Mapear código si es necesario
  const mappedCountryCode = COUNTRY_CODE_MAP[countryCode] || countryCode;
  console.log(
    `Código original: ${countryCode}, Código mapeado: ${mappedCountryCode}`
  );

  try {
    console.log(
      `Cargando ciudades para país: ${countryCode} (mapeado: ${mappedCountryCode})`
    );
    citySelect.innerHTML = '<option value="">Cargando ciudades...</option>';

    // Intentar HTTPS primero, luego HTTP con proxy
    let data;
    try {
      const httpsUrl = `https://54.167.110.190/api/get-cities.php?country=${mappedCountryCode}`;
      console.log("Intentando cargar ciudades con HTTPS:", httpsUrl);

      const httpsResponse = await fetch(httpsUrl);
      if (httpsResponse.ok) {
        data = await httpsResponse.json();
        console.log("✅ Ciudades cargadas con HTTPS directo");
      } else {
        throw new Error("HTTPS no disponible");
      }
    } catch (httpsError) {
      console.log("HTTPS falló, usando proxy:", httpsError.message);
      const apiUrl = `http://54.167.110.190/api/get-cities.php?country=${mappedCountryCode}`;
      data = await fetchWithProxy(apiUrl);
    }
    console.log(
      "Respuesta completa de ciudades:",
      JSON.stringify(data, null, 2)
    );

    // La API puede devolver 'cities' o 'data' dependiendo del endpoint
    const citiesArray = data.cities || data.data || [];
    console.log("Array de ciudades extraído:", citiesArray);
    console.log("¿Es array?", Array.isArray(citiesArray));
    console.log("Longitud:", citiesArray.length);

    if (data.success && Array.isArray(citiesArray)) {
      cities = citiesArray;

      if (cities.length > 0) {
        citySelect.innerHTML =
          '<option value="">Selecciona una ciudad</option>';

        cities.forEach((city, index) => {
          // Manejar diferentes formatos de respuesta de la API
          const cityId = city.ID || city.id;
          const cityName = city.Name || city.city_name || city.name;

          console.log(`Ciudad ${index}:`, { cityId, cityName, original: city });

          if (city && cityId && cityName) {
            const option = document.createElement("option");
            option.value = cityId;
            option.textContent = cityName;
            citySelect.appendChild(option);
          }
        });

        console.log(
          `${cities.length} ciudades cargadas para ${countryCode} (${mappedCountryCode})`
        );
        showNotification(`${cities.length} ciudades cargadas`, "success");
      } else {
        // No hay ciudades para este país
        citySelect.innerHTML =
          '<option value="999">Ciudad no especificada</option>';
        console.log(
          `No se encontraron ciudades para ${countryCode} (${mappedCountryCode})`
        );
        showNotification(
          `No hay ciudades disponibles para ${countryCode}`,
          "warning"
        );
      }
    } else {
      console.error("Error en estructura de datos:", {
        success: data.success,
        isArray: Array.isArray(citiesArray),
      });
      throw new Error(
        data.message ||
          `No se encontraron ciudades para ${countryCode} (${mappedCountryCode})`
      );
    }
  } catch (error) {
    console.error("Error cargando ciudades desde API:", error);
    console.log("Intentando usar datos de respaldo...");

    // Usar datos de respaldo
    if (typeof loadFallbackCities === "function") {
      console.log("Función de respaldo encontrada, ejecutando...");
      loadFallbackCities(countryCode);
    } else {
      console.log("No se encontró función de respaldo");
      citySelect.innerHTML =
        '<option value="">Error cargando ciudades</option>';
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
            "https://54.167.110.190/api/register-user.php",
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
              "http://54.167.110.190/api/register-user.php",
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
                    "http://54.167.110.190/api/register-user.php"
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
                "No se pudo conectar con el servidor AWS. " +
                  "Esto puede deberse a limitaciones de CORS. " +
                  "Solución: Configurar HTTPS en el servidor EC2."
              );
            }
          }
        }
      } else {
        // En HTTP local, usar directamente
        console.log("Modo local - usando conexión directa...");
        const response = await fetch(
          "http://54.167.110.190/api/register-user.php",
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
