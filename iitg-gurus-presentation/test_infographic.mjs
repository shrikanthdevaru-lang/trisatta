import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters_Test');
const imagesDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Posters', 'images');

if (!fs.existsSync(desktopDir)) {
    fs.mkdirSync(desktopDir, { recursive: true });
}

let enrichedData = [{
    id: 24,
    name: "Bharata Muni",
    era: "Antiquity",
    vidyaSthana: "The Father of Indian Performing Arts",
    shloka: "नाट्यं भिन्नरुचेर्जनस्य बहुधाप्येकं समाराधनम् ।",
    shlokaTranslation: "Natya is the one amusement that brings joy to people of diverse tastes.",
    quote: "I have composed the Nāṭyaśāstra for the people of varied tastes, to instruct them in different duties of life through the medium of drama.",
    details: {
        lifeContext: "Bharata Muni, the sage of ancient India, is revered as the author of the Nāṭyaśāstra, the foundational treatise on the performing arts. He systematized drama, dance, music, and stagecraft into a comprehensive science for the upliftment and education of society."
    },
    structuredContributions: [
        { title: "Nāṭya (Drama)", description: "Origin, structure, types and purpose of drama." },
        { title: "Rasa Theory", description: "The doctrine of Rasa, the essence of emotional experience in art." },
        { title: "Abhinaya (Expression)", description: "Four types of abhinaya: āṅgika, vācika, āhārya and sāttvika." },
        { title: "Saṅgīta (Music)", description: "Theory of music, notes, scales and instruments." }
    ],
    structuredLegacy: [
        { title: "Classical Dances", description: "Bharatanatyam, Kathak, Kuchipudi owe their roots here." },
        { title: "Indian Cinema", description: "Storytelling, acting, expressions trace to Nāṭyaśāstra." },
        { title: "Theatre & Acting", description: "Guides performance, direction, and modern theatre practices." }
    ]
}];

const svgs = {
    lotus: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 9 6 6 9C3 12 1 15 2 18C3 21 6 22 12 22C18 22 21 21 22 18C23 15 21 12 18 9C15 6 12 2 12 2ZM12 19C12 19 8 18 8 14C8 10 12 5 12 5C12 5 16 10 16 14C16 18 12 19 12 19Z"/></svg>`,
    scroll: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6C4.9 2 4 2.9 4 4ZM13 3.5L18.5 9H13V3.5ZM6 20V4H11V10H18V20H6Z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>`,
    brain: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3C9.69 3 7 5.69 7 9C7 11.23 8.23 13.16 10 14.17V17C10 18.1 10.9 19 12 19H14C15.1 19 16 18.1 16 17V14.17C17.77 13.16 19 11.23 19 9C19 5.69 16.31 3 13 3ZM13 13H11V11H13V13ZM13 9H11V7H13V9Z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.06 19.43 4 16.05 4 12C4 11.68 4.03 11.36 4.08 11.05L10 17V18C10 19.1 10.45 20.08 11 20.73V19.93ZM19.6 15.34C19.14 16.63 18.23 17.73 17 18.46V17C17 15.9 16.1 15 15 15H13V13C13 12.45 12.55 12 12 12H10V10H11C12.1 10 13 9.1 13 8V6H14C15.66 6 17 7.34 17 9V9.5C18.24 9.5 19.34 10.15 20.04 11.13C20.31 11.75 20.5 12.41 20.5 13.11C20.5 13.88 20.17 14.67 19.6 15.34Z"/></svg>`,
    hands: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"/></svg>`
};

const iconList = [svgs.scroll, svgs.lotus, svgs.star, svgs.brain, svgs.globe, svgs.hands];

