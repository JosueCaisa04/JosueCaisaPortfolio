import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createCV() {
  const pdfDoc = await PDFDocument.create();

  // Load standard fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Load profile photo if exists
  let embeddedImage = null;
  try {
    if (fs.existsSync('/tmp/profile_pic.jpg')) {
      const imgBytes = fs.readFileSync('/tmp/profile_pic.jpg');
      embeddedImage = await pdfDoc.embedJpg(imgBytes);
    }
  } catch (e) {
    console.log('Profile image embed skipped:', e.message);
  }

  // Colors
  const black = rgb(0.08, 0.08, 0.08);
  const grayDark = rgb(0.2, 0.2, 0.2);
  const grayMuted = rgb(0.45, 0.45, 0.45);
  const lineGray = rgb(0.85, 0.85, 0.85);
  const linkBlue = rgb(0.05, 0.35, 0.75);

  const PAGE_WIDTH = 595.28; // A4 width
  const PAGE_HEIGHT = 841.89; // A4 height
  const LEFT_COL_X = 36;
  const LEFT_COL_WIDTH = 160;
  const RIGHT_COL_X = 220;
  const RIGHT_COL_WIDTH = 340;

  // Helper to wrap text
  function wrapText(text, font, size, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  function drawText(page, text, x, y, font, size, color) {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color,
    });
  }

  function drawWrappedText(page, text, x, startY, font, size, color, maxWidth, lineHeight) {
    const lines = wrapText(text, font, size, maxWidth);
    let currentY = startY;
    for (const line of lines) {
      drawText(page, line, x, currentY, font, size, color);
      currentY -= lineHeight;
    }
    return currentY;
  }

  // ==========================================
  // PAGE 1
  // ==========================================
  const page1 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const photoX = LEFT_COL_X;
  const photoY = PAGE_HEIGHT - 175;
  const photoWidth = 125;
  const photoHeight = 140;

  if (embeddedImage) {
    page1.drawImage(embeddedImage, {
      x: photoX,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
    });
  } else {
    page1.drawRectangle({
      x: photoX,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
      color: rgb(0.92, 0.92, 0.94),
      borderColor: rgb(0.8, 0.8, 0.85),
      borderWidth: 1,
    });
  }

  // Left Column Content - Page 1
  let leftY = PAGE_HEIGHT - 195;

  // Profilo
  drawText(page1, 'Profilo', LEFT_COL_X, leftY, fontBold, 11.5, black);
  leftY -= 13;
  leftY = drawWrappedText(
    page1,
    'Sono una persona creativa, motivata e con forte voglia di apprendere. Attualmente alla ricerca di un’opportunità lavorativa che mi permetta di crescere.',
    LEFT_COL_X,
    leftY,
    fontRegular,
    8.5,
    grayDark,
    LEFT_COL_WIDTH,
    11.5
  );

  leftY -= 14;
  // Lingue
  drawText(page1, 'Lingue', LEFT_COL_X, leftY, fontBold, 11.5, black);
  leftY -= 13;
  drawText(page1, 'Spagnolo', LEFT_COL_X, leftY, fontBold, 8.5, black);
  drawText(page1, 'Madrelingua', LEFT_COL_X + 65, leftY, fontRegular, 8.5, grayDark);
  leftY -= 11;
  drawText(page1, 'Italiano', LEFT_COL_X, leftY, fontBold, 8.5, black);
  drawText(page1, 'Madrelingua', LEFT_COL_X + 65, leftY, fontRegular, 8.5, grayDark);
  leftY -= 11;
  drawText(page1, 'Inglese', LEFT_COL_X, leftY, fontBold, 8.5, black);
  drawText(page1, 'B1', LEFT_COL_X + 65, leftY, fontRegular, 8.5, grayDark);

  leftY -= 15;
  // Interessi
  drawText(page1, 'Interessi', LEFT_COL_X, leftY, fontBold, 11.5, black);
  leftY -= 13;
  leftY = drawWrappedText(
    page1,
    'Ho interessi che spaziano dal calcio, apprezzando il lavoro di squadra e la disciplina che questo sport richiede, alla musica, con particolare attenzione alle tendenze e ai contenuti digitali più attuali. Sono inoltre curioso verso la tecnologia e l’innovazione, soprattutto per quanto riguarda gli strumenti digitali e le loro applicazioni pratiche.',
    LEFT_COL_X,
    leftY,
    fontRegular,
    8.5,
    grayDark,
    LEFT_COL_WIDTH,
    11
  );

  leftY -= 15;
  // Info e Contatti
  drawText(page1, 'Info e Contatti', LEFT_COL_X, leftY, fontBold, 11.5, black);
  leftY -= 13;
  drawText(page1, '• Nato il 26 Settembre 2004', LEFT_COL_X, leftY, fontBold, 8.5, black);
  leftY -= 10;
  drawText(page1, '  cittadinanza Italo-Ecuadoregna', LEFT_COL_X, leftY, fontRegular, 8, grayDark);

  leftY -= 13;
  drawText(page1, '• Via Bettinetti Rho', LEFT_COL_X, leftY, fontBold, 8.5, black);

  leftY -= 13;
  drawText(page1, '• +39 345 4690 373', LEFT_COL_X, leftY, fontBold, 8.5, black);

  leftY -= 13;
  drawText(page1, '• jeremyjosue334@gmail.com', LEFT_COL_X, leftY, fontBold, 8, black);

  leftY -= 20;
  // Signature
  drawText(page1, 'Jeremi Josue Caisachana', LEFT_COL_X, leftY, fontOblique, 10, grayMuted);

  // Vertical separator line
  page1.drawLine({
    start: { x: 205, y: PAGE_HEIGHT - 35 },
    end: { x: 205, y: 55 },
    thickness: 0.8,
    color: lineGray,
  });

  // Right Column Content - Page 1
  let rightY = PAGE_HEIGHT - 65;

  // Name Header
  drawText(page1, 'Jeremi Josue Caisachana Pillajo', RIGHT_COL_X, rightY, fontBold, 18, black);
  rightY -= 12;

  // Horizontal Accent Bar
  page1.drawRectangle({
    x: RIGHT_COL_X,
    y: rightY,
    width: 25,
    height: 3.5,
    color: black,
  });
  rightY -= 24;

  // Section Title: Istruzione
  drawText(page1, 'Istruzione', RIGHT_COL_X, rightY, fontBold, 13.5, black);
  rightY -= 16;

  // Item 1: ATTUALMENTE | FONDAZIONE ITS AMMI MILANO
  drawText(page1, 'ATTUALMENTE | FONDAZIONE ITS AMMI MILANO', RIGHT_COL_X, rightY, fontBold, 9.5, black);
  rightY -= 12;
  drawText(page1, 'Digital marketing', RIGHT_COL_X, rightY, fontBold, 9, black);
  rightY -= 11;
  rightY = drawWrappedText(
    page1,
    'Percorso di alta specializzazione post-diploma focalizzato sulla progettazione e gestione della presenza digitale di aziende e brand. Il corso combina lezioni teoriche con laboratori pratici intensivi per padroneggiare gli strumenti di comunicazione e vendita online più moderni.',
    RIGHT_COL_X,
    rightY,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  rightY -= 10;
  page1.drawLine({ start: { x: RIGHT_COL_X, y: rightY }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: rightY }, thickness: 0.5, color: lineGray });
  rightY -= 12;

  // Item 2: 2024-2025 | ISTITUTO TECNICO I.T. ENRICO MATTEI, RHO
  drawText(page1, '2024-2025 | ISTITUTO TECNICO I.T. ENRICO MATTEI, RHO', RIGHT_COL_X, rightY, fontBold, 9.5, black);
  rightY -= 12;
  drawText(page1, 'Diploma Sistemi Informativi Aziendali', RIGHT_COL_X, rightY, fontBold, 9, black);
  rightY -= 11;
  rightY = drawWrappedText(
    page1,
    'Diplomato in Sistemi Informativi Aziendali, indirizzo orientato alla gestione dei processi aziendali, all’integrazione tra economia e informatica e al supporto delle attività amministrative e organizzative.',
    RIGHT_COL_X,
    rightY,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  rightY -= 10;
  page1.drawLine({ start: { x: RIGHT_COL_X, y: rightY }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: rightY }, thickness: 0.5, color: lineGray });
  rightY -= 12;

  // Item 3: 2023 | TVM GRUOP ARLUNO RHO
  drawText(page1, '2023 | TVM GRUOP ARLUNO RHO', RIGHT_COL_X, rightY, fontBold, 9.5, black);
  rightY -= 12;
  drawText(page1, 'Stage di formazione (PCTO)', RIGHT_COL_X, rightY, fontBold, 9, black);
  rightY -= 11;
  rightY = drawWrappedText(
    page1,
    'Percorso formativo focalizzato sull\'operatività di magazzino e sulla gestione dei flussi logistici aziendali. Gestione database per il monitoraggio dello stato delle macchine, sistemazione strategica dei mezzi nel piazzale, supporto alle attività di ricezione e spedizione.',
    RIGHT_COL_X,
    rightY,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  rightY -= 10;
  page1.drawLine({ start: { x: RIGHT_COL_X, y: rightY }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: rightY }, thickness: 0.5, color: lineGray });
  rightY -= 12;

  // Item 4: 2022 | DCU: DUBLIN CITY UNIVERSITY
  drawText(page1, '2022 | DCU: DUBLIN CITY UNIVERSITY', RIGHT_COL_X, rightY, fontBold, 9.5, black);
  rightY -= 12;
  drawText(page1, 'Stage di formazione linguistica a Dublino', RIGHT_COL_X, rightY, fontBold, 9, black);
  rightY -= 11;
  rightY = drawWrappedText(
    page1,
    'Esperienza di studio e integrazione culturale all\'estero finalizzata al potenziamento della lingua inglese. Frequenza di corsi intensivi, partecipazione a workshop in lingua e attività di networking in ambiente multiculturale.',
    RIGHT_COL_X,
    rightY,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  rightY -= 10;
  page1.drawLine({ start: { x: RIGHT_COL_X, y: rightY }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: rightY }, thickness: 0.5, color: lineGray });
  rightY -= 12;

  // Item 5: 2022 | CORSO SU AI
  drawText(page1, '2022 | CORSO SU AI', RIGHT_COL_X, rightY, fontBold, 9.5, black);
  rightY -= 12;
  drawText(page1, '“Introduzione all’Intelligenza Artificiale”', RIGHT_COL_X, rightY, fontBold, 9, black);
  rightY -= 11;
  rightY = drawWrappedText(
    page1,
    'Percorso formativo focalizzato sulla comprensione delle architetture di base dell\'IA, l\'analisi dei dati e l\'automazione dei processi digitali. Nonostante l\'evoluzione del settore, il corso ha fornito le basi logico-matematiche necessarie per comprendere come gli algoritmi elaborano le informazioni.',
    RIGHT_COL_X,
    rightY,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  rightY -= 10;
  page1.drawLine({ start: { x: RIGHT_COL_X, y: rightY }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: rightY }, thickness: 0.5, color: lineGray });
  rightY -= 12;

  // Item 6: 2021 | FORMAZIONE SICUREZZA
  drawText(page1, '2021 | FORMAZIONE SICUREZZA', RIGHT_COL_X, rightY, fontBold, 9.5, black);
  rightY -= 12;
  drawText(page1, '“Salute e sicurezza sui luoghi di lavoro”', RIGHT_COL_X, rightY, fontBold, 9, black);
  rightY -= 11;
  rightY = drawWrappedText(
    page1,
    'Formazione specifica e completa riguardante il quadro normativo della sicurezza in azienda. Il corso ha affrontato la valutazione dei rischi, le misure di prevenzione e protezione, e l\'importanza del corretto utilizzo dei Dispositivi di Protezione Individuale (DPI).',
    RIGHT_COL_X,
    rightY,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  // Footer Page 1
  drawText(
    page1,
    'Autorizzo il trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).',
    140,
    30,
    fontRegular,
    7.5,
    grayMuted
  );
  drawText(page1, 'Pagina 1', 530, 30, fontRegular, 8, grayMuted);

  // ==========================================
  // PAGE 2
  // ==========================================
  const page2 = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  if (embeddedImage) {
    page2.drawImage(embeddedImage, {
      x: photoX,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
    });
  } else {
    page2.drawRectangle({
      x: photoX,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
      color: rgb(0.92, 0.92, 0.94),
      borderColor: rgb(0.8, 0.8, 0.85),
      borderWidth: 1,
    });
  }

  // Left Column Content - Page 2
  let left2Y = PAGE_HEIGHT - 195;

  // Competenze
  drawText(page2, 'Competenze', LEFT_COL_X, left2Y, fontBold, 12, black);
  left2Y -= 16;

  // Hard Skills
  drawText(page2, 'Hard Skills', LEFT_COL_X, left2Y, fontBold, 10, black);
  left2Y -= 13;

  const hardSkills = [
    'Patente B',
    'Creazione contenuti digitali per progetti scolastici',
    'Canva',
    'Pacchetto Office',
    'Adobe',
    'Utilizzo base di strumenti di Intelligenza Artificiale',
    'Software contabili',
    'Utilizzo di fotocamera professionale e accessori',
    'Editing video',
  ];

  for (const skill of hardSkills) {
    left2Y = drawWrappedText(page2, skill, LEFT_COL_X, left2Y, fontRegular, 8.5, grayDark, LEFT_COL_WIDTH, 11);
    left2Y -= 2;
  }

  left2Y -= 10;
  // Soft Skills
  drawText(page2, 'Soft Skills', LEFT_COL_X, left2Y, fontBold, 10, black);
  left2Y -= 13;

  const softSkills = [
    'Lavoro in team',
    'Problem solving',
    'Adattabilità',
    'Comunicazione',
    'Organizzazione del lavoro',
    'Precisione',
  ];

  for (const skill of softSkills) {
    drawText(page2, skill, LEFT_COL_X, left2Y, fontRegular, 8.5, grayDark);
    left2Y -= 11.5;
  }

  left2Y -= 10;
  // Info e Contatti
  drawText(page2, 'Info e Contatti', LEFT_COL_X, left2Y, fontBold, 11.5, black);
  left2Y -= 13;
  drawText(page2, '• Nato il 26 Settembre 2004', LEFT_COL_X, left2Y, fontBold, 8.5, black);
  left2Y -= 10;
  drawText(page2, '  cittadinanza Italo-Ecuadoregna', LEFT_COL_X, left2Y, fontRegular, 8, grayDark);

  left2Y -= 13;
  drawText(page2, '• Via Bettinetti Rho', LEFT_COL_X, left2Y, fontBold, 8.5, black);

  left2Y -= 13;
  drawText(page2, '• +39 345 4690 373', LEFT_COL_X, left2Y, fontBold, 8.5, black);

  left2Y -= 13;
  drawText(page2, '• jeremyjosue334@gmail.com', LEFT_COL_X, left2Y, fontBold, 8, black);

  left2Y -= 20;
  drawText(page2, 'Jeremi Josue Caisachana', LEFT_COL_X, left2Y, fontOblique, 10, grayMuted);

  // Vertical separator line
  page2.drawLine({
    start: { x: 205, y: PAGE_HEIGHT - 35 },
    end: { x: 205, y: 55 },
    thickness: 0.8,
    color: lineGray,
  });

  // Right Column Content - Page 2
  let right2Y = PAGE_HEIGHT - 65;

  // Name Header
  drawText(page2, 'Jeremi Josue Caisachana Pillajo', RIGHT_COL_X, right2Y, fontBold, 18, black);
  right2Y -= 12;

  // Horizontal Accent Bar
  page2.drawRectangle({
    x: RIGHT_COL_X,
    y: right2Y,
    width: 25,
    height: 3.5,
    color: black,
  });
  right2Y -= 24;

  // Section Title: Esperienze
  drawText(page2, 'Esperienze', RIGHT_COL_X, right2Y, fontBold, 13.5, black);
  right2Y -= 16;

  // Item 1: 2025 | ADDETTO ALLA COSTRUZIONE DI CANALIZZAZIONI
  drawText(page2, '2025 | ADDETTO ALLA COSTRUZIONE DI CANALIZZAZIONI', RIGHT_COL_X, right2Y, fontBold, 9.5, black);
  right2Y -= 13;
  right2Y = drawWrappedText(
    page2,
    'Gestione integrale del processo produttivo, dalla sagomatura del materiale grezzo alla costruzione strutturale dei canali (fogli di alluminio pre-isolato/P3 o lamiera). Operazioni di incollaggio industriale, sigillatura con silicone e rifinitura tecnica per garantire la perfetta tenuta pneumatica del componente. Uso di attrezzatura specifica, tra cui taglierini professionali, plotter da taglio, e strumenti di misura di precisione. Gestione indipendente della commessa, con capacità di interpretare le richieste tecniche e trasformarle in prodotto finito pronto per l\'installazione.',
    RIGHT_COL_X,
    right2Y,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  right2Y -= 12;
  page2.drawLine({ start: { x: RIGHT_COL_X, y: right2Y }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: right2Y }, thickness: 0.5, color: lineGray });
  right2Y -= 14;

  // Item 2: 2023 -2024 | ADDETTO ALLA CURA E MOVIMENTAZIONE VEICOLI
  drawText(page2, '2023 -2024 | ADDETTO ALLA CURA E MOVIMENTAZIONE VEICOLI', RIGHT_COL_X, right2Y, fontBold, 9.5, black);
  right2Y -= 13;
  right2Y = drawWrappedText(
    page2,
    'Lavaggio accurato (interno/esterno) e sanificazione dei veicoli su specifica richiesta del cliente. Organizzazione e posizionamento dei mezzi negli spazi dedicati per ottimizzare i flussi di lavoro.',
    RIGHT_COL_X,
    right2Y,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  right2Y -= 12;
  page2.drawLine({ start: { x: RIGHT_COL_X, y: right2Y }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: right2Y }, thickness: 0.5, color: lineGray });
  right2Y -= 14;

  // Item 3: 2021-2023 | DOG-SITTER
  drawText(page2, '2021-2023 | DOG-SITTER', RIGHT_COL_X, right2Y, fontBold, 9.5, black);
  right2Y -= 13;
  right2Y = drawWrappedText(
    page2,
    'Gestione completa delle necessità quotidiane di un animale domestico per conto di una persona anziana. Pianificazione delle uscite, somministrazione pasti e monitoraggio dello stato di salute.',
    RIGHT_COL_X,
    right2Y,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  right2Y -= 16;
  page2.drawLine({ start: { x: RIGHT_COL_X, y: right2Y }, end: { x: RIGHT_COL_X + RIGHT_COL_WIDTH, y: right2Y }, thickness: 1, color: lineGray });
  right2Y -= 18;

  // Portfolio Section
  drawText(page2, 'Portfolio', RIGHT_COL_X, right2Y, fontBold, 13.5, black);
  right2Y -= 14;
  right2Y = drawWrappedText(
    page2,
    'Una raccolta dei miei progetti di digital marketing, sia scolastici che personali. Include contenuti visivi e multimediali curati interamente da me, tra cui grafiche e video progettati per comunicare in modo efficace. I progetti completi sono disponibili al seguente link:',
    RIGHT_COL_X,
    right2Y,
    fontRegular,
    8.5,
    grayDark,
    RIGHT_COL_WIDTH,
    11
  );

  right2Y -= 4;
  drawText(page2, 'https://josuecaisa04.github.io/JosueCaisaPortfolio/', RIGHT_COL_X, right2Y, fontBold, 9, linkBlue);

  // Footer Page 2
  drawText(
    page2,
    'Autorizzo il trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).',
    140,
    30,
    fontRegular,
    7.5,
    grayMuted
  );
  drawText(page2, 'Pagina 2', 530, 30, fontRegular, 8, grayMuted);

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), 'public', 'curriculum_josue_caisachana.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`Successfully created PDF at ${outputPath}`);
}

createCV().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
