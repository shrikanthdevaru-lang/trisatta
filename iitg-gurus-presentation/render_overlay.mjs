import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport to the exact size of the poster
    await page.setViewport({
        width: 1364,
        height: 2048,
        deviceScaleFactor: 1,
    });
    
    const filePath = path.join(__dirname, 'overlay_test.html');
    await page.goto(`file://${filePath}`, {waitUntil: 'networkidle0'});
    
    await page.screenshot({
        path: path.join(__dirname, 'overlay_result.jpg'),
        fullPage: true,
        quality: 100
    });
    
    await browser.close();
    console.log("Overlay test rendered.");
})();
