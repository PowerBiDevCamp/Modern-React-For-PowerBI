import { useState, useContext } from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from "../AppContext";

import { Box, Drawer, Toolbar, Typography } from '@mui/material';
import { List, ListItem, ListItemAvatar } from '@mui/material';
import { Divider, IconButton, Stack, Select, MenuItem, InputLabel, FormControl, SxProps, SelectChangeEvent } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchemaIcon from '@mui/icons-material/Schema';

import { MyWorkspace } from '../services/PowerBiService'
import { PowerBiWorkspace, PowerBiReport, PowerBiDataset } from '../models/PowerBiModels';

import DataLoading from './DataLoading';

const LeftNav = () => {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const { appContextData, setCurrentWorkspaceId } = useContext(AppContext);
    const expandedLeftNavWidth = 320;
    const colapsedLeftNavWidth = 48;
    const [leftNavWidth, setLeftNavWidth] = useState(expandedLeftNavWidth);
    const [leftNavExpanded, setLeftNavExpanded] = useState(true);

    const listItemWithListProps: SxProps = {
        justifyContent: leftNavExpanded ? 'flex-start' : 'center', pl: 0, py: 0, pr: leftNavExpanded ? 1 : 0
    };

    const leftNavTopBoxProps: SxProps = { width: 1, color: "white", backgroundColor: "black", mt: "48px" };

    const leftNavOuterBoxProps: SxProps = { width: 1, display: "flex", borderBottom: "1px solid #888888" };

    const leftNavInnerBoxLeftProps: SxProps = { width: "48px", textAlign: "center", pt: "4px" };

    const avatarProps: SxProps = { width: "28px", height: "28px" };

    const leftNavInnerBoxRightProps: SxProps = { py: 0, width: leftNavExpanded ? 1 : 0, backgroundColor: "white" };

    const leftNavHeaderProps: SxProps = {
        fontSize: "16px", width: 1, color: "white", backgroundColor: "black", pl: 2, mb: 0, mt: 0, py: "2px", borderLeft: "1px solid #888888"
    };

    const leftNavListProps: SxProps = {
        mt: 0, pt: 0, borderLeft: 1, fontSize: "14px", width: 1, my: 0, py: 0, color: "black"
    };

    const toggleLeftNavWidth = () => {
        if (leftNavExpanded) {
            setLeftNavExpanded(false);
            setLeftNavWidth(colapsedLeftNavWidth);
        }
        else {
            setLeftNavExpanded(true);
            setLeftNavWidth(expandedLeftNavWidth);
        }
    };

    const onUpdateCurrentWorkspace = (event: SelectChangeEvent<string>) => {
        const workspaceId = event.target.value;
        setCurrentWorkspaceId(workspaceId);
        navigate("workspaces/" + workspaceId);
    }

    return (
        <Drawer variant='permanent' anchor='left'
            sx={{ width: leftNavWidth, display: isAuthenticated ? "flex" : "none", zIndex: 1, pt: "84px", pb: 3 }}
            PaperProps={{ sx: { width: leftNavWidth, backgroundColor: "black" } }}  >

            <Box sx={leftNavTopBoxProps} >
                <Box sx={leftNavOuterBoxProps} >
                    <Box sx={leftNavInnerBoxLeftProps} >
                        <MenuIcon sx={avatarProps} onClick={toggleLeftNavWidth} />
                    </Box>
                    <Box sx={leftNavInnerBoxRightProps}>
                        <FormControl sx={{ width: 1, display: leftNavExpanded ? "inline-flex" : "none" }}>
                            <Select variant='standard' size='medium' sx={{ height: "42px", pl: 1 }} value={appContextData?.currentWorkspaceId ?? ""}
                                onChange={onUpdateCurrentWorkspace} >
                                <MenuItem value={MyWorkspace.id} key={MyWorkspace.id} >{MyWorkspace.name}</MenuItem>
                                <Divider />
                                {appContextData.workspaces && appContextData.workspaces.map((workspace: PowerBiWorkspace) => (
                                    <MenuItem value={workspace.id} key={workspace.id}>{workspace.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Divider />

                <Box sx={leftNavOuterBoxProps} >
                    <Box sx={leftNavInnerBoxLeftProps} >
                        <AssessmentIcon sx={avatarProps} />
                    </Box>
                    {leftNavExpanded &&
                        <Box sx={leftNavInnerBoxRightProps}>
                            <Typography sx={leftNavHeaderProps} variant='subtitle1' >Reports</Typography>
                            {appContextData.workspaceArtifactsLoading && <DataLoading />}
                            {!appContextData.workspaceArtifactsLoading && (
                                <List disablePadding dense sx={leftNavListProps}>
                                    {appContextData.reports?.map((report: PowerBiReport) => (
                                        <ListItem button key={report.id}
                                            sx={{ width: 1, backgroundColor: (document.URL.includes(report.id)) ? "lightblue" : "white" }}
                                            onClick={() => {
                                                navigate("/reports/" + appContextData.currentWorkspaceId + "@" + report.id);
                                            }} >{report.name}</ListItem>

                                    ))}
                                </List>
                            )}
                        </Box>
                    }
                </Box>
                <Divider />

                <Box sx={leftNavOuterBoxProps} >
                    <Box sx={leftNavInnerBoxLeftProps} >
                        <SchemaIcon sx={avatarProps} />
                    </Box>
                    {leftNavExpanded &&
                        <Box sx={leftNavInnerBoxRightProps}>
                            <Typography sx={leftNavHeaderProps} variant='subtitle1' >Datasets</Typography>
                            {appContextData.workspaceArtifactsLoading && <DataLoading />}
                            {!appContextData.workspaceArtifactsLoading && (
                                <List disablePadding dense sx={leftNavListProps}>
                                    {appContextData.datasets?.map((dataset: PowerBiDataset) => (
                                        <ListItem button key={dataset.id}
                                            sx={{ backgroundColor: (document.URL.includes(dataset.id)) ? "lightblue" : "white" }}
                                            onClick={() => {
                                                navigate("/reports/" + appContextData.currentWorkspaceId + "$" + dataset.id);
                                            }} >{dataset.name}</ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    }
                </Box>
                <Divider />
            </Box>
        </Drawer >
    )
}

export default LeftNav