import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gurusData } from './gurus_data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters');
const imagesDir = path.join(desktopDir, 'images');

if (!fs.existsSync(desktopDir)) {
    fs.mkdirSync(desktopDir, { recursive: true });
}

const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{NAME}} - A1 Poster</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --ink: #1C2833;
            --ivory: #F7F5F0;
            --sand: #EAE6DB;
            --terracotta: #C0392B;
            --saffron: #E67E22;
            --gold: #D4AF37;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #222; display: flex; justify-content: center; padding: 50px; overflow-x: auto; }

        .a1-poster {
            width: 594mm; height: 841mm;
            background-color: var(--ivory);
            position: relative; overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            font-family: 'Outfit', sans-serif; color: var(--ink);
            display: flex; flex-direction: column;
            padding: 40mm; flex-shrink: 0; 
        }

        .sacred-geometry {
            position: absolute; top: -100mm; right: -150mm; width: 700mm; height: 700mm;
            background: conic-gradient(from 0deg at 50% 50%, var(--ivory) 0deg, var(--sand) 90deg, var(--ivory) 180deg, var(--sand) 270deg, var(--ivory) 360deg);
            border-radius: 50%; z-index: 0; opacity: 0.6; border: 2px dashed rgba(192, 57, 43, 0.1);
        }
        .sacred-geometry::after {
            content: ''; position: absolute; top: 50mm; left: 50mm; right: 50mm; bottom: 50mm;
            border-radius: 50%; border: 4px solid rgba(212, 175, 55, 0.2);
        }

        .content-layer { z-index: 10; width: 100%; height: 100%; display: flex; flex-direction: column; }

        .top-tagline {
            text-transform: uppercase; letter-spacing: 12px; font-size: 11mm; color: var(--terracotta);
            font-weight: 700; border-bottom: 2px solid var(--terracotta); padding-bottom: 10mm;
            margin-bottom: 30mm; width: 100%; text-align: center;
        }

        .hero-section {
            display: flex; justify-content: space-between; align-items: flex-start;
            margin-bottom: 25mm;
        }

        .text-content { flex: 1; padding-right: 20mm; }
        .image-content { width: 35%; flex-shrink: 0; display: flex; justify-content: flex-end; }
        .portrait-img { width: 100%; max-width: 150mm; height: auto; border-radius: 10mm; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }

        .title-wrapper { position: relative; margin-bottom: 15mm; display: inline-block; align-self: flex-start; }
        .title-underlay {
            position: absolute; bottom: 5mm; left: -10mm; right: -15mm; height: 35mm;
            background: rgba(230, 126, 34, 0.2); z-index: -1; transform: skewX(-15deg);
        }
        .main-title {
            font-family: 'Cinzel', serif; font-size: 55mm; font-weight: 900;
            line-height: 1.05; color: var(--ink); text-transform: uppercase;
        }

        .subtitle-wrapper { position: relative; margin-bottom: 20mm; display: inline-block; align-self: flex-start; }
        .subtitle-underlay {
            position: absolute; bottom: 2mm; left: -5mm; right: -10mm; height: 10mm;
            background: rgba(192, 57, 43, 0.15); z-index: -1;
        }
        .sub-title { font-family: 'Cinzel', serif; font-size: 20mm; color: var(--terracotta); letter-spacing: 6px; font-weight: 700; }



        .description {
            font-size: 14mm; line-height: 1.6; max-width: 100%;
            color: #333; font-weight: 400; margin-bottom: 25mm;
            border-left: 5px solid var(--gold); padding-left: 15mm; text-align: justify;
        }

        .editorial-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20mm; width: 100%; }

        .editorial-card {
            background: #FFF; border-top: 4px solid var(--terracotta); padding: 20mm;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative;
        }
        .editorial-card::before { content: '✦'; position: absolute; top: -12mm; left: 15mm; font-size: 15mm; color: var(--gold); }
        .editorial-card h3 { font-family: 'Cinzel', serif; color: var(--ink); font-size: 18mm; margin-bottom: 10mm; font-weight: 900; }
        .editorial-card p { font-size: 12mm; line-height: 1.5; color: #444; font-weight: 300; }

        .footer-banner {
            width: 100%; display: flex; flex-direction: column; align-items: center;
            border-top: 1px solid rgba(0,0,0,0.1); padding-top: 15mm; position: absolute; bottom: 40mm; left: 0; padding-left: 40mm; padding-right: 40mm;
        }
        .made-by { font-size: 14mm; font-weight: 700; color: var(--ink); letter-spacing: 5px; text-transform: uppercase; }
        .iks-logo { font-family: 'Cinzel', serif; font-size: 25mm; font-weight: 900; color: var(--terracotta); margin-top: 5mm; letter-spacing: 8px; }

        @media print {
            body { padding: 0; background: none; }
            .a1-poster { box-shadow: none; margin: 0; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
    </style>
</head>
<body>
    <div class="a1-poster">
        <div class="sacred-geometry"></div>
        <div class="content-layer">
            <div class="top-tagline">A Tribute to the Gurus of India</div>
            
            <div class="hero-section">
                <div class="text-content">
                    <div class="title-wrapper">
                        <div class="title-underlay"></div>
                        <h1 class="main-title">{{NAME}}</h1>
                    </div>
                    
                    <div class="subtitle-wrapper">
                        <div class="subtitle-underlay"></div>
                        <h2 class="sub-title">{{VIDYASTHANA}} | {{ERA}}</h2>
                    </div>
                </div>
                <div class="image-content">
                    {{IMAGE_BLOCK}}
                </div>
            </div>
            
            <p class="description">{{CONTEXT}}</p>

            <div class="editorial-grid">
                <div class="editorial-card">
                    <h3>Key Contributions</h3>
                    <p>{{CONTRIBUTIONS}}</p>
                </div>
                <div class="editorial-card">
                    <h3>Eternal Legacy</h3>
                    <p>{{LEGACY}}</p>
                </div>
            </div>

            <div class="footer-banner">
                <div class="made-by">Produced By</div>
                <div class="iks-logo">Centre for Indian Knowledge Systems, IIT Guwahati</div>
            </div>
        </div>
    </div>
</body>
</html>`;

let indexLinks = '';

gurusData.forEach(guru => {
    let safeName = guru.name.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
    
    let imagePath = path.join(imagesDir, safeName + '.jpg');
    let genericImagePath = path.join(imagesDir, 'Generic_Guru.jpg');
    let imgSrc = fs.existsSync(imagePath) ? 'file://' + imagePath : 'file://' + genericImagePath;
    let imageBlock = `<img src="${imgSrc}" class="portrait-img" />`;
    
    let htmlContent = template
        .replaceAll('{{NAME}}', guru.name)
        .replaceAll('{{VIDYASTHANA}}', guru.vidyaSthana)
        .replaceAll('{{ERA}}', guru.era)
        .replaceAll('{{CONTEXT}}', guru.details.lifeContext)
        .replaceAll('{{CONTRIBUTIONS}}', guru.details.keyContributions)
        .replaceAll('{{LEGACY}}', guru.details.legacy)
        .replaceAll('{{IMAGE_BLOCK}}', imageBlock);
        
    let filePath = path.join(desktopDir, safeName + '_A1_Poster.html');
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
    
    indexLinks += `<li><a href="${safeName}_A1_Poster.html" target="_blank">${guru.name} A1 Poster</a></li>\n`;
});

const indexHtml = `<!DOCTYPE html>
<html>
<head>
<title>IITG Guru Posters Directory</title>
<style>
body { font-family: sans-serif; background: #f0f2f5; padding: 40px; }
.container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
h1 { color: #333; }
ul { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
li a { display: block; padding: 15px; background: #D4AF37; color: white; text-decoration: none; border-radius: 4px; text-align: center; font-weight: bold; }
li a:hover { background: #FF9933; }
</style>
</head>
<body>
<div class="container">
    <h1>All 30 Guru A1 Posters</h1>
    <p>Click on any link below to open the A1 poster. The system is currently generating images.</p>
    <ul>
        ${indexLinks}
    </ul>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(desktopDir, 'index.html'), indexHtml, 'utf-8');
console.log("Successfully generated all 30 posters with image placeholders at " + desktopDir);
