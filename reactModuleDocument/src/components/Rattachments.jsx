import React, { useState, useEffect, useRef } from 'react';
import EditIcon from '@material-ui/icons/Edit';
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
    Tab
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { Paper, Typography, Box, Button } from "@material-ui/core";

function Rattachments() {
    const [fileInputKey, setFileInputKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approverMail, setApproverMail] = useState('');
    const [approverName, setApproverName] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [editingFile, setEditingFile] = useState(null); // or set to true/false depending on your logic
    const [selectedFile, setSelectedFile] = useState(null);


    //For Completion Document
    const handleFileUploadCompletion = (event) => {
        console.log('rattachment');
        const fileCompletion = event.target.files[0];
        if (fileCompletion) {
            setSelectedFile(fileCompletion);
            setIsModalOpen(true); // Open modal when file is selected
            setEditingFile(null);
            setApproverMail(null);
            setApproverName(null);
        }
    };

    const handleOpenFolderCompletion = (fileCompletion) => {
        // If file.folderUrl exists, open the folder URL in a new tab
        if (fileCompletion.folderUrl) {
          window.open(fileCompletion.folderUrl, '_blank');
        } else {
          console.log("Folder URL not available for this file.");
        }
      };
      

    const renderEmptyStates = () => (
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
                style={{ display: 'none' }}
                id="file-uploadCompletion"
                type="file"
                onChange={handleFileUploadCompletion}
            />
            <label htmlFor="file-uploadCompletion">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    style={{
                        backgroundColor: '#0073e6', // Custom primary color
                        color: '#ffffff',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        marginTop: '20px',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#005bb5')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#0073e6')}
                >
                    Upload
                </Button>
            </label>
        </Box>
    );

    const renderFileList1 = () => (
        <Paper id='classForAttachmentList' variant="outlined">
            <List>
                {uploadedFiles.map((fileCompletion) => (
                    <React.Fragment key={fileCompletion.id}>
                        <ListItem>
                            <ListItemIcon>
                                <InsertDriveFileIcon fontSize="large" />
                            </ListItemIcon>
                            <ListItemText
                                primary={fileCompletion.name}
                                secondary={`Uploaded By: ${fileCompletion.uploadedBy} · Uploaded on: ${fileCompletion.uploadDate} · Status: ${fileCompletion.status}`}
                            />
                            {/* Open Folder Button */}
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenFolderCompletion(
                                    );
                                }}
                                color="default"
                            >
                                <FolderOpenIcon /> {/* Make sure to import this icon */}
                            </IconButton>
                            {/* Edit Button */}
                            <IconButton onClick={() => handleEdit(fileCompletion)} color="primary">
                                <EditIcon />
                            </IconButton>
                            {/* Delete Button */}
                            <IconButton onClick={() => handleDelete(fileCompletion.id)} color="secondary">
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );

    const handleSubmit = (e) => {
        console.log({ "email": approverMail, "name": approverName });
        if (selectedFile) {
            const newFile = {
                id: uploadedFiles.length + 1,
                name: selectedFile.name,
                uploadedBy: approverName || 'privileged',
                uploadDate: new Date().toLocaleString(),
                status: 'PENDING',
            };
            setUploadedFiles([...uploadedFiles, newFile]);
            setSelectedFile(null);
            setIsModalOpen(false); // Close modal on submit
            setApproverMail(approverMail);
            setApproverName(approverName);
            setFileInputKey(Date.now()); // Reset the file input key
        }
    };

    const handleEdit = (fileCompletion) => {
        setEditingFile(fileCompletion);
        setSelectedFile(fileCompletion);
        setApproverMail(approverMail || '');
        setApproverName(approverName);
        setIsModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        if (editingFile) {
            setUploadedFiles((prevFiles) =>
                prevFiles.map((fileCompletion) =>
                    fileCompletion.id === editingFile.id
                        ? { ...fileCompletion, uploadedBy: approverName, status: editingFile.status }
                        : fileCompletion
                )
            );
            setEditingFile(null);
            setApproverMail(approverMail);
            setApproverName(approverName);
            setIsModalOpen(false);
        }
    };

    const handleDelete = (fileId) => {
        setUploadedFiles(uploadedFiles.filter((fileCompletion) => fileCompletion.id !== fileId));
    };


    const handleClose = () => {
        setSelectedFile(null);
        setEditingFile(null);
        setIsModalOpen(false);
        setApproverMail('');
        setApproverName('');
    };

    return (
        <>
            <Typography variant="h6"><strong>Completion Document</strong></Typography>
            {/* Heading */}
            <Box mb={4} mt={4} style={{
                border: '2px solid #0073e6', // Outline color
                borderRadius: '8px',          // Rounded corners
                padding: '20px',              // Space inside the outline
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <input
                    key={fileInputKey} // New key changes with each upload
                    accept="*"
                    style={{ display: 'none' }}
                    id="file-uploadCompletion"
                    type="file"
                    onChange={handleFileUploadCompletion}
                />
                <div style={{ maxWidth: "100%", display: "flex", alignItems: "center", justifyContent: "end" }}>
                    <Button
                        className='uploadTopRight'
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => document.getElementById('file-uploadCompletion').click()} // Trigger file input click
                        style={{
                            backgroundColor: "#0073e6",
                            color: "#ffffff",
                            padding: "10px 20px",
                            borderRadius: "25px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#005bb5')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#0073e6')}
                    >
                        Upload
                    </Button>

                </div>
                <Dialog open={isModalOpen} onClose={handleClose}>
                    <DialogTitle>{editingFile ? "Edit File Details" : "Completion Document"}</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                            {/* File Name and ID */}
                            <Typography className='fileNameCompletion' variant="h6"><strong>{selectedFile ? selectedFile.name : "No file selected"}</strong></Typography>
                            <Typography className='idOfsupplierCompletion' variant="body2" color="textSecondary">
                                ID OF SUPPLIER
                            </Typography>

                            {/* File Metadata (Created Date, Created By) */}
                            <Box display="flex" className='completionIcon' alignItems="left" alignContent="left" mt={1} mb={2}>
                                <InsertDriveFileIcon fontSize="large" />
                                <Box ml={2} alignItems="left">
                                    <Typography variant="body2" color="textSecondary">
                                        Created Date:
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Created By:
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Suppliers Section */}
                            <Box
                                border={1}
                                borderColor="#0073e6"
                                borderRadius={4}
                                p={2}
                                width="100%"
                                maxWidth="400px"
                            >
                                <Typography variant="h6" color="primary">
                                    Suppliers
                                </Typography>
                                <Box mt={2}>
                                    {/* Document Type */}
                                    <TextField
                                        label="Approdoc Type"
                                        value="Completion Document"
                                        fullWidth
                                        margin="dense"
                                        InputProps={{ readOnly: true }}
                                    />
                                    {/* Approver Email */}
                                    <TextField
                                        label="Approver Email"
                                        value={approverMail}
                                        onChange={(e) => setApproverMail(e.target.value)}
                                        fullWidth
                                        margin="dense"
                                    />
                                    {/* Approver Name */}
                                    <TextField
                                        label="Approver Name"
                                        value={approverName}
                                        onChange={(e) => setApproverName(e.target.value)}
                                        fullWidth
                                        margin="dense"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={editingFile ? handleEditSubmit : handleSubmit}
                            color="primary"
                            variant="contained"
                        >
                            {editingFile ? "Save Changes" : "Submit"}
                        </Button>
                        <Button onClick={handleClose} color="secondary" variant="contained">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Box p={3} maxWidth="600px" mx="auto">
                    {/* Conditional Rendering */}
                    {uploadedFiles.length === 0 ? renderEmptyStates() : renderFileList1()}
                </Box>
            </Box >
        </>
    )
}

export default Rattachments