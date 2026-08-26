# Jeremi Josue Caisachana - Digital Marketing & Creative Gym Portfolio

Benvenuto nel repository ufficiale del Portfolio Digitale e Palestra Creativa di **Jeremi Josue Caisachana**.  
Questo progetto unisce contenuti ad alto impatto visivo per il Digital Marketing, video storytelling, caroselli social, poster design e una palestra di creatività interattiva.

---

## Caratteristiche Principali

- **Reels & Video Storytelling**: Player video integrato con controlli audio/play/pause per visualizzare i progetti video (Vlog Fieramilano, ITS vs Università, ecc.).
- **Palestra Creativa (Creative Gym)**: Sezione interattiva per visualizzare le sfide creative e i concept di design.
- **Caroselli Social & Poster Gallery**: Visualizzazione interattiva dei caroselli (es. AC Milan, Coca-Cola) e poster grafici in alta risoluzione con modalità full screen e zoom.
- **Voice Chatbot & AI Concept**: Dimostrazione interattiva di progetti legati all'Intelligenza Artificiale e innovazione tecnologica.
- **Download Diretto CV**: Pulsante con download istantaneo del curriculum in formato PDF (`Curriculum_Jeremi_Josue_Caisachana.pdf`).
- **Contatto Diretto**: Collegamenti rapidi per WhatsApp (`+39 345 469 0373`), Email e Instagram.

---

## Stack Tecnologico

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Stile & Design**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animazioni**: [Motion (Framer Motion)](https://motion.dev/), [GSAP](https://gsap.com/)
- **Icone**: [Lucide React](https://lucide.dev/)
- **Backend / Server API**: [Express](https://expressjs.com/) (per supporto full-stack e download del CV)

---

## Struttura del Progetto

```text
├── public/                 # File multimediali statici (immagini, video MP4, PDF del CV)
│   ├── Curriculum_Jeremi_Josue_Caisachana.pdf
│   ├── videos/             # Video dei progetti e reel
│   └── ...                 # Immagini caroselli e poster
├── src/
│   ├── App.tsx             # Componente principale dell'applicazione
│   ├── portfolioData.ts    # Dati e contenuti di tutti i progetti, video e caroselli
│   ├── main.tsx            # Entry point React
│   └── index.css           # Stili globali e direttive Tailwind CSS
├── server.ts               # Server Express per routing API e file serving
├── vite.config.ts          # Configurazione di Vite con alias e ottimizzazioni
├── package.json            # Dipendenze e script di compilazione
└── .github/workflows/      # GitHub Actions per il deploy automatico su GitHub Pages
```

---

## Guida all'Installazione e Sviluppo Locale

### 1. Prerequisiti
- [Node.js](https://nodejs.org/) (versione 18 o superiore consigliata)
- `npm`, `pnpm` o `yarn`

### 2. Installazione delle dipendenze
Clona il repository sul tuo computer ed esegui:
```bash
git clone https://github.com/josuecaisa04/JosueCaisaPortfolio.git
cd JosueCaisaPortfolio
npm install
```

### 3. Avvio in modalità di sviluppo
Avvia il server di sviluppo locale con:
```bash
npm run dev
```
Apri il browser su `http://localhost:3000`.

### 4. Compilazione per la produzione
Per compilare sia il frontend statico che il server:
```bash
npm run build
```
Per avviare la build di produzione:
```bash
npm start
```

Per compilare solo il frontend statico (utile per GitHub Pages, Vercel o Netlify):
```bash
npm run build:static
```

---

## Deployment

### Opzione A: GitHub Pages (Automatica)
Il repository include già una GitHub Action configurata in `.github/workflows/deploy.yml`:
1. Vai nelle **Impostazioni del repository (Settings)** su GitHub.
2. Seleziona **Pages** nella barra laterale sinistra.
3. Sotto **Build and deployment > Source**, seleziona **GitHub Actions**.
4. Ogni volta che fai un `git push` sul branch `main` o `master`, il sito verrà automaticamente compilato e pubblicato online!

### Opzione B: Vercel / Netlify / Render
1. Collega il repository GitHub su Vercel o Netlify.
2. Imposta il Build Command su: `npm run build:static`
3. Imposta la Output Directory su: `dist`
4. Il deploy avverrà automaticamente a ogni push.

---

## Contatti & Social

- **Email**: [jeremyjosue334@gmail.com](mailto:jeremyjosue334@gmail.com)
- **WhatsApp**: [+39 345 469 0373](https://wa.me/393454690373)
- **Portfolio Live**: [josuecaisa04.github.io/JosueCaisaPortfolio](https://josuecaisa04.github.io/JosueCaisaPortfolio/)

---

## Licenza

Tutti i diritti sui contenuti grafici, video e progetti appartengono a **Jeremi Josue Caisachana**.
