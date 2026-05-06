# Decisiones abiertas — PYMSMED Prototipo

Decisiones técnicas y funcionales que requieren definición antes de pasar a fase backend.

## TODO-SIISMED

| # | Tema | Pregunta | Estado |
|---|------|----------|--------|
| 1 | Autenticación | ¿Cómo se leen las cookies `jwt_token_SIISMED` y `user_SIISMED`? ¿Hay endpoint de validación? | Pendiente |
| 2 | Personas Salud | ¿Cuál es el endpoint para buscar personas por documento? ¿Qué campos retorna? | Pendiente |
| 3 | Permisos | ¿Los permisos vienen como array en el token JWT o se consultan por endpoint? | Pendiente |
| 4 | Contratos | ¿Cómo se consultan los contratos vigentes del usuario? ¿Vienen en la sesión? | Pendiente |
| 5 | MapGIS | ¿Se integrará mapa para ubicar entornos? ¿Qué API se usará? | Pendiente |
| 6 | Calendarización | ¿Se usará el módulo transversal de calendarización o uno propio? | Pendiente |

## TODO-BACKEND

| # | Tema | Pregunta | Estado |
|---|------|----------|--------|
| 1 | Base de datos | Esquema PostgreSQL: ¿prefijo `pyms_` confirmado para todas las tablas? | Pendiente |
| 2 | Auditoría | ¿La auditoría se guarda en tabla separada o en campos de la entidad? | Pendiente |
| 3 | Códigos | ¿Los códigos de entorno (EC-001) son autogenerados o los asigna SIISMED? | Pendiente |
| 4 | Inactivación | ¿La inactivación es reversible directamente o solo por solicitud aprobada? | Pendiente |
| 5 | Reapertura | ¿Qué pasa cuando se aprueba una solicitud de reapertura? ¿Se cambia el estado automáticamente? | Pendiente |
| 6 | Formularios dinámicos | ¿Se usarán los formularios del módulo transversal desde el inicio? | Pendiente |
| 7 | Canalizaciones | ¿Cuáles son las reglas automáticas de canalización por tipo de riesgo? | Pendiente |
| 8 | Reportes | ¿Qué reportes se necesitan en la primera versión? | Pendiente |

## TODO-API

| # | Tema | Decisión pendiente | Estado |
|---|------|-------------------|--------|
| 1 | Paginación | ¿Usar cursor o offset? ¿Tamaño de página por defecto? | Pendiente |
| 2 | Filtros | ¿Filtros en query params o body para búsquedas complejas? | Pendiente |
| 3 | Versionado | ¿Prefijo `/api/v1/` confirmado? | Pendiente |
| 4 | Errores | ¿Formato de error estándar? ¿Codes de error propios? | Pendiente |

## Decisiones tomadas en el prototipo

| Decisión | Justificación |
|----------|--------------|
| localStorage como persistencia | Permite demo sin backend; patrón Repository permite migrar después |
| Selector de usuario mock | Simula roles sin depender de SIISMED |
| Semáforo rojo/amarillo/verde | Rojo = sin atención, Amarillo = parcial, Verde = todas finalizadas |
| Solicitudes mock no ejecutan la acción | Solo quedan en estado pendiente/aprobada/rechazada; no modifican entidades automáticamente |
| Códigos autogenerados | EC-001, EC-002... secuencial. TODO-BACKEND: confirmar con SIISMED |
