## Proyecto Veterinaria MASK!OTAS

Bienvenido al repositorio **proyecto-veterinaria-maskotas**. Este proyecto corresponde a una página web desarrollada para el proyecto intermodular del Grado de Desarrollo de Aplicaciones Web (DAW).

MASK!OTAS es una clínica veterinaria moderna que ofrece servicios completos para el cuidado de mascotas, incluyendo consultas, vacunación, peluquería y un sistema avanzado de gestión de usuarios con análisis de datos.

<p align="center">
  <img width="300" height="300" alt="imagen" src="https://github.com/user-attachments/assets/6bef0ed6-9a7d-44fe-96ec-5599a94dfce8" />
</p>

## 🚀 Funcionalidades Principales

### 🌐 Sitio Web Corporativo

- **Página principal** con hero section y vídeo de fondo
- **Sección de servicios** (consultas, vacunación, peluquería)
- **Blog** con consejos y tips para mascotas
- **Testimonios** de clientes
- **Sistema de newsletter** para suscripciones
- **Formulario de contacto** y reserva de citas
- **Diseño responsive** adaptado a móviles y tablets
- **Soporte multiidioma** (español/inglés)
- **Sistema de cookies** con consentimiento RGPD

### 👥 Sistema de Autenticación y Registro

- **Modales de registro e inicio de sesión** integrados en la navbar
- **Registro de usuarios** con selección de país y ciudad
- **Validación de formularios** en tiempo real
- **Sistema de notificaciones** elegantes
- **Integración con base de datos** mundial de países y ciudades
- **Tracking automático** de conexiones de usuarios

### 📊 Dashboard Administrativo y Análisis de Datos

- **Panel de control** con estadísticas en tiempo real
- **Stored procedures** avanzados para análisis de datos:
  - Usuarios por país y ciudad
  - País con más usuarios registrados
  - Tiempo promedio de conexión por país
  - Análisis de concentración de usuarios por ciudades
- **Visualización de datos** con tablas interactivas
- **Actualización automática** cada 5 minutos
- **API REST** para consulta de datos

### 🗄️ Base de Datos y Backend

- **Base de datos MariaDB** con integración de world database
- **Stored procedures** complejos para análisis estadístico
- **APIs RESTful** para gestión de datos
- **Sistema de tracking** de conexiones de usuarios
- **Gestión de sesiones** y tiempo de actividad

## 🛠️ Tecnologías Utilizadas

### Frontend

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con Flexbox y Grid
- **JavaScript ES6+** - Interactividad y funcionalidades dinámicas
- **Font Awesome** - Iconografía
- **Google Translate Widget** - Traducción automática

### Backend

- **PHP 8.0+** - Lógica del servidor
- **MariaDB/MySQL** - Base de datos relacional
- **Apache/Nginx** - Servidor web

### Infraestructura

- **AWS EC2** - Hosting en la nube
- **Amazon Linux** - Sistema operativo del servidor
- **SSL/HTTPS** - Seguridad de conexiones

## 📁 Estructura del Proyecto

```
proyecto-veterinaria-maskotas/
├── index.html                 # Página principal
├── servicios.html            # Página de servicios
├── citas.html               # Reserva de citas
├── contacto.html            # Formulario de contacto
├── admin-dashboard.html     # Dashboard administrativo
├── style.css               # Estilos principales
├── scripts/
│   └── index.js            # JavaScript principal
├── js/
│   ├── auth-modals.js      # Sistema de autenticación
│   └── connection-tracker.js # Tracking de conexiones
├── api/
│   ├── dashboard-data.php   # API del dashboard
│   ├── register-user.php    # Registro de usuarios
│   ├── get-countries.php    # API de países
│   ├── get-cities.php       # API de ciudades
│   └── update-connection-end.php # Tracking de conexiones
├── includes/
│   └── DatabaseConnection.php # Clase de conexión a BD
├── database-setup/
│   ├── create-users-table.sql # Estructura de tabla usuarios
│   ├── create-easy-stored-procedures.sql # Procedures básicos
│   └── create-difficult-stored-procedures.sql # Procedures avanzados
├── config/
│   └── database.example.php # Configuración de ejemplo
└── DATABASE_SETUP.md       # Guía de instalación de BD
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- PHP 8.0 o superior
- MariaDB/MySQL 5.7 o superior
- Servidor web (Apache/Nginx)
- Extensiones PHP: mysqli, json

### Instalación Local

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/proyecto-veterinaria-maskotas.git
cd proyecto-veterinaria-maskotas
```

2. **Configurar la base de datos**

```bash
# Descargar e importar world database
# Ejecutar scripts SQL en database-setup/
mysql -u root -p < database-setup/create-users-table.sql
mysql -u root -p < database-setup/create-easy-stored-procedures.sql
mysql -u root -p < database-setup/create-difficult-stored-procedures.sql
```

3. **Configurar PHP**

```bash
# Copiar configuración de ejemplo
cp config/database.example.php config/database.php
# Editar config/database.php con tus credenciales
```

4. **Configurar servidor web**

