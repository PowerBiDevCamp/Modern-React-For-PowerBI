import { useEffect, useLayoutEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import PageNotAccessible from '../PageNotAccessible';

import { AppContext } from "../../AppContext";

import ReportPath from './report/ReportPath'
import ReportToolbar from './report/ReportToolbar';
import NewReportToolbar from './report/NewReportToolbar';

import PowerBiService, { MyWorkspace } from '../../services/PowerBiService'
import { PowerBiDataset, PowerBiReport, PowerBiWorkspace } from '../../models/PowerBiModels';

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";

// ensure Power BI JavaScript API has loaded
require('powerbi-models');
require('powerbi-client');

import { Box } from '@mui/material';


export type ViewMode = "FitToPage" | "FitToWidth" | "ActualSize";

const Report = () => {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const embedContainer = useRef(null);
    const { path } = useParams();
    const { appContextData, setCurrentWorkspaceId, refreshReportList } = useContext(AppContext)

    const [embeddedReport, setEmbeddedReport] = useState<powerbi.Report | null>(null);
    const [embeddedNewReport, setEmbeddedNewReport] = useState<powerbi.Embed | null>(null);

    const [embedType, setEmbedType] = useState<"ExistingReport" | "NewReport" | null>(null);
    const [reportType, setReportType] = useState<"PowerBiReport" | "PaginatedReport" | null>(null);

    const [editMode, setEditMode] = useState(false);
    const [showNavigation, setShowNavigation] = useState(true);
    const [showFiltersPane, setShowFiltersPane] = useState(true);
    const [showBookmarksPane, setShowBookmarksPane] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("FitToPage");

    const [reportPath, setReportPath] = useState("");

    const embedExistingReport = async (WorkspaceId: string, ReportId: string) => {

        const params = new URLSearchParams(window.location.search);
        const openInEditMode = (params.get('edit') === "true");
        setEditMode(openInEditMode);

        const defaultShowNavigation: boolean = true;
        setShowNavigation(defaultShowNavigation);
        const defaultShowFilterPane: boolean = false;
        setShowFiltersPane(defaultShowFilterPane);
        const defaultShowBookmarksPane: boolean = false;
        setShowBookmarksPane(defaultShowBookmarksPane);
        const defaultViewMode: ViewMode = 'FitToPage';
        setViewMode(defaultViewMode);

        let report: PowerBiReport = await PowerBiService.GetReport(WorkspaceId, ReportId);

        if (appContextData.currentWorkspaceName && report.name) {
            setReportPath(appContextData.currentWorkspaceName + " > " + report.name);
        }
        else {
            setReportPath("...");
        }

        if (report.reportType === "PaginatedReport") {
            setReportType("PaginatedReport")
            embedPaginatedReport(WorkspaceId, report);
            return;
        }

        setEmbedType("ExistingReport")
        setReportType("PowerBiReport")

        let accessToken: string = await PowerBiService.GetAccessToken();

        var config: powerbi.IEmbedConfiguration = {
            type: 'report',
            id: report.id,
            embedUrl: report.embedUrl,
            accessToken: accessToken,
            tokenType: models.TokenType.Aad,
            viewMode: openInEditMode ? models.ViewMode.Edit : models.ViewMode.View,
            permissions: models.Permissions.All,
            settings: {
                panes: {
                    pageNavigation: { visible: defaultShowNavigation, position: models.PageNavigationPosition.Left },
                    filters: { visible: defaultShowFilterPane, expanded: false },
                    bookmarks: { visible: defaultShowBookmarksPane }
                },
                bars: {
                    actionBar: { visible: false }
                },
                persistentFiltersEnabled: true,
                personalBookmarksEnabled: true
            }
        };

        console.log("config", config);

        // Embed the report and display it within the div container                
        var embeddedReport: powerbi.Report = (window.powerbi.embed(embedContainer.current, config) as powerbi.Report);

        embeddedReport.on("filtersApplied", (args) => { embeddedReport.savePersistentFilters(); });
        embeddedReport.on("dataSelected", (args) => { embeddedReport.savePersistentFilters(); });
        embeddedReport.on("visualClicked", (args) => { embeddedReport.savePersistentFilters(); });
        embeddedReport.on("selectionChanged", (args) => { embeddedReport.savePersistentFilters(); });
  
        setEmbeddedReport(embeddedReport);
        console.log(embeddedReport);

        embeddedReport.on("saved", (event: any) => {

            console.log("embeddedReport.on", event);

            if (event.detail.saveAs) {
                refreshReportList();
                var newReportId = event.detail.reportObjectId;
                var newReportName = event.detail.reportName;
                navigate("/reports/" + WorkspaceId + "@" + newReportId + "/?edit=true&newReport=true");
            }

        });

    };

    const embedNewReport = async (WorkspaceId: string, DatasetId: string) => {

        let dataset: PowerBiDataset = await PowerBiService.GetDataset(WorkspaceId, DatasetId);
        let accessToken: string = await PowerBiService.GetAccessToken();

        var config: powerbi.IEmbedConfiguration = {
            type: 'report',
            datasetId: dataset.id,
            embedUrl: dataset.createReportEmbedURL,
            accessToken: accessToken,
            tokenType: models.TokenType.Aad,
            settings: {
                bars: {
                    actionBar: { visible: false }
                },
                panes: {
                    filters: { expanded: false, visible: true }
                }
            }
        };

        // Embed the report and display it within the div container.
        var embeddedNewReport: powerbi.Embed = window.powerbi.createReport(embedContainer.current, config);
        setEmbeddedNewReport(embeddedNewReport);

        embeddedNewReport.on("saved", (event: any) => {

            console.log("Saved");
            console.log(event.detail);

            // get ID and name of new report
            refreshReportList();
            var newReportId = event.detail.reportObjectId;
            var newReportName = event.detail.reportName;
            navigate("/reports/" + WorkspaceId + "@" + newReportId + "/?edit=true&newReport=true")
        });

    };

    const embedPaginatedReport = async (WorkspaceId: string, Report: PowerBiReport) => {

        let accessToken: string = await PowerBiService.GetAccessToken();

        var config: powerbi.IEmbedConfiguration = {
            type: 'report',
            id: Report.id,
            embedUrl: Report.embedUrl,
            accessToken: accessToken,
            tokenType: models.TokenType.Aad,
            settings: {}
        };

        console.log("config", config);

        // Embed the report and display it within the div container                
        var embeddedReport: powerbi.Report = (window.powerbi.embed(embedContainer.current, config) as powerbi.Report);

    };

    // set height of embed container relative to height of window
    const setReportContainerHeight = () => {
        var reportContainer: HTMLElement = embedContainer.current;
        var reportContainerTopPosition = reportType === "PaginatedReport" ? 88 : 122;
        reportContainer.style.height = (window.innerHeight - reportContainerTopPosition - 10) + "px";
    };

    useLayoutEffect(() => {
        if (isAuthenticated) {
            setReportContainerHeight();
            window.addEventListener("resize", setReportContainerHeight);
        }
    }, [isAuthenticated, reportType]);

    // call Power BI REST API and embed report
    useEffect(() => {

        const useEffectAsync = async () => {

            window.powerbi.reset(embedContainer.current);

            // handle URL for embedding existing report
            if (path.includes("@")) {
                setEmbedType("ExistingReport");
                let parts = path.split("@");
                let workspaceId = parts[0];
                let reportId = parts[1];
                if (workspaceId !== appContextData.currentWorkspaceId) {
                    setCurrentWorkspaceId(workspaceId);
                }
                embedExistingReport(workspaceId, reportId);
                return;
            }

            // handle URL for embedding new report
            if (path.includes("$")) {
                setEmbedType("NewReport");
                let parts = path.split("$");
                let workspaceId = parts[0];
                let datasetId = parts[1];
                if (workspaceId !== appContextData.currentWorkspaceId) {
                    setCurrentWorkspaceId(workspaceId);
                }
                embedNewReport(workspaceId, datasetId);
                return;
            }
        }

        if (isAuthenticated) { useEffectAsync(); }

    }, [path, appContextData]);

    if (!isAuthenticated) {
        return <PageNotAccessible />;
    }
    else {
        return (
            <Box sx={{ display: "grid", gridAutoFlow: "row", width: 1 }}>

                <ReportPath reportPath={reportPath} />

                {embedType === "ExistingReport" && reportType === "PowerBiReport" &&
                    <ReportToolbar report={embeddedReport}
                        editMode={editMode} setEditMode={setEditMode} showNavigation={showNavigation} setShowNavigation={setShowNavigation}
                        showFiltersPane={showFiltersPane} setShowFiltersPane={setShowFiltersPane} viewMode={viewMode} setViewMode={setViewMode}
                        showBookmarksPane={showBookmarksPane} setShowBookmarksPane={setShowBookmarksPane} />}

                {embedType === "NewReport" &&
                    <NewReportToolbar report={embeddedNewReport}
                        showFiltersPane={showFiltersPane} setShowFiltersPane={setShowFiltersPane} viewMode={viewMode} setViewMode={setViewMode}
                        showBookmarksPane={showBookmarksPane} setShowBookmarksPane={setShowBookmarksPane} />}


                <Box ref={embedContainer} sx={{ width: "100%" }} />

            </Box>
        );
    }
};

export default Report;