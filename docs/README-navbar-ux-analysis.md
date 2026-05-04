# Barra de navegación pública — análisis UX/UI exhaustivo

Documento de trabajo para el rediseño propio de la zona pública: describe **el estado del header**, la **saturación que percibe el ojo**, la solución **§8.7** (un enlace **Sign in** → `/login` con pestañas, sin API), y **cómo no repetir** la prueba de dos botones en la franja.

**Ámbito:** `PublicNavbar`, drawer (`HamburgerMenu`), `NavbarSearch`, `PublicThemeToggle`. No incluye footer ni player global.

---

## 0. Síntesis honesta (lo que le pasa a la barra a simple vista)

En **una sola franja** de 64px de alto el usuario ve, en desktop: **marca** + **cuatro enlaces** de sección + a la derecha, en secuencia, **búsqueda** (aunque arranque en icono), **tres pictogramas/rueditas de tema** y un **botón naranja entero** (“For Artists”). Eso es **mucha señal competidora** en poco ancho, sobre todo en el **cluster derecho**: el ojo no hace “análisis de taxonomía”, hace **conteo visual** y termina con la impresión de **demasiadas cosas en la barra**.

Eso **no** se soluciona diciendo que el centro está vacío: el vacío no quita que el **bloque derecho** esté abarrotado de significados distintos (buscar, pintar el sitio, ir al panel de artistas).

**Evidencia en el propio rediseño:** en una iteración se **sumaron** en esa misma fila **Sign in** y **Create account** (placeholder). **Cargó más la barra** y reforzó justo la sensación de exceso; por eso **esos controles se sacaron del código** y el análisis **no** propone “pegotear” dos botones más sin reagrupar. El fallo de esa prueba no es el README: es la **física** del header en una sola línea.

El documento que sigue desglosa *por qué* se siente así y *qué* se puede hacer cuando haya auth de verdad, sin asumir que hoy haya entradas de cuenta en el repo.

---

## 1. Objetivo de este análisis

- Fijar **criterio de producto** antes de volver a tocar el header: **percepción de saturación** es un riesgo real, no un detalle.
- Relacionar **inventario técnico** con **carga visual** (no confundir “pocos tipos de componente” con “poca carga en el ojo”).
- Proponer **cómo** integrar Sign in / Create account **sin** repetir la iteración que apretó la barra (menú único, solo “Sign in”, etc.).

---

## 2. Método y criterios usados

- **Inspección heurística** (Nielsen, versión resumida): visibilidad del estado, consistencia, prevención de error, flexibilidad, estética minimalista, reconocimiento, documentación (en este caso, affordance de controles).
- **Leyes de tiempos de respuesta** (Hick–Hyman): más alternativas **independientes** en un mismo tramo de UI incrementan el tiempo de decisión.
- **Carga cognitiva** (Sweller, aplicado a UI): distinguir carga **intrínseca** (tarea “qué quiero hacer”) e **extrínseca** (cómo de difícil es operar la interfaz en ese tramo).
- **Ley de Fitts**: distancia y tamaño de los targets en el cluster derecho.
- **Patrones de escaneo** (Nielsen Norman, resumen): en cabeceras web, frecuente patrón en **F** o barra superior horizontal seguida de salto al contenido.

Ninguno de estos métodos “prohíbe” un número fijo de ítems; sí advierten cuando **varias intenciones distintas** compiten en **poco espacio lineal**.

---

## 3. Inventario detallado del estado actual

### 3.1 Desktop (`lg` y superior, ~1024px+)

**Altura fija aparente:** `h-16` (64px) — una sola franja; todo compite en altura similar.

| Orden visual (izquierda → derecha) | Elemento | Tipo de control | Función semántica |
|-------------------------------------|----------|-----------------|-------------------|
| 1 | Icono + texto “Proton” | `Link` | Marca, retorno a home |
| 2–5 | Radio, Shows, Charts, Labels | `Link` ×4 | Navegación **primaria de contenido** |
| 6 | Lupa (colapsada) / campo al expandir | `button` + `input` | **Descubrimiento** (búsqueda global MVP) |
| 7 | Sol — interruptor — Luna | `button` (switch) | **Preferencia de apariencia** |
| 8 | **Sign in** + icono | `Link` → `/login` | **Una sola entrada** a cuenta (§8.7); registro en la página |
| 9 | “For Artists” + icono dashboard | `Link` | **CTA** creadores → `/dashboard` |

**Conteo:** en la franja derecha entran **búsqueda**, **tema**, **Sign in** (un target) y **For Artists**; los cuatro enlaces de contenido siguen a la izquierda.

### 3.2 Móvil (por debajo del breakpoint `lg`)

En la **barra visible** (64px):

| Elemento | Función |
|----------|---------|
| Hamburguesa | Abrir drawer |
| Marca centrada | Home / identidad |

