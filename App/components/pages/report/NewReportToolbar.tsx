import { useState, useRef, useContext } from 'react';
import { AppContext } from "../../../AppContext";

import PowerBiService from '../../../services/PowerBiService'

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";

import { ViewMode } from './../Report'

// ensure Power BI JavaScript API has loaded
require('powerbi-models');
require('powerbi-client');

import { Box, Toolbar, Button, Divider, Menu, MenuItem, TextField, Switch, SxProps } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';

import { Fullscreen, Edit, Pageview, Download, PictureAsPdf, Image, Slideshow, SyncAlt, Refresh, Article, Bookmark } from '@mui/icons-material';
import { KeyboardArrowDown, SaveAs, Save, Visibility, FitScreen, PhotoSizeSelectActual, Check, Filter } from '@mui/icons-material';
import { RadioButtonUnchecked, RadioButtonChecked, FilterAltOff, Menu as MenuIcon } from '@mui/icons-material';

interface NewReportToolbarProps {
    report: powerbi.Embed;
    showFiltersPane: boolean;
    setShowFiltersPane: (ShowFiltersPane: boolean) => void;
    showBookmarksPane: boolean;
    setShowBookmarksPane: (ShowBookmarksPane: boolean) => void;
    viewMode: ViewMode;
    setViewMode: (VeiwModeValue: ViewMode) => void;
}

const NewReportToolbar = ({ report, showFiltersPane, setShowFiltersPane,
    showBookmarksPane, setShowBookmarksPane, viewMode, setViewMode }: NewReportToolbarProps) => {

    const { appContextData } = useContext(AppContext)
    const [anchorElementFile, setAnchorElementFile] = useState<null | HTMLElement>(null);
    const [anchorElementView, setAnchorElementView] = useState<null | HTMLElement>(null);
    const [anchorElementViewMode, setAnchorElementViewMode] = useState<null | HTMLElement>(null);

    const [openSaveAsDialog, setOpenSaveAsDialog] = useState(false);
    const [newReportName, setNewReportName] = useState("");
    const refReportName = useRef<HTMLInputElement>(null);

    const menuButtonProperties: SxProps = { fontSize: "9px", color: "#555555", ml: 1 };
    const menuItemProps: SxProps = { fontSize: "11px", px: 1.5, py: 0, m: 0 };
    const menuSwitchProps: SxProps = { ml: "auto", pl: 1 };
    const menuRadioButtonProps: SxProps = { ml: "auto", pl: 1.5 };

    const onFileSaveAs = () => {
        setAnchorElementFile(null);
        setNewReportName("")
        setOpenSaveAsDialog(true);
    };

    const onReportFullscreen = () => {
        report.fullscreen();
    };

    return (
        <>
            <Box sx={{ width: 1, backgroundColor: "#CCCCCC", p: 0, m: 0 }} >
                <Toolbar disableGutters variant='dense' sx={{ p: 0, m: 0, minHeight: "32px" }} >

                    <Divider orientation='vertical' flexItem sx={{ pl: 0.5 }} />


                    <Button startIcon={<Article />} endIcon={<KeyboardArrowDown />} sx={menuButtonProperties}
                        onClick={(event) => { setAnchorElementFile(event.currentTarget); }} >
                        File
                    </Button>
                    <Menu sx={menuItemProps} anchorEl={anchorElementFile} open={Boolean(anchorElementFile)} onClose={() => { setAnchorElementFile(null); }} >
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem sx={menuItemProps} onClick={onFileSaveAs} disableRipple >
                            <SaveAs sx={{ mr: 1 }} /> Save As
                        </MenuItem>
                    </Menu>
                    <Divider orientation='vertical' flexItem />


        
                    <Divider orientation='vertical' flexItem />

                    <Divider orientation='vertical' flexItem sx={{ ml: "auto" }} />


                    <Divider orientation='vertical' flexItem />

                    <Button startIcon={<Fullscreen />} sx={menuButtonProperties} onClick={onReportFullscreen}  >Full Screen</Button>

                    <Divider orientation='vertical' flexItem sx={{ mr: 1 }} />

                </Toolbar>

            </Box >

            <Dialog open={openSaveAsDialog} onClose={() => { setOpenSaveAsDialog(false); }} >
                <DialogTitle>Enter report name</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You need to give this new report a name.
                    </DialogContentText>
                    <TextField
                        onChange={(event) => { setNewReportName(event.target.value) }}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="New Report Name"
                        type="text"
                        value={newReportName}
                        fullWidth
                        variant="standard"
                        inputRef={refReportName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button disabled={newReportName === ""} onClick={async () => {
                        setOpenSaveAsDialog(false);
                        console.log("Save new report: " + newReportName)
                        await report.saveAs({ name: newReportName });
                    }}>Save</Button>
                    <Button onClick={() => { setOpenSaveAsDialog(false); }}>Cancel</Button>
                </DialogActions>
            </Dialog>          

        </>
    )
}

export default NewReportToolbar