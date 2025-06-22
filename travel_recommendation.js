// Fetch travel recommendations and log the data
fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    console.log('Travel Recommendations:', data);
    // You can add logic here to display the recommendations on the page
  })
  .catch(error => {
    console.error('Error fetching recommendations:', error);
  });