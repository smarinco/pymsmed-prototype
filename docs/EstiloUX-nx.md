# Guía de Estilo UX/UI — SOE v2 · Netux

> **Propósito:** Este documento define el sistema de diseño visual y de experiencia de usuario construido en la plataforma interna SOE v2. Es la referencia única para cualquier miembro del equipo que diseñe o desarrolle nuevas páginas, módulos o componentes dentro del sistema.

---

## 1. Fundamentos visuales

### 1.1 Paleta de colores

| Token | Hex | Uso principal |
|---|---|---|
| `navy` | `#0B1A3B` | Color corporativo principal. Textos de título, headers de drawers, Sidebar activo. |
| `accent` | `#E8731A` | Naranja Netux. Botones primarios, links activos, KPI destacados, indicadores de acción. |
| `secondary` | `#4A5568` | Textos secundarios, subtítulos, iconos en reposo. |
| `background` | `#F0F2F5` | Fondo general de la aplicación (gris suave). Nunca usar blanco puro como fondo de página. |
| `white` | `#FFFFFF` | Fondo de cards, drawers, tablas. |
| `border` | `#E5E7EB` (gray-200) | Bordes de cards, inputs, separadores. |

```css
/* globals.css */
@theme inline {
  --color-navy:      #0B1A3B;
  --color-accent:    #E8731A;
  --color-secondary: #4A5568;
}

body {
  background: #F0F2F5;
  color: #0B1A3B;
}
```

**Variantes de accent para estados interactivos:**
- Hover botón primario: `#D45602`
- Fondo suave accent: `bg-[#E8731A]/10` (badges MRR, highlights)
- Ring de foco: `ring-[#E8731A]/30`

### 1.2 Tipografía

**Fuente base:** Open Sans (Google Fonts), cargada via `next/font/google`.

| Uso | Clase Tailwind | Peso |
|---|---|---|
| Títulos de página (h1) | `text-[15px] font-bold` | 700 |
| Título en header de drawer | `text-[18px] font-bold` | 700 |
| Texto de tabla / body principal | `text-[13px]` | 400 |
| Labels de formulario | `text-[12px] font-semibold` | 600 |
| Subtextos, metadatos | `text-[11px]` | 400–500 |
| Micro (badges, contadores, uppercase) | `text-[10px]` | 500–600 |
| Nano (avisos mínimos) | `text-[9px]` | 500 |

**Regla de oro:** el texto más pequeño en pantalla es `text-[10px]`. Nada debe ir por debajo de este tamaño, excepto en casos muy específicos de etiquetas de alerta.

**Uppercase tracking:** Las etiquetas de sección, headers de columnas de tabla y labels de KPI usan `uppercase tracking-wide` o `tracking-widest` en `text-[10px]`.

### 1.3 Espaciado y bordes

| Elemento | Clases |
|---|---|
| Card estándar | `bg-white rounded-xl border border-gray-200` |
| Padding card principal | `p-5` o `p-6` |
| Padding card compacto (KPI) | `p-4` |
| Separadores horizontales | `border-b border-gray-100` |
| Separadores de header de tabla | `border-b border-gray-100` (más marcado que filas) |
| Radio de bordes inputs | `rounded-lg` |
| Radio de bordes cards/modales | `rounded-xl` |
| Radio de badges/pills | `rounded-full` |
| Sombra de drawer | `shadow-2xl` |
| Sombra de card hover | `shadow-md` |

---

## 2. Layout general

### 2.1 Estructura de página

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (240px expandido / 56px colapsado)         │
│  ┌───────────────────────────────────────────────┐  │
│  │  TopBar (52px, blanco, borde inferior)        │  │
│  ├───────────────────────────────────────────────┤  │
│  │                                               │  │
│  │  <main> — fondo #F0F2F5, overflow-auto        │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

- El body usa `flex h-screen overflow-hidden antialiased`
- El área de contenido (`<main>`) tiene `flex-1 overflow-auto`
- El padding interno de cada página es `p-6` como mínimo

### 2.2 Sidebar

