// Datos de respaldo para países más comunes
const FALLBACK_COUNTRIES = [
  { Code: "ES", Name: "España" },
  { Code: "FR", Name: "Francia" },
  { Code: "IT", Name: "Italia" },
  { Code: "PT", Name: "Portugal" },
  { Code: "DE", Name: "Alemania" },
  { Code: "GB", Name: "Reino Unido" },
  { Code: "US", Name: "Estados Unidos" },
  { Code: "MX", Name: "México" },
  { Code: "AR", Name: "Argentina" },
  { Code: "BR", Name: "Brasil" },
  { Code: "CO", Name: "Colombia" },
  { Code: "PE", Name: "Perú" },
  { Code: "CL", Name: "Chile" },
  { Code: "VE", Name: "Venezuela" },
  { Code: "EC", Name: "Ecuador" },
  { Code: "UY", Name: "Uruguay" },
  { Code: "PY", Name: "Paraguay" },
  { Code: "BO", Name: "Bolivia" },
  { Code: "CR", Name: "Costa Rica" },
  { Code: "PA", Name: "Panamá" },
  { Code: "GT", Name: "Guatemala" },
  { Code: "HN", Name: "Honduras" },
  { Code: "SV", Name: "El Salvador" },
  { Code: "NI", Name: "Nicaragua" },
  { Code: "CU", Name: "Cuba" },
  { Code: "DO", Name: "República Dominicana" },
  { Code: "PR", Name: "Puerto Rico" }
];

const FALLBACK_CITIES = {
  "ES": [
    { ID: 1, Name: "Madrid" },
    { ID: 2, Name: "Barcelona" },
    { ID: 3, Name: "Valencia" },
    { ID: 4, Name: "Sevilla" },
    { ID: 5, Name: "Zaragoza" },
    { ID: 6, Name: "Málaga" },
    { ID: 7, Name: "Murcia" },
    { ID: 8, Name: "Palma de Mallorca" },
    { ID: 9, Name: "Las Palmas de Gran Canaria" },
    { ID: 10, Name: "Bilbao" }
  ],
  "FR": [
    { ID: 11, Name: "París" },
    { ID: 12, Name: "Marsella" },
    { ID: 13, Name: "Lyon" },
    { ID: 14, Name: "Toulouse" },
    { ID: 15, Name: "Niza" }
  ],
  "IT": [
    { ID: 16, Name: "Roma" },
    { ID: 17, Name: "Milán" },
    { ID: 18, Name: "Nápoles" },
    { ID: 19, Name: "Turín" },
    { ID: 20, Name: "Palermo" }
  ],
  "US": [
    { ID: 21, Name: "Nueva York" },
    { ID: 22, Name: "Los Ángeles" },
    { ID: 23, Name: "Chicago" },
    { ID: 24, Name: "Houston" },
    { ID: 25, Name: "Miami" }
  ],
  "MX": [
    { ID: 26, Name: "Ciudad de México" },
    { ID: 27, Name: "Guadalajara" },
    { ID: 28, Name: "Monterrey" },
    { ID: 29, Name: "Puebla" },
    { ID: 30, Name: "Tijuana" }
  ]
};

// Función para usar datos de respaldo
function loadFallbackCountries() {
  console.log("🔄 Usando datos de respaldo para países");
  
  countries = FALLBACK_COUNTRIES;
  const countrySelect = document.getElementById("registerCountry");
  
  if (countrySelect) {
    countrySelect.innerHTML = '<option value="">Selecciona un país</option>';
    
    FALLBACK_COUNTRIES.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.Code;
      option.textContent = country.Name;
      countrySelect.appendChild(option);
    });
    
    showNotification("Países cargados (modo offline)", "warning");
    console.log("✅ Datos de respaldo de países cargados");
  }
}

function loadFallbackCities(countryCode) {
  console.log(`🔄 Usando datos de respaldo para ciudades de ${countryCode}`);
  console.log("Datos disponibles:", Object.keys(FALLBACK_CITIES));
  
  const citySelect = document.getElementById("registerCity");
  const countryCities = FALLBACK_CITIES[countryCode] || [];
  
  if (citySelect) {
    if (countryCities.length > 0) {
      citySelect.innerHTML = '<option value="">Selecciona una ciudad</option>';
      
      countryCities.forEach((city) => {
        const option = document.createElement("option");
        option.value = city.ID;
        option.textContent = city.Name;
        citySelect.appendChild(option);
      });
      console.log(`✅ ${countryCities.length} ciudades de respaldo cargadas para ${countryCode}`);
    } else {
      citySelect.innerHTML = '<option value="999">Ciudad no especificada</option>';
      console.log(`⚠️ No hay ciudades de respaldo para ${countryCode}`);
    }
  }
}