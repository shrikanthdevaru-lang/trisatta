import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters');

(async () => {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch();
    const files = fs.readdirSync(desktopDir).filter(f => f.endsWith('_A1_Poster.html'));
    
    for (const file of files) {
        const filePath = path.join(desktopDir, file);
        const pdfPath = filePath.replace('.html', '.pdf');
        
        console.log(`Converting ${file} to PDF...`);
        const page = await browser.newPage();
        // Set higher timeout as local loading is fast but rendering can take a bit
        await page.goto(`file://${filePath}`, {waitUntil: 'networkidle0', timeout: 60000});
        
        // Exact A1 size dimensions
        await page.setViewport({
            width: 2104,
            height: 3179,
            deviceScaleFactor: 2,
        });
        await page.pdf({
            path: pdfPath,
            width: '594mm',
            height: '841mm',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });
        await page.close();
        
        // Cleanup HTML file
        fs.unlinkSync(filePath);
    }
    
    await browser.close();
    
    // Cleanup index
    const indexPath = path.join(desktopDir, 'index.html');
    if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);
    
    console.log("All 30 A1 Posters successfully converted to PDF format.");
})();