- **Expandido:** 240px de ancho
- **Colapsado:** 56px de ancho
- **Fondo:** blanco (`bg-white`), borde derecho `border-r border-gray-100`
- **Logo:** 120px ancho (expandido) / 28px (colapsado). Zona logo siempre 52px de alto.
  - Logo expandido → `<Link href="/">` (navega al home)
  - Logo colapsado → botón que expande el sidebar
- **Acordeón 3 niveles:** Sección → Grupo → Hoja
- **Item activo:** solo texto en `#E8731A`, **sin fondo ni borde**
- **Item hover:** solo texto en `#E8731A`, sin fondo
- **Chevron de grupo:** rota 90° al abrir con `transition-transform duration-200`

### 2.3 TopBar

- Altura fija 52px, fondo blanco, `border-b border-gray-100`
- **Izquierda:** breadcrumb dinámico generado desde el pathname
- **Derecha:** búsqueda (⌘K), ayuda, notificaciones, avatar

---

## 3. Componentes de datos

### 3.1 KPI Cards

```jsx
<div className="bg-white rounded-xl border border-gray-200 p-4">
  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
    Etiqueta del indicador
  </p>
  <p className="text-2xl font-bold mt-1 text-[#0B1A3B]">
    1.234
  </p>
  {/* Variación opcional */}
  <p className="text-[11px] text-green-600 mt-0.5">↑ 12% vs mes ant.</p>
</div>
```

**Colores del valor principal según semántica:**
| Tipo | Color |
|---|---|
| Valor neutro / conteo | `text-[#0B1A3B]` |
| Valor financiero destacado (MRR, dinero) | `text-[#E8731A]` |
| Valor positivo (ganados, activos) | `text-green-600` |
| Valor de alerta / tasa baja | `text-amber-600` |
| Valor crítico | `text-red-600` |

Las KPI cards van siempre en grid: `grid grid-cols-N gap-3` o `gap-4` (N según el módulo, típicamente 4).

### 3.2 Tablas

```jsx
<table className="w-full">
  <thead>
    <tr className="bg-gray-50 border-b border-gray-100">
      <th className="text-left px-4 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
        Columna
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors cursor-pointer">
      <td className="px-4 py-3 text-[13px] text-[#0B1A3B]">
        Contenido
      </td>
    </tr>
  </tbody>
</table>
```

**Reglas de tabla:**
- Header: `bg-gray-50` con `border-b border-gray-100`
- Filas: `border-b border-gray-50` (más suave que el header)
- Hover: `hover:bg-orange-50/30` (tono suave naranja)
- Cursor: `cursor-pointer` cuando la fila abre drawer
- Columna de acciones: siempre al extremo derecho, texto `text-[#E8731A]`
- Paginación: 50 registros por página como estándar (100 en tablas de inventario/activos)

**Columna de ordenamiento activo:** header color `text-[#E8731A]` cuando el sort está aplicado.

### 3.3 Badges de estado

Formato: `px-2 py-0.5 rounded-full text-[10px] font-semibold`

| Estado | Clases |
|---|---|
| Activo / Éxito | `bg-green-50 text-green-600` |
| Pendiente / Alerta | `bg-yellow-100 text-yellow-800` |
| Inactivo / Neutral | `bg-gray-100 text-gray-500` |
| Suspendido | `bg-amber-50 text-amber-600` |
| Rechazado / Error | `bg-red-100 text-red-700` |
| Conciliado | `bg-green-100 text-green-800` |
| Editando | `bg-[#E8731A]/20 text-[#E8731A]` |

### 3.4 Pills de producto Netux

Las soluciones de Netux tienen un color fijo en toda la plataforma:

| Producto | Clases |
|---|---|
| Mi Monitor | `bg-purple-50 text-purple-600` |
| Mi Turno | `bg-sky-50 text-sky-600` |
| Mi Emergencia | `bg-red-50 text-red-600` |
| Mi Llamado | `bg-orange-50 text-orange-600` |
| Mi Paciente | `bg-teal-50 text-teal-600` |

Formato: `inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap`

### 3.5 Badges de categoría CRM

| Categoría | Clases |
|---|---|
| Diamante | `bg-sky-50 text-sky-700` |
| Oro | `bg-yellow-50 text-yellow-700` |
| Plata | `bg-gray-100 text-gray-600` |
| Bronce | `bg-orange-50 text-orange-700` |

