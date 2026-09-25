import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const baseDir = __dirname;
  
  // Output directories on Desktop and in workspace
  const desktopPdfDir = '/Users/sjs.iss/Desktop/IITG_Guru_A3_Posters_PDF';
  const desktopPngDir = '/Users/sjs.iss/Desktop/IITG_Guru_A3_Posters_PNG';
  const outputPngDir = path.join(baseDir, 'output', 'a3_posters', 'png');
  const outputPdfDir = path.join(baseDir, 'output', 'a3_posters', 'pdf');

  fs.mkdirSync(desktopPdfDir, { recursive: true });
  fs.mkdirSync(desktopPngDir, { recursive: true });
  fs.mkdirSync(outputPngDir, { recursive: true });
  fs.mkdirSync(outputPdfDir, { recursive: true });

  const htmlPath = path.join(baseDir, 'index.html');
  const gurusJsonPath = path.join(baseDir, 'gurus_data.json');
  const gurus = JSON.parse(fs.readFileSync(gurusJsonPath, 'utf8'));

  console.log(`Rendering A3 Posters for ${gurus.length} Gurus...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // A3 portrait dimensions: 297mm x 420mm at high DPI
  // 1240 x 1754 at 2x scale = 2480 x 3508 pixels
  await page.setViewport({
    width: 1240,
    height: 1754,
    deviceScaleFactor: 2
  });

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  let totalOverflows = 0;

  for (let i = 0; i < gurus.length; i++) {
    const guru = gurus[i];
    const indexStr = String(i + 1).padStart(2, '0');
    const safeId = guru.id;

    // Filter view to single poster
    await page.evaluate((id) => {
      window.onGuruChange(id);
    }, safeId);

    await new Promise(r => setTimeout(r, 200));

    // Verify overflow programmatically
    const overflowInfo = await page.evaluate((id) => {
      const el = document.getElementById(`poster-${id}`);
      if (!el) return { found: false };
      
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const overflows = scrollHeight > clientHeight + 2; // 2px tolerance

      // Check sub-boxes
      const childOverflows = [];
      const subBoxes = el.querySelectorAll('.shloka-box, .quote-box, .about-box, .column-box');
      subBoxes.forEach(b => {
        if (b.scrollHeight > b.clientHeight + 2) {
          childOverflows.push({
            className: b.className,
            scrollHeight: b.scrollHeight,
            clientHeight: b.clientHeight
          });
        }
      });

      return {
        found: true,
        scrollHeight,
        clientHeight,
        overflows,
        childOverflows
      };
    }, safeId);

    if (!overflowInfo.found) {
      console.error(`❌ Poster element not found for ID: poster-${safeId} (${guru.name})`);
      continue;
    }

    if (overflowInfo.overflows || overflowInfo.childOverflows.length > 0) {
      console.warn(`⚠️ OVERFLOW DETECTED in [${indexStr}/${gurus.length}] ${guru.name}: main (${overflowInfo.scrollHeight}px vs ${overflowInfo.clientHeight}px), sub:`, overflowInfo.childOverflows);
      totalOverflows++;
    } else {
      console.log(`✅ [${indexStr}/30] ${guru.name} -> Perfectly fitted A3 Poster`);
    }

    // Export PNG
    const pngFilename = `${indexStr}_${guru.id.replace(/[^a-zA-Z0-9_]/g, '')}.png`;
    const localPngPath = path.join(outputPngDir, pngFilename);
    const desktopPngPath = path.join(desktopPngDir, pngFilename);
    
    const element = await page.$(`.poster-page`);
    if (element) {
      const imageBuffer = await element.screenshot({ type: 'png' });
      fs.writeFileSync(localPngPath, imageBuffer);
      fs.writeFileSync(desktopPngPath, imageBuffer);
    }

    // Export PDF for single guru
    const pdfFilename = `${indexStr}_${guru.id.replace(/[^a-zA-Z0-9_]/g, '')}.pdf`;
    const localPdfPath = path.join(outputPdfDir, pdfFilename);
    const desktopPdfPath = path.join(desktopPdfDir, pdfFilename);

    const pdfBuffer = await page.pdf({
      format: 'A3',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    fs.writeFileSync(localPdfPath, pdfBuffer);
    fs.writeFileSync(desktopPdfPath, pdfBuffer);
  }

  // Export Combined 30-Page Master PDF on Desktop & local workspace
  console.log('\nGenerating Combined Master 30-Page A3 PDF Book...');
  await page.evaluate(() => {
    window.onGuruChange('ALL');
  });
  await new Promise(r => setTimeout(r, 600));

  const masterPdfBuffer = await page.pdf({
    format: 'A3',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  const localMasterPdf = path.join(baseDir, 'output', 'a3_posters', 'IITG_30_Gurus_Complete_A3_Posters.pdf');
  const desktopMasterPdf = '/Users/sjs.iss/Desktop/IITG_30_Gurus_Complete_A3_Posters.pdf';

  fs.writeFileSync(localMasterPdf, masterPdfBuffer);
  fs.writeFileSync(desktopMasterPdf, masterPdfBuffer);

  console.log(`\n🎉 MASTER 30-PAGE A3 PDF CREATED AT:\n  -> ${desktopMasterPdf}`);
  console.log(`Individual PNG Posters (30 files) saved to:\n  -> ${desktopPngDir}`);
  console.log(`Individual PDF Posters (30 files) saved to:\n  -> ${desktopPdfDir}`);
  console.log(`Total Overflows Detected: ${totalOverflows}`);

  await browser.close();
}

run().catch(err => {
  console.error("Error generating posters:", err);
  process.exit(1);
});
