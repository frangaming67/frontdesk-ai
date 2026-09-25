# FrontDesk AI — Demo (Miami Smile Dental)

Commercial demo of an AI receptionist for dental practices. Built with Next.js
(App Router), TypeScript, and Tailwind CSS. No backend, no database, no API
keys required. It runs locally or on Vercel; lead data stays in each visitor's
browser. Hosting it does not create a shared database or notify the clinic.

- Live demo: https://frontdesk-ai-flame.vercel.app
- GitHub (private): https://github.com/frangaming67/frontdesk-ai
- Pushes to `main` publish through the connected Vercel project.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

- `/` — landing page
- `/chat` — the AI receptionist (try the suggested prompt about Invisalign)
- `/dashboard` — leads dashboard
- `/dashboard/leads/[id]` — a single lead with its full conversation

> Note: fonts (Fraunces, Inter) load from Google Fonts at build/dev time via
> `next/font/google`. You need normal internet access the first time you run
> `npm run dev` or `npm run build` so Next.js can fetch them (cached after
> the first successful run).

## How the demo flow works

1. Open `/chat` and ask about Invisalign (or click the suggested prompt).
2. Say yes to a consultation, then give a name, contact, day, and time.
3. On completion, a lead is created and stored in `localStorage`.
4. Click **View captured lead** to see the saved details and full conversation.
5. Open `/dashboard` to search inquiries, filter their status or mark a lead contacted.

## Architecture

- `lib/knowledge-base/` — the only source of truth for practice info
  (name, hours, treatments, FAQ). No prices are stored — the AI is not
  allowed to invent them.
- `lib/ai/AIService.ts` — interface the chat UI depends on.
  `lib/ai/DemoAIService.ts` — the only implementation today: a scripted,
  explainable conversation state machine (no external API key needed).
  A future `RealAIService` (LLM-backed) can implement the same interface
  without touching any component.
- `lib/leads/LeadRepository.ts` — interface for lead persistence.
  `lib/leads/LocalLeadRepository.ts` — the only implementation today,
  backed by `localStorage`. It is the only place that touches
  `localStorage` directly. A future `DatabaseLeadRepository` can replace
  it without touching any component.
- `lib/intent/detectIntent.ts` — small, explainable heuristic for
  HIGH / MEDIUM / LOW intent.
- `data/seed-leads.ts` — fictional leads so the dashboard isn't empty on
  first load.

All data (practice, leads, patients) is fictional and created for this demo.

## Mejoras para las demos comerciales

- Diseño coherente en landing, chat y dashboard, con navegación clara y tarjetas
  de leads en móvil. El chat muestra el progreso y ofrece respuestas rápidas.
- Vista previa al compartir: título, descripción, Open Graph y Twitter Card con
  imagen de 1200 × 630, generada por Next.js en `/opengraph-image`.
- Dashboard: **Reset demo leads** → **Reset and restore examples** elimina los
  leads de prueba de este navegador y restaura los cuatro ejemplos y sus estados
  originales. **Cancel** conserva los datos. Las métricas y los filtros se actualizan.
- Chat: más variantes de tratamientos, precios, reservas, afirmaciones y rechazos;
  preguntas intermedias sin perder los datos; validación de email/teléfono;
  respuestas alternativas cuando una consulta no se reconoce.
- Los precios siguen pendientes de evaluación del equipo. Las preguntas médicas
  se derivan y el cierre siempre es una solicitud, nunca una cita confirmada.

## Subir a Vercel

La carpeta del proyecto es la que contiene `package.json`, `app/` y `lib/`.
En esta copia está dentro de una segunda carpeta `frontdesk-ai`.

### Opción rápida: desde PowerShell, sin preparar GitHub

```powershell
cd C:\Users\franc\Downloads\frontdesk-ai\frontdesk-ai
npx vercel@latest login
npx vercel@latest --prod
```

Si `npx` pregunta si puede instalar Vercel CLI, aceptá. En el asistente de deploy:

1. Elegí tu cuenta/equipo y creá un proyecto nuevo (o vinculá uno existente).
2. Usá `./` como directorio del código.
3. Dejá la detección de **Next.js** y los ajustes de build predeterminados.
4. Al terminar, Vercel muestra el enlace de producción para compartir.

El proyecto ya está publicado y conectado al repositorio: los cambios en `main`
se publican automáticamente. Para un deploy manual, ejecutá `npx vercel@latest --prod`
desde la misma carpeta. [Documentación de Vercel CLI](https://vercel.com/docs/projects/deploy-from-cli).

### Alternativa: importar desde GitHub

Subí el código a un repositorio y luego importalo desde **Add New → Project** en
Vercel. Elegí **Next.js** como framework. En **Root Directory**, seleccioná la
carpeta que contiene `package.json`: `./` si subiste el contenido de la carpeta
interna, o `frontdesk-ai` si subiste la carpeta externa completa.

| Ajuste | Valor |
| --- | --- |
| Framework | Next.js |
| Install command | Predeterminado (`npm install`) |
| Build command | `npm run build` |
| Output directory | Predeterminado de Next.js |
| Variables obligatorias / API keys | Ninguna |

No subas `node_modules`, `.next`, `.vercel` ni archivos `.env` con valores privados;
ya están excluidos en `.gitignore`.

### URL e imagen del enlace

El código usa `VERCEL_PROJECT_PRODUCTION_URL`, con `VERCEL_URL` como alternativa,
para crear enlaces absolutos a la imagen. Vercel expone esas variables de sistema
cuando está habilitada la opción **Enable access to System Environment Variables**.
No hace falta copiar una URL manualmente para el deploy habitual.
([Variables de sistema](https://vercel.com/docs/environment-variables/system-environment-variables)).

Si usás otro dominio o desactivaste esas variables, definí
`NEXT_PUBLIC_SITE_URL=https://tu-dominio.com` en Vercel y hacé un nuevo deploy.
Sin esas variables, el entorno local usa `http://localhost:3000`.
`.env.example` documenta esta opción sin activar un dominio de ejemplo.

### Comprobación después de publicar

1. Abrí el enlace de producción en incógnito para confirmar que un prospecto puede acceder.
2. Entrá a `/chat`, preguntá por Invisalign y completá una solicitud con datos ficticios.
3. Abrí el dashboard en **ese mismo navegador**; revisá el lead y su conversación.
4. Probá **Reset demo leads** para preparar la próxima presentación.
5. Abrí `/opengraph-image` y compartí el enlace de producción para comprobar la vista
   previa en la aplicación elegida. Algunas aplicaciones conservan la imagen anterior
   en caché o no muestran vistas previas.

**Límite de esta demo:** cada navegador y cada dominio tienen sus propios leads.
Los datos de `localhost` no se transfieren al dominio de Vercel, y no vas a ver
desde tu computadora los leads que genere un prospecto en la suya. No se envían
emails ni se reservan citas reales.

## Validación local

```bash
npm ci
npm test
npm run lint
npm run build
npm start
```

`npm test` ejecuta regresiones del flujo conversacional y del reset/persistencia.
`npm run build` también verifica TypeScript. Usá `npm start` después del build para
revisar la versión de producción local. Se mantienen las fuentes originales de
Google, por lo que la compilación necesita acceso a Google Fonts.
