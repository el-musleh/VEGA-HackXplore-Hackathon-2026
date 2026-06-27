const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('karlsruhe.pdf');

pdf(dataBuffer).then(function(data) {
  let text = data.text.replace(/\n/g, '').trim();
  // It might have trailing garbage or prefix.
  const start = text.indexOf('{"features"');
  if (start !== -1) {
    text = text.substring(start);
  }
  const end = text.lastIndexOf('}');
  if (end !== -1) {
    text = text.substring(0, end + 1);
  }
  
  try {
    const parsed = JSON.parse(text);
    fs.mkdirSync('src/data', { recursive: true });
    
    // Add mock fields to each tree since the original data is just species/location
    const enrichedFeatures = parsed.features.map((f, i) => {
      const moisture = Math.floor(Math.random() * 100);
      return {
        id: i + 1,
        pos: [f.geometry.coordinates[1], f.geometry.coordinates[0]], // Leaflet uses [lat, lng]
        moisture: moisture,
        name: f.properties.baumart_allgemein || 'Tree',
        type: f.properties.baumgruppe || 'Tree',
        waterRequired: Math.floor(Math.random() * 5) + 1,
        sourceNearby: Math.random() > 0.5,
        hasAutoValve: Math.random() > 0.8,
        fact: "Karlsruhe's urban forest helps cool the city by up to 2°C.",
        stadtteil: f.properties.stadtteil
      };
    });

    fs.writeFileSync('src/data/trees.json', JSON.stringify(enrichedFeatures, null, 2));
    console.log('Successfully parsed and saved ' + enrichedFeatures.length + ' trees.');
  } catch(e) {
    console.error('JSON Parse error:', e.message);
  }
});
