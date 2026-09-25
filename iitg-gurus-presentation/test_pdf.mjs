import puppeteer from 'puppeteer';
import path from 'path';

const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters');
const filePath = path.join(desktopDir, 'Mahari_Gautama_A1_Poster.html');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 2104, height: 3179, deviceScaleFactor: 2 });
    
    await page.goto(`file://${filePath}`, {waitUntil: 'networkidle0', timeout: 60000});
    await page.screenshot({ path: path.join(desktopDir, 'Maharshi_Gautama_Test.jpg'), fullPage: true, quality: 100 });
    
    await browser.close();
    console.log("Test JPG generated.");
})();