```bash
# Copiar archivos al directorio web
sudo cp -r * /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

### Despliegue en AWS EC2

Consulta el archivo `DATABASE_SETUP.md` para instrucciones detalladas de despliegue en AWS.

## 📊 APIs Disponibles

### Autenticación

- `POST /api/register-user.php` - Registro de nuevos usuarios
- `POST /api/update-connection-end.php` - Actualización de tiempo de conexión

### Datos Geográficos

- `GET /api/get-countries.php` - Lista de países disponibles
- `GET /api/get-cities.php?country=XX` - Ciudades por código de país

### Dashboard y Análisis

- `GET /api/dashboard-data.php` - Datos completos del dashboard administrativo

## 🔧 Stored Procedures Implementados

### Nivel Básico

- **SP_UsersByCountryAndCity** - Cuenta usuarios agrupados por país y ciudad
- **SP_CountryWithMostUsers** - Identifica el país con mayor número de usuarios

### Nivel Avanzado

- **SP_AverageConnectionTimeByCountry** - Calcula tiempo promedio de conexión por país
- **SP_CitiesConcentrating90PercentUsers** - Encuentra ciudades con alta concentración de usuarios

## 🎨 Características de Diseño

- **Diseño responsive** que se adapta a todos los dispositivos
- **Paleta de colores** moderna con verde corporativo (#009688)
- **Tipografía** clara y legible
- **Animaciones CSS** suaves y profesionales
- **Interfaz intuitiva** con navegación clara
- **Modales elegantes** para registro e inicio de sesión
- **Sistema de notificaciones** no intrusivo

## 🔒 Seguridad y Privacidad

- **Validación de formularios** tanto en frontend como backend
- **Protección contra inyección SQL** mediante prepared statements
- **Sistema de cookies** conforme al RGPD
- **Configuración segura** de base de datos
- **Archivos sensibles** protegidos en .gitignore

## 📈 Análisis y Métricas

El sistema incluye un completo dashboard administrativo que proporciona:

- **Estadísticas de usuarios** en tiempo real
- **Análisis geográfico** de la base de usuarios
- **Métricas de engagement** basadas en tiempo de conexión
- **Visualización de datos** con tablas interactivas
- **Exportación de datos** en formato JSON

## 🧪 Testing y Desarrollo

### Datos de Prueba

El sistema incluye datos de ejemplo para testing:

- Usuarios de muestra en diferentes países
- Datos de conexión simulados
- Países y ciudades de la base de datos mundial

### Entorno de Desarrollo

```bash
# Iniciar servidor de desarrollo local
php -S localhost:8000

# Acceder al dashboard administrativo
http://localhost:8000/admin-dashboard.html

# Probar APIs
curl http://localhost:8000/api/dashboard-data.php
```

## 🚀 Roadmap y Futuras Mejoras

### Próximas Funcionalidades

- [ ] Sistema completo de autenticación con JWT
- [ ] Panel de usuario personalizado
- [ ] Sistema de citas online integrado
- [ ] Notificaciones push para recordatorios
- [ ] Integración con sistemas de pago
- [ ] App móvil complementaria
- [ ] Sistema de historiales médicos
- [ ] Chat en vivo con veterinarios

### Mejoras Técnicas

- [ ] Migración a framework moderno (React/Vue)
- [ ] Implementación de PWA
- [ ] Optimización de rendimiento
- [ ] Tests automatizados
- [ ] CI/CD pipeline
- [ ] Monitorización y logging avanzado

## 🤝 Contribución

¿Quieres aportar al proyecto? ¡Genial! Sigue estos pasos:

1. **Fork del repositorio**

```bash
git clone https://github.com/tu-usuario/proyecto-veterinaria-maskotas.git
```

2. **Crear rama para tu funcionalidad**

```bash
git checkout -b feature/nueva-funcionalidad
```

3. **Realizar cambios y commit**

```bash
git commit -m 'feat: descripción de tu cambio'
```

4. **Push a tu rama**

```bash
git push origin feature/nueva-funcionalidad
```

5. **Abrir Pull Request**

### Convenciones de Código

- Usar **español** para comentarios y documentación
- Seguir **estándares PSR** para PHP
- **Indentación** de 2 espacios para HTML/CSS/JS
- **Nombres descriptivos** para variables y funciones
- **Commits semánticos** (feat, fix, docs, style, refactor)

## 📞 Soporte y Contacto

### Información del Proyecto

- **Autor**: Estudiantes DAW
- **Institución**: Grado en Desarrollo de Aplicaciones Web
- **Año académico**: 2024-2026
- **Tipo**: Proyecto Intermodular


### Enlaces Útiles

- [Documentación de la Base de Datos](DATABASE_SETUP.md)
- [Demo en Vivo](http://tu-ip-aws/admin-dashboard.html)
- [Repositorio GitHub](https://github.com/Fralopala2/proyecto-veterinaria-maskotas)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 🙏 Agradecimientos

- **World Database** por proporcionar datos geográficos
- **Font Awesome** por los iconos
- **AWS** por la infraestructura de hosting
- **Comunidad DAW** por el apoyo y feedback

---

**MASK!OTAS** - _Porque son algo más que mascotas_ 🐾

¡Gracias por tu interés en el proyecto!
