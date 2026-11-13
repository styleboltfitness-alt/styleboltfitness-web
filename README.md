# STYLEBOLTFITNESS · sitio web (listo para GitHub Pages)

Sitio estático: HTML, CSS y JavaScript, sin dependencias ni compilación.

## Archivos
| Archivo | Uso |
|---|---|
| `index.html` | Página completa |
| `assets/css/bolt.css` | Estilos (versión legible, para editar) |
| `assets/css/bolt.min.css` | Estilos minificados (los que usa la página) |
| `assets/js/bolt.js` | Comportamiento: WhatsApp, menú, próxima clase, simulador, pilares, visor de fotos |
| `assets/img/` | Fotos WebP en varios tamaños + `og-styleboltfitness.jpg` (imagen al compartir) |
| `assets/icons/` | Favicon (SVG y PNG), ícono de iPhone y de Android |
| `site.webmanifest` | Nombre e íconos para «Agregar a inicio» |
| `404.html` | Página de error de GitHub Pages |
| `robots.txt`, `.nojekyll` | Configuración para buscadores y GitHub Pages |

> Si editas `bolt.css`, vuelve a generar `bolt.min.css` o cambia el `<link>` del `index.html` a `assets/css/bolt.css`.

## Datos editables
Al inicio de `assets/js/bolt.js`: `CONFIG.whatsapp` (56993999020) y `CLASES` (horario semanal).

## Publicar en GitHub Pages
1. Sube **el contenido** de esta carpeta a la raíz del repositorio (incluido el archivo oculto `.nojekyll`).
2. Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
3. En 1–3 minutos queda en `https://USUARIO.github.io/REPOSITORIO/`.

## Dirección configurada
El sitio está preparado para **https://styleboltfitness-alt.github.io/styleboltfitness-web/** (canonical, imagen al compartir, sitemap). Si cambia la dirección o se usa un dominio propio, reemplazarla en `index.html`, `robots.txt` y `sitemap.xml`.

## Dominio propio (opcional)
- En `index.html`: activar `<link rel="canonical" href="...">` y cambiar `og:image` por la URL completa (`https://.../assets/img/og-styleboltfitness.jpg`) para que la vista previa al compartir funcione en todas las apps.
- En `robots.txt`: agregar la línea `Sitemap:` (y crear `sitemap.xml`).
- Dominio propio: crear un archivo `CNAME` con el dominio y configurarlo en Settings → Pages.

## Redes
Instagram @style.bolt_fitness · TikTok @styleboltfitness1 · Instagram del entrenador @marcelo.sanchezb
