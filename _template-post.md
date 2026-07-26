---
# title: "Título del post — descriptivo y atractivo"
# description: "Descripción breve del artículo (se usa en listados, meta description y OG). Ideal: entre 120 y 160 caracteres."
# date: 2026-06-01
# category: politica | economia
# author: "Nombre del autor"
# status: draft | published
---

# Título del post

Escribí el contenido del artículo acá. Podés usar Markdown estándar: **negrita**, *cursiva*, listas, enlaces, etc.

## Sección 2

El contenido se organiza en secciones con títulos de nivel 2 y 3. En archivos `.mdx` también podés importar y usar componentes Astro.

### Consideraciones

- Los archivos `.md` no pueden importar componentes Astro — usá `.mdx` si los necesitás
- El campo `status` define si el post aparece en el listado público (`published`) o solo es accesible por URL directa con banner de borrador (`draft`)
- La fecha debe estar en formato `YYYY-MM-DD`; en el frontend se muestra como `DD/MM/YYYY`
- Las categorías disponibles son `politica` y `economia`
