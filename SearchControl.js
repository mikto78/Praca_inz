import React, { useState } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../Styles/searchControl.css";

const SearchControl = ({ onSearchSelect }) => {
  const map = useMap();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    // Przykładowe zapytanie do OpenStreetMap Nominatim
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const position = [lat, lon];

        map.flyTo(position, 13);
        onSearchSelect(position);
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div className="search-control">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Wyszukaj miejsce..."
      />
      <button onClick={handleSearch}>Szukaj</button>
    </div>
  );
};

export default SearchControl;