No hay búsqueda ni tema en la barra fija: se **descargan** al drawer para **no** multiplicar iconos en una fila ya ocupada por marca centrada y menú.

**En el drawer:** Búsqueda, cuatro enlaces de contenido, **Sign in** (misma ruta `/login`), toggle de tema, CTA “For Artists”.

### 3.3 Lo que falta o está diferido (respecto a un producto con auth real)

- **Create account** como **segundo botón** en la barra: **no** (va en la pestaña dentro de `/login`, §8.7).
- **Sesión iniciada** (avatar, “Mi cuenta”, cerrar sesión): aún no.
- **Backend / API** de login y registro: prototipo sin integración.

Un **solo** “Sign in” en header cumple la expectativa mínima de “punto de entrada” sin repetir la prueba de **dos** CTAs de cuenta en la misma fila.

---

## 4. Patrón de escaneo y jerarquía visual

### 4.1 Lectura típica (LTR, desktop)

1. **Logo** → ancla de marca.
2. **Enlaces primarios** (Radio… Labels) → “¿dónde voy dentro del sitio?”
3. **Ojo salta al margen derecho** → zona de **utilidades globales** y **CTA**.

El margen derecho concentra **alta densidad de decisión** en pocos centímetros: **tipos de decisión distintos** (buscar, tema, **cuenta**, panel de artistas).

### 4.2 Contraste de peso visual

- **For Artists** es el único bloque con **fondo de acento sólido** en ese cluster: CTA **primario** del bloque derecho para creadores.
- **Sign in** (enlace con borde, hover/focus y estado activo en `/login`) es **secundario** frente al naranja: no compite por relleno sólido.
- **Búsqueda** minimizada reduce peso hasta que el usuario **elige** expandir: buen mecanismo para **no** competir con el CTA naranja en reposo.
- **Tema** ocupa ancho fijo (sol + switch + luna): lectura clara pero **siempre visible**: consume anchura lineal de forma estable.

---

## 5. Taxonomía de intenciones vs controles

| Intención del usuario | Control actual | ¿Está en barra desktop? |
|----------------------|----------------|-------------------------|
| Explorar secciones del sitio | Radio, Shows, Charts, Labels | Sí |
| Encontrar algo concreto | Búsqueda | Sí (minimizada) |
| Ajustar lectura (claro/oscuro) | Theme toggle | Sí |
| Iniciar sesión (oyente) | Sign in → `/login` | Sí (un enlace) |
| Crear cuenta / registrarse | Pestaña en `/login` | **No** en barra (§8.7) |
| Acceder como artista al producto B2B | For Artists | Sí |

**Sesión iniciada** (avatar, menú “Mi cuenta”): aún no.

**Sign in** marca el polo “cuenta oyente” frente a **For Artists** sin poner **dos** CTAs de auth en la misma fila.

---

## 6. Por qué la barra se siente “llena” — y por qué sumar auth empeoró lo que ya se veía

### 6.1 La base ya era pesada para el ojo

En el margen derecho conviven **varios tipos de acción** muy visibles a la vez (búsqueda, interruptor de tema con tres piezas, **Sign in**, CTA sólido). Aunque la búsqueda arranque minimizada, al expandir **ocupa más** y el sector derecho se vuelve **aún más denso**. La lectura de “demasiadas cosas” ya aparecía **antes** de volver a probar dos botones de cuenta en fila; **Sign in** como **único** enlace a `/login` intenta **limitar** ese crecimiento frente a la prueba fallida de dos CTAs.

### 6.2 Heterogeneidad = más esfuerzo mental en el mismo centímetro

Tres familias en el cluster derecho:

1. **Exploración** (búsqueda)
2. **Preferencia de interfaz** (tema)
3. **Conversión / segmento** (For Artists)

Cada salto de categoría fuerza un **micro-replanteo**. Eso suma carga **extrínseca**: no es solo “muchos íconos”, es **cambiar de pregunta** (¿busco? ¿cambio tema? ¿soy artista?) en el mismo tramo.

### 6.3 Prueba en el rediseño: añadir Sign in + Create account en la misma fila

Se implementó en el prototipo **colocar dos acciones de cuenta** junto a búsqueda, tema y For Artists. **Resultado:** la barra se vio **más cargada**; al mirarla, **sí** parece “demasiado” — porque **lo es** en términos de **competencia por espacio y atención**. Por eso esa UI **no se mantuvo**: el propio ejercicio sirvió para **validar** el límite del header actual, no para negarlo.

### 6.4 Anchura lineal y Ley de Fitts

En anchos intermedios (`lg` justo por encima del breakpoint), el cluster derecho agrupa **varios targets** seguidos. Cada control extra **sin** agrupación ni separación empeora errores de clic y la sensación de apretura.

