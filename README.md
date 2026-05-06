# PYMSMED — Prototipo Funcional

Prototipo frontend-only del módulo de **Promoción y Mantenimiento de la Salud** para SIISMED, Secretaría de Salud de Medellín.

## Ejecutar

```bash
cd pymsmed-prototype
npm install
npm run dev
```

Abrir http://localhost:5173/ en el navegador.

## Objetivo

Aplicación React navegable y funcional para **validar flujos con el equipo de la Secretaría** antes de implementar backend, autenticación real, PostgreSQL o integraciones institucionales.

- No requiere backend, login real ni internet.
- Los datos se almacenan en `localStorage` del navegador.
- El botón **"Reset demo"** en la barra superior restaura los datos semilla.

## Módulos implementados

| Módulo | Funcionalidad |
|--------|--------------|
| **Dashboard** | 8 KPIs en tiempo real, alertas dinámicas, accesos rápidos a todos los módulos |
| **Entorno Comunitario** | CRUD completo: listar, crear, editar, inactivar con justificación, solicitar edición |
| **Entorno Hogar** | Ficha hogar, integrantes (agregar/quitar), caracterización progresiva por 6 dimensiones, riesgos asociados a integrantes, seguimiento |
| **Entorno Educativo** | CRUD genérico con campos: institución, sede, jornada, población |
| **Entorno Laboral** | CRUD genérico con campos: empresa, NIT, sector económico, trabajadores |
| **Entorno Institucional** | CRUD genérico con campos: tipo institución, capacidad, población atendida |
| **Visitas** | Listado general, crear desde entorno, detalle, agregar participantes, cerrar visita, solicitar reapertura |
| **Participantes** | Listado general, buscar persona, crear nueva, agregar a visita con semáforo |
| **Atenciones** | Crear atención (tipo, dimensión, resultado, riesgo, canalización), finalizar, semáforo rojo/amarillo/verde automático |
| **Actividades Colectivas** | Programar, aprobar/rechazar (supervisor), registrar realización con participantes reales |
| **Canalizaciones** | Bandeja general + bandeja EAPB, asignar cita, rechazar, reprogramar, marcar atendida, cerrar seguimiento |
| **Reportes** | Tablero con KPIs, barras por tipo de entorno, semaforización, visitas por dimensión, canalizaciones por estado/prioridad, actividades |
| **Solicitudes** | Filtros por estado, búsqueda, aprobar/rechazar, detalle completo |
| **Administración** | Tabs: Contratos (tarjetas con presupuesto), Solicitudes, Auditoría (timeline con iconos) |

## Flujo guiado de demostración

### 1. Dashboard
- Abrir la app → panel con estadísticas y alertas dinámicas de todos los módulos.
- Cambiar de usuario/rol en la barra superior para probar diferentes permisos.

### 2. Entornos
- Sidebar → **Entornos** (menú colapsable) → Comunitario, Hogar, Educativo, Laboral, Institucional.
- Crear, consultar, editar, inactivar con justificación.

### 3. Entorno Hogar (flujo completo)
- Crear hogar → Agregar integrantes → Iniciar caracterización.
- Responder preguntas por dimensión → Registrar riesgos → Asociar a integrantes.
- Completar secciones progresivamente → Ver seguimientos.

### 4. Visitas y Participantes
- Desde ficha de entorno → Nueva visita → Agregar participantes (semáforo rojo).
- Registrar atención → semáforo amarillo → Finalizar → semáforo verde.
- Cerrar visita → todo bloqueado → Solicitar reapertura.

### 5. Actividades Colectivas
- Programar actividad → Supervisor aprueba → Registrar realización con participantes reales.

### 6. Canalizaciones
- Atención con riesgo genera canalización → EAPB asigna cita → Atender → Cerrar.
- Probar con usuario **Laura Vélez (EAPB)** para ver bandeja EAPB.

### 7. Reportes
- Sidebar → **Reportes** → Tablero con indicadores de todos los módulos.

### 8. Administración
- Sidebar → **Administración** → Contratos | Solicitudes | Auditoría.

## Usuarios de prueba

| Usuario | Rol | Permisos principales |
|---------|-----|---------------------|
| Carlos Gómez | Administrador | Todo |
| María López | Supervisor | Entornos, visitas, atenciones, solicitudes, aprobación |
| Ana Martínez | Profesional Social | Lectura entornos, visitas y atenciones completas |
| Jorge Restrepo | Profesional Operativo | Lectura entornos, visitas y atenciones |
| Laura Vélez | EAPB | Canalizaciones |

## Datos semilla

- 5 entornos comunitarios, 3 educativos, 2 laborales, 3 institucionales
- 4 hogares con 8 integrantes, 2 caracterizaciones, 1 seguimiento
- 8 personas mock
- 5 visitas, 9 participantes, 4 atenciones
- 5 actividades colectivas, 6 canalizaciones
- 3 solicitudes, 4 contratos, 12 registros de auditoría

## Arquitectura

```
src/
  app/                                  # Router principal
  shared/
    components/                         # Button, Card, Badge, DataTable, Modal, etc.
    context/                            # AuthContext (usuario/rol mock)
    layout/                             # AppShell, Sidebar (colapsable con submenú), Header
    storage/                            # Repository genérico + seed manager
    types/                              # Tipos de dominio TypeScript
    mock/                               # Datos semilla
  modules/
    dashboard/                          # Dashboard con KPIs dinámicos
    entornos/comunitario/               # CRUD completo entorno comunitario
    entornos/generic/                   # Componente genérico para educativo/laboral/institucional
    hogares/                            # Hogar + integrantes + caracterización + seguimiento
    visitas/                            # Listado, crear, detalle de visitas
    participantes/                      # Agregar participante a visita
    atenciones/                         # Atención básica + semaforización
    actividades/                        # Actividades colectivas + aprobación
    canalizaciones/                     # Bandeja general + EAPB + gestión
    reportes/                           # Tablero con indicadores agregados
    solicitudes/                        # Gestión de solicitudes
    administracion/                     # Contratos + solicitudes + auditoría
```

### Patrón de persistencia

```
LocalStorageRepository (actual) → ApiRepository (futuro)
```

Interface `Repository<T>` con `list()`, `getById()`, `create()`, `update()`, `delete()`.
Para migrar a API REST solo se implementa `ApiRepository`.

### Patrón genérico de entornos

`entorno-config.ts` define campos por tipo. 3 páginas genéricas reciben la config como prop.
Para agregar un nuevo tipo de entorno solo se agrega una entrada en la config.

## Stack técnico

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React (iconos)
- localStorage para persistencia

## Checklist de validación con usuarios

- [ ] ¿La navegación por entornos es comprensible?
- [ ] ¿Los usuarios entienden cómo crear registros, visitas y atenciones?
- [ ] ¿El flujo de participantes dentro de una visita es claro?
- [ ] ¿La semaforización ayuda a entender el estado de atención?
- [ ] ¿Los formularios tienen los campos correctos?
- [ ] ¿El cierre de visita y bloqueo se entiende?
- [ ] ¿Las solicitudes de edición/reapertura son útiles?
- [ ] ¿El flujo de canalizaciones es claro para EAPB?
- [ ] ¿La caracterización progresiva del hogar funciona bien?
- [ ] ¿Los reportes muestran la información necesaria?
- [ ] ¿Falta algún campo o acción?
- [ ] ¿La terminología es correcta?
