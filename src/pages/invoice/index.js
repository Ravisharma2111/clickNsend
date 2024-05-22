import React, { useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Pagination
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import Header from "@/layout/primaryWeb/header";
import Footer from "@/layout/primaryWeb/footer";

const InvoicePage = () => {
  const invoiceData = [
    {
      sn: 1,
      invoiceNo: "INV001", 
      jobId: "JOB001",
      jobTitle: "Software Developer",
      date: "Feb 21, 2024",
      dueDate: "Mar 15, 2024",
      status: "Pending"
    }
  ];

  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Handler for changing the invoice date
  const handleInvoiceDateChange = (event) => {
    setInvoiceDate(event.target.value);
  };

  // Handler for changing the due date
  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  // Handler for changing the number of entries to show
  const handleShowEntriesChange = (event) => {
    setShowEntries(event.target.value);
  };

  // Handler for searching as the user types
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle opening dropdown menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle pagination change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filtered data based on search term and pagination
  const indexOfLastRow = currentPage * showEntries;
  const indexOfFirstRow = indexOfLastRow - showEntries;
  const currentRows = invoiceData
    .filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div style={{ padding: "0 20px" }}>
      <div style={{ marginBottom: "100px" }}>
        <Header />
      </div>
      <Typography variant="h4" gutterBottom>
        Invoices Page
      </Typography>

      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="show-label">Show</InputLabel>
            <Select
              labelId="show-label"
              id="entries-select"
              value={showEntries}
              onChange={handleShowEntriesChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            id="invoice-date"
            label="Invoice Date"
            type="date"
            fullWidth
            value={invoiceDate}
            onChange={handleInvoiceDateChange}
            InputLabelProps={{ shrink: true }}
            style={{ paddingRight: "10px" }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            id="due-date"
            label="Due Date"
            type="date"
            fullWidth
            value={dueDate}
            onChange={handleDueDateChange}
            InputLabelProps={{ shrink: true }}
            style={{ paddingRight: "10px" }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              style={{ paddingRight: "10px" }}
            />
          </div>
        </Grid>
      </Grid>

      <TableContainer component={Paper} style={{ padding: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SN</TableCell>
              <TableCell>Invoice No</TableCell>
              <TableCell>Job ID</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Invoice Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.sn}</TableCell>
                <TableCell>{row.invoiceNo}</TableCell>
                <TableCell>{row.jobId}</TableCell>
                <TableCell>{row.jobTitle}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>Pay Now</MenuItem>
                    <MenuItem onClick={handleClose}>Reminder</MenuItem>
                    <MenuItem onClick={handleClose}>Raise Ticket</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body2" gutterBottom>
        Showing {indexOfFirstRow + 1}-{indexOfLastRow} of {invoiceData.length} entries
      </Typography>
      <div style={{ marginTop: "150px" }}>
        <Footer />
      </div>

      {/* Pagination */}
      <Box display="flex" justifyContent="flex-start" mt={2}>
        <Pagination
          count={Math.ceil(invoiceData.length / showEntries)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </Box>
    </div>
  );
};

export default InvoicePage;
