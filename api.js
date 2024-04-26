import axios from "axios";

// Funkcja do wysyłania lokalizacji użytkownika
export const sendUserLocation = (latitude, longitude) => {
  return axios.post("/location", { lat: latitude, lon: longitude });
};

// Funkcja do pobierania danych o dekanatach
export const fetchDekanaty = () => {
  return axios.get("/dekanaty");
};

// Funkcja do pobierania danych o kościołach
export const fetchKosciol = () => {
  return axios.get("/koscioly");
};

// Funkcja do pobierania danych o parafiach
export const fetchParafie = () => {
  return axios.get("/parafie");
};
