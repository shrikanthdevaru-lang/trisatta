document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('search-input');
  const searchResultsEl = document.getElementById('search-results');
  
  let allVerses = [];
  let kandaData = null;

  // Load Data
  try {
    const res = await fetch('data/brahma-kanda.json');
    kandaData = await res.json();
    
    // Flatten verses into searchable array, adding kanda info
    if (kandaData && kandaData.verses) {
      allVerses = kandaData.verses.map(v => ({
        ...v,
        kandaName: kandaData.kandaName,
        kandaId: kandaData.kanda
      }));
    }
  } catch(e) {
    console.error("Error loading search data:", e);
    searchResultsEl.innerHTML = `<div class="text-center text-gold p-lg">Failed to load searchable data.</div>`;
    return;
  }

  // Handle Search Input
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      searchResultsEl.innerHTML = `<div class="text-center text-muted p-lg">Type a keyword to begin searching.</div>`;
      return;
    }

    const results = performSearch(query);
    renderResults(results, query);
  });

  function performSearch(query) {
    return allVerses.filter(v => {
      return (
        (v.sanskrit && v.sanskrit.toLowerCase().includes(query)) ||
        (v.iast && v.iast.toLowerCase().includes(query)) ||
        (v.english && v.english.toLowerCase().includes(query)) ||
        (v.hindi && v.hindi.includes(query)) ||
        (v.conceptTags && v.conceptTags.some(tag => tag.toLowerCase().includes(query)))
      );
    });
  }

  function highlightText(text, query) {
    if (!text || !query) return text;
    // Simple case-insensitive replacement
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  function renderResults(results, query) {
    if (results.length === 0) {
      searchResultsEl.innerHTML = `<div class="text-center text-muted p-lg">No results found for "${query}".</div>`;
      return;
    }

    let html = `<div class="text-sm text-gold mb-md">Found ${results.length} result(s)</div>`;
    
    results.forEach(res => {
      // Create link to text browser
      const link = `text.html?kanda=${res.kandaId}`;
      
      html += `
        <a href="${link}" class="search-result" onclick="sessionStorage.setItem('targetVerse', '${res.id}')">
          <div class="result-kanda">${res.kandaName} — Kārikā ${res.number}</div>
          <div class="result-sanskrit deva">${highlightText(res.sanskrit, query).replace(/\n/g, ' ')}</div>
          <div class="result-translation">${highlightText(res.english, query)}</div>
        </a>
      `;
    });

    searchResultsEl.innerHTML = html;
  }
});
