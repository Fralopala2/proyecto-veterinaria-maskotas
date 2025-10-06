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
    { ID: 653, Name: "Madrid" },
    { ID: 654, Name: "Barcelona" },
    { ID: 655, Name: "Valencia" },
    { ID: 656, Name: "Sevilla" },
    { ID: 657, Name: "Zaragoza" },
    { ID: 658, Name: "Málaga" },
    { ID: 661, Name: "Murcia" },
    { ID: 662, Name: "Palma de Mallorca" },
    { ID: 660, Name: "Las Palmas de Gran Canaria" },
    { ID: 659, Name: "Bilbao" }
  ],
  "FR": [
    { ID: 2974, Name: "París" },
    { ID: 2975, Name: "Marsella" },
    { ID: 2976, Name: "Lyon" },
    { ID: 2977, Name: "Toulouse" },
    { ID: 2978, Name: "Niza" }
  ],
  "IT": [
    { ID: 1464, Name: "Roma" },
    { ID: 1465, Name: "Milán" },
    { ID: 1466, Name: "Nápoles" },
    { ID: 1467, Name: "Turín" },
    { ID: 1468, Name: "Palermo" }
  ],
  "DE": [
    { ID: 3068, Name: "Berlín" },
    { ID: 3069, Name: "Hamburgo" },
    { ID: 3070, Name: "Múnich" },
    { ID: 3071, Name: "Colonia" },
    { ID: 3072, Name: "Frankfurt" }
  ],
  "PT": [
    { ID: 2914, Name: "Lisboa" },
    { ID: 2915, Name: "Oporto" },
    { ID: 2918, Name: "Braga" },
    { ID: 2917, Name: "Coimbra" },
    { ID: 2919, Name: "Funchal" }
  ],
  "US": [
    { ID: 3793, Name: "Nueva York" },
    { ID: 3794, Name: "Los Ángeles" },
    { ID: 3795, Name: "Chicago" },
    { ID: 3796, Name: "Houston" },
    { ID: 3839, Name: "Miami" }
  ],
  "MX": [
    { ID: 2515, Name: "Ciudad de México" },
    { ID: 2516, Name: "Guadalajara" },
    { ID: 2523, Name: "Monterrey" },
    { ID: 2518, Name: "Puebla" },
    { ID: 2521, Name: "Tijuana" }
  ],
  "AR": [
    { ID: 69, Name: "Buenos Aires" },
    { ID: 71, Name: "Córdoba" },
    { ID: 72, Name: "Rosario" },
    { ID: 116, Name: "Mendoza" },
    { ID: 76, Name: "La Plata" }
  ],
  "BR": [
    { ID: 206, Name: "São Paulo" },
    { ID: 207, Name: "Rio de Janeiro" },
    { ID: 211, Name: "Brasília" },
    { ID: 208, Name: "Salvador" },
    { ID: 210, Name: "Fortaleza" }
  ],
  "CO": [
    { ID: 2257, Name: "Bogotá" },
    { ID: 2259, Name: "Medellín" },
    { ID: 2258, Name: "Cali" },
    { ID: 2260, Name: "Barranquilla" },
    { ID: 2261, Name: "Cartagena" }
  ],
  "PE": [
    { ID: 2890, Name: "Lima" },
    { ID: 2891, Name: "Arequipa" },
    { ID: 2892, Name: "Trujillo" },
    { ID: 2893, Name: "Chiclayo" },
    { ID: 2895, Name: "Iquitos" }
  ],
  "CL": [
    { ID: 554, Name: "Santiago" },
    { ID: 557, Name: "Valparaíso" },
    { ID: 562, Name: "Concepción" },
    { ID: 572, Name: "La Serena" },
    { ID: 559, Name: "Antofagasta" }
  ],
  "VE": [
    { ID: 3539, Name: "Caracas" },
    { ID: 3540, Name: "Maracaibo" },
    { ID: 3542, Name: "Valencia" },
    { ID: 3541, Name: "Barquisimeto" },
    { ID: 3545, Name: "Maracay" }
  ],
  "EC": [
    { ID: 594, Name: "Quito" },
    { ID: 593, Name: "Guayaquil" },
    { ID: 595, Name: "Cuenca" },
    { ID: 596, Name: "Machala" },
    { ID: 597, Name: "Santo Domingo" }
  ],
  "UY": [
    { ID: 3492, Name: "Montevideo" }
  ],
  "PY": [
    { ID: 2885, Name: "Asunción" },
    { ID: 2886, Name: "Ciudad del Este" },
    { ID: 2887, Name: "San Lorenzo" },
    { ID: 2888, Name: "Lambaré" },
    { ID: 2889, Name: "Fernando de la Mora" }
  ],
  "BO": [
    { ID: 194, Name: "La Paz" },
    { ID: 193, Name: "Santa Cruz" },
    { ID: 195, Name: "El Alto" },
    { ID: 196, Name: "Cochabamba" },
    { ID: 198, Name: "Sucre" }
  ],
  "CR": [
    { ID: 584, Name: "San José" }
  ],
  "PA": [
    { ID: 2882, Name: "Ciudad de Panamá" },
    { ID: 2883, Name: "San Miguelito" }
  ],
  "GT": [
    { ID: 922, Name: "Ciudad de Guatemala" },
    { ID: 923, Name: "Mixco" },
    { ID: 924, Name: "Villa Nueva" },
    { ID: 925, Name: "Quetzaltenango" }
  ],
  "HN": [
    { ID: 933, Name: "Tegucigalpa" },
    { ID: 934, Name: "San Pedro Sula" },
    { ID: 935, Name: "La Ceiba" }
  ],
  "SV": [
    { ID: 645, Name: "San Salvador" },
    { ID: 646, Name: "Santa Ana" },
    { ID: 647, Name: "Mejicanos" },
    { ID: 649, Name: "San Miguel" }
  ],
  "NI": [
    { ID: 2734, Name: "Managua" },
    { ID: 2735, Name: "León" },
    { ID: 2736, Name: "Chinandega" },
    { ID: 2737, Name: "Masaya" }
  ],
  "CU": [
    { ID: 2413, Name: "La Habana" },
    { ID: 2414, Name: "Santiago de Cuba" },
    { ID: 2415, Name: "Camagüey" },
    { ID: 2416, Name: "Holguín" },
    { ID: 2417, Name: "Santa Clara" }
  ],
  "DO": [
    { ID: 587, Name: "Santo Domingo" },
    { ID: 588, Name: "Santiago" },
    { ID: 589, Name: "La Romana" },
    { ID: 590, Name: "San Pedro de Macorís" },
    { ID: 592, Name: "Puerto Plata" }
  ],
  "PR": [
    { ID: 2919, Name: "San Juan" },
    { ID: 2920, Name: "Bayamón" },
    { ID: 2921, Name: "Ponce" },
    { ID: 2922, Name: "Carolina" },
    { ID: 2923, Name: "Caguas" }
  ],
  "GB": [
    { ID: 456, Name: "Londres" },
    { ID: 457, Name: "Birmingham" },
    { ID: 458, Name: "Glasgow" },
    { ID: 459, Name: "Liverpool" },
    { ID: 460, Name: "Edimburgo" }
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