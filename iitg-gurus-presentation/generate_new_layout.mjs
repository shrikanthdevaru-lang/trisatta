import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters');
const imagesDir = path.join(desktopDir, 'images');

if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const e1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'enriched_1.json'), 'utf-8'));
const e2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'enriched_2.json'), 'utf-8'));
const e3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'enriched_3.json'), 'utf-8'));
const gurusData = [...e1, ...e2, ...e3];

const getIcon = (text) => {
    if (!text) return `<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`;
    let t = text.toLowerCase();
    if (t.includes('natya') || t.includes('drama') || t.includes('theatre')) return `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`;
    if (t.includes('dance') || t.includes('nrtta')) return `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`;
    if (t.includes('cinema') || t.includes('film')) return `<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>`;
    if (t.includes('music') || t.includes('sangita')) return `<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>`;
    if (t.includes('psychology') || t.includes('rasa') || t.includes('mind')) return `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/>`;
    if (t.includes('book') || t.includes('treatise') || t.includes('veda')) return `<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>`;
    return `<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`;
};

const femaleGurus = [
    "Gārgī Vācaknavī", "Maitreyī", "Lopāmudrā", 
    "Āṇḍāḷ", "Avvaiyār", "Akka Mahādevī", "Mīrābāī"
];

gurusData.forEach(guru => {
    if (femaleGurus.includes(guru.name)) {
        console.log(`Skipping female guru ${guru.name}...`);
        return;
    }

    let safeName = guru.name.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
    
    // Core contributions
    let contribHtml = "";
    let majorContributions = guru.structuredContributions || [];
    if (majorContributions.length === 0 && guru.details?.keyContributions) {
        majorContributions = [{ title: "Key Contribution", description: guru.details.keyContributions }];
    }
    
    for(let i=0; i<6; i++) {
        let c = majorContributions[i];
        if (c) {
            contribHtml += `
            <div class="contrib-item">
                <div class="contrib-icon-box"><svg viewBox="0 0 24 24">${getIcon(c.title + ' ' + c.description)}</svg></div>
                <div class="contrib-text-box"><h4>${c.title}</h4><p>${c.description}</p></div>
            </div>`;
        } else {
            // empty placeholder for layout consistency if desired, or just leave blank. 
            // Better to leave blank and let CSS grid handle empty cells if any
        }
    }

    // Influence
    let influenceHtml = "";
    let influenceList = guru.structuredLegacy || [];
    if (influenceList.length === 0 && guru.details?.legacy) {
        influenceList = [{ title: "Historical Impact", description: guru.details.legacy }];
    }
    
    for(let i=0; i<5; i++) {
        let inf = influenceList[i];
        if (inf) {
            influenceHtml += `
            <div class="inf-item">
                <svg viewBox="0 0 24 24">${getIcon(inf.title + ' ' + inf.description)}</svg>
                <h4>${inf.title}</h4>
                <p>${inf.description}</p>
            </div>`;
        }
    }

    let imagePath = path.join(imagesDir, safeName + '.jpg');
    let portraitHtml = '';
    if (fs.existsSync(imagePath) && safeName !== 'Generic_Guru') {
        portraitHtml = `<img src="file://${imagePath}" class="portrait-img" />`;
    } else {
        portraitHtml = `<div class="portrait-placeholder"><p>${guru.name}<br>Portrait</p></div>`;
    }
    
    let mainTitleStr = guru.vidyaSthana ? guru.vidyaSthana.split(' (')[0] : guru.name;
    let subTitleStr = guru.vidyaSthana && guru.vidyaSthana.includes('(') ? guru.vidyaSthana.match(/\(([^)]+)\)/)[1] : '';
    if(!subTitleStr) subTitleStr = guru.era || '';

    // Adjust font size dynamically to avoid overflow
    let mainTitleFontSize = mainTitleStr.length > 20 ? '70px' : '90px';
    if(mainTitleStr.length > 30) mainTitleFontSize = '55px';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #f6ecdb;
            --border-red: #4a150b;
            --gold: #b28a50;
            --text-dark: #2a110a;
            --box-bg: rgba(220, 180, 130, 0.15);
        }
        body { margin: 0; padding: 0; background: #333; font-family: 'Outfit', sans-serif; display: flex; justify-content: center; }
        .poster {
            width: 2104px; height: 3179px; background: var(--bg-color);
            position: relative; box-sizing: border-box;
            border-radius: 800px 800px 0 0;
            border: 20px solid var(--border-red);
            box-shadow: inset 0 0 0 10px var(--bg-color), inset 0 0 0 16px var(--gold);
            padding: 120px 80px 80px 80px;
            display: flex; flex-direction: column;
        }

        .top-section { display: flex; gap: 60px; height: 1400px; margin-bottom: 50px; }
        
        .portrait-area { width: 45%; position: relative; }
        .portrait-img { width: 100%; height: 100%; object-fit: cover; border-radius: 400px 400px 20px 20px; border: 10px solid var(--gold); }
        .portrait-placeholder { width: 100%; height: 100%; border-radius: 400px 400px 20px 20px; border: 10px dashed var(--gold); display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.05); }
        .portrait-placeholder p { font-family: 'Cinzel', serif; font-size: 50px; font-weight: 700; opacity: 0.5; color: var(--border-red); text-align: center; }

        .info-area { width: 55%; display: flex; flex-direction: column; align-items: center; padding-top: 40px; }
        
        .name-banner { 
            background: var(--border-red); color: #fff; font-family: 'Cinzel', serif; font-size: 50px; font-weight: 700;
            padding: 10px 60px; border-radius: 10px; margin-bottom: 20px; text-transform: uppercase; text-align: center;
        }
        .main-title { font-family: 'Cinzel', serif; font-size: ${mainTitleFontSize}; font-weight: 900; color: var(--border-red); margin: 0; line-height: 1.1; text-align: center; text-transform: uppercase; word-wrap: break-word; max-width: 100%; }
        .sub-title { font-size: 35px; color: var(--text-dark); letter-spacing: 4px; margin: 20px 0; border-top: 2px solid var(--gold); border-bottom: 2px solid var(--gold); padding: 10px 0; text-transform: uppercase; text-align: center; word-wrap: break-word; max-width: 100%; }
        
        .quote-box { margin: 40px 0; font-size: 42px; font-style: italic; color: var(--text-dark); text-align: center; padding: 0 40px; line-height: 1.4; word-wrap: break-word; max-width: 100%; }
        
        .about-banner {
            background: var(--border-red); color: #fff; font-family: 'Cinzel', serif; font-size: 35px;
            padding: 10px 80px; border-radius: 8px; margin: 20px 0; text-align: center;
        }
        
        .about-content {
            border: 4px solid var(--gold); border-radius: 20px; background: var(--box-bg);
            padding: 40px; flex-grow: 1; width: 100%; box-sizing: border-box;
            font-size: 32px; line-height: 1.5; color: var(--text-dark); text-align: justify; overflow: hidden;
        }

        .section-header-banner {
            background: var(--border-red); color: #fff; font-family: 'Cinzel', serif; font-size: 40px; font-weight: 700;
            padding: 15px 100px; border-radius: 10px; margin: 0 auto 40px auto; display: inline-block;
        }
        
        .section-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; margin-bottom: 60px; }

        .contributions-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 40px 60px; width: 100%; height: 700px;
        }
        .contrib-item {
            display: flex; gap: 20px; height: 100%; overflow: hidden;
        }
        .contrib-icon-box {
            width: 25%; background: var(--box-bg); border: 4px solid var(--gold); border-radius: 20px;
            display: flex; justify-content: center; align-items: center; flex-shrink: 0;
        }
        .contrib-icon-box svg { width: 80px; height: 80px; fill: var(--border-red); }
        .contrib-text-box {
            width: 75%; background: var(--box-bg); border: 4px solid var(--gold); border-radius: 20px;
            padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; overflow: hidden;
        }
        .contrib-text-box h4 { font-family: 'Cinzel', serif; font-size: 32px; margin: 0 0 10px 0; color: var(--border-red); line-height: 1.1; }
        .contrib-text-box p { font-size: 26px; margin: 0; line-height: 1.3; color: var(--text-dark); overflow: hidden; text-overflow: ellipsis; }

        .influence-grid {
            display: flex; justify-content: space-between; width: 100%; height: 400px; gap: 20px;
        }
        .inf-item {
            width: 19%; background: var(--box-bg); border: 4px solid var(--gold); border-radius: 20px;
            padding: 30px 20px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; text-align: center; overflow: hidden;
        }
        .inf-item svg { width: 70px; height: 70px; fill: var(--gold); margin-bottom: 20px; flex-shrink: 0; }
        .inf-item h4 { font-family: 'Cinzel', serif; font-size: 24px; margin: 0 0 15px 0; color: var(--border-red); line-height: 1.1; flex-shrink: 0; }
        .inf-item p { font-size: 20px; margin: 0; line-height: 1.3; color: var(--text-dark); overflow: hidden; text-overflow: ellipsis; }

        .footer {
            margin-top: auto; border-top: 4px solid var(--gold); border-bottom: 4px solid var(--gold);
            padding: 20px 0; text-align: center; font-family: 'Cinzel', serif; font-size: 45px;
            font-weight: 700; color: var(--border-red); letter-spacing: 10px;
        }
    </style>
