import { useState, useRef, useContext } from 'react';

import { AppContext } from "../../../AppContext";

import PowerBiService from '../../../services/PowerBiService'
import { PowerBiExportRequest } from '../../../models/PowerBiModels';

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
import { RadioButtonUnchecked, RadioButtonChecked, FilterAlt, FilterAltOff, Menu as MenuIcon } from '@mui/icons-material';

interface ReportToolbarProps {
  report: powerbi.Report;
  editMode: boolean;
  setEditMode: (EditMode: boolean) => void;
  showNavigation: boolean;
  setShowNavigation: (ShowNavigation: boolean) => void;
  showFiltersPane: boolean;
  setShowFiltersPane: (ShowFiltersPane: boolean) => void;
  showBookmarksPane: boolean;
  setShowBookmarksPane: (ShowBookmarksPane: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (VeiwModeValue: ViewMode) => void;
}

const ReportToolbar = ({ report, editMode, setEditMode, showNavigation, setShowNavigation, showFiltersPane, setShowFiltersPane,
                         showBookmarksPane, setShowBookmarksPane, viewMode, setViewMode }: ReportToolbarProps) => {

  const { appContextData } = useContext(AppContext)
  const [anchorElementFile, setAnchorElementFile] = useState<null | HTMLElement>(null);
  const [anchorElementExport, setAnchorElementExport] = useState<null | HTMLElement>(null);
  const [anchorElementView, setAnchorElementView] = useState<null | HTMLElement>(null);
  const [anchorElementViewMode, setAnchorElementViewMode] = useState<null | HTMLElement>(null);

  const [openSaveAsDialog, setOpenSaveAsDialog] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const refReportName = useRef<HTMLInputElement>(null);

  const [openExportProgressDialog, setOpenExportProgressDialog] = useState(false);
  const [exportProgressMessage, setExportProgressMessage] = useState("");

  const menuButtonProperties: SxProps = { fontSize: "9px", color: "#555555", ml: 1 };
  const menuItemProps: SxProps = { fontSize: "11px", px: 1.5, py: 0, m: 0 };
  const menuSwitchProps: SxProps = { ml: "auto", pl: 1 };
  const menuRadioButtonProps: SxProps = { ml: "auto", pl: 1.5 };

  const onFileSave = () => {
    setAnchorElementFile(null);
    report.save()
  };

  const onFileSaveAs = () => {
    setAnchorElementFile(null);
    setNewReportName("")
    setOpenSaveAsDialog(true);
  };

  const onExportPageToPDF = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let workspaceId = appContextData.currentWorkspaceId;
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: PowerBiExportRequest = {
      format: "PDF",
      powerBIReportConfiguration: {
        pages: [{ pageName: currentPageName }],
        defaultBookmark: { state: bookmark.state }
      },
      exportStatusCallback: setExportProgressMessage
    };
    await PowerBiService.ExportReport(workspaceId, reportId, exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportPageToPNG = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let workspaceId = appContextData.currentWorkspaceId;
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: PowerBiExportRequest = {
      format: "PNG",
      powerBIReportConfiguration: {
        pages: [{ pageName: currentPageName }],
        defaultBookmark: { state: bookmark.state }
      }
    };
    await PowerBiService.ExportReport(workspaceId, reportId, exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportPageToPPTX = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let workspaceId = appContextData.currentWorkspaceId;
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: PowerBiExportRequest = {
      format: "PPTX",
      powerBIReportConfiguration: {
        pages: [{ pageName: currentPageName }],
        defaultBookmark: { state: bookmark.state }
      },
      exportStatusCallback: setExportProgressMessage
    };
    await PowerBiService.ExportReport(workspaceId, reportId, exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportReportToPDF = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let workspaceId = appContextData.currentWorkspaceId;
    let reportId = report.getId();
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: PowerBiExportRequest = {
      format: "PDF",
      powerBIReportConfiguration: {
        defaultBookmark: { state: bookmark.state }
      }
    };
    await PowerBiService.ExportReport(workspaceId, reportId, exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportReportToPNG = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let workspaceId = appContextData.currentWorkspaceId;
    let reportId = report.getId();
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: PowerBiExportRequest = {
      format: "PNG",
      powerBIReportConfiguration: {
        defaultBookmark: { state: bookmark.state }
      }
    };
    await PowerBiService.ExportReport(workspaceId, reportId, exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportReportToPPTX = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let workspaceId = appContextData.currentWorkspaceId;
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: PowerBiExportRequest = {
      format: "PPTX",
      powerBIReportConfiguration: {
        pages: [{ pageName: currentPageName }],
        defaultBookmark: { state: bookmark.state }
      }
    };
    await PowerBiService.ExportReport(workspaceId, reportId, exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onViewSwitchNavigation = () => {
    setShowNavigation(!showNavigation);
    report.updateSettings({
      panes: {
        pageNavigation: { visible: !showNavigation }
      }
    });
  };

  const onViewSwitchBookmarksPane = (args: any) => {
    setShowBookmarksPane(!showBookmarksPane);
    report.updateSettings({
      panes: {
        bookmarks: { visible: !showBookmarksPane }
      }
    });
    console.log("config", report.config.settings.panes.bookmarks.visible);
  };

  const onViewSwitchFilterPaneView = () => {
    setShowFiltersPane(!showFiltersPane);
    report.updateSettings({
      panes: {
        filters: { visible: !showFiltersPane, expanded: true }
      }
    });
  };

  const onViewClearPersistentFilters = () => {
    setAnchorElementView(null);
    report.resetPersistentFilters();
  };

  const onViewModeFitToPage = () => {
    console.log("onViewFitToPage");
    setAnchorElementViewMode(null);
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage }
    });
    setViewMode("FitToPage")
  };

  const onViewModeFitToWidth = () => {
    console.log("onViewFitToWidth");
    setAnchorElementViewMode(null);
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    });
    setViewMode("FitToWidth")
  };

  const onViewModeActualSize = () => {
    console.log("onViewActualSize");
    setAnchorElementViewMode(null);
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.ActualSize }
    });
    setViewMode("ActualSize")
  };

  const onReportRefresh = () => {
    report.refresh();
  };

  const onReportFullscreen = () => {
    report.fullscreen();
  };

  return (
    <>
      <Box sx={{ width: 1, backgroundColor: "#CCCCCC", p: 0, m: 0 }} >
        <Toolbar disableGutters variant='dense' sx={{ p: 0, m: 0, minHeight: "32px" }} >

          <Divider orientation='vertical' flexItem sx={{ pl: 0.5 }} />

          {editMode && (
            <>
              <Button startIcon={<Article />} endIcon={<KeyboardArrowDown />} sx={menuButtonProperties}
                onClick={(event) => { setAnchorElementFile(event.currentTarget); }} >
                File
              </Button>
              <Menu sx={menuItemProps} anchorEl={anchorElementFile} open={Boolean(anchorElementFile)} onClose={() => { setAnchorElementFile(null); }} >
                <MenuItem sx={menuItemProps} onClick={onFileSave} disableRipple >
                  <Save sx={{ mr: 1 }} /> Save
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem sx={menuItemProps} onClick={onFileSaveAs} disableRipple >
                  <SaveAs sx={{ mr: 1 }} /> Save As
                </MenuItem>
              </Menu>
              <Divider orientation='vertical' flexItem />
            </>
          )}

          {appContextData.currentWorkspaceIsPremium && (
            <>
              <Button startIcon={<Download />} endIcon={<KeyboardArrowDown />} sx={menuButtonProperties}
                onClick={(event) => { setAnchorElementExport(event.currentTarget); }} >
                Export
              </Button>
              <Menu sx={menuItemProps} anchorEl={anchorElementExport} open={Boolean(anchorElementExport)}
                onClose={() => { setAnchorElementExport(null); }} >
                <MenuItem sx={menuItemProps} onClick={onExportPageToPDF}   >
                  <PictureAsPdf sx={{ mr: 1 }} /> Export Current Page to PDF
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem sx={menuItemProps} onClick={onExportPageToPNG} disableRipple >
                  <Image sx={{ mr: 1 }} /> Export Current Page to PNG
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem sx={menuItemProps} onClick={onExportPageToPPTX} disableRipple >
                  <Slideshow sx={{ mr: 1 }} /> Export Current Page to PowerPoint (PPTX)
                </MenuItem>
                <Divider sx={{ my: 0.5, borderWidth: "1px", backgroundColor: "#666666" }} />
                <MenuItem sx={menuItemProps} onClick={onExportReportToPDF}  >
                  <PictureAsPdf sx={{ mr: 1 }} /> Export Report to PDF
                </MenuItem>
                <Divider sx={{ my: 1.5 }} />
                <MenuItem sx={menuItemProps} onClick={onExportReportToPNG} disableRipple >
                  <Image sx={{ mr: 1 }} /> Export Report to PNG
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem sx={menuItemProps} onClick={onExportReportToPPTX} disableRipple >
                  <Slideshow sx={{ mr: 1 }} /> Export Report to PowerPoint (PPTX)
                </MenuItem>
              </Menu>

              <Divider orientation='vertical' flexItem />
            </>
          )}

          <Button startIcon={<Visibility />} endIcon={<KeyboardArrowDown />} sx={menuButtonProperties}
            onClick={(event) => { setAnchorElementView(event.currentTarget); }} >
            View
          </Button>
          <Menu sx={menuItemProps} anchorEl={anchorElementView} open={Boolean(anchorElementView)} onClose={() => { setAnchorElementView(null); }} >
            <MenuItem sx={menuItemProps} disableRipple >
              <MenuIcon sx={{ mr: 1 }} /> Navigation Menu <Switch sx={menuSwitchProps} checked={showNavigation} onChange={onViewSwitchNavigation} />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem sx={menuItemProps} disableRipple >
              <Bookmark sx={{ mr: 1 }} /> Bookmarks <Switch sx={menuSwitchProps} checked={showBookmarksPane} onChange={onViewSwitchBookmarksPane} />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem sx={menuItemProps} disableRipple >
              <FilterAlt sx={{ mr: 1 }} /> Filter Pane <Switch sx={menuSwitchProps} checked={showFiltersPane} onChange={onViewSwitchFilterPaneView} />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem sx={menuItemProps} disableRipple onClick={onViewClearPersistentFilters} >
              <FilterAltOff sx={{ mr: 1 }} /> Clear Persistent Filters
            </MenuItem>
          </Menu>
          <Divider orientation='vertical' flexItem />

          <Button startIcon={editMode ? <Pageview /> : <Edit />} sx={menuButtonProperties} onClick={() => {
            console.log(report.config);
            report.switchMode(editMode ? "view" : "edit");
            setEditMode(!editMode);
          }}  >{editMode ? "Reading View" : "Edit"}</Button>

          <Divider orientation='vertical' flexItem />

          <Divider orientation='vertical' flexItem sx={{ ml: "auto" }} />

          <Button startIcon={<FitScreen />} endIcon={<KeyboardArrowDown />} sx={menuButtonProperties}
            onClick={(event) => { setAnchorElementViewMode(event.currentTarget); }} >
            View Mode
          </Button>
          <Menu sx={menuItemProps} anchorEl={anchorElementViewMode} open={Boolean(anchorElementViewMode)} onClose={() => { setAnchorElementViewMode(null); }} >
            <MenuItem onClick={onViewModeFitToPage} disableRipple sx={menuItemProps}  >
              <FitScreen sx={{ mr: 1 }} /> Fit to Page {viewMode === "FitToPage" ? <RadioButtonChecked sx={menuRadioButtonProps} /> : <RadioButtonUnchecked sx={menuRadioButtonProps} />}
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={onViewModeFitToWidth} disableRipple sx={menuItemProps} >
              <SyncAlt sx={{ mr: 1 }} /> Fit to Width {viewMode === "FitToWidth" ? <RadioButtonChecked sx={menuRadioButtonProps} /> : <RadioButtonUnchecked sx={menuRadioButtonProps} />}
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={onViewModeActualSize} disableRipple sx={menuItemProps} >
              <PhotoSizeSelectActual sx={{ mr: 1 }} /> Actual Size {viewMode === "ActualSize" ? <RadioButtonChecked sx={menuRadioButtonProps} /> : <RadioButtonUnchecked sx={menuRadioButtonProps} />}
            </MenuItem>
          </Menu>

          <Button startIcon={<Refresh />} sx={menuButtonProperties} onClick={onReportRefresh} >Refresh</Button>

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

      <Dialog open={openExportProgressDialog} onClose={() => { setOpenExportProgressDialog(false); }} >
        <DialogTitle>Power BI Report Export Job in Progress</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "table-cell", verticalAlign: "middle" }} >
            <CircularProgress size="1rem" sx={{ mx: 1 }} />
            {exportProgressMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenExportProgressDialog(false); }}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </>
  )
}

export default ReportToolbar