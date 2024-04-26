import wellknown from "wellknown";

//Funkcja przekształcająca dane z backendu na format geojson

export const convertWKTtoGeoJSON = (item) => {
  const { geometry, ...otherProperties } = item; //Rozdzielam plik na geometry i resztę właściowości
  const geoJsonGeometry = wellknown.parse(item.geometry);
  return {
    type: "Feature",
    geometry: geoJsonGeometry,
    properties: {
      ...otherProperties, //Reszta danych z properties w geojson
    },
  };
};

//Funkcja, która przekształca geometrię z geojsona na format w react-leaflet
//zamiana współrzędnych miejscami

export const prepareGeometryForMap = (geoJsonData) => {
  return geoJsonData
    .map(({ geometry, properties }) => {
      let positions;

      switch (geometry.type) {
        case "Polygon":
          positions = geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
          break;
        case "Point":
          positions = [[geometry.coordinates[1], geometry.coordinates[0]]];
          break;
        default:
          console.warn(`Unsupported geometry type: ${geometry.type}`);
          positions = [];
      }
      return {
        ...properties, //Reszta danych z properties w geojson
        positions,
      };
    })
    .filter((item) => item.positions.length > 0);
};
