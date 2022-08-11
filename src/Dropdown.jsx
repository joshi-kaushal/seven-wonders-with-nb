import { useEffect } from "react";
// Taj Mahal - India
// Colosseum - Italy
// Chichen Itza - Mexico
// Machu Picchu - Peru
// Christ the Redeemer - Brazil
// Petra - Jordan
// Great Wall of China - China
function Dropdown({ wonder, setWonder, setCoordinates }) {
  useEffect(() => {
    switch (wonder) {
      case "taj-mahal":
        setCoordinates({ lat: 27.1773531, lng: 78.0116069 });
        break;
      case "colosseum":
        setCoordinates({ lat: 41.8902141, lng: 12.4877462 });
        break;
      case "chichen-itza":
        setCoordinates({ lat: 20.6787867, lng: -88.5706656 });
        break;
      case "machu-picchu":
        setCoordinates({ lat: -13.163136, lng: -72.5471516 });
        break;
      case "christ-the-redeemer":
        setCoordinates({ lat: -22.9533291, lng: -43.2132448 });
        break;
      case "petra":
        setCoordinates({ lat: 26.9965639, lng: 33.5115078 });
        break;
      case "great-wall":
        setCoordinates({ lat: 40.4319117, lng: 116.565892 });
        break;
      default:
        setCoordinates({ lat: 27.1773531, lng: 78.0116069 });
    }
  }, [wonder]);

  return (
    <section className="dropdown">
      <select name="wonders" onChange={(e) => setWonder(e.target.value)}>
        <option value="taj-mahal">Taj Mahal</option>
        <option value="colosseum">Colosseum</option>
        <option value="chichen-itza">Chichen Itza</option>
        <option value="machu-picchu">Machu Picchu</option>
        <option value="christ-the-redeemer">Christ the Redeemer</option>
        <option value="petra">Petra</option>
        <option value="great-wall">Great Wall of China</option>
      </select>
    </section>
  );
}
export default Dropdown;
