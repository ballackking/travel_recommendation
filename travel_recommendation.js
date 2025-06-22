// Fetch travel recommendations and log the data
let recommendations = [];
fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    recommendations = data;
    console.log('Travel Recommendations:', data);
  })
  .catch(error => {
    console.error('Error fetching recommendations:', error);
  });

// Helper to get current time in a given time zone
function getCurrentTimeInTimeZone(timeZone) {
  if (!timeZone) return '';
  const options = { timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date().toLocaleTimeString('en-US', options);
}

// Helper to render recommendations
function renderRecommendations(results) {
  let container = document.getElementById('recommendationResults');
  if (!container) {
    container = document.createElement('div');
    container.id = 'recommendationResults';
    container.style.marginTop = '32px';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.gap = '32px';
    document.body.appendChild(container);
  }
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<p style="color:#fff;font-size:1.2em;">No recommendations found.</p>';
    return;
  }
  results.slice(0, 4).forEach(item => {
    const card = document.createElement('div');
    card.style.background = 'rgba(255,255,255,0.95)';
    card.style.borderRadius = '16px';
    card.style.boxShadow = '0 4px 24px #0002';
    card.style.overflow = 'hidden';
    card.style.width = '380px';
    card.style.marginBottom = '16px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.border = '4px solid #008080';
    card.style.paddingBottom = '12px';

    if (item.imageUrl) {
      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = item.name;
      img.style.width = '100%';
      img.style.height = '220px';
      img.style.objectFit = 'cover';
      card.appendChild(img);
    }
    const title = document.createElement('h2');
    title.textContent = item.name + (item.country ? ', ' + item.country : '');
    title.style.margin = '16px 16px 8px 16px';
    title.style.fontSize = '1.3em';
    title.style.color = '#222';
    card.appendChild(title);
    // Show current time if timeZone is present
    if (item.timeZone) {
      const timeDiv = document.createElement('div');
      timeDiv.textContent = 'Current time: ' + getCurrentTimeInTimeZone(item.timeZone);
      timeDiv.style.margin = '0 16px 8px 16px';
      timeDiv.style.color = '#008080';
      timeDiv.style.fontWeight = 'bold';
      card.appendChild(timeDiv);
    }
    const desc = document.createElement('p');
    desc.textContent = item.description || '';
    desc.style.margin = '0 16px 12px 16px';
    desc.style.color = '#444';
    desc.style.fontSize = '1em';
    card.appendChild(desc);
    const visitBtn = document.createElement('a');
    visitBtn.textContent = 'Visit';
    visitBtn.href = item.link || '#';
    visitBtn.target = '_blank';
    visitBtn.style.display = 'inline-block';
    visitBtn.style.margin = '0 16px';
    visitBtn.style.padding = '8px 24px';
    visitBtn.style.background = '#008080';
    visitBtn.style.color = '#fff';
    visitBtn.style.borderRadius = '8px';
    visitBtn.style.textDecoration = 'none';
    visitBtn.style.fontWeight = '600';
    visitBtn.style.fontSize = '1em';
    visitBtn.style.transition = 'background 0.2s';
    visitBtn.onmouseover = () => visitBtn.style.background = '#005f5f';
    visitBtn.onmouseout = () => visitBtn.style.background = '#008080';
    card.appendChild(visitBtn);
    container.appendChild(card);
  });
}

// Search functionality for navbar
const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.getElementById('searchInput');
    if (!input) return;
    const keyword = input.value.trim().toLowerCase();
    if (!keyword) return;
    // Accept variations: beach, beaches, BEACH, etc.
    const results = recommendations.filter(item => {
      const name = item.name ? item.name.toLowerCase() : '';
      const desc = item.description ? item.description.toLowerCase() : '';
      // Accept plural/singular and case-insensitive
      if (keyword === 'beach' || keyword === 'beaches') {
        return name.includes('beach') || desc.includes('beach');
      }
      if (keyword === 'temple' || keyword === 'temples') {
        return name.includes('temple') || desc.includes('temple');
      }
      // Accept country names
      if (item.country && item.country.toLowerCase().includes(keyword)) {
        return true;
      }
      // General keyword match
      return name.includes(keyword) || desc.includes(keyword);
    });
    renderRecommendations(results);
  });
}

// Clear results function
function clearRecommendations() {
  const container = document.getElementById('recommendationResults');
  if (container) {
    container.innerHTML = '';
  }
  const input = document.getElementById('searchInput');
  if (input) {
    input.value = '';
  }
}

// Attach clear button event
const clearBtn = document.getElementById('resetBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', function() {
    clearRecommendations();
  });
}