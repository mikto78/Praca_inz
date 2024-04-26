import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  Polygon,
  LayerGroup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { fetchDekanaty, fetchKosciol, fetchParafie } from "../Services/api";
import { convertWKTtoGeoJSON, prepareGeometryForMap } from "../Utils/utils";
import SearchControl from "./SearchControl";
import { DekanatZoomListener, ParafiaZoomListener } from "./ZoomListener";
import { MarkerClusterGroupComponent } from "./MarkerClusterGroup";

const { BaseLayer, Overlay } = LayersControl;

//Dodanie ikonki kościoła
const customIcon = new L.Icon({
  iconUrl: "/church.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const locationIcon = new L.Icon({
  iconUrl: "/geolocation.png",
  iconSize: [25, 41],
  popupAnchor: [1, -34],
});

// Stworzenie przycisku, który będzie na mapie i będzie obsługiwał sidebar

const CustomControl = ({ toggleDrawer }) => {
  const map = useMap();

  useEffect(() => {
    const customControlButton = L.Control.extend({
      onAdd: function () {
        const button = L.DomUtil.create("button", "leaflet-bar");
        button.innerText = "Otwórz panel";
        button.style.backgroundColor = "#3f51b5";
        button.style.color = "white";
        button.style.padding = "5px 10px";
        button.onclick = function () {
          toggleDrawer(true)();
        };
        return button;
      },
    });

    const instance = new customControlButton({ position: "topleft" });
    instance.addTo(map);

    return () => {
      instance.remove();
    };
  }, [map, toggleDrawer]);

  return null;
};

const MapComponent = ({ toggleDrawer }) => {
  const [location, setLocation] = useState(null); //Dane o lokalizacji użytkownika
  const [polygons, setPolygons] = useState([]); //Dane o dekanatach
  const [parafiePolygons, setParafiePolygons] = useState([]); //Dane o parafiach
  const [points, setPoints] = useState([]); //Dane o kościołach
  const [showPolygons, setShowPolygons] = useState(); //Usatwianie widoczności dekanatów
  const [showParafie, setShowParafie] = useState(); //Ustawianie widoczności

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    fetchKosciol()
      .then((response) => {
        const geoJsonData = response.data.map((item) =>
          convertWKTtoGeoJSON(item)
        );
        console.log("Geojson:", geoJsonData);

        const pointsData = prepareGeometryForMap(geoJsonData);
        console.log("Koscioly Data:", pointsData);

        setPoints(pointsData);
      })
      .catch((error) => console.error("Error fetching koscioly", error));
  }, []);

  useEffect(() => {
    fetchDekanaty()
      .then((response) => {
        const geoJsonData = response.data.map((item) =>
          convertWKTtoGeoJSON(item)
        );
        console.log("Geojson Dekanaty:", geoJsonData);

        const polygonsData = prepareGeometryForMap(geoJsonData);
        console.log("Dekanaty Data:", polygonsData);

        setPolygons(polygonsData);
      })
      .catch((error) => console.error("Error fetching dekanaty", error));
  }, []);

  useEffect(() => {
    fetchParafie()
      .then((response) => {
        const geoJsonData = response.data.map((item) =>
          convertWKTtoGeoJSON(item)
        );
        console.log("Geojson Parafie:", geoJsonData);

        const parafieData = prepareGeometryForMap(geoJsonData);
        console.log("Parafie Data:", parafieData);

        setParafiePolygons(parafieData);
      })
      .catch((error) => console.error("Error fetching parafie", error));
  }, []);

  return (
    <>
      <MapContainer
        center={location || [53.157657, 23.160099]}
        zoom={11}
        style={{ height: "100vh", width: "100vw" }}
        zoomControl={false}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
          <BaseLayer name="OpenTopoMap">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </BaseLayer>
          <DekanatZoomListener setShowPolygons={setShowPolygons} />
          {showPolygons && (
            <Overlay name="Dekanaty" checked>
              <LayerGroup>
                {polygons.map((polygon, index) => (
                  <Polygon key={index} positions={polygon.positions}>
                    <Tooltip>Dekanat: {polygon.Dekanat}</Tooltip>
                  </Polygon>
                ))}
              </LayerGroup>
            </Overlay>
          )}
          <ParafiaZoomListener setShowParafie={setShowParafie} />
          {showParafie && (
            <Overlay name="Parafie" checked>
              <LayerGroup>
                {parafiePolygons.map((polygon, index) => (
                  <Polygon key={index} positions={polygon.positions}>
                    <Tooltip>Parafia: {polygon.Name}</Tooltip>{" "}
                  </Polygon>
                ))}
              </LayerGroup>
            </Overlay>
          )}
          <Overlay name="Kościoły" checked>
            <MarkerClusterGroupComponent
              customIcon={customIcon}
              points={points}
            />
          </Overlay>
        </LayersControl>
        {location && (
          <Marker position={location} icon={locationIcon}>
            <Popup>Twoja lokalizacja!</Popup>
          </Marker>
        )}
        <SearchControl onSearchSelect={(position) => {}} />
        <CustomControl toggleDrawer={toggleDrawer} />
      </MapContainer>
    </>
  );
};

export default MapComponent;
