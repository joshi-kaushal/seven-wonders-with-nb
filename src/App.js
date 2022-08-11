import React, { useEffect, useState } from "react";
import nextbillion from "nbmap-gl";
import "nbmap-gl/dist/nextbillion.css";

import "./styles.css";
import Map from "./Map";
import Dropdown from "./Dropdown";

nextbillion.setApiKey("plaintesting");

function App() {
  const [coordinates, setCoordinates] = useState({
    lat: 27.1773531,
    lng: 78.0116069
  });
  const [wonder, setWonder] = useState(null);

  return (
    <>
      <h1>Explore the Seven Wonders of the World!</h1>
      <Dropdown
        wonder={wonder}
        setWonder={setWonder}
        setCoordinates={setCoordinates}
      />
      <Map coordinates={coordinates} setCoordinates={setCoordinates} />
    </>
  );
}

export default App;
