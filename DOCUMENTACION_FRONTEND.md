# Documentación Frontend - Fundación Huahuacuna

## Descripción General

Aplicación web moderna desarrollada para la Fundación Huahuacuna, una organización sin fines de lucro dedicada al apoyo y bienestar de niños en situación de vulnerabilidad. El frontend proporciona una plataforma completa para gestionar donaciones, apadrinamientos, voluntariado y administración de la fundación.

## Stack Tecnológico

### Frameworks y Librerías Principales

- **Next.js 16.0.0** - Framework React con App Router y Turbopack para compilación ultrarrápida
- **React 19** - Biblioteca UI con las últimas características de React
- **TypeScript 5** - Tipado estático para mayor robustez del código
- **Tailwind CSS v4** - Framework CSS utility-first para diseño responsive

### Herramientas de Desarrollo

- **ESLint** - Linter para mantener calidad del código
- **PostCSS** - Procesamiento de CSS con plugins modernos
- **Node.js** - Entorno de ejecución JavaScript

### Dependencias Clave

- **Axios** - Cliente HTTP para comunicación con APIs
- **date-fns** - Manejo y formato de fechas
- **React Hook Form** - Gestión de formularios con validación
- **Lucide React** - Iconografía moderna y ligera
- **html2canvas & jsPDF** - Generación de certificados en PDF

## Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── app/                    # Páginas y rutas (App Router)
│   ├── api/               # API Routes
│   │   ├── certificates/  # Generación y envío de certificados
│   │   ├── donations/     # Registro de donaciones
│   │   └── payu/         # Integración pasarela de pago
│   ├── dashboard/         # Panel administrativo
│   ├── donaciones/        # Página de donaciones públicas
│   ├── apadrinar/         # Sistema de apadrinamiento
│   ├── voluntariado/      # Registro de voluntarios
│   └── [otras rutas]/     # Login, registro, historia, proyectos
├── components/            # Componentes reutilizables
│   ├── admin/            # Componentes del dashboard
│   ├── apadrinamiento/   # Componentes de apadrinamiento
│   ├── auth/             # Componentes de autenticación
│   └── ui/               # Componentes UI genéricos
├── lib/                   # Utilidades y configuraciones
│   ├── api/              # Servicios de API
│   ├── auth/             # Gestión de tokens
│   └── payu.ts           # Configuración PayU
├── services/              # Servicios de negocio
├── hooks/                 # Custom React Hooks
├── types/                 # Definiciones TypeScript
└── context/              # Context API de React
```

## Integración de Pasarela de Pago - PayU

### Características de la Integración

La aplicación integra **PayU Latam** como pasarela de pago para procesar donaciones monetarias en línea de forma segura.

### Flujo de Pago

1. **Formulario de Donación** (`/donaciones`)
   - Usuario completa información personal y monto a donar
   - Selecciona método de pago "En línea"
   - Ingresa tipo y número de documento (requerido para PayU)

2. **Procesamiento** (`/api/payu/process`)
   - Genera código de referencia único
   - Calcula firma MD5 para seguridad
   - Prepara datos del formulario PayU
   - Redirige automáticamente a la pasarela PayU

3. **Pago en PayU**
   - Usuario es redirigido a ambiente seguro de PayU
   - Completa información de tarjeta/método de pago
   - PayU procesa la transacción

4. **Respuesta** (`/payu/response`)
   - PayU redirige de vuelta a la aplicación
   - Se valida la firma de respuesta
   - Se muestra estado de la transacción (aprobada/rechazada/pendiente)
   - Opción para volver a donaciones o descargar certificado

### Configuración PayU

```typescript
// Variables de entorno requeridas
PAYU_MERCHANT_ID=508029        // ID del comercio
PAYU_ACCOUNT_ID=512321         // ID de cuenta
PAYU_API_KEY=4Vj8eK4rloUd...   // Clave API para firmas
PAYU_TEST=1                    // Modo sandbox (1) o producción (0)
PAYU_RESPONSE_URL=http://...   // URL de respuesta
```

### Seguridad

- **Firma MD5**: Todas las transacciones incluyen firma criptográfica
- **Validación de respuesta**: Se verifica la autenticidad de respuestas de PayU
- **Ambiente de pruebas**: Modo sandbox para desarrollo seguro
- **HTTPS**: Comunicación encriptada (requerido en producción)

## Funcionalidades Principales

### 1. Sistema de Donaciones

**Tipos de Donación:**
- **Monetarias**: Con integración PayU para pago en línea o efectivo
- **En Especie**: Ropa, alimentos, juguetes, útiles escolares, electrodomésticos

**Características:**
- Formularios intuitivos con validación en tiempo real
- Certificados digitales automáticos en PDF
- Envío de confirmación por email
- Almacenamiento persistente de donaciones

### 2. Sistema de Apadrinamiento

**Funcionalidades:**
- Visualización de niños disponibles para apadrinamiento
- Solicitud de apadrinamiento con documentación
- Panel para padrinos aprobados con:
  - Información detallada del ahijado
  - Bitácora de progreso y eventos
  - Chat privado con la fundación
  - Historial de donaciones

### 3. Panel Administrativo (Dashboard)

**Módulos de Administración:**
- **Solicitudes**: Gestión de apadrinamientos y voluntariado
- **Niños**: CRUD completo de niños beneficiarios
- **Bitácoras**: Registro de progreso de cada niño
- **Mensajes**: Sistema de chat con padrinos
- **Eventos**: Gestión de actividades de la fundación
- **Proyectos**: Administración de programas activos
- **Usuarios**: Control de acceso y roles
- **Notificaciones**: Centro de alertas y avisos

**Características de Seguridad:**
- Autenticación con JWT (JSON Web Tokens)
- Rutas protegidas con middleware
- Control de acceso basado en roles
- Sesiones persistentes con refresh tokens

### 4. Voluntariado

- Formulario de inscripción completo
- Selección de áreas de interés
- Calendario de disponibilidad
- Gestión administrativa de solicitudes

### 5. Información Institucional

- **Historia**: Trayectoria de la fundación
- **Proyectos**: Programas educativos, salud, nutrición
- **Home/Landing**: Presentación atractiva de la misión

## Autenticación y Autorización

### Sistema de Autenticación

- **Login/Registro**: Formularios con validación robusta
- **JWT Tokens**: Almacenamiento seguro en localStorage
- **Refresh Tokens**: Renovación automática de sesión
- **Recuperación de contraseña**: Flujo completo de reset
- **Protected Routes**: Componente HOC para rutas privadas

### Context API

```typescript
AuthContext: {
  user: User | null
  login: (email, password) => Promise<void>
  logout: () => void
  register: (userData) => Promise<void>
  isAuthenticated: boolean
}
```

## Sistema de Notificaciones

### Notificaciones Email

- Confirmación de donaciones
- Certificados de donación adjuntos
- Actualizaciones de solicitudes
- Comunicaciones con padrinos

### Notificaciones In-App

- Centro de notificaciones en dashboard
- Badges con contador de no leídas
- Marcado de leído/no leído
- Filtros por tipo y estado

## Diseño Responsive

### Breakpoints de Tailwind

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Características UI/UX

- Navegación adaptativa con menú hamburguesa en móvil
- Cards y layouts que se ajustan a diferentes pantallas
- Formularios optimizados para touch
- Imágenes responsive con Next.js Image
- Animaciones suaves con Tailwind transitions

## Sistema de Diseño

### Paleta de Colores

- **Primario**: Púrpura (#9333EA, #7C3AED, #6B21A8)
- **Acento**: Amarillo (#FDD835, #FFD54F)
- **Neutros**: Grises y blancos
- **Estados**: Verde (éxito), Rojo (error), Azul (info)

### Componentes Reutilizables

- **Modales**: Confirmación, edición, eliminación
- **Cards**: Aplicaciones, niños, proyectos, estadísticas
- **Forms**: Inputs validados con mensajes de error
- **Buttons**: Variantes primary, secondary, danger
- **Alerts**: Success, error, warning, info
- **Navbar/Footer**: Navegación consistente

## Gestión de Estado

### Estrategias Utilizadas

1. **React Context**: Estado global de autenticación
2. **useState**: Estado local de componentes
3. **Custom Hooks**: Lógica reutilizable
   - `useAuth`: Gestión de sesión
   - `useNotifications`: Notificaciones
   - `useApplications`: Solicitudes
   - `useUsers`: Usuarios

## API Integration

### Servicios Backend

Base URL configurada en variables de entorno:
```
NEXT_PUBLIC_API_URL=https://api.fundacionhuahuacuna.org
```

### Endpoints Principales

- `POST /api/auth/login` - Autenticación
- `POST /api/donations` - Crear donación
- `GET /api/children` - Listar niños
- `GET /api/applications` - Solicitudes
- `POST /api/godparents/request` - Solicitar apadrinamiento
- `GET /api/notifications` - Notificaciones de usuario

### Manejo de Errores

- Interceptores Axios para errores globales
- Mensajes de error descriptivos
- Retry logic para peticiones fallidas
- Loading states en todas las operaciones asíncronas

## Características de Rendimiento

### Optimizaciones de Next.js

- **Server-Side Rendering (SSR)**: Páginas dinámicas pre-renderizadas
- **Static Site Generation (SSG)**: Páginas estáticas cuando es posible
- **Image Optimization**: Componente Next/Image para lazy loading
- **Code Splitting**: Carga de código por rutas
- **Turbopack**: Compilación ultrarrápida en desarrollo

### Best Practices

- Componentes React memoizados con `useMemo` y `useCallback`
- Lazy loading de módulos pesados
- Debouncing en búsquedas y filtros
- Paginación de listas largas
- Caché de peticiones API

## Testing y Calidad

### Herramientas de Calidad de Código

- **ESLint**: Reglas estrictas de Next.js y React
- **TypeScript**: Tipado estático completo
- **Prettier**: Formateo consistente (configuración integrada)

### Validación

- Validación de formularios con React Hook Form
- Validación de esquemas con TypeScript
- Sanitización de inputs del usuario

## Deployment

### Variables de Entorno Requeridas

```env
# API Backend
NEXT_PUBLIC_API_URL=https://api.fundacionhuahuacuna.org

