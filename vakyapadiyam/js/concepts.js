document.addEventListener('DOMContentLoaded', async () => {
  const conceptListEl = document.getElementById('concept-list');
  const conceptDisplayEl = document.getElementById('concept-display');
  
  let conceptsData = [];
  let kandaData = null;
  let allVerses = [];

  try {
    // Fetch concepts
    const conceptsRes = await fetch('data/concepts.json');
    if (!conceptsRes.ok) throw new Error("Failed to load concepts.json");
    conceptsData = await conceptsRes.json();

    // Fetch verses (for cross-referencing)
    const kandaRes = await fetch('data/brahma-kanda.json');
    if (kandaRes.ok) {
      kandaData = await kandaRes.json();
      allVerses = kandaData.verses.map(v => ({
        ...v,
        kandaName: kandaData.kandaName,
        kandaId: kandaData.kanda
      }));
    }

    renderConceptList();
    
    // Auto-select first concept or check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const conceptId = urlParams.get('id');
    
    if (conceptId) {
      selectConcept(conceptId);
    } else if (conceptsData.length > 0) {
      selectConcept(conceptsData[0].id);
    }

  } catch (error) {
    console.error(error);
    conceptDisplayEl.innerHTML = `<div class="text-center p-lg text-gold">Failed to load concept data. Please ensure the local server is running.</div>`;
  }

  function renderConceptList() {
    conceptListEl.innerHTML = '';
    conceptsData.forEach(concept => {
      const item = document.createElement('div');
      item.className = 'concept-item';
      item.dataset.id = concept.id;
      item.innerHTML = `
        <div class="concept-item-deva">${concept.term_deva}</div>
        <div class="concept-item-iast">${concept.term_iast}</div>
      `;
      item.addEventListener('click', () => {
        // Update URL without reloading
        const url = new URL(window.location);
        url.searchParams.set('id', concept.id);
        window.history.pushState({}, '', url);
        
        selectConcept(concept.id);
      });
      conceptListEl.appendChild(item);
    });
  }

  function selectConcept(id) {
    // Update active state in list
    document.querySelectorAll('.concept-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === id);
    });

    const concept = conceptsData.find(c => c.id === id);
    if (!concept) return;

    // Find relevant karikas based on conceptTags
    // We check if the concept ID or term matches any tag
    const relevantVerses = allVerses.filter(v => {
      if (!v.conceptTags) return false;
      return v.conceptTags.some(tag => 
        tag.toLowerCase() === concept.id.toLowerCase() || 
        tag.toLowerCase() === concept.term_iast.toLowerCase()
      );
    });

    renderConceptContent(concept, relevantVerses);
  }

  function renderConceptContent(concept, verses) {
    let karikasHtml = '';
    
    if (verses.length > 0) {
      karikasHtml = `
        <div class="relevant-karikas-section animate-fadeInUp" style="animation-delay: 0.2s">
          <h3>Relevant Kārikās</h3>
          ${verses.map(v => `
            <a href="text.html?kanda=${v.kandaId}&verse=${v.id}" class="karika-card">
              <div class="karika-card-header">
                <span>${v.kandaName}</span>
                <span>Kārikā ${v.number}</span>
              </div>
              <div class="karika-sanskrit">${v.sanskrit.replace(/\n/g, '<br>')}</div>
              <div class="karika-english">"${v.english}"</div>
              <span class="read-more">Analyze deeply in Text Browser →</span>
            </a>
          `).join('')}
        </div>
      `;
    } else {
      karikasHtml = `
        <div class="relevant-karikas-section animate-fadeInUp" style="animation-delay: 0.2s">
          <h3>Relevant Kārikās</h3>
          <div class="text-center text-muted p-md">No verses have been tagged with this concept yet.</div>
        </div>
      `;
    }

    conceptDisplayEl.innerHTML = `
      <div class="concept-header animate-fadeInUp">
        <h2 class="concept-title deva">${concept.term_deva}</h2>
        <div class="concept-subtitle iast">${concept.term_iast}</div>
        <div class="text-gold text-sm mt-sm uppercase tracking-wide">${concept.short_desc}</div>
      </div>
      
      <div class="concept-image-wrapper animate-fadeInUp" style="animation-delay: 0.05s">
        <img src="${concept.image}" alt="${concept.term_iast}" onerror="this.src='assets/images/hero.jpg'">
      </div>
      
      <div class="concept-definition animate-fadeInUp" style="animation-delay: 0.1s">
        ${concept.definition}
      </div>

      ${karikasHtml}
    `;
  }
});
