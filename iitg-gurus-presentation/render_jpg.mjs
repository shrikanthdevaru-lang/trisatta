import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const filePath = path.join(__dirname, 'test_layout.html');
    const jpgPath = path.join(__dirname, 'test_render.jpg');
    
    // Set viewport to A1
    await page.setViewport({ width: 2245, height: 3179 });
    
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    
    await page.screenshot({ path: jpgPath, fullPage: true });
    
    await browser.close();
})();