### 6.5 El hueco central no “equilibra” el derecho

El espacio entre “Labels” y el cluster derecho **no compensa** visualmente la densidad del margen derecho: el usuario **no mira el centro** cuando busca “qué puedo hacer ya”; mira **logo, links y esquina**. El hueco ayuda al layout, **no** baja el conteo de elementos que compiten en la esquina.

---

## 7. El gap Sign in / Create account: implicancias

### 7.1 Expectativa de usuario

En sitios de radio/streaming, la esquina superior derecha suele alojar **cuenta** o **inicio de sesión**. Su ausencia puede interpretarse como:

- Producto **solo lectura** (aceptable en prototipo).
- O **omisión** no intencionada (riesgo de confianza si el sitio promete funciones futuras ligadas a cuenta).

### 7.2 Qué pasa si se añaden dos botones **literales** en la misma fila

Sin rediseño de agrupación, se suman **dos decisiones** más en el mismo tramo lineal:

- Aumenta el **conteo de Hick** en el cluster derecho.
- Compiten por jerarquía con **For Artists** si se les da demasiado contraste.
- En anchos **entre `lg` y `xl`**, puede aparecer **overflow**, truncado o salto de línea (anti–patrón en header de una sola altura).

Por eso el análisis **no** recomienda repetir “pegar Sign in y Create account” en la misma fila **sin** reducir peso en otro lado o **reagrupar** — la prueba en prototipo ya mostró el efecto en la barra.

---

## 8. Estrategias posibles para incorporar auth (cuando exista producto)

Estas son **alternativas de diseño**; ninguna está implementada en el código actual.

### 8.1 Un solo entry “Account” (dropdown o sheet)

- **Ventaja:** un target en barra; dentro, Sign in, Create account, ayuda legal.
- **Costo:** implementación de menú accesible (`aria-expanded`, foco, Escape).

### 8.2 Solo “Sign in” en barra

- **Create account** como enlace secundario **en la pantalla de login** (patrón muy común).
- **Ventaja:** menos anchura; jerarquía clara (la mayoría de usuarios recurrentes van a login).

### 8.3 Sign in como texto; Create account solo en footer o modal desde login

- **Ventaja:** minimiza competencia con For Artists.
- **Riesgo:** registro menos visible (solo aceptable si métricas lo permiten).

### 8.4 Cuenta solo en móvil dentro del drawer (no en barra fija)

- **Ventaja:** la barra móvil sigue siendo hamburger + marca.
- **Desventaja:** en desktop sigue faltando entrada visible si no se añade nada en `lg+`.

### 8.5 Separador visual entre bloques

- Entre “utilidades oyente” (búsqueda + futura cuenta) y “For Artists”, un **margen mayor** o línea vertical sutil puede **reducir errores de clic** y refuerzo semántico, sin añadir nuevos textos.

### 8.6 Segunda fila de header solo en home (patrón promo / subnav)

- Solo si el negocio lo exige; aumenta altura y complejidad operativa (sticky, sombras, accesibilidad).

### 8.7 Foros, literatura breve y propuesta: un botón → página de login / registro

**Dónde se discute “demasiados ítems en la nav” (comunidad UX, no “foro random”):** en **UX Stack Exchange** (Q&A con votos, referencia habitual en la industria) aparecen hilos directamente útiles:

