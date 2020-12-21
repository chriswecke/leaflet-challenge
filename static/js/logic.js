// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level for sf
// This gets inserted into the div with an id of 'map' in index.html
var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: "pk.eyJ1IjoiY2hyaXN3ZWNrZSIsImEiOiJja2hwamdic2cwMTVzMnduejhqOGh1ZWZvIn0.t8u_63P6Jk7Ne48SICJoLg"
  }).addTo(myMap);

  // Store our API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
    //   fillOpacity: 0.5,
      fillOpacity: getOpacity(feature.properties.mag),
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set different color from magnitude
  // Used depth ranges from https://www.usgs.gov/natural-hazards/earthquake-hazards/science/determining-depth-earthquake?qt-science_center_objects=0#qt-science_center_objects

    function getColor(depth) {
    switch (true) {
    case depth > 500:
      return "#ea2c2c";
    case depth > 400:
      return "#ea822c";
    case depth > 200:
      return "#ee9c00";
    case depth > 70:
      return "#eecc00";
    case depth > 25:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

  function getOpacity(magnitude) {
    switch (true) {
    case magnitude > 5:
      return 1;
    case magnitude > 4:
      return 1;
    case magnitude > 3:
      return 0.6;
    case magnitude > 2:
      return 0.4;
    case magnitude > 1:
      return 0.2;
    default:
      return 0.1;
    }
  }

  // set radiuss from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    //experimenting with radius sizing
    return (magnitude*magnitude);
    // return magnitude * 4;
    // return Math.log(magnitude);
  }
    // GeoJSON layer
    L.geoJson(data, {
      // Create circles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // circle style
      style: styleInfo,
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km deep" + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  
    // an object legend
    var legend = L.control({
      position: "bottomright"
    });
  
    // details for the legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
  
      var grades = [0, 25, 70, 200, 400, 500];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
      // Looping through
      //***can't get this to show the correct background color***
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
    // Finally, we our legend to the map.
    legend.addTo(myMap);
  });