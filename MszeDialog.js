import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function MszaDialog({
  isDialogOpen,
  toggleDialog,
  date,
  hour,
  address,
  searchResults,
  handleDateChange,
  handleHourChange,
  handleAddressChange,
  handleSubmit,
}) {
  return (
    <Dialog open={isDialogOpen} onClose={toggleDialog(false)}>
      <DialogTitle>Wprowadź dane</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="date"
          label="Data"
          type="date"
          fullWidth
          variant="standard"
          value={date}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="hour"
          label="Godzina"
          type="time"
          fullWidth
          variant="standard"
          value={hour}
          onChange={handleHourChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          id="address"
          label="Adres"
          type="text"
          fullWidth
          variant="standard"
          value={address}
          onChange={handleAddressChange}
        />
        {searchResults.length > 0 && (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Kościół</TableCell>
                  <TableCell align="right">Godzina</TableCell>
                  <TableCell align="right">Odległość (m)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((row) => (
                  <TableRow
                    key={row.Kosciol}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Kosciol}
                    </TableCell>
                    <TableCell align="right">{row.godzina}</TableCell>
                    <TableCell align="right">{row.odleglosc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {searchResults.length === 0 && <div>Nie ma więcej mszy w tym dniu</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog(false)}>Anuluj</Button>
        <Button onClick={handleSubmit}>Wyślij</Button>
      </DialogActions>
    </Dialog>
  );
}

export default MszaDialog;
