async function fetchData() {
  try {
    let inputValue = document.querySelector("input");
    let data;
    let dataFile;

    if (inputValue.value === "") {
      data = await fetch(`https://ipinfo.io/json?token=eabeacdaeeff6a`);
      dataFile = await data.json();

      document.querySelector(".address").textContent = dataFile.ip;
      document.querySelector(
        ".location"
      ).textContent = `${dataFile.country}, ${dataFile.region}`;
      document.querySelector(".timezone").textContent = dataFile.timezone;
      document.querySelector(".isp").textContent = dataFile.org;

      // the current lat, lng
      const successCallback = (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        // intialize the map on "the" div with given center and zoom
        var map = L.map("map", {
          center: [lat, lng],
          zoom: 13,
        });

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        var marker = L.marker([lat, lng]).addTo(map);
        document.querySelector(".leaflet-marker-icon").src =
          "./images/icon-location.svg";

        var circle = L.circle([lat, lng], {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: 500,
        }).addTo(map);
      };

      const errorCallback = (error) => {
        console.log(Error(error));
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }

    document.querySelector("button").onclick = async function () {
      document.querySelector(".the-map").remove();

      let regexIP = /\d{1,}.\d{1,}.\d{1,}.\d{1,}/gi;
      if (regexIP.test(inputValue.value) === true) {
        // fetch the map by the user input
        data = await fetch(
          `https://ipinfo.io/${inputValue.value}?token=eabeacdaeeff6a`
        );

        dataFile = await data.json();

        createMap(dataFile);

        inputValue.classList.remove("activeErorr");
      } else {
        inputValue.classList.add("activeErorr");
        inputValue.value = "";
        inputValue.placeholder = "Please enter a valid IP address";

        createMap(dataFile);
      }
    };
  } catch {
    console.log(Error("Data not found"));
  }
}

fetchData();

function createMap(dataFile) {
  // create the box of map
  let theMap = document.createElement("div");
  theMap.className = "the-map";
  theMap.id = "map";
  document.querySelector("main").appendChild(theMap);

  document.querySelector(".address").textContent = dataFile.ip;
  document.querySelector(
    ".location"
  ).textContent = `${dataFile.country}, ${dataFile.region}`;
  document.querySelector(".timezone").textContent = dataFile.timezone;
  document.querySelector(".isp").textContent = dataFile.org;

  let loc = dataFile.loc.split(",");
  let lat = +loc[0];
  let lng = +loc[1];

  // intialize the map on "the map" div with given center and zoom
  var map = L.map("map", {
    center: [lat, lng],
    zoom: 13,
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var marker = L.marker([lat, lng]).addTo(map);
  document.querySelector(".leaflet-marker-icon").src =
    "./images/icon-location.svg";

  var circle = L.circle([lat, lng], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 500,
  }).addTo(map);

  var popup = L.popup();
  function onMapClick(e) {
    popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
  }
  map.on("click", onMapClick);
}