const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{NAME}} - Infographic Poster</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --ink: #3b1712;
            --gold: #b38446;
            --dark-red: #5e1111;
            --parchment: #f4ecd8;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #222; display: flex; justify-content: center; padding: 50px; }

        .a1-poster {
            width: 594mm; height: 841mm;
            background-color: var(--parchment);
            background-image: url('https://www.transparenttextures.com/patterns/aged-paper.png');
            position: relative; overflow: hidden;
            box-shadow: inset 0 0 50mm rgba(94,17,17,0.15), 0 20px 50px rgba(0,0,0,0.8);
            font-family: 'Outfit', sans-serif; color: var(--ink);
            display: flex; flex-direction: column;
            padding: 25mm; flex-shrink: 0;
            border-radius: 40mm 40mm 0 0;
        }

        /* Elaborate SVG Border */
        .border-layer {
            position: absolute; top: 15mm; left: 15mm; right: 15mm; bottom: 15mm;
            border: 4px solid var(--dark-red); border-radius: 30mm 30mm 0 0;
            pointer-events: none; z-index: 10;
        }
        .border-inner {
            position: absolute; top: 4mm; left: 4mm; right: 4mm; bottom: 4mm;
            border: 2px solid var(--gold); border-radius: 26mm 26mm 0 0;
        }

        /* Top Header Ornament */
        .top-ornament {
            width: 100%; display: flex; justify-content: center; margin-bottom: 25mm; z-index: 20; position: relative;
        }
        .ornament-circle {
            width: 50mm; height: 50mm; border: 4px solid var(--dark-red); border-radius: 50%;
            background: var(--parchment); display: flex; justify-content: center; align-items: center;
            box-shadow: 0 0 0 2px var(--gold); margin-top: -15mm; position: absolute; top: 0;
        }
        .ornament-circle svg { width: 35mm; height: 35mm; color: var(--dark-red); }

        .content-layer { z-index: 20; display: flex; flex-direction: row; height: 100%; position: relative; margin-top: 35mm; }

        /* Left Side: Portrait */
        .left-col { width: 45%; display: flex; flex-direction: column; align-items: center; position: relative; padding-right: 25mm; }
        .portrait-img {
            width: 100%; height: auto; mix-blend-mode: multiply; filter: sepia(0.5) contrast(1.1) brightness(0.9);
            border-radius: 10mm; margin-bottom: 20mm;
        }
        
        .ornate-circle {
            width: 180mm; height: 180mm; border-radius: 50%; border: 4px solid var(--dark-red);
            position: relative; display: flex; justify-content: center; align-items: center;
            margin-top: 10mm;
        }
        .ornate-circle::before {
            content: ''; position: absolute; top: 3mm; left: 3mm; right: 3mm; bottom: 3mm;
            border: 2px dashed var(--gold); border-radius: 50%;
        }

        /* Right Side: Information */
        .right-col { width: 55%; display: flex; flex-direction: column; }

        /* Headers */
        .title-section { text-align: center; margin-bottom: 20mm; }
        .main-title { font-family: 'Cinzel', serif; font-size: 45mm; font-weight: 900; color: var(--dark-red); line-height: 1; text-transform: uppercase; margin-bottom: 5mm; }
        .sub-title { font-family: 'Cinzel', serif; font-size: 14mm; color: var(--ink); letter-spacing: 5px; font-weight: 700; border-bottom: 2px solid var(--gold); padding-bottom: 5mm; display: inline-block; text-transform: uppercase; }

        /* Shloka */
        .shloka-block { text-align: center; margin-bottom: 15mm; }
        .shloka-sanskrit { font-size: 15mm; font-weight: 700; color: var(--dark-red); margin-bottom: 5mm; }
        .shloka-trans { font-size: 13mm; font-style: italic; color: var(--ink); }

        /* Quote */
        .quote-block {
            font-size: 15mm; font-style: italic; font-weight: 500; text-align: center; line-height: 1.5;
            margin: 10mm 20mm 25mm 20mm; position: relative; padding: 10mm 0;
        }
        .quote-block::before { content: '❝'; position: absolute; top: -15mm; left: -25mm; font-size: 40mm; color: var(--gold); }
        .quote-block::after { content: '❞'; position: absolute; bottom: -35mm; right: -25mm; font-size: 40mm; color: var(--gold); }

        /* Section Banners */
        .section-banner {
            background: var(--dark-red); color: var(--parchment); font-family: 'Cinzel', serif;
            font-size: 15mm; font-weight: 700; text-align: center; padding: 6mm 0;
            border-radius: 30mm; margin: 15mm 0 15mm 0; position: relative; letter-spacing: 4px;
        }
        .section-banner::before { content: '◆'; position: absolute; left: 15mm; top: 9mm; color: var(--gold); font-size: 12mm; }
        .section-banner::after { content: '◆'; position: absolute; right: 15mm; top: 9mm; color: var(--gold); font-size: 12mm; }

        /* Details */
        .who-was { font-size: 14mm; line-height: 1.6; text-align: justify; margin-bottom: 20mm; padding: 0 10mm; }

        /* Contributions Grid */
        .contributions-grid { display: grid; grid-template-columns: 1fr; gap: 12mm; margin-bottom: 15mm; padding: 0 10mm; }
        .contrib-item { display: flex; align-items: flex-start; }
        .contrib-icon {
            width: 30mm; height: 30mm; border-radius: 50%; background: var(--parchment);
            border: 3px solid var(--dark-red); display: flex; justify-content: center; align-items: center;
            margin-right: 12mm; flex-shrink: 0; box-shadow: 0 0 0 2px var(--gold);
        }
        .contrib-icon svg { width: 18mm; height: 18mm; color: var(--dark-red); }
        .contrib-text h4 { font-family: 'Cinzel', serif; font-size: 15mm; font-weight: 900; color: var(--dark-red); margin-bottom: 2mm; }
        .contrib-text p { font-size: 12mm; line-height: 1.4; color: var(--ink); }

        /* Legacy Row */
        .legacy-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15mm; align-items: start; text-align: center; padding-top: 5mm; }
        .legacy-item { display: flex; flex-direction: column; align-items: center; }
        .legacy-icon { width: 25mm; height: 25mm; margin-bottom: 8mm; color: var(--dark-red); }
        .legacy-icon svg { width: 100%; height: 100%; }
        .legacy-item h4 { font-family: 'Cinzel', serif; font-size: 13mm; font-weight: 900; margin-bottom: 3mm; color: var(--dark-red); }
        .legacy-item p { font-size: 11mm; line-height: 1.4; }

        /* Footer */
        .footer {
            position: absolute; bottom: 0; left: 0; width: 100%; height: 35mm;
            background: var(--dark-red); color: var(--parchment);
            display: flex; justify-content: center; align-items: center;
            font-family: 'Cinzel', serif; font-size: 18mm; letter-spacing: 6px; font-weight: 700;
            z-index: 30; border-top: 3px solid var(--gold);
        }
        .footer svg { width: 15mm; height: 15mm; color: var(--gold); margin: 0 15mm; }

        @media print {
            body { padding: 0; background: none; }
            .a1-poster { box-shadow: none; margin: 0; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
    </style>
</head>
<body>
    <div class="a1-poster">
        <div class="border-layer"><div class="border-inner"></div></div>
        
        <div class="top-ornament">
            <div class="ornament-circle">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V11H17V13H13V17H11V13H7V11H11V7Z"/></svg>
            </div>
        </div>

        <div class="content-layer">
            <!-- LEFT COLUMN (Portrait) -->
            <div class="left-col">
                {{IMAGE_BLOCK}}
                <div class="ornate-circle">
                    <!-- Placeholder for the custom circle diagram -->
                    <svg viewBox="0 0 24 24" fill="var(--gold)" style="width: 80mm; height: 80mm; opacity: 0.3;"><path d="M12 2C12 2 9 6 6 9C3 12 1 15 2 18C3 21 6 22 12 22C18 22 21 21 22 18C23 15 21 12 18 9C15 6 12 2 12 2ZM12 19C12 19 8 18 8 14C8 10 12 5 12 5C12 5 16 10 16 14C16 18 12 19 12 19Z"/></svg>
                </div>
            </div>

            <!-- RIGHT COLUMN (Info) -->
            <div class="right-col">
                <div class="title-section">
                    <h1 class="main-title">{{NAME}}</h1>
                    <h2 class="sub-title">{{VIDYASTHANA}}</h2>
                </div>

                <div class="shloka-block">
                    <div class="shloka-sanskrit">{{SHLOKA}}</div>
                    <div class="shloka-trans">{{SHLOKA_TRANS}}</div>
                </div>

                <div class="quote-block">
                    {{QUOTE}}
                </div>

                <div class="section-banner">WHO WAS {{NAME_SHORT}}?</div>
                <p class="who-was">{{CONTEXT}}</p>

                <div class="section-banner">MAJOR CONTRIBUTIONS</div>
                <div class="contributions-grid">
                    {{CONTRIBUTIONS_GRID}}
                </div>
            </div>
        </div>
        
        <!-- FULL WIDTH LEGACY ROW AT BOTTOM (Inside Content Layer visually, but placed below) -->
        <div style="z-index: 20; position: absolute; bottom: 45mm; left: 30mm; right: 30mm;">
            <div class="section-banner">INFLUENCE THAT CONTINUES</div>
            <div class="legacy-row">
                {{LEGACY_ROW}}
            </div>
        </div>

        <div class="footer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 9 6 6 9C3 12 1 15 2 18C3 21 6 22 12 22C18 22 21 21 22 18C23 15 21 12 18 9C15 6 12 2 12 2ZM12 19C12 19 8 18 8 14C8 10 12 5 12 5C12 5 16 10 16 14C16 18 12 19 12 19Z"/></svg>
            CENTER FOR INDIAN KNOWLEDGE SYSTEMS
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 9 6 6 9C3 12 1 15 2 18C3 21 6 22 12 22C18 22 21 21 22 18C23 15 21 12 18 9C15 6 12 2 12 2ZM12 19C12 19 8 18 8 14C8 10 12 5 12 5C12 5 16 10 16 14C16 18 12 19 12 19Z"/></svg>
        </div>
    </div>
</body>
</html>`;

if (enrichedData.length > 0) {
    enrichedData.forEach((guru, index) => {
        let safeName = guru.name.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
        let imagePath = path.join(imagesDir, 'Generic_Guru.jpg'); // testing fallback
        let imageBlock = fs.existsSync(imagePath) 
            ? `<img src="file://${imagePath}" class="portrait-img" />` 
            : `<img src="file:///Users/sjs.iss/Desktop/IITG_Guru_Posters/images/Generic_Guru.jpg" class="portrait-img" />`;
        
        let contribGrid = '';
        if(guru.structuredContributions) {
            guru.structuredContributions.forEach((c, i) => {
                let icon = iconList[i % iconList.length];
                contribGrid += `<div class="contrib-item"><div class="contrib-icon">${icon}</div><div class="contrib-text"><h4>${c.title}</h4><p>${c.description}</p></div></div>`;
            });
        }

        let legacyRow = '';
        if(guru.structuredLegacy) {
            guru.structuredLegacy.forEach((l, i) => {
                let icon = iconList[(i+2) % iconList.length];
                legacyRow += `<div class="legacy-item"><div class="legacy-icon">${icon}</div><h4>${l.title}</h4><p>${l.description}</p></div>`;
            });
        }

        let htmlContent = template
            .replaceAll('{{NAME}}', guru.name)
            .replaceAll('{{NAME_SHORT}}', guru.name.replace('Maharṣi ', '').replace('Bhagavān ', '').replace('Ācārya ', ''))
            .replaceAll('{{VIDYASTHANA}}', guru.vidyaSthana)
            .replaceAll('{{ERA}}', guru.era)
            .replaceAll('{{SHLOKA}}', guru.shloka || '॥ ज्ञानं परमं बलम् ॥')
            .replaceAll('{{SHLOKA_TRANS}}', guru.shlokaTranslation || 'Knowledge is the ultimate power.')
            .replaceAll('{{QUOTE}}', guru.quote || 'The highest truth is found within.')
            .replaceAll('{{CONTEXT}}', guru.details ? guru.details.lifeContext : '')
            .replaceAll('{{CONTRIBUTIONS_GRID}}', contribGrid)
            .replaceAll('{{LEGACY_ROW}}', legacyRow)
            .replaceAll('{{IMAGE_BLOCK}}', imageBlock);
            
        let filePath = path.join(desktopDir, safeName + '_Test_Poster.html');
        fs.writeFileSync(filePath, htmlContent, 'utf-8');
    });
    console.log("Successfully generated test poster HTML at " + desktopDir);
}
