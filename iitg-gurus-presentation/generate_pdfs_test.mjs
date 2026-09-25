import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters_Test');

(async () => {
    console.log('Launching headless browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // A1 Size in pixels at 300 DPI (approximately 7016 x 9933)
    // However, puppeteer uses CSS pixels (96 DPI). 
    // A1 dimensions in CSS pixels: 594mm x 841mm.
    
    const files = fs.readdirSync(desktopDir).filter(file => file.endsWith('.html') && file !== 'index.html');
    
    for (const file of files) {
        const filePath = path.join(desktopDir, file);
        const pdfPath = filePath.replace('.html', '.pdf');
        
        console.log(`Converting ${file} to PDF...`);
        
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
        
        await page.pdf({
            path: pdfPath,
            width: '594mm',
            height: '841mm',
            printBackground: true,
            pageRanges: '1'
        });
    }

    await browser.close();
    console.log('All Test Posters successfully converted to PDF format.');
})();
