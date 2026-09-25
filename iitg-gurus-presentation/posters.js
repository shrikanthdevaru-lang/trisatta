import { gurusData } from './gurus_data.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('posters-container');
    
    gurusData.forEach((guru, index) => {
        const worksHtml = guru.works.map(work => `<li>${work}</li>`).join('');
        const watermarkNumber = String(index + 1).padStart(2, '0');
        
        const posterHTML = `
            <div class="poster-page">
                <!-- Ornate Corners -->
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>
                
                <div class="watermark">${watermarkNumber}</div>
                
                <div class="poster-content-wrapper">
                    
                    <div class="poster-header">
                        <h1 class="poster-title">${guru.name}</h1>
                        <div class="metadata-tags">
                            <span class="meta-tag">Era: ${guru.era}</span>
                            <span class="meta-tag">Vidyāsthāna: ${guru.vidyaSthana}</span>
                        </div>
                    </div>
                    
                    <div class="poster-body">
                        <!-- Magazine-style 2-column text block -->
                        <div class="editorial-text">
                            <div class="content-block">
                                <h3>Life & Context</h3>
                                <p>${guru.details.lifeContext}</p>
                            </div>
                            
                            <div class="content-block">
                                <h3>Key Contributions</h3>
                                <p>${guru.details.keyContributions}</p>
                            </div>
                            
                            <div class="content-block">
                                <h3>Legacy</h3>
                                <p>${guru.details.legacy}</p>
                            </div>
                        </div>
                        
                        <!-- Full width Works section at the bottom -->
                        <div class="works-section">
                            <h3>Complete Works</h3>
                            <ul class="works-list">
                                ${worksHtml}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="poster-footer">
                        <p class="iitg-branding">IIT GUWAHATI &nbsp;◈&nbsp; INDIC KNOWLEDGE SYSTEMS &nbsp;◈&nbsp; THE ETERNAL GURUS OF BHĀRATA</p>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', posterHTML);
    });
});
