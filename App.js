import React, { useState } from "react";
import axios from "axios";
import MapComponent from "./Components/MapComponent";
import Sidebar from "./Components/Sidebar";

//Ustawienie adresu do backendu
axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Stan dla zapytania wyszukiwania

  // Funkcja, która zmienia stan Drawera na otwarty/zamknięty
  // () => {...} dzięki temu może być potem wywoływana jako callback
  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  // Funkcja do obsługi wyszukiwania
  const handleSearch = (query) => {
    setSearchQuery(query); // Aktualizuj stan zapytania wyszukiwania
  };

  return (
    <div className="App">
      <Sidebar
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
        onSearch={handleSearch}
      />
      <MapComponent toggleDrawer={toggleDrawer} searchQuery={searchQuery} />{" "}
    </div>
  );
}

export default App;
