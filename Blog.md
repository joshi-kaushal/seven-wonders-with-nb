# Creating a Map to Search Seven Wonders of the World

## Introduction

In this article, we will create a web application to search for the seven wonders of the world. The user will be shown a list of seven wonders and based on his choice the map will change. To render the map and handle all of its related logic, we will use Nextbilion.ai, but more on this later.

## Prerequisites

The only prerequisite for this article is familiarity with react.

- Component based architecture in react
- `useState` and `useEffect` hooks

You don't need to be a master of maps as well. Nextbillion has ready to use functions and hooks which can be imported directly from the library. However, there are a few terms from the map ecosystem that we will discuss here so you won't face any issues later:

- **Coordinates**: Simply put, coordinates are the precise values of latitude and longitude of a particular location. Every place on the Earth has a latitude and a longitude that uniquely identifies the geographical position of the place. In our app, we will use decimal degrees to work with coordinates.
- **Marker**: A marker identifies a location on the map. In most scenarios, it will point towards the coordinates of the selected place. With nextbillion, you can [set a custom icon as a marker](https://doc.maps.nextbillion.io/docs/examples/custom-marker), but for the sake of simplicity, we will stick to the default one.

### Let's Build

Enough of the theory, let's start with building the application. I am assuming you already have your react/next app ready in front of you.

### Basic Setup

To use any of the nextbillion products or services, we need its API key. You can [fill out a form](https://doc.maps.nextbillion.io/docs/get-an-api-key) to get yourself a new API key. The form asks you for your bare minimum information, expected API calls per month and the API service you need. No credit card information is required until you are willing to pay for the product.
Once you get the API key, we recommend you to put it in the `.env` file rather than hardcoding it in your code. Also, don't forget to add the `.env` file in the `.gitignore` (or your version control equivalent) file so you won't commit it in the remote repo.

The second thing swe have to do before our main course is to install the NPM package released by Nextbilion. To install it with NPM, just enter the following command:

```bash
npm install nbmap-gl
```

Or if you use Yarn:

```bash
yarn add nbmap-gl
```

Everything related to Nextbillion would be installed in `node_modules` folder. You can find all JavaScript, CSS and Map files in `node_modules/nbmap-gl/dist`.

## Code Architecture

Let's briefly discuss how we are going to build this app. The map would be the most important part of the project, so we will make a separate component that will handle the business and presentational logic of the map. Additionally, we will make a Dropdown component which will handle dropdown and data change.

We need to store coordinates as well as the selected wonder, hence we will create two states in `App.js`. Everything else could be declared as we go.

For now, create two components, `Map.jsx` and `Dropdown.jsx` and initialize them with mock data. In `App.js` create two states `coordinates` and `wonder`. The first one will hold the coordinates of the selected wonder whereas the latter one will hold the name. I am initializing coordinates with geolocation of Taj Mahal but feel free to keep it `null` or your desired destination. Just make sure it's a valid set of geocoordinates so you won't face any errors later.

```jsx
const [coordinates, setCoordinates] = useState({
  lat: 27.1773531,
  lng: 78.0116069
});

const [wonder, setWonder] = useState("taj-mahal");
```

## Creating a Map

Now as we are done with the skeleton, let's focus on the main thing. We have already installed the necessary packages and created a map component. This component will show a map that will be centred on the selected wonder.

First things first: import dependencies and set the API key. In your `Map.jsx`, paste the following code:

```jsx
import nextbillion from "nbmap-gl";
import "nbmap-gl/dist/nextbillion.css";

nextbillion.setApiKey(process.env.REACT_APP_NB_API_KEY);
```

It is a good checkpoint to check whether your API is working and all dependencies and packages are installed properly. If you encounter any issue at this stage, check the status of your API.

The `Map.jsx` will receive `coordinates` and `setCoordinates` as props and return only a single `div` with an id of `map`. Everything else will be taken care of by in built functions provided by the Nextbillion package.

```jsx
function Map({ coordinates, setCoordinates }) {
  return <div id="map"></div>;
}

export default Map;
```

Don't forget to give it a fixed height. Otherwise, it won't be rendered properly.

```css
#map {
  width: 100vw;
  height: 80vh;
}
```

Create two state variables, `map` and `marker` which would store the current state of the map and the position of the marker.

```jsx
const [map, setMap] = useState(null);
const [marker, setMarker] = useState(null);
```

### Initializing the Map

We want the map to be rendered on the screen as soon as the component renders. The `useEffect` hook with an empty dependency array is how we do it.

```jsx
useEffect(() => {
  const nbMap = new nextbillion.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: coordinates
  });

  setMap(nbMap);
}, []);
```

Here, we create a new instance of Map that takes two parameters: the DOM node where you want to render your application (in our case, `#map`) and an object with details about the map. The most widely used options are zoom and center. `zoom` defines how much zoomed we want our map in the beginning whereas `center` is the value of latitude and longitude where the map should focus.

This creates an initial state of the map, which is stored in the state variable.

### Positioning the Marker for the First Time

The marker should be positioned at the center that we defined in the last stage. It should happen when the map is rendered on the screen. Again, we will use `useEffect` but this time keep `map` in the dependency array.

```jsx
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
```

Since the map is initialized as `null`, it will throw an error when the component is rendering. Hence we put the logic in the try-catch block so errors can be handled without causing much harm.

### Readjusting the Map when wonder is selected

When the user selects any wonder, the map, as well as the marker, should readjust and be centred to the geolocation of the wonder. The nextbillion has methods which animate the transition of the map and marker.

We call our friend `useEffect` for help. This should happen when coordinates change but to avoid possible errors, add map and marker to the dependency list.

```jsx
useEffect(() => {
  marker &&
    map &&
    (marker.moveTo(coordinates, 9),
    map.flyTo({ center: coordinates, zoom: 12, speed: 9.0, curve: 0.8 }));
}, [map, marker, coordinates]);
```

This look complicated at first glance. But if you look closer, you'll see that it's just the same procedure we used before with a few extra parameters.

The `marker.moveTo()` method moves the position of the marker to the location mentioned in the first parameter with the speed mentioned in the second parameter. The speed could be any number from 0 to 10(inclusive) where a lower number denotes a slow speed.

The second method, `map.flyTo()` does similar to the map. It flies to the new center with the zoom and speed mentioned.

## The User Input

The map component is completed. You can play around with the `coordinates` state to test if everything is working as it should. The final step is to build up the logic for selecting the wonder from the user.

An easy way to achieve this is to create a dropdown with seven wonders as options and change the coordinates as per selection. Let's start with creating the skeleton of the component.

```jsx
import { useEffect } from "react";

function Dropdown({ wonder, setWonder, setCoordinates }) {
  return <section className="dropdown"> Dropdown </section>;
}

export default Dropdown;
```

The component doesn't need to store any state by itself since everything it needs is sent by the App component as props. Once integrated with the App component, return a dropdown with seven wonders, like this:

```jsx
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
```

The dropdown will change the value of `wonder` whenever a new wonder is selected from the list. The final piece of the puzzle is changing coordinates as the user selects the wonder. We could use a switch statement to toggle between multiple states.

```jsx
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
      setCoordinates({ lat: 28.6139, lng: 77.209 });
  }
}, [wonder]);
```

That's all it! We have created an application to search for the seven wonders of the world!

## Conclusion

## Questions for Arpit

- do we have a free tier for API
- Next Billion or Nextbillion
- what does the `curve` parameter do in `map.flyTo()` method
- what is the range of `speed` in `map.flyTo()` method.
- is that ture: No credit card information is required until you are willing to pay for the product.
