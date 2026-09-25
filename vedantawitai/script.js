document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const slokaInput = document.getElementById('sloka-input');
    const dashboard = document.getElementById('analysis-dashboard');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab Switching Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Mock Data for Analysis
    const mockAnalysis = {
        padaccheda: [
            { word: 'धर्मक्षेत्रे', root: 'धर्म-क्षेत्र', type: 'Noun, Locative, Singular' },
            { word: 'कुरुक्षेत्रे', root: 'कुरु-क्षेत्र', type: 'Noun, Locative, Singular' },
            { word: 'समवेताः', root: 'सम्-अव-इ', type: 'Participle, Nominative, Plural' },
            { word: 'युयुत्सवः', root: 'युध्', type: 'Desiderative Adjective, Nominative, Plural' }
        ],
        sandhi: [
            { original: 'समवेताः + युयुत्सवः', resolved: 'समवेता युयुत्सवः', rule: 'भोभगोअघोअपूर्वस्य योऽशि (8.3.17)', desc: 'Visarga changes to y, which is optionally elided' }
        ],
        samasa: [
            { compound: 'धर्मक्षेत्रे', breakdown: 'धर्मस्य क्षेत्रम् (षष्ठी तत्पुरुषः)', meaning: 'In the field of Dharma' },
            { compound: 'कुरुक्षेत्रे', breakdown: 'कुरूणां क्षेत्रम् (षष्ठी तत्पुरुषः)', meaning: 'In the field of the Kurus' }
        ],
        shabdarupa: [
            { word: 'क्षेत्रे', base: 'क्षेत्र (Neuter)', vibhakti: 'सप्तमी (Locative)', vacana: 'एकवचनम् (Singular)', meaning: 'in the field' }
        ],
        anvaya: "हे सञ्जय ! धर्मक्षेत्रे कुरुक्षेत्रे समवेताः युयुत्सवः मामकाः पाण्डवाः च किम् अकुर्वत ?"
    };

    // Render Analysis Data
    const renderAnalysis = () => {
        // Render Padaccheda
        const padacchedaContainer = document.getElementById('padaccheda-results');
        padacchedaContainer.innerHTML = mockAnalysis.padaccheda.map(item => `
            <div class="analysis-card">
                <h3 class="sanskrit-text">${item.word}</h3>
                <p><strong>Root:</strong> <span class="sanskrit-text">${item.root}</span></p>
                <p><strong>Morphology:</strong> ${item.type}</p>
            </div>
        `).join('');

        // Render Sandhi
        const sandhiContainer = document.getElementById('sandhi-results');
        sandhiContainer.innerHTML = mockAnalysis.sandhi.map(item => `
            <div class="analysis-card">
                <h3 class="sanskrit-text">${item.original} ➔ ${item.resolved}</h3>
                <p>${item.desc}</p>
                <span class="sutra-ref sanskrit-text">${item.rule}</span>
            </div>
        `).join('');

        // Render Samasa
        const samasaContainer = document.getElementById('samasa-results');
        samasaContainer.innerHTML = mockAnalysis.samasa.map(item => `
            <div class="analysis-card">
                <h3 class="sanskrit-text">${item.compound}</h3>
                <p class="sanskrit-text">${item.breakdown}</p>
                <p><em>${item.meaning}</em></p>
            </div>
        `).join('');

        // Render Shabdarupa
        const shabdarupaContainer = document.getElementById('shabdarupa-results');
        shabdarupaContainer.innerHTML = mockAnalysis.shabdarupa.map(item => `
            <div class="analysis-card">
                <h3 class="sanskrit-text">${item.word}</h3>
                <p><strong>Base:</strong> <span class="sanskrit-text">${item.base}</span></p>
                <p><strong>Vibhakti:</strong> <span class="sanskrit-text">${item.vibhakti}</span></p>
                <p><strong>Vacana:</strong> <span class="sanskrit-text">${item.vacana}</span></p>
                <p><em>${item.meaning}</em></p>
            </div>
        `).join('');

        // Render Anvaya
        const anvayaContainer = document.getElementById('anvaya-results');
        anvayaContainer.innerHTML = mockAnalysis.anvaya;
    };

    // Analyze Button Click
    analyzeBtn.addEventListener('click', () => {
        const text = slokaInput.value.trim();
        
        if (!text) {
            // If empty, auto-fill the Bhagavad Gita 1.1 for demonstration
            slokaInput.value = "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥";
        }

        // Change button state to simulate loading
        const originalText = analyzeBtn.innerHTML;
        analyzeBtn.innerHTML = 'Analyzing...';
        analyzeBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            renderAnalysis();
            dashboard.classList.add('active');
            
            // Reset button
            analyzeBtn.innerHTML = originalText;
            analyzeBtn.disabled = false;
            
            // Scroll to dashboard
            dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800);
    });
});