</head>
<body>
    <div class="poster">
        <div class="top-section">
            <div class="portrait-area">
                ${portraitHtml}
            </div>
            <div class="info-area">
                <div class="name-banner">${guru.name}</div>
                <h1 class="main-title">${mainTitleStr}</h1>
                <div class="sub-title">${subTitleStr}</div>
                <div class="quote-box">"${guru.quote || guru.details?.lifeContext?.split('.')[0] + '.'}"</div>
                
                <div class="about-banner">ABOUT THE GURU</div>
                <div class="about-content">
                    ${guru.details?.lifeContext || ''}
                </div>
            </div>
        </div>

        <div class="section-wrapper">
            <div class="section-header-banner">CORE CONTRIBUTIONS</div>
            <div class="contributions-grid">
                ${contribHtml}
            </div>
        </div>

        <div class="section-wrapper">
            <div class="section-header-banner">INFLUENCE THAT CONTINUES</div>
            <div class="influence-grid">
                ${influenceHtml}
            </div>
        </div>

        <div class="footer">
            CENTER FOR INDIAN KNOWLEDGE SYSTEMS
        </div>
    </div>
</body>
</html>`;

    let filePath = path.join(desktopDir, safeName + '_A1_Poster.html');
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
});

console.log("Successfully generated all new box-layout HTML posters!");
