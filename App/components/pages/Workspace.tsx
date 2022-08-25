import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { AppContext } from "../../AppContext";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Grid } from '@mui/material';
import { Avatar, Box, ListItemAvatar } from '@mui/material';
import { Assessment, Psychology, Schema, WorkspacePremiumTwoTone } from '@mui/icons-material';

const Workspace = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    const { appContextData, setCurrentWorkspaceId } = useContext(AppContext);

    useEffect(() => {
        if (id !== appContextData.currentWorkspaceId) {
            setCurrentWorkspaceId(id);
        }
    });

    return (
        <Container maxWidth={false}>
            <h2>Workspace Details</h2>
            <Container maxWidth="xl">
                <TableContainer component={Paper} sx={{ border: 1, backgroundColor: "#EEEEEE", }} >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small" >
                        <TableBody>
                            <TableRow key={"name"} >
                                <TableCell scope="row" sx={{ width: "160px" }} >
                                    Name:
                                </TableCell>
                                <TableCell><strong>{appContextData.currentWorkspaceName}</strong></TableCell>
                            </TableRow>
                            <TableRow key={"id"} >
                                <TableCell scope="row">
                                    Workspace ID:
                                </TableCell>
                                <TableCell><strong>{appContextData.currentWorkspaceId}</strong></TableCell>
                            </TableRow>
                            <TableRow key={"readonly"} >
                                <TableCell scope="row">
                                    Is Read-only:
                                </TableCell>
                                <TableCell><strong>{String(appContextData.currentWorkspaceIsReadOnly)}</strong></TableCell>
                            </TableRow>
                            <TableRow key={"premium"} >
                                <TableCell scope="row">
                                    Is Premium:
                                </TableCell>
                                <TableCell><strong>{String(appContextData.currentWorkspaceIsPremium)}</strong></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Divider sx={{ my: 3 }} />
            <Container maxWidth="xl" sx={{}} >
                <Grid container >
                    <Grid item xs={6} sx={{ padding: "4px" }} >
                        <Box sx={{ fontSize: "1.25rem", color: "white", backgroundColor: "black", padding: "4px", paddingLeft: "12px" }} >
                            Reports
                        </Box>
                        <List sx={{ border: "1px solid #888888" }}>
                            {appContextData.reports &&
                                appContextData.reports.map((report) => (
                                    <ListItem key={report.id} divider dense >
                                        <ListItemButton onClick={() => { navigate("/reports/" + id + "@" + report.id); }}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <Assessment />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={report.name} secondary={report.id} />
                                        </ListItemButton>
                                    </ListItem>

                                ))}
                        </List>
                    </Grid>
                    <Grid item xs={6} sx={{ padding: "4px" }}>
                        <Box sx={{ fontSize: "1.25rem", color: "white", backgroundColor: "black", padding: "4px", paddingLeft: "12px" }} >
                            Datasets
                        </Box>
                        <List sx={{ border: "1px solid #888888" }}>
                            {appContextData.datasets &&
                                appContextData.datasets.map((dataset) => (
                                    <ListItem key={dataset.id} divider dense >
                                        <ListItemButton onClick={() => { console.log("Dataset selected", dataset) }}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <Schema />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={dataset.name} secondary={dataset.id} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </List>
                    </Grid>
                </Grid>
            </Container>
        </Container>)
};

export default Workspace;