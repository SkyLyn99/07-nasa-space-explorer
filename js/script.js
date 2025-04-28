// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Set up the date pickers with:
// - A start date 9 days ago
// - Today as the end date
// - Makes sure you can't pick dates before 1995
setupDateInputs(startInput, endInput);

const API_KEY = 'm2IrGhDOIhI4N8Iw8DacL7bRWiFLQi3Et7GXthtT';
const fetchBtn = document.getElementById('fetchApods');
const resultsContainer = document.getElementById('results');

// ✅ Corrected arrow function for click event
fetchBtn.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  const apiUrl = `https://api.nasa.gov/planetary/apod?start_date=${startDate}&end_date=${endDate}&thumbs=true&api_key=${API_KEY}`;

  // 👇 Show a loading message
  resultsContainer.innerHTML = '<p>🔄 Loading space photos…</p>';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      resultsContainer.innerHTML = ''; // Clear loading message

      if (data.length === 0) {
        resultsContainer.innerHTML = '<p>No space images found for this date range.</p>';
        return;
      }

      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-item';

        let mediaHtml = '';

        if (item.media_type === 'image') {
          mediaHtml = `<img src="${item.url}" alt="${item.title}" />`;
        } else if (item.media_type === 'video' && item.thumbnail_url) {
          mediaHtml = `<a href="${item.url}" target="_blank"><img src="${item.thumbnail_url}" alt="Video thumbnail for ${item.title}" /></a>`;
        } else {
          mediaHtml = `<a href="${item.url}" target="_blank">View ${item.media_type}</a>`;
        }

        card.innerHTML = `
          ${mediaHtml}
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;

        resultsContainer.appendChild(card);
      });
    })
    // ✅ Finished catch block
    .catch(error => {
      console.error('API fetch error:', error);
      resultsContainer.innerHTML = '<p>Error fetching space images. Please try again.</p>';
    });
});

