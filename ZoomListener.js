import { useMapEvents } from "react-leaflet";

// Ustawienie widoczności dekanatów
export function DekanatZoomListener({ setShowPolygons }) {
  useMapEvents({
    zoomend: (e) => {
      const zoomLevel = e.target.getZoom();
      setShowPolygons(zoomLevel >= 8 && zoomLevel <= 10); // Poniżej zooma 8 nie widać warswty
    },
  });
  return null;
}

export function ParafiaZoomListener({ setShowParafie }) {
  useMapEvents({
    zoomend: (e) => {
      const zoomLevel = e.target.getZoom();
      setShowParafie(zoomLevel > 10); // Poniżej zooma 8 nie widać warswty
    },
  });
  return null;
}