- *UX alternative for too many navigation items* — alternativas cuando hay muchos ítems de primer nivel. [https://ux.stackexchange.com/questions/107069/ux-alternative-for-too-many-navigation-items](https://ux.stackexchange.com/questions/107069/ux-alternative-for-too-many-navigation-items)
- *Navigation too long, any real case solves this issue?* — casos reales y recortar / reagrupar. [https://ux.stackexchange.com/questions/107133/navigation-too-long-any-real-case-solves-this-issue](https://ux.stackexchange.com/questions/107133/navigation-too-long-any-real-case-solves-this-issue)
- *Large Number of Menu Items and UX* — muchos items y trade-offs. [https://ux.stackexchange.com/questions/55196/large-number-of-menu-items-and-ux](https://ux.stackexchange.com/questions/55196/large-number-of-menu-items-and-ux)
- *Pros and cons of an overflowing horizontal scrollable nav bar* — por qué el scroll horizontal en la barra suele ser mala idea; refuerza **no** apilar sin límite. [https://ux.stackexchange.com/questions/135434/what-are-the-pros-and-cons-with-an-overflowing-horizontal-scrollable-nav-bar](https://ux.stackexchange.com/questions/135434/what-are-the-pros-and-cons-with-an-overflowing-horizontal-scrollable-nav-bar)

**Síntesis de lo que suelen recomendar (y encaja con buenas prácticas amplias):** **reorganizar la IA**, **agrupar** o **sacar a un segundo nivel** (submenú, “More”, hamburguesa en móvil), **priorizar** lo visible y evitar filas interminables; en barra horizontal, muchas veces se sugiere **reducir el número de destinos al primer vistazo** en lugar de añadir scroll lateral al menú.

**Posible solución (anotada): un solo control en la barra con feedback claro → una página donde entrar o crear cuenta**

- **Idea:** en el header, **un único botón o enlace** (p. ej. “Sign in” / “Account”) con **estado hover/focus evidente** y que **navegue** a una **ruta dedicada** (`/login`, `/account`, etc.) donde el usuario elija **iniciar sesión** o **registrarse** (pestañas, dos bloques o formulario único con enlace “Create account”).
- **Encaje con teoría / práctica habitual:** reduce **ítems de primer nivel** en la barra (menos competencia con búsqueda, tema y “For Artists”), alinea con **una entrada clara** hacia el espacio de cuenta — mismo espíritu que **§8.2** (“solo Sign in en barra” + registro en la pantalla siguiente). Es coherente con **simplificar elecciones en la cabecera** y mover el detalle al siguiente paso (NN/g y estudios de homepage suelen insistir en **claridad de rutas críticas** y **evitar duplicar destinos** innecesarios en la misma zona).
- **Baymard** y otros centros publican guías para **simplificar sign-in** (menos fricción en el camino al login); tener **una sola puerta** desde la barra y **decidir login vs registro en la página** suele ser **mejor** que dos botones grandes en la franja ya saturada.
- **Matiz:** el botón debe tener **etiqueta inequívoca** (“Sign in”, “Log in”, “Account”) y la página destino debe cumplir **expectativa** (no landing vacío); en **móvil** puede repetirse la misma idea o vivir en el drawer si la barra sigue minimalista.

---

## 9. Accesibilidad y densidad

- Cada nuevo control en la misma fila debe mantener **área mínima** razonable (~44×44 CSS px en táctil; en desktop el estándar suele ser algo menor pero consistente).
- **Orden de foco** (teclado): logo → primarios → búsqueda → tema → [futura cuenta] → For Artists. Saltos bruscos si el orden visual no coincide con el DOM.
- **Etiquetas**: “For Artists” ya distingue audiencia; futuros “Sign in” deben evitar ambigüedad con el dashboard de artistas.

---

## 10. Tabla resumen: tensión “añadir cuenta” vs “no sobrecargar”

| Enfoque | Reduce densidad percibida | Riesgo |
|---------|---------------------------|--------|
| Un botón en barra → página login/registro (§8.7) | Alto (un solo target) | Página destino debe cumplir expectativa; registro puede ser tab secundario |
| Dropdown “Account” | Alto | Más desarrollo y patrones A11Y |
| Solo Sign in en barra | Medio–alto | Registro menos visible |
| Cuenta solo en drawer móvil | Medio en móvil | Inconsistencia desktop/móvil si no se compensa |
| Dos botones explícitos en barra (como en la prueba) | Muy bajo | **Saturación** visible; colisión con tema, búsqueda y CTA; confirma el límite del header actual |

---

## 11. Referencias en el repo (estado al redactar)

| Pieza | Archivo |
|--------|---------|
| Barra pública | `components/public/Navbar.tsx` |
| Drawer móvil | `components/public/HamburgerMenu.tsx` |
| Búsqueda minimizada | `components/public/NavbarSearch.tsx` |
| Tema claro/oscuro | `components/public/PublicThemeToggle.tsx` |
| Layout zona pública | `app/(public)/layout.tsx` |
| Página `/login` (pestañas inicio / registro, prototipo sin API) | `app/(public)/login/page.tsx`, `app/(public)/login/layout.tsx`, `components/public/LoginSignUpView.tsx` |

**Patrón §8.7 en código:** un único control **Sign in** (desktop + bloque en drawer) enlaza a **`/login`**; crear cuenta está en la **segunda pestaña** de esa página, no como segundo botón en la franja superior.

---

## 12. Conclusión

1. A **ojo de usuario**, la barra sigue siendo **densa** a la derecha (búsqueda + tema en tres piezas + **un solo** Sign in + CTA naranja). El hueco central **no diluye** esa impresión.
2. **Sumar dos botones** (Sign in + Create account) **en la misma fila** del header **recargó** la barra en la prueba anterior; por eso se descartó ese layout.
3. La implementación actual sigue **§8.7**: **un enlace** a **`/login`** y **registro en la página** (pestaña), en línea con **§8.2** y la tabla de la **sección 10**.
4. Los formularios son **prototipo** hasta existir backend; el foco del rediseño es **densidad** y **una sola puerta** visible en barra.

---

*Última actualización: implementado §8.7 (`/login` + Sign in en navbar/drawer); sin API de auth.*
