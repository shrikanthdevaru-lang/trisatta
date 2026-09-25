import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters');

(async () => {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setViewport({
        width: 1364,
        height: 2048,
        deviceScaleFactor: 2,
    });
    
    const filePath = path.join(__dirname, 'Gautama_Overlay.html');
    await page.goto(`file://${filePath}`, {waitUntil: 'networkidle0'});
    
    const pdfPath = path.join(desktopDir, 'Rishi_Gautama_Final_Template.pdf');
    await page.pdf({
        path: pdfPath,
        width: '1364px',
        height: '2048px',
        printBackground: true
    });
    
    const jpgPath = path.join(desktopDir, 'Rishi_Gautama_Final_Template.jpg');
    await page.screenshot({
        path: jpgPath,
        fullPage: true,
        quality: 100
    });
    
    await browser.close();
    console.log("Successfully generated PDF and JPG at " + desktopDir);
})();
