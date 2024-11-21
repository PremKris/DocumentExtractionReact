import React, { useState, useEffect, useRef, useContext } from "react";
import {
  getTableData,
  getTableDataForPoLineItem,
  getTableCountForLineItems,
  getPoVendor,
  getTableCountForPoVendors,
  postAttachmentReadiness,
  putAttachmentReadiness,
  deleteAttachmentReadiness,
  patchAttachmentReadiness,
} from "api";
import { DataGrid } from "@material-ui/data-grid";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Rattachments from "components/Rattachments";
import DocExchange from "components/DocExchange";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  Tabs,
  Tab,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Paper, Typography, Box, Button } from "@material-ui/core";
import Submit from "../components/Submit";
import SubmitContext from "context/SubmitContext";

const linecolumns = [
  { field: "itemNo", headerName: "Item Number", width: 250 },
  { field: "itemDesc", headerName: "Item Description", width: 250 },
  {
    field: "itemCondDesc",
    headerName: "Item Description Condition",
    width: 250,
  },
  { field: "plant", headerName: "Plant", width: 250 },
  { field: "unitPrice", headerName: "Unit Price", width: 250 },
  { field: "lineItemQuant", headerName: "Quantity", width: 250 },
  { field: "TotalValue", headerName: "Total Value", width: 250 },
  { field: "CgstPercent", headerName: "Cgst Percentage", width: 250 },
  { field: "sgstPercent", headerName: "Sgst Percentage", width: 250 },
  { field: "orderNumber", headerName: "Order Number", width: 250 },
  { field: "condType", headerName: "Condition Type", width: 250 },
  { field: "amount", headerName: "Amount", width: 250 },
  { field: "conditionValue", headerName: "Condition Value", width: 250 },
];
const poVendorlinecolumns = [
  { field: "vendorNo", headerName: "Vendor No", width: 250 },
  { field: "orderNumber", headerName: "Order No", width: 250 },
  { field: "orderNumber", headerName: "Order No", width: 250 },
  { field: "firstname", headerName: "First Name", width: 250 },
  { field: "lastname", headerName: "Last Name", width: 250 },
  { field: "email", headerName: "Email", width: 250 },
];

