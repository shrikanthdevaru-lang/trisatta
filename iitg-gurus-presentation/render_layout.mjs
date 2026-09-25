import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setViewport({
        width: 2104,
        height: 3179,
        deviceScaleFactor: 1,
    });
    
    const filePath = path.join(__dirname, 'layout_test.html');
    await page.goto(`file://${filePath}`, {waitUntil: 'networkidle0'});
    
    await page.screenshot({
        path: path.join(__dirname, 'layout_test.jpg'),
        fullPage: true,
        quality: 100
    });
    
    await browser.close();
    console.log("Layout test rendered.");
})();