### 3.6 Badges de tipo de pago

| Tipo | Clases |
|---|---|
| Compra | `bg-purple-50 text-purple-700` |
| Pago proveedor | `bg-blue-50 text-blue-700` |
| Pago tarjeta | `bg-pink-50 text-pink-700` |
| Transferencia | `bg-teal-50 text-teal-700` |
| Otro | `bg-gray-100 text-gray-600` |

---

## 4. Componentes de formulario

### 4.1 Inputs

```jsx
// Input estándar
<input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px]
  text-[#0B1A3B] placeholder:text-gray-300
  focus:outline-none focus:ring-2 focus:ring-[#E8731A]/30 focus:border-[#E8731A]
  bg-white transition-colors" />

// Input compacto (en drawers)
<input className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-[12px]
  text-[#0B1A3B] placeholder:text-gray-300
  focus:outline-none focus:ring-2 focus:ring-[#E8731A]/30 focus:border-[#E8731A]
  bg-white transition-colors" />
```

**Reglas:**
- Ring de foco siempre `ring-[#E8731A]/30` con `border-[#E8731A]`
- Placeholder: `text-gray-300` (muy suave, no `text-gray-400`)
- Select tiene las mismas clases que input

### 4.2 Labels de formulario

```jsx
<label className="text-[11px] font-semibold text-[#0B1A3B] block mb-1">
  Campo <span className="text-[#E8731A]">*</span>
</label>
```

El asterisco de campo requerido va en `text-[#E8731A]`.

### 4.3 Botones

```jsx
// Primario
<button className="bg-[#E8731A] hover:bg-[#D45602] text-white
  font-semibold rounded-xl px-4 py-2 text-[13px] transition-colors">
  Acción principal
</button>

// Secundario
<button className="border border-gray-200 text-gray-500
  hover:bg-gray-50 rounded-lg px-3 py-1.5 text-[12px] transition-colors">
  Acción secundaria
</button>

// Botón peligro (eliminar)
<button className="text-red-400 hover:text-red-600 transition-colors text-[12px]">
  Eliminar
</button>

// Botón ghost sobre fondo navy (en headers de drawer)
<button className="flex items-center gap-1.5 text-white/60 hover:text-white
  border border-white/20 hover:border-white/40 rounded-lg px-2.5 py-1
  text-[11px] font-medium transition-colors">
  Editar
</button>
```

### 4.4 Autocomplete / Búsqueda con dropdown

- Debounce de **250ms** sobre el input
- Dropdown: `absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto`
- Item del dropdown: `px-3 py-2 hover:bg-orange-50/40 cursor-pointer`
- Texto principal del item: `text-[12px] font-medium text-[#0B1A3B]`
- Subtexto del item: `text-[10px] text-gray-400`
- Cierre con click fuera: `useRef` + listener `mousedown`

### 4.5 DatePicker custom

- Trigger: `border border-gray-200 rounded-lg px-3 py-1.5 text-[12px]` con icono de calendario
- Cuando está abierto: `border-[#E8731A] ring-2 ring-[#E8731A]/20`
- Popup: `bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-[240px]`
- Día seleccionado: `bg-[#E8731A] text-white font-semibold rounded-lg`
- Día actual (sin seleccionar): `border border-[#E8731A] text-[#E8731A] font-semibold rounded-lg`
- Rango activo (intermedio): `bg-orange-50 text-gray-700 rounded-lg`
- Extremos del rango: `bg-[#E8731A]/20 text-[#E8731A] font-semibold rounded-lg`

---

## 5. Drawers (paneles laterales)

Los drawers son el patrón principal de detalle/edición en SOE. Se abren desde la derecha de la pantalla.

### 5.1 Estructura

```
┌────────────────────────────────┐  ← fixed inset-y-0 right-0 z-50
│  HEADER (bg navy #0B1A3B)      │    w-full max-w-md (formularios)
│  → Título blanco               │    w-full max-w-lg (detalle con listas)
│  → Subtítulo blanco/40         │
│  → Botón X blanco/40           │
├────────────────────────────────┤
│                                │  ← flex-1 overflow-y-auto
│  BODY scrollable               │
│                                │
├────────────────────────────────┤
│  FOOTER (acciones)             │  ← border-t border-gray-100 p-4
│  → Cancelar (secundario)       │
│  → Guardar (primario)          │
└────────────────────────────────┘
```

