import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MszaDialog from "./MszeDialog";
import ParafiaDialog from "./ParafiaDialog";

const Sidebar = ({ isOpen, toggleDrawer, onSearch }) => {
  const [isMszaDialogOpen, setMszaDialogOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Domyślna data: dzisiejsza
  const [hour, setHour] = useState(
    new Date().toTimeString().split(" ")[0].substring(0, 5)
  ); // Domyślna godzina: aktualna
  const [address, setAddress] = useState(""); // Nowy stan dla adresu
  const [searchResults, setSearchResults] = useState([]);

  const [isParafiaDialogOpen, setParafiaDialogOpen] = useState(false);
  const [address2, setAddress2] = useState(""); // Nowy stan dla adresu
  const [searchResults2, setSearchResults2] = useState([]);

  // Otwieranie i zamykanie dialogu
  const toggleMszaDialog = (open) => () => {
    setMszaDialogOpen(open);
    if (!open) {
      // Resetuj dane formularza do wartości początkowych
      setDate(new Date().toISOString().split("T")[0]);
      setHour(new Date().toTimeString().split(" ")[0].substring(0, 5));
      setAddress("");
      // Opcjonalnie, wyczyść wyniki wyszukiwania
      setSearchResults([]);
    }
  };

  const toggleParafiaDialog = (open) => () => {
    setParafiaDialogOpen(open);
    if (!open) {
      // Resetuj dane formularza do wartości początkowych
      setAddress2("");
      // Opcjonalnie, wyczyść wyniki wyszukiwania
      setSearchResults2([]);
    }
  };

  // Aktualizacja daty
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  // Aktualizacja godziny
  const handleHourChange = (event) => {
    setHour(event.target.value);
  };

  // Aktualizacja adresu
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleAddressChange2 = (event) => {
    setAddress2(event.target.value);
  };

  // Przesyłanie godziny i adresu do backendu
  const handleSubmit = async () => {
    const url = "http://localhost:5000/send-data";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: date, hour: hour, address: address }), // Przesłanie godziny i adresu
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Odpowiedź z serwera:", jsonResponse);
        setSearchResults(jsonResponse);
      } else {
        console.error("Nie udało się przesłać danych");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  const handleSubmit2 = async () => {
    const url = "http://localhost:5000/send-data2";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address2 }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Odpowiedź z serwera:", jsonResponse);
        setSearchResults2(jsonResponse);
      } else {
        console.error("Nie udało się przesłać danych");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={toggleDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 250,
          backgroundColor: "#3f51b5",
          color: "#fff",
        },
      }}
    >
      <div
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <ListItem
            button
            onClick={(event) => {
              event.stopPropagation();
              toggleMszaDialog(true)();
            }}
          >
            <ListItemText primary="Msze" />
          </ListItem>
          <ListItem
            button
            onClick={(event) => {
              event.stopPropagation();
              toggleParafiaDialog(true)();
            }}
          >
            <ListItemText primary="Parafia" />
          </ListItem>
        </List>
      </div>
      <MszaDialog
        isDialogOpen={isMszaDialogOpen}
        toggleDialog={toggleMszaDialog}
        date={date}
        hour={hour}
        address={address}
        searchResults={searchResults}
        handleDateChange={handleDateChange}
        handleHourChange={handleHourChange}
        handleAddressChange={handleAddressChange}
        handleSubmit={handleSubmit}
      />

      <ParafiaDialog
        isDialogOpen={isParafiaDialogOpen}
        toggleDialog={toggleParafiaDialog}
        address={address2}
        searchResults={searchResults2}
        handleAddressChange={handleAddressChange2}
        handleSubmit={handleSubmit2}
      />
    </Drawer>
  );
};

export default Sidebar;
