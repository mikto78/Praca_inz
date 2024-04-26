import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { useMap } from "react-leaflet";

//Komponent odpowiedzialny za łączenie punktów w MarkerClusterGroup, gdyż bliblioteka react-leaflet-markercluster nie jest obsługiwana przez
//react-leaflet w wersji powyżej 4.0
//Dodatkowo przekazywana jest tutaj ikona kościoła

export const MarkerClusterGroupComponent = ({ points, customIcon }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const markerClusterGroup = L.markerClusterGroup();

    points.forEach((point) => {
      const { Miejscowosc, Parafia, Kosciol, positions } = point;
      const marker = L.marker(new L.LatLng(positions[0][0], positions[0][1]), {
        icon: customIcon,
      });
      //Dodanie popup w formie html
      const popupContent = `<div>Miejscowość: ${Miejscowosc}<br/>Parafia: ${Parafia}<br/>${Kosciol}</div>`;

      marker.bindPopup(popupContent);
      markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);

    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [points, map, customIcon]);

  return null;
};
