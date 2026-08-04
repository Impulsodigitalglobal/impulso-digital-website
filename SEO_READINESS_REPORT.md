# SEO Readiness Report - Impulso Digital

Fecha: 2026-07-26

## Score Técnico

**88 / 100**

La website ya tiene una base técnica sólida para SEO profesional. El score no es 100 porque todavía falta conectar el dominio final, reemplazar placeholders reales de Google Search Console / GA4, y crear contenido SEO específico por servicio o ciudad.

## Implementado

- Metadata base con título descriptivo y meta description única.
- Canonical URL preparada para dominio final.
- Open Graph para previews en redes sociales.
- Twitter Card metadata.
- `robots.txt` con indexación permitida.
- `sitemap.xml` con la URL principal.
- `site.webmanifest` para metadata de navegador y mobile.
- `browserconfig.xml` para compatibilidad de navegador.
- Favicon y Apple touch icon usando assets de Impulso Digital.
- Placeholder para Google Search Console.
- Placeholder documentado para Google Analytics 4, sin cargar scripts falsos.
- Schema.org JSON-LD:
  - `Organization`
  - `LocalBusiness`
  - `WebSite`
  - `Service`
- Navegación crawlable invisible para buscadores con enlaces internos.
- Refuerzo de accesibilidad:
  - `aria-label` en navegación.
  - `aria-current` en links internos.
  - `aria-live` en cambios de sección.
  - Alt text descriptivo para imágenes que no lo tuvieran.
  - `loading` y `decoding` en imágenes para performance.
- Preload de logo principal y primera imagen del showcase.
- Mejor preparación para mobile-first indexing.
- Corrección visual móvil: botones ES / EN alineados a la derecha.

## Issues Encontrados

- El sitio es una experiencia SPA de una sola página. Google puede indexarla, pero para SEO competitivo sería mejor crear URLs reales por sección cuando el sitio crezca.
- El dominio final todavía no está confirmado. Se usó `https://impulsodigitalglobal.com/` como URL preparada.
- GA4 y Search Console están en placeholder, listos para reemplazarse.
- El contenido actual es más comercial/visual que SEO. Está bien para esta etapa, pero no está optimizado por keywords, ciudad o intención de búsqueda.
- Algunas imágenes son capturas grandes; conviene convertirlas a WebP/AVIF más adelante para mejorar Core Web Vitals.

## Recomendaciones Técnicas

- Reemplazar `https://impulsodigitalglobal.com/` por el dominio final si cambia.
- Reemplazar `GOOGLE_SEARCH_CONSOLE_VERIFICATION_PENDING` con el token real.
- Agregar GA4 cuando exista el ID final.
- Convertir imágenes grandes a WebP/AVIF.
- Crear un `og-image` dedicado de 1200x630 para previews.
- Cuando se publique, verificar indexación con Google Search Console.

## Futuras Mejoras de Contenido

- Crear una página o sección SEO para “websites para negocios locales”.
- Crear contenido específico para artistas, emprendedores y negocios locales.
- Agregar casos de estudio con texto real para KT Studios, Maria’s Housekeeping y Luis Landscaping.
- Agregar testimonios reales.
- Crear copy optimizado por ubicación cuando definan el mercado principal.
- Publicar artículos cortos sobre presencia digital, confianza online y websites para negocios pequeños.
