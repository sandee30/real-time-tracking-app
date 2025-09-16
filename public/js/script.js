const socket = io();

let isMapCentered = false; 


if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      
      socket.emit("sendLocation", { latitude, longitude });

      
      if (!isMapCentered) {
        map.setView([latitude, longitude], 16); 
        isMapCentered = true;
      }
    },
    (error) => {
      console.error("Error obtaining location:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}


const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Sandeep Pandey",
}).addTo(map);


const markers = {};


socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  if (markers[id]) {
    
    markers[id].setLatLng([latitude, longitude]);
  } else {
    
    markers[id] = L.marker([latitude, longitude]).addTo(map);
    markers[id].bindPopup(`User: ${id}`).openPopup();
  }
});


socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
