const axios = require("axios");

const BASE_URL = "http://localhost:5000/destinations/add";

const destinations = [
 
  {
    name: "Paris",
    imageUrl: "images/pexels-gryziu-31342695.jpg",
    description: "Romance, architecture, and culture in the City of Light.",
    price: 35000,
    duration: "5 days",
    type: "Romantic"
  },
  {
    name: "New York",
    imageUrl: "images/pexels-jaime-reimer-1376930-2662116.jpg",
    description: "Discover the vibrant energy of the Big Apple.",
    price: 40000,
    duration: "4 days",
    type: "City Tour"
  },
  {
    name: "Tokyo",
    imageUrl: "images/pexels-matthardy-2309272.jpg",
    description: "Explore futuristic tech and traditional temples.",
    price: 42000,
    duration: "6 days",
    type: "Cultural"
  },
  {
    name: "Swiss Alps",
    imageUrl: "images/pexels-myersmc16-31357710.jpg",
    description: "Snow-covered peaks and charming villages await.",
    price: 50000,
    duration: "7 days",
    type: "Adventure"
  },
  {
    name: "Maldives",
    imageUrl: "images/pexels-myersmc16-31357721.jpg",
    description: "Crystal-clear water and luxury resorts.",
    price: 60000,
    duration: "5 days",
    type: "Luxury"
  },
  {
    name: "Dubai",
    imageUrl: "images/pexels-myersmc16-31357753.jpg",
    description: "Modern architecture, shopping, and desert safaris.",
    price: 30000,
    duration: "4 days",
    type: "Modern"
  },
  {
    name: "Kerala Backwaters",
    imageUrl: "images/pexels-samson-bush-1387215-2678418.jpg",
    description: "Houseboat journeys and natural serenity.",
    price: 15000,
    duration: "3 days",
    type: "Nature"
  },
  {
    name: "London",
    imageUrl: "images/pexels-silvia-trigo-545701-2675268.jpg",
    description: "History, royalty, and vibrant street culture.",
    price: 45000,
    duration: "5 days",
    type: "City Tour"
  },
  {
    name: "Great Barrier Reef",
    imageUrl: "images/pexels-yulius-santoso-1587812313-31340895.jpg",
    description: "Snorkel with vibrant coral and marine life.",
    price: 55000,
    duration: "6 days",
    type: "Adventure"
  }
];

async function uploadDestinations() {
  for (const dest of destinations) {
    try {
      const res = await axios.post(BASE_URL, dest);
      console.log(`✅ Uploaded: ${dest.name}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${dest.name}`, err.response?.data || err.message);
    }
  }
}

uploadDestinations();
