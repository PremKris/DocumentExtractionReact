import React, { useState } from 'react';
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
    Select,
    MenuItem,
    Checkbox,
    Typography,
    Box,
    Button,
    Paper,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

function DocExchange() {
    const [fileInputKey, setFileInputKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approverMail, setApproverMail] = useState('');
    const [approverName, setApproverName] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [editingFile, setEditingFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [comments, setComments] = useState('');


    const handleFileUploadDoc = (event) => {
        const fileDoc = event.target.files[0];
        if (fileDoc) {
            setSelectedFile(fileDoc);
            setIsModalOpen(true);
            setEditingFile(null);
            setApproverMail('');
            setApproverName('');
        }
    };

    const handleOpenFolderDoc = (fileDoc) => {
        // If file.folderUrl exists, open the folder URL in a new tab
        if (fileDoc.folderUrl) {
          window.open(fileDoc.folderUrl, '_blank');
        } else {
          console.log("Folder URL not available for this file.");
        }
      };
      

    const renderFileList1 = () => (
        <Paper id='classForAttachmentList' variant="outlined">
            <List>
                {uploadedFiles.map((fileDoc) => (
                    <React.Fragment key={fileDoc.id}>
                        <ListItem>
                            <ListItemIcon>
                                <InsertDriveFileIcon fontSize="large" />
                            </ListItemIcon>
                            <ListItemText
                                primary={fileDoc.name}
                                secondary={`Uploaded By: ${fileDoc.uploadedBy} · Uploaded on: ${fileDoc.uploadDate} · Status: ${fileDoc.status}`}
                            />
                            {/* Open Folder Button */}
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenFolderDoc(fileDoc);
                                }}
                                color="default"
                            >
                                <FolderOpenIcon /> {/* Make sure to import this icon */}
                            </IconButton>
                            {/* Edit Button */}
                            <IconButton onClick={() => handleEdit(fileDoc)} color="primary">
                                <EditIcon />
                            </IconButton>
                            {/* Delete Button */}
                            <IconButton onClick={() => handleDelete(fileDoc.id)} color="secondary">
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );

    const handleSupplierChange = (event) => {
        setSelectedSuppliers(event.target.value);
    };

    const handleSubmit = () => {
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
            setIsModalOpen(false);
            setFileInputKey(Date.now());
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setEditingFile(null);
        setIsModalOpen(false);
        setApproverMail('');
        setApproverName('');
    };

    const handleEdit = (fileDoc) => {
        setEditingFile(fileDoc);
        setSelectedFile(fileDoc);
        setApproverMail(approverMail || '');
        setApproverName(approverName);
        setIsModalOpen(true);
    };


    const handleEditSubmit = (e) => {
        if (editingFile) {
            setUploadedFiles((prevFiles) =>
                prevFiles.map((fileDoc) =>
                    fileDoc.id === editingFile.id
                        ? { ...fileDoc, uploadedBy: approverName, status: editingFile.status }
                        : fileDoc
                )
            );
            setEditingFile(null);
            setApproverMail(approverMail);
            setApproverName(approverName);
            setIsModalOpen(false);
        }
    };

    const handleDelete = (fileId) => {
        setUploadedFiles(uploadedFiles.filter((fileDoc) => fileDoc.id !== fileId));
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
                key={fileInputKey}
                accept="*"
                style={{ display: 'none' }}
                id="file-uploadDoc"
                type="file"
                onChange={handleFileUploadDoc}
            />
            <label htmlFor="file-uploadDoc">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    style={{
                        backgroundColor: '#0073e6',
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

    return (
        <>
            <Typography variant="h6"><strong>Document Exchange</strong></Typography>
            <Box mb={4} mt={4} style={{
                border: '2px solid #0073e6',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <input
                    key={fileInputKey}
                    accept="*"
                    style={{ display: 'none' }}
                    id="file-uploadDoc"
                    type="file"
                    onChange={handleFileUploadDoc}
                />
                <div style={{ maxWidth: "100%", display: "flex", alignItems: "center", justifyContent: "end" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => document.getElementById('file-uploadDoc').click()}
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
                <Dialog open={isModalOpen} onClose={handleClose} fullWidth={true} maxWidth='sm'>
                    <DialogTitle>{editingFile ? "Edit File Details" : "Document Exchange"}</DialogTitle>
                    <DialogContent id='contehhhhhh'>
                        <Typography variant="subtitle1" gutterBottom>Suppliers</Typography>
                        <Select
                            multiple
                            value={selectedSuppliers}
                            onChange={handleSupplierChange}
                            variant="outlined"
                            renderValue={(selected) => selected.join(', ')}
                            fullWidth
                        >
                            <MenuItem value="COALSALE COMPANY LTD">
                                <Checkbox checked={selectedSuppliers.includes("COALSALE COMPANY LTD")} />
                                COALSALE COMPANY LTD
                            </MenuItem>
                            <MenuItem value="FA & CAO South Central Railway">
                                <Checkbox checked={selectedSuppliers.includes("FA & CAO South Central Railway")} />
                                FA & CAO South Central Railway
                            </MenuItem>
                            <MenuItem value="THE SINGARENI COLLIERIES COMPANY">
                                <Checkbox checked={selectedSuppliers.includes("THE SINGARENI COLLIERIES COMPANY")} />
                                THE SINGARENI COLLIERIES COMPANY
                            </MenuItem>
                        </Select>

                        <Typography variant="subtitle1" gutterBottom>Add Comments</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Enter Comments..."
                            variant="outlined"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
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
                        <Button onClick={handleClose} color="secondary" variant="contained">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Box p={3} maxWidth="600px" mx="auto">
                    {uploadedFiles.length === 0 ? renderEmptyStates() : renderFileList1()}
                </Box>
            </Box>
        </>
    );
}

export default DocExchange;