# PayU Configuration
PAYU_MERCHANT_ID=508029
PAYU_ACCOUNT_ID=512321
PAYU_API_KEY=4Vj8eK4rloUd272L48hsrarnUA
PAYU_TEST=0  # 1 para sandbox, 0 para producción
PAYU_RESPONSE_URL=https://fundacionhuahuacuna.org/payu/response
PAYU_CONFIRMATION_URL=https://fundacionhuahuacuna.org/api/payu/confirmation

# Base URL del Frontend
NEXT_PUBLIC_BASE_URL=https://fundacionhuahuacuna.org

# Email Service (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contacto@fundacionhuahuacuna.org
SMTP_PASS=password_secreto
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Verificar código
```

### Consideraciones de Producción

1. **HTTPS obligatorio** para PayU y seguridad general
2. **CORS configurado** en el backend para el dominio del frontend
3. **Variables de entorno** configuradas en el servicio de hosting
4. **Modo PayU en producción** (`PAYU_TEST=0`)
5. **Monitoreo de errores** (recomendado: Sentry, LogRocket)

## Flujo de Desarrollo

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/slopez1023/fundacion-huahuacuna-frontend.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales correctas

# Iniciar desarrollo
npm run dev
```

### Estructura de Commits

Siguiendo convenciones de commits semánticos:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no afectan funcionalidad)
- `refactor:` - Refactorización de código
- `test:` - Añadir o modificar tests
- `chore:` - Tareas de mantenimiento

## Mejoras Futuras Sugeridas

1. **Testing Automatizado**: Implementar Jest y React Testing Library
2. **Internacionalización (i18n)**: Soporte multiidioma
3. **PWA**: Convertir en Progressive Web App
4. **Analytics**: Integrar Google Analytics o similar
5. **SEO Avanzado**: Metadatos dinámicos, sitemap, robots.txt
6. **Webhooks PayU**: Confirmaciones automáticas desde PayU
7. **Dashboard Analytics**: Gráficos de donaciones y métricas
8. **Chat en Tiempo Real**: WebSockets para mensajería instantánea
9. **Galería de Fotos**: Gestión multimedia de eventos y actividades
10. **Blog/Noticias**: CMS para contenido dinámico

## Soporte y Contacto

Para consultas técnicas o contribuciones al proyecto:
- **Repositorio**: https://github.com/slopez1023/fundacion-huahuacuna-frontend
- **Issues**: https://github.com/slopez1023/fundacion-huahuacuna-frontend/issues

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2025  
**Mantenido por**: Equipo de Desarrollo Fundación Huahuacuna