export default function ObjectPage() {
  const submitContext = useContext(SubmitContext);
  const { handleSubmitContext } = submitContext;
  const navigate = useNavigate(); // Use useNavigate hook
  const [lineitems, setItems] = useState([]);
  const [poVendorlineitems, poVendorsetItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [poVendorrowCount, poVendorsetRowCount] = useState(0);
  const PAGE_SIZE = 15;
  //ref for each section
  const partnerInfoRef = useRef(null);
  const poLineItemsRef = useRef(null);
  const readinessDocumentRef = useRef(null);
  const completionDocumentRef = useRef(null);
  const docExchangeRef = useRef(null);
  const generalInfoRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approverMail, setApproverMail] = useState("");
  const [approverName, setApproverName] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [genInfo, setGeneralInfo] = useState(null);
  let content = "";
  let id = "";

  // Function to detect scroll and toggle class
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 100) {
      // Adjust scrollTop value to suit your needs
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    const getGeneralInfo = async () => {
      var dataGeneral = await getTableData();
      setGeneralInfo(dataGeneral[0]);
      console.log(dataGeneral);
      console.log("general info", genInfo);
    };
    getGeneralInfo();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadDataForPoVendor = async (isFirstLoad, skip = 0) => {
    try {
      poVendorsetItems([]);
      setLoading(true);

      if (isFirstLoad) {
        const count = await getTableCountForPoVendors();
        poVendorsetRowCount(count);
      }

      const _poVendorlineitems = await getPoVendor({
        $top: PAGE_SIZE,
        $skip: skip,
      });
      const poVendorlineitemsWithIds = _poVendorlineitems.map(
        (poVendorlineitem, index) => {
          poVendorlineitem.id = index;
          return poVendorlineitem;
        }
      );
      poVendorsetItems(poVendorlineitemsWithIds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataForPoVendor(true);
  }, []);

  const loadData = async (isFirstLoad, skip = 0) => {
    try {
      setItems([]);
      setLoading(true);

      if (isFirstLoad) {
        const count = await getTableCountForLineItems();
        setRowCount(count);
      }

      const _lineitems = await getTableDataForPoLineItem({
        $top: PAGE_SIZE,
        $skip: skip,
      });
      const lineitemsWithIds = _lineitems.map((lineitem, index) => {
        lineitem.id = index;
        return lineitem;
      });
      setItems(lineitemsWithIds);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData(true);
  }, []);

  // Add a state to re-render the file input for consecutive uploads
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsModalOpen(true); // Open modal when file is selected
      setEditingFile(null);
      setApproverMail(null);
      setApproverName(null);
    }
  };

  const handleOpenFolder = (file) => {
    // If file.folderUrl exists, open the folder URL in a new tab
    if (file.folderUrl) {
      window.open(file.folderUrl, "_blank");
    } else {
      console.log("Folder URL not available for this file.");
    }
  };


  const updateAttachment = async (dataForReadiness, id) => {
    try {
      // Call putAttachmentReadiness with the ID and data
      const response = await putAttachmentReadiness(dataForReadiness, id);
      console.log("Update successful:", response);
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  // Reset input key after each upload so users can upload multiple files consecutively

  const handleSubmit = async (e) => {
    const data = {
      genInfo,
      selectedFile,
      content,
      postAttachmentReadiness,
      id,
      approverMail,
      approverName,
      uploadedFiles,
      setUploadedFiles,
      setSelectedFile,
      setIsModalOpen,
      setApproverMail,
      setApproverName,
      setFileInputKey,
    };
    await handleSubmitContext(e,data);
    console.log("Passed successfully");
  };

  const handleEditSubmit = (e) => {
    if (editingFile) {
      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === editingFile.id
            ? { ...file, uploadedBy: approverName, status: editingFile.status }
            : file
        )
      );
      setEditingFile(null);
      setApproverMail(approverMail);
      setApproverName(approverName);
      setIsModalOpen(false);
      // patchAttachmentReadiness(dataForReadiness,id);
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file);
    setSelectedFile(file);
    setApproverMail(approverMail || "");
    setApproverName(approverName);
    setIsModalOpen(true);
  };

  const handleDelete = (fileId) => {
    deleteAttachmentReadiness(fileId);
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
  };

  const handleClose = () => {
    setSelectedFile(null);
    setEditingFile(null);
    setIsModalOpen(false);
    setApproverMail("");
    setApproverName("");
  };

  const renderEmptyState = () => (
    <Box textAlign="center" p={5}>
      <Typography variant="h6" color="textSecondary">
        No files found.
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Use the "Upload" button.
      </Typography>
      <input
        key={fileInputKey} // New key changes with each upload
        accept="*"
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<CloudUploadIcon />}
          style={{
            backgroundColor: "#0073e6", // Custom primary color
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "25px",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            marginTop: "20px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#005bb5")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0073e6")}
        >
          Upload
        </Button>
      </label>
    </Box>
  );

  const renderFileList = () => (
    <Paper className="classForAttachmentList" variant="outlined">
      <List>
        {uploadedFiles.map((file) => (
          <React.Fragment key={file.id}>
            <ListItem
              id="testing"
              button
              onClick={() => window.open(file.url, "_blank")}
            >
              <ListItemIcon>
                <InsertDriveFileIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`Uploaded By: ${file.uploadedBy} · Uploaded on: ${file.uploadDate} · Status: ${file.status}`}
              />
              {/* Open Folder Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenFolder(file);
                }}
                color="primary"
              >
                <FolderOpenIcon /> {/* Make sure to import this icon */}
              </IconButton>
              {/* Edit Button */}
              <IconButton onClick={() => handleEdit(file)} color="primary">
                <EditIcon />
              </IconButton>
              {/* Delete Button */}
              <IconButton
                onClick={() => handleDelete(file.id)}
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  // Function to scroll to a section
  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    switch (newValue) {
      case 0:
        scrollToSection(generalInfoRef);
        break;
      case 1:
        scrollToSection(partnerInfoRef);
        break;
      case 2:
        scrollToSection(poLineItemsRef);
        break;
      case 3:
        scrollToSection(readinessDocumentRef);
        break;
      case 4:
        scrollToSection(completionDocumentRef);
        break;
      case 5:
        scrollToSection(docExchangeRef);
      default:
        break;
    }
  };

  const useStyles = makeStyles({
    tabs: {
      backgroundColor: "white",
      color: "#3f51b5", // Tab text color
      borderBottom: "1px solid #e0e0e0",
    },
    tab: {
      fontWeight: "bold",
      color: "#3f51b5", // Active color
      "&.Mui-selected": {
        color: "#3f51b5",
      },
    },
    header: {
      backgroundColor: "#3f51b5",
      color: "white",
      padding: "20px",
      textAlign: "center",
    },
  });
  const classes = useStyles();

  return (
    <>
      {/* <div className={`top-section ${isScrolled ? 'hidden' : ''}`} style={{ padding: '20px 0', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
      </div> */}

      <div
        className="blue-header"
        style={{
          backgroundColor: "#3f51b5",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">Document Exchange</Typography>
      </div>

      {/* Tab menu */}
      <div className="tab-menu">
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className={classes.tabs}
        >
          <Tab label="General Information" className={classes.tab} />
          <Tab label="Partner Information" className={classes.tab} />
          <Tab label="PO Line Items" className={classes.tab} />
          <Tab label="Readiness Document" className={classes.tab} />
          <Tab label="Completion Document" className={classes.tab} />
          <Tab label="Doc Exchange" className={classes.tab} />
        </Tabs>
      </div>

      <div
        id="backButton"
        style={{
          right: "1rem",
          zIndex: 1,
          margin: "1rem",
          top: "8.7rem",
          display: "block",
          position: "fixed",
          padding: "10px",
        }}
      >
        <Button
          className="back-button"
          variant="contained"
          // style={{
          //   backgroundColor: '#4F8ACB',  // Matches the header color
          //   color: 'white',               // White text for contrast
          //   textTransform: 'none',        // To keep the text in normal case
          //   fontWeight: 'bold',           // Bold text to make it more prominent
          //   padding: '8px 16px',          // Padding for a substantial look
          //   borderRadius: '4px',          // Slightly rounded corners
          //   boxShadow: 'none',            // Removes default button shadow for a flat look
          // }}
          onClick={() => navigate(-1)} // Use navigate(-1) to go back
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      </div>

      {/* Main content */}
      <div className="content">
        {/* General Information */}
        {genInfo ? (
          <div id="Gi" ref={generalInfoRef}>
            <Typography id="HgeneralInfo" variant="h6">
              <strong>General Information</strong>
            </Typography>
            <box id="giBox">
              <form>
                <div className="info-box">
                  <div className="info-row">
                    <label>Order Number:</label>
                    <span>
                      {genInfo.orderNumber
                        ? genInfo.orderNumber
                        : "Not Available"}
                    </span>
                  </div>

                  <div className="info-row">
                    <label>Contract No:</label>
                    <span>
                      {genInfo.contractNo
                        ? genInfo.contractNo
                        : "Not Available"}
                    </span>
                  </div>

                  <div className="info-row">
                    <label>Vendor Name:</label>
                    <span>
                      {genInfo.vendorName
                        ? genInfo.vendorName
                        : "Not Available"}
                    </span>
                  </div>

                  <div className="info-row">
                    <label>Vendor Gstin:</label>
                    <span>
                      {genInfo.vendorGstin
                        ? genInfo.vendorGstin
                        : "Not Available"}
                    </span>
                  </div>

                  <div className="info-row">
                    <label>Company Code:</label>
                    <span>
                      {genInfo.CompanyCode
                        ? genInfo.CompanyCode
                        : "Not Available"}
                    </span>
                  </div>
                </div>
              </form>
            </box>
          </div>
        ) : (
          "Data Fetching..."
        )}

        {/* Partner Information Section */}
        <div
          className="partnerInfo"
          ref={partnerInfoRef}
          style={{ paddingTop: "60px" }}
        >
          <Box mb={4} mt={4}>
            <Typography variant="h6">
              <strong>Partner Information</strong>
            </Typography>
            <Box height={400} mt={2}>
              <DataGrid
                rows={poVendorlineitems}
                columns={poVendorlinecolumns}
                loading={loading}
                pageSize={5}
              />
            </Box>
          </Box>
        </div>

        {/* PO Line Items Section */}
        <div
          ref={poLineItemsRef}
          style={{ paddingTop: "60px", overflowX: "auto" }}
        >
          <Box mb={4} mt={4}>
            <Typography variant="h6">
              <strong>PO Line Items</strong>
            </Typography>
            <Box height={400} mt={2}>
              <DataGrid
                rows={lineitems}
                columns={linecolumns}
                loading={loading}
                rowCount={rowCount}
                pageSize={PAGE_SIZE}
                paginationMode="server"
              />
            </Box>
          </Box>
        </div>

        {/* Readiness Document Section */}
        <div ref={readinessDocumentRef} style={{ paddingTop: "60px" }}>
          <Typography variant="h6">
            <strong>Readiness Document</strong>
          </Typography>
          {/* Heading */}
          <Box
            mb={4}
            mt={4}
            style={{
              border: "2px solid #0073e6", // Outline color
              borderRadius: "8px", // Rounded corners
              padding: "20px", // Space inside the outline
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <input
              key={fileInputKey} // New key changes with each upload
              accept="*"
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />

            <div
              style={{
                maxWidth: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <Button
                className="uploadTopRight"
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUploadIcon />}
                onClick={() => document.getElementById("file-upload").click()} // Trigger file input click
                style={{
                  backgroundColor: "#0073e6", // Custom primary color
                  color: "#ffffff",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#005bb5")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#0073e6")}
              >
                Upload
              </Button>
            </div>

            <Dialog open={isModalOpen} onClose={handleClose}>
              <DialogTitle>
                {editingFile
                  ? "Edit File Details" ||
                    setApproverMail("") ||
                    setApproverName("")
                  : "Readiness Document"}
              </DialogTitle>
              <DialogContent>
                <TextField
                  label="Approver docType"
                  value="Readiness Document"
                  fullWidth
                  margin="dense"
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Approver mail"
                  value={approverMail}
                  onChange={(e) => setApproverMail(e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Approver Name"
                  value={approverName}
                  onChange={(e) => setApproverName(e.target.value)}
                  fullWidth
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={editingFile ? handleEditSubmit : handleSubmit}
                  color="primary"
                  variant="contained"
                >
                  {editingFile ? "Save Changes" : "Submit"}
                </Button>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <div id="fileUploadLengthReadiness">
              <Box p={3} maxWidth="600px" mx="auto">
                {/* Conditional Rendering */}
                {uploadedFiles.length === 0
                  ? renderEmptyState()
                  : renderFileList()}
              </Box>
            </div>
          </Box>
        </div>

        {/* Completion Document Section */}
        <div ref={completionDocumentRef} style={{ paddingTop: "60px" }}>
          <Rattachments />
        </div>

        {/* Doc Exchange Section */}
        <div ref={docExchangeRef} style={{ paddingTop: "60px" }}>
          <DocExchange />
        </div>
      </div>
    </>
  );
}
