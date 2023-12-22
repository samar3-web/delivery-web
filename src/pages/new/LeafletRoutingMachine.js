import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

const LeafletRoutingMachine = ({ onMapClick }) => {
  const map = useMap();
  let DefaultIcon = L.icon({
    iconUrl: "/marche.gif",
    iconSize: [90, 90],
  });

  useEffect(() => {
    var marker1 = L.marker([36.8065, 10.1815], { icon: DefaultIcon }).addTo(
      map
    );

    const handleMapClick = (e) => {
      // Invoke the callback function with the selected latitude and longitude
      onMapClick(e.latlng.lat, e.latlng.lng);

      // Add a marker to the clicked location
      L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

      
      console.log(e)
    };

    map.on("click", handleMapClick);

    return () => {
      // Clean up event listener when the component unmounts
      map.off("click", handleMapClick);
    };
  }, [map, onMapClick, DefaultIcon]);

  return null;
};

export default LeafletRoutingMachine;
