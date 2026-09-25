document.addEventListener('DOMContentLoaded', () => {
  const verseListEl = document.getElementById('verse-list');
  const verseDisplayEl = document.getElementById('verse-display');
  const tikaContentEl = document.getElementById('tika-content');
  const tikaTargetWordEl = document.getElementById('tika-target-word');
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  let currentKandaData = null;
  let currentVerse = null;
  let currentWord = null;
  let activeLanguage = 'sanskrit';

  // Extract kanda from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const kandaParam = urlParams.get('kanda') || 'brahma';

  // Initialize
  loadKanda(kandaParam);

  // Tab switching logic
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      tabBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      // Set active language
      activeLanguage = btn.dataset.tab;
      // Re-render tika content if a word is selected
      if (currentWord) {
        renderTika(currentWord);
      }
    });
  });

  async function loadKanda(kandaId) {
    try {
      // In a real scenario, this would fetch from a server.
      // We are fetching the local JSON file.
      const response = await fetch(`data/${kandaId}-kanda.json`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      currentKandaData = await response.json();
      renderVerseList();
      
      // Load specific verse from URL or fallback to first verse
      const urlParams = new URLSearchParams(window.location.search);
      const targetVerseId = urlParams.get('verse');
      
      if (targetVerseId) {
        selectVerse(targetVerseId);
        
        // Try to scroll the left sidebar to the selected verse
        setTimeout(() => {
           const activeItem = document.querySelector('.verse-item.active');
           if (activeItem) {
               activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
        }, 100);
      } else if (currentKandaData.verses && currentKandaData.verses.length > 0) {
        selectVerse(currentKandaData.verses[0].id);
      }
    } catch (error) {
      console.error('Failed to load Kanda data:', error);
      verseDisplayEl.innerHTML = `<div class="text-center p-lg text-gold">Failed to load data. Please check connection.</div>`;
    }
  }

  function renderVerseList() {
    verseListEl.innerHTML = '';
    currentKandaData.verses.forEach(verse => {
      const item = document.createElement('div');
      item.className = 'verse-item';
      item.dataset.id = verse.id;
      
      // Get first line of sanskrit for preview
      const previewText = verse.sanskrit.split('\n')[0].substring(0, 30) + '...';
      
      item.innerHTML = `
        <div class="verse-item-num">${verse.number}</div>
        <div class="verse-item-text">${previewText}</div>
      `;
      
      item.addEventListener('click', () => selectVerse(verse.id));
      verseListEl.appendChild(item);
    });
  }

  function selectVerse(verseId) {
    // Update active state in list
    document.querySelectorAll('.verse-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === verseId);
    });

    currentVerse = currentKandaData.verses.find(v => v.id === verseId);
    if (!currentVerse) return;

    // Reset current word selection
    currentWord = null;
    tikaTargetWordEl.innerHTML = `Select a word in the verse to see commentary.`;
    tikaContentEl.innerHTML = `
      <div class="text-muted text-sm text-center mt-lg p-lg glass-2" style="border-radius: var(--r-md);">
        Click on any highlighted Sanskrit word in the verse to explore traditional commentaries (Helārāja, Puṇyarāja) and modern explanations.
      </div>
    `;

    renderVerseContent();
  }

  function renderVerseContent() {
    // Process sanskrit text to make words clickable
    // The data contains an array of 'words' that have detailed info
    let clickableSanskritHTML = currentVerse.sanskrit.replace(/\n/g, '<br>');
    
    // Simple replacement approach: Wrap known words in spans
    // A more robust approach would need exact character offsets in the JSON
    if (currentVerse.words) {
      currentVerse.words.forEach(wordObj => {
        // Use a regex to match the word safely
        // Note: Sandhi makes this complex in real Sanskrit text.
        // For this demo, we assume the JSON 'word' exactly matches substrings in 'sanskrit'
        // or we simply render the 'words' array instead of the raw string if we want 100% precision.
        
        // Better approach for precision: Render the raw text, but below it provide the Anvaya (word breakup)
      });
    }

    // Since sandhi splitting is complex, we will render the Anvaya (word-by-word) as clickable blocks
    let anvayaHTML = '';
    if (currentVerse.words) {
      anvayaHTML = currentVerse.words.map((w, index) => 
        `<span class="sanskrit-word deva-lg" data-word-index="${index}">${w.word}</span>`
      ).join(' · ');
    }

    // Determine image
    const imageSrc = currentVerse.image || 'assets/images/hero.jpg';

    verseDisplayEl.innerHTML = `
      <div class="verse-image-wrapper animate-fadeInUp">
        <img src="${imageSrc}" alt="Karika Concept" class="verse-img" onerror="this.src='assets/images/hero.jpg'">
        <div class="verse-img-overlay"></div>
        <div class="verse-meta">
          <span class="badge badge-gold">${currentKandaData.kandaName} — Kārikā ${currentVerse.number}</span>
        </div>
      </div>

      <div class="sanskrit-verse deva-xl animate-fadeInUp" style="animation-delay: 0.1s">
        ${currentVerse.sanskrit.replace(/\n/g, '<br>')}
      </div>
      
      <div class="verse-iast animate-fadeInUp" style="animation-delay: 0.2s">
        ${currentVerse.iast.replace(/\n/g, '<br>')}
      </div>

      <div class="divider"></div>

      <div class="text-center mb-md text-gold text-sm uppercase tracking-wide">Anvaya & Clickable Analysis</div>
      <div class="sanskrit-verse animate-fadeInUp" style="animation-delay: 0.3s">
        ${anvayaHTML}
      </div>

      <div class="verse-translation animate-fadeInUp" style="animation-delay: 0.4s">
        "${currentVerse.english}"
      </div>
      
      <div class="verse-hindi animate-fadeInUp" style="animation-delay: 0.5s">
        ${currentVerse.hindi}
      </div>
      
      ${currentVerse.conceptTags ? `
      <div class="mt-lg text-center animate-fadeInUp" style="animation-delay: 0.6s">
        ${currentVerse.conceptTags.map(tag => `<a href="concepts.html?id=${tag.toLowerCase().replace(/ /g, '-')}" class="badge badge-purple" style="margin: 0 4px; text-decoration: none; display: inline-block;">#${tag}</a>`).join('')}
      </div>
      ` : ''}
    `;

    // Attach click listeners to words
    document.querySelectorAll('.sanskrit-word').forEach(el => {
      el.addEventListener('click', (e) => {
        // Remove active from all
        document.querySelectorAll('.sanskrit-word').forEach(w => w.classList.remove('active'));
        // Add to clicked
        e.target.classList.add('active');
        
        const idx = e.target.dataset.wordIndex;
        currentWord = currentVerse.words[idx];
        renderTika(currentWord);
      });
    });
  }

  function renderTika(wordObj) {
    if (!wordObj) return;

    tikaTargetWordEl.innerHTML = `Commentary on: <strong class="deva text-gold" style="font-size: 1.2rem;">${wordObj.word}</strong>`;

    let html = `
      <div class="word-meaning animate-fadeInUp">
        <div class="word-grammar">${wordObj.grammar}</div>
        <div class="iast">${wordObj.iast}</div>
        <div class="mt-sm">${wordObj.meaning}</div>
      </div>
    `;

    if (wordObj.tikas) {
      const tikas = wordObj.tikas;
      
      // Render based on active language tab
      
      if (tikas.punyaraja && tikas.punyaraja[activeLanguage]) {
        html += createTikaCard('Puṇyarāja', 'Ṭīkā', tikas.punyaraja[activeLanguage], activeLanguage);
      }
      
      if (tikas.helaraja && tikas.helaraja[activeLanguage]) {
        html += createTikaCard('Helārāja', 'Prakīrṇaprakāśa', tikas.helaraja[activeLanguage], activeLanguage);
      }

      if (tikas.iyer && tikas.iyer[activeLanguage]) {
        html += createTikaCard('K.A.S. Iyer', 'Commentary', tikas.iyer[activeLanguage], activeLanguage);
      }

      if (Object.keys(tikas).length === 0 || !hasContentInLanguage(tikas, activeLanguage)) {
         html += `<div class="text-muted text-center p-md">No specific commentary available in ${activeLanguage} for this word.</div>`;
      }
    } else {
      html += `<div class="text-muted text-center p-md">No commentary available for this word.</div>`;
    }

    if (wordObj.extra && wordObj.extra[activeLanguage]) {
      html += `
        <div class="tika-card animate-fadeInUp" style="border-color: var(--clr-gold); background: rgba(201, 169, 110, 0.05);">
          <div class="tika-card-header">
            <span class="tika-author" style="color: var(--clr-gold);">Deep Analysis & Extra Explanation</span>
            <span class="badge badge-purple" style="font-size: 0.65rem;">AI Pandit</span>
          </div>
          <div class="${activeLanguage === 'sanskrit' || activeLanguage === 'hindi' ? 'deva' : 'text-serif'}" style="font-size: ${activeLanguage === 'sanskrit' || activeLanguage === 'hindi' ? '1.1rem' : '1rem'}; line-height: 1.6;">
            ${wordObj.extra[activeLanguage]}
          </div>
        </div>
      `;
    }

    tikaContentEl.innerHTML = html;
  }

  function hasContentInLanguage(tikas, lang) {
    return (tikas.punyaraja && tikas.punyaraja[lang]) || 
           (tikas.helaraja && tikas.helaraja[lang]) || 
           (tikas.iyer && tikas.iyer[lang]);
  }

  function createTikaCard(author, source, content, lang) {
    const isDeva = lang === 'sanskrit' || lang === 'hindi';
    const contentClass = isDeva ? 'deva' : 'text-serif';
    const fontSize = isDeva ? '1.1rem' : '1rem';
    
    return `
      <div class="tika-card animate-fadeInUp">
        <div class="tika-card-header">
          <span class="tika-author">${author}</span>
          <span class="badge badge-gold" style="font-size: 0.65rem;">${source}</span>
        </div>
        <div class="${contentClass}" style="font-size: ${fontSize}; line-height: 1.6;">
          ${content}
        </div>
      </div>
    `;
  }

});
