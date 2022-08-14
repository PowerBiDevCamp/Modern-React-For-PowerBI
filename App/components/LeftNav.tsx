import { useState, useContext } from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from "../AppContext";

import { Box, Drawer, Toolbar, Typography } from '@mui/material';
import {List, ListItem, ListItemAvatar } from '@mui/material';
import { Divider, IconButton, Stack, Select, MenuItem, InputLabel, FormControl, SxProps, SelectChangeEvent } from '@mui/material';
 
import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchemaIcon from '@mui/icons-material/Schema';
import { Group, Person, AccountCircle, Menu, PersonOff } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { MyWorkspace } from '../services/PowerBiService'
import { PowerBiWorkspace, PowerBiReport, PowerBiDataset } from '../models/PowerBiModels';

const LeftNav = () => {
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const { appContextData, setCurrentWorkspaceId } = useContext(AppContext);
    const expandedLeftNavWidth = 320;
    const colapsedLeftNavWidth = 48;
    const [leftNavWidth, setLeftNavWidth] = useState(expandedLeftNavWidth);
    const [leftNavExpanded, setLeftNavExpanded] = useState(true);

    const listItemProps: SxProps = {
        justifyContent: leftNavExpanded ? 'flex-start' : 'center', pl: 0, pr: leftNavExpanded ? 1 : 0, pb: 0
    };

    const listItemAvatarProps: SxProps = {
        pl: 0, width: "32px", height: "32px", alignContent: "center", minWidth: "32px", textAlign: "center",
        mr: leftNavExpanded ? 2 : 0
    };

    const avatarProps: SxProps = {
        width: "36px", height: "36px", border:1
    };

    const leftNavHeaderProps: SxProps = {
        fontSize: "16px", width: 1, color: "white", backgroundColor: "black", pl: 2, mb: 0, mt: 0, height: "32px"
    };

    const leftNavListProps: SxProps = {
        ml: "48px", mt: 0, pt: 0, borderLeft: 1, fontSize: "14px", width: 1, my: 0, py: 0, border: "1px solid #DDDDDD"
    };

    const listItemWithListProps: SxProps = {
        justifyContent: leftNavExpanded ? 'flex-start' : 'center', pl: 0, py: 0, pr: leftNavExpanded ? 1 : 0
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
            sx={{ width: leftNavWidth, display: isAuthenticated ? "flex" : "none", zIndex: 1, pb: 3 }}
            PaperProps={{ sx: { width: leftNavWidth } }}  >

            <List disablePadding dense sx={{ width: 1, mt:"56px" }} >
                <ListItem key={"workspaces"} sx={listItemProps}  >
                    <ListItemAvatar sx={listItemAvatarProps} onClick={toggleLeftNavWidth}  >
                     <MenuIcon sx={avatarProps} />
                    </ListItemAvatar>
                    <FormControl sx={{ width: 1, mt: 1, display: leftNavExpanded ? "inline-flex" : "none" }}>
                        <InputLabel shrink={true} sx={{ backgroundColor: "white", color: "#CCCCCC", px: 2, }} >Select Workspace</InputLabel>
                        <Select variant='outlined' size='small' value={appContextData?.currentWorkspaceId ?? ""}
                            onChange={onUpdateCurrentWorkspace} >
                            <MenuItem value={MyWorkspace.id} key={MyWorkspace.id} >{MyWorkspace.name}</MenuItem>
                            <Divider />
                            {appContextData.workspaces && appContextData.workspaces.map((workspace: PowerBiWorkspace) => (
                                <MenuItem value={workspace.id} key={workspace.id}>{workspace.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ListItem>

                <Divider />

                <ListItem key={"reportsHeader"} sx={listItemProps} >
                    <ListItemAvatar sx={listItemAvatarProps} onClick={toggleLeftNavWidth} >
                        <AssessmentIcon sx={avatarProps} />
                    </ListItemAvatar>
                    {leftNavExpanded && <Typography sx={leftNavHeaderProps} variant='subtitle1' >Reports</Typography>}
                </ListItem>
                {leftNavExpanded && appContextData.reports && (
                    <ListItem key={"reportsList"} sx={listItemWithListProps} >
                        <List disablePadding dense sx={leftNavListProps}>
                            {appContextData.reports.map((report: PowerBiReport) => (
                                <ListItem button key={report.id}
                                    sx={{ width: 1, backgroundColor: (document.URL.includes(report.id)) ? "lightyellow" : "white" }}
                                    onClick={() => {
                                        navigate("/reports/" + appContextData.currentWorkspaceId + "@" + report.id);
                                    }} >{report.name}</ListItem>

                            ))}
                        </List>
                    </ListItem>
                )}

                <Divider />

                <ListItem key={"DatasetsHeader"} sx={listItemProps}  >
                    <ListItemAvatar sx={listItemAvatarProps} onClick={toggleLeftNavWidth} >
                        <SchemaIcon sx={avatarProps} />
                    </ListItemAvatar>
                    {leftNavExpanded && <Typography sx={leftNavHeaderProps} variant='subtitle1' >Datasets</Typography>}
                </ListItem>
                {leftNavExpanded && appContextData.datasets && (
                    <ListItem key={"datasetsList"} sx={listItemWithListProps} >
                        <List disablePadding dense sx={leftNavListProps}>
                            {appContextData.datasets.map((dataset: PowerBiDataset) => (
                                <ListItem button key={dataset.id}
                                    sx={{ backgroundColor: (document.URL.includes(dataset.id)) ? "lightyellow" : "white" }}
                                    onClick={() => {
                                        navigate("/reports/" + appContextData.currentWorkspaceId + "$" + dataset.id);
                                    }} >{dataset.name}</ListItem>
                            ))}
                        </List>
                    </ListItem>
                )}
                <Divider />
            </List>
        </Drawer >
    )
}

export default LeftNav