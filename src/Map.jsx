import React, { useEffect, useState } from "react";
import nextbillion from "nbmap-gl";
import "nbmap-gl/dist/nextbillion.css";

import "./styles.css";

function Map({ coordinates, setCoordinates }) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  nextbillion.setApiKey(process.env.REACT_APP_NB_API_KEY);

  // Setting a new map
  useEffect(() => {
    const nbMap = new nextbillion.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: coordinates,
      vectorTilesSourceUrl: "https://api.nextbillion.io/tiles/v3/tiles.json",
      style: `https://api.nextbillion.io/maps/streets/style.json?key=${process.env.REACT_APP_NB_API_KEY}`
    });
    setMap(nbMap);
  }, []);

  // Positioning the marker for the first time
  useEffect(() => {
    try {
      const nbMarker = new nextbillion.maps.Marker({
        position: coordinates,
        map: map
      });

      setMarker(nbMarker);
    } catch (error) {
      console.error(error);
    }
  }, [map]);

  // Dynamic  Marker
  useEffect(() => {
    map &&
      marker &&
      map.on("click", (event) => {
        const { lng, lat } = event.lngLat;

        // The second parameter is speed: 0-10inclusive
        marker.moveTo({ lng, lat }, 10);

        setCoordinates({
          lat,
          lng
        });
      });
  }, [map, marker, setCoordinates]);

  // Choosing a wonder!
  useEffect(() => {
    marker &&
      map &&
      (marker.moveTo(coordinates, 10),
      map.flyTo({ center: coordinates, zoom: 14, speed: 2.5, curve: 0.8 }));
  }, [map, marker, coordinates]);

  return <div id="map"></div>;
}

export default Map;