**Overlay de fondo:** `fixed inset-0 z-40 bg-black/30 backdrop-blur-sm` — cierra el drawer al hacer click.

### 5.2 Header de drawer

```jsx
<div className="bg-[#0B1A3B] px-6 py-5 shrink-0">
  <div className="flex items-start justify-between">
    <div>
      {/* Identificador/badge */}
      <span className="font-mono text-[11px] text-white/40 bg-white/10
        px-1.5 py-0.5 rounded">
        ID 001
      </span>
      {/* Nombre principal */}
      <p className="text-white text-[18px] font-bold leading-tight truncate mt-1">
        Nombre del registro
      </p>
      {/* Subtítulo */}
      <p className="text-white/40 text-[11px] mt-1">detalle secundario</p>
    </div>
    {/* Botón cerrar */}
    <button className="text-white/40 hover:text-white transition-colors">
      ✕
    </button>
  </div>
</div>
```

### 5.3 Tabs dentro de drawer

Cuando el drawer tiene múltiples secciones, se usan tabs en la parte superior del body:

```jsx
<div className="flex border-b border-gray-100">
  {['Detalle', 'Actividad', 'Tareas', 'Contactos'].map(tab => (
    <button
      key={tab}
      onClick={() => setTab(tab)}
      className={`px-4 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
        activeTab === tab
          ? 'border-[#E8731A] text-[#E8731A]'
          : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {tab}
    </button>
  ))}
</div>
```

**Lazy loading de tabs:** usar `useRef(new Set<string>())` para registrar qué tabs ya cargaron. No re-fetchar al cambiar de tab.

### 5.4 Secciones dentro del body de drawer

```jsx
{/* Sección con etiqueta */}
<div className="px-6 py-4 border-b border-gray-50">
  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
    Título de sección
  </p>
  {/* contenido */}
</div>
```

---

## 6. Gráficas (Recharts)

### 6.1 Configuración base

```jsx
<ResponsiveContainer width="100%" height={220}>
  <BarChart data={data} barSize={28}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
    <XAxis
      dataKey="label"
      tick={{ fontSize: 10, fill: '#9CA3AF' }}
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      tick={{ fontSize: 10, fill: '#9CA3AF' }}
      axisLine={false}
      tickLine={false}
      tickFormatter={v => `$${(v/1_000_000).toFixed(1)}M`}
    />
    <Tooltip
      contentStyle={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: 12,
      }}
    />
    <Bar dataKey="monto" fill="#E8731A" radius={[4, 4, 0, 0]}>
      {data.map((_, i) => (
        <Cell key={i} fill={selectedBar === i ? '#D45602' : '#E8731A'} />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
```

**Reglas de gráficas:**
- Color principal de barras: `#E8731A`
- Color hover/seleccionado: `#D45602`
- Líneas secundarias (comparación): `#CBD5E0` (gray-300)
- Grid: solo horizontal (`vertical={false}`), color `#f0f0f0`
- Ejes sin línea ni tick visual (`axisLine={false} tickLine={false}`)
- Bordes redondeados en barras: `radius={[4, 4, 0, 0]}`
- Suprimir outline de foco SVG: definido globalmente en `globals.css`

### 6.2 Toggle Diario / Acumulado

```jsx
<div className="flex rounded-lg border border-gray-200 overflow-hidden">
  {['Diario', 'Acumulado'].map(opt => (
    <button
      key={opt}
      onClick={() => setChartMode(opt)}
      className={`px-3 py-1 text-[11px] font-medium transition-colors ${
        chartMode === opt
          ? 'bg-[#0B1A3B] text-white'
          : 'bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      {opt}
    </button>
  ))}
</div>
```

---

## 7. Kanban

Usado en CRM (Pipeline y Negocios). Cada columna es un contenedor vertical con scroll interno.

### 7.1 Columna

```jsx
<div className={`w-72 flex flex-col rounded-xl border ${cfg.col} overflow-hidden`}>
  {/* Header de columna */}
  <div className="px-4 py-3 border-b border-gray-200/60 shrink-0">
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
      Etapa
    </span>
    <span className="text-[12px] font-bold text-gray-500">{count}</span>
  </div>
  {/* Scroll interno de cards */}
  <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
    {/* cards */}
  </div>
</div>
```

### 7.2 Card de kanban

```jsx
<div className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm
  hover:shadow-md hover:border-[#E8731A]/30 transition-all cursor-default">
  <p className="text-[13px] font-semibold text-[#0B1A3B] leading-snug mb-1">
    Nombre del negocio
  </p>
  <p className="text-[11px] text-gray-400">Empresa asociada</p>

  {/* Footer de card */}
  <div className="flex items-center justify-between mt-2.5">
    <span className="bg-[#E8731A]/10 text-[#E8731A] text-[10px] font-bold px-2 py-0.5 rounded-full">
      $1.2M MRR
    </span>
    {/* Indicador de actividad */}
    <span className="text-[10px] font-medium text-amber-500">hace 8d</span>
  </div>
</div>
```

### 7.3 Colores por etapa CRM

| Etapa | Badge | Fondo de columna |
|---|---|---|
| Prospecto | `bg-gray-100 text-gray-600` | `bg-gray-50 border-gray-200` |
| Calificado | `bg-blue-50 text-blue-600` | `bg-blue-50/40 border-blue-100` |
| Propuesta | `bg-purple-50 text-purple-600` | `bg-purple-50/40 border-purple-100` |
| Negociación | `bg-amber-50 text-amber-700` | `bg-amber-50/40 border-amber-100` |

### 7.4 Indicador de inactividad en cards

| Días sin actividad | Color |
|---|---|
| ≤ 7 días | `text-gray-400` |
| 8–14 días | `text-amber-500` |
| > 14 días | `text-red-500` + aviso `⚠ Sin actividad reciente` en `text-[9px] text-red-400` |

---

## 8. Estados de carga y vacíos

### 8.1 Estado cargando

```jsx
<div className="flex items-center justify-center py-12 text-gray-400 text-[12px]">
  Cargando...
</div>
```

### 8.2 Estado vacío

```jsx
<div className="py-8 text-center">
  <p className="text-[11px] text-gray-300">Sin resultados</p>
</div>
```

---

## 9. Paginación

```jsx
<div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 shrink-0">
  <span className="text-[11px] text-gray-400">
    {total} registros · Página {page} de {totalPages}
  </span>
  <div className="flex gap-1">
    <button
      onClick={() => setPage(p => Math.max(1, p - 1))}
      disabled={page === 1}
      className="px-2 py-1 rounded border border-gray-200 text-[11px]
        text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
    >
      ← Ant.
    </button>
    <button
      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      disabled={page === totalPages}
      className="px-2 py-1 rounded border border-gray-200 text-[11px]
        text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
    >
      Sig. →
    </button>
  </div>
</div>
```

---

## 10. Toolbar de filtros

El patrón estándar para filtrar una tabla es una barra horizontal encima de ella:

```jsx
<div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100">
  {/* Búsqueda */}
  <div className="relative">
    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" width={13} height={13} .../>
    <input
      placeholder="Buscar…"
      className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[12px]
        focus:ring-2 focus:ring-[#E8731A]/30 focus:border-[#E8731A] outline-none w-52"
    />
  </div>

  {/* Filtro select */}
  <select className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px]
    text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E8731A]/30 focus:border-[#E8731A]">
    <option value="">Todos los estados</option>
    ...
  </select>

  {/* Botones de acción (al final, alineados a la derecha) */}
  <div className="ml-auto flex gap-2">
    <button className="border border-gray-200 text-gray-500 hover:bg-gray-50
      rounded-lg px-3 py-1.5 text-[12px] flex items-center gap-1.5 transition-colors">
      Exportar Excel
    </button>
  </div>
</div>
```

**Debounce en búsqueda:** 400ms estándar. Se aplica antes de llamar a la API.

---

## 11. Formateo de datos

### 11.1 Moneda COP

```ts
// Formato completo: $1.234.567
const COP = (v: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(v);

// Formato compacto para KPIs
function fmtMrr(v: number | null | undefined): string {
  if (!v) return '—';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${Math.round(v / 1_000)}K`;
  return `$${v.toLocaleString('es-CO')}`;
}
```

### 11.2 Fechas

```ts
// Fecha corta: "09 abr. 2026"
new Date(dateStr).toLocaleDateString('es-CO', {
  day: '2-digit', month: 'short', year: 'numeric',
  timeZone: 'America/Bogota',
});

// Hora: "14:32"
new Date(dateStr).toLocaleTimeString('es-CO', {
  hour: '2-digit', minute: '2-digit', hour12: false,
  timeZone: 'America/Bogota',
});
```

Siempre usar `timeZone: 'America/Bogota'` para fechas de operación.

---

## 12. Iconografía

Todos los iconos son SVG inline estilo **outline** (no filled), con:
- `stroke="currentColor"` — hereda el color del texto del padre
- `strokeWidth="1.75"` para iconos de UI (sidebar, toolbar, labels)
- `strokeWidth="2"` para iconos de acción (botones, cierres)
- `strokeLinecap="round" strokeLinejoin="round"`
- `fill="none"`

**Tamaños estándar:**
| Contexto | Size |
|---|---|
| Sidebar | `16×16` |
| Toolbar / inline | `13×13` o `14×14` |
| Botones de acción | `16×16` |
| Cierre de drawer (X) | `20×20` |
| Chevron de acordeón | `12×12` |

---

## 13. Accesibilidad y micro-interacciones

- Todos los botones con estado disabled usan `disabled:opacity-40`
- Transiciones: siempre `transition-colors` en botones e inputs; `transition-all` cuando también cambia sombra
- Duración de transición Sidebar: `duration-200`
- Backdrop blur en overlay de drawer: `backdrop-blur-sm`
- Click fuera para cerrar: siempre implementar con `useRef` + `mousedown` listener, no con `blur`

---

## 14. Patrones de arquitectura UI

| Patrón | Regla |
|---|---|
| **Tabla → Drawer** | El detalle/edición de un registro siempre abre en drawer lateral, nunca en página nueva |
| **KPI reactivos** | Los KPI cards siempre reflejan el estado actual de los filtros aplicados. Usar `?aggregate=1` |
| **Lazy tabs** | Tabs dentro de drawer no re-fetcha al cambiar de pestaña. Usar `useRef(new Set())` |
| **Debounce búsqueda** | 400ms en tablas, 250ms en autocompletes inline |
| **Paginación server-side** | Siempre 50 registros/página (100 en inventario). El conteo `#` arranca según la página actual |
| **Export Excel** | Siempre disponible en tablas con datos. Aplica los mismos filtros activos. Usar `?all=1` |
| **Zona horaria** | Toda fecha de operación se muestra y filtra en `America/Bogota` (GMT-5) |
| **Null display** | Valores nulos o vacíos se muestran como `—` (guión em), nunca como vacío o "null" |

---

## 15. Checklist antes de publicar una nueva página

- [ ] ¿El fondo del `<main>` es `#F0F2F5`? (no blanco)
- [ ] ¿Los títulos usan `text-[15px] font-bold text-[#0B1A3B]`?
- [ ] ¿Las cards son `bg-white rounded-xl border border-gray-200`?
- [ ] ¿Los inputs tienen el ring naranja en foco?
- [ ] ¿Los badges de estado/producto siguen la paleta definida en §3.3–3.6?
- [ ] ¿Los KPIs reaccionan a los filtros activos (re-fetch aggregate)?
- [ ] ¿Las fechas usan `timeZone: 'America/Bogota'`?
- [ ] ¿Los valores vacíos muestran `—`?
- [ ] ¿Los iconos son SVG outline con `stroke="currentColor"`?
- [ ] ¿El drawer tiene overlay `bg-black/30 backdrop-blur-sm` que cierra al hacer click?
- [ ] ¿La búsqueda tiene debounce antes de llamar a la API?
- [ ] ¿Los botones tienen `transition-colors` y `disabled:opacity-40`?
