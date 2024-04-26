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

function ParafiaDialog({
  isDialogOpen,
  toggleDialog,
  address,
  searchResults,
  handleAddressChange,
  handleSubmit,
}) {
  return (
    <Dialog open={isDialogOpen} onClose={toggleDialog(false)}>
      <DialogTitle>Znajdź swoją parafię:</DialogTitle>
      <DialogContent>
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
                  <TableCell>Parafia</TableCell>
                  <TableCell align="right">Dekanat</TableCell>
                  <TableCell align="right">Parafianie</TableCell>
                  <TableCell align="right">Proboszcz</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((row) => (
                  <TableRow key={row.Parafia}>
                    <TableCell component="th" scope="row">
                      {row.Parafia}
                    </TableCell>
                    <TableCell align="right">{row.Dekanat}</TableCell>
                    <TableCell align="right">{row.Parafianie}</TableCell>
                    <TableCell align="right">{row.Proboszcz}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {searchResults.length === 0 && (
          <div>Adres leży poza Archidiecezją Białostocką!</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog(false)}>Anuluj</Button>
        <Button onClick={handleSubmit}>Wyślij</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ParafiaDialog;
