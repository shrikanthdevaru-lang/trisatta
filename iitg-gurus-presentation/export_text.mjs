import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const desktopDir = path.join(process.env.HOME || '/Users/sjs.iss', 'Desktop', 'IITG_Guru_Text_Data');
if (!fs.existsSync(desktopDir)) {
    fs.mkdirSync(desktopDir, { recursive: true });
}

const e1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'enriched_1.json'), 'utf-8'));
const e2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'enriched_2.json'), 'utf-8'));
const e3 = JSON.parse(fs.readFileSync(path.join(__dirname, 'enriched_3.json'), 'utf-8'));
const gurusData = [...e1, ...e2, ...e3];

gurusData.forEach(guru => {
    let safeName = guru.name.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
    let content = `NAME: ${guru.name}\n`;
    content += `VIDYASTHANA (DOMAIN): ${guru.vidyaSthana || 'N/A'}\n`;
    content += `ERA: ${guru.era || 'N/A'}\n\n`;
    
    if (guru.shloka) {
        content += `SHLOKA:\n${guru.shloka}\n`;
        content += `TRANSLATION:\n${guru.shlokaTranslation || 'N/A'}\n\n`;
    }
    
    if (guru.quote) {
        content += `QUOTE:\n"${guru.quote}"\n\n`;
    }
    
    content += `ABOUT THE GURU / CONTEXT:\n${guru.details?.lifeContext || 'N/A'}\n\n`;
    
    content += `MAJOR CONTRIBUTIONS:\n`;
    let contribs = guru.structuredContributions || [];
    if (contribs.length === 0 && guru.details?.keyContributions) {
        contribs = [{title: "Key Contribution", description: guru.details.keyContributions}];
    }
    contribs.forEach(c => {
        content += `- ${c.title}: ${c.description}\n`;
    });
    content += `\n`;
    
    content += `INFLUENCE THAT CONTINUES / LEGACY:\n`;
    let legacy = guru.structuredLegacy || [];
    if (legacy.length === 0 && guru.details?.legacy) {
        legacy = [{title: "Historical Impact", description: guru.details.legacy}];
    }
    legacy.forEach(l => {
        content += `- ${l.title}: ${l.description}\n`;
    });
    content += `\n`;

    let filePath = path.join(desktopDir, `${safeName}_Data.txt`);
    fs.writeFileSync(filePath, content, 'utf-8');
});

console.log(`Successfully exported 30 text files to ${desktopDir}`);
