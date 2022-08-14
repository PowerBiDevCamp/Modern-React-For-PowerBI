import { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";

import { useIsAuthenticated } from "@azure/msal-react";

import PageLayout from './components/PageLayout'
import { CssBaseline } from '@mui/material';

import { AppContext } from "./AppContext";
import { PowerBiWorkspace, PowerBiReport, PowerBiDataset } from './models/PowerBiModels';
import PowerBiService, { MyWorkspace } from './services/PowerBiService';

const App = () => {
  const isAuthenticated = useIsAuthenticated();
  const [workspaces, setWorkspaces] = useState<PowerBiWorkspace[] | null>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(MyWorkspace.id);
  const [currentWorkspaceName, setCurrentWorkspaceName] = useState<string>(MyWorkspace.name);
  const [currentWorkspaceIsReadOnly, setCurrentWorkspaceIsReadOnly] = useState<boolean>(MyWorkspace.isReadOnly);
  const [currentWorkspaceIsPremium, setCurrentWorkspaceIsPremium] = useState<boolean>(MyWorkspace.isOnDedicatedCapacity);
  const [reports, setReports] = useState<PowerBiReport[] | null>(null);
  const [datasets, setDatasets] = useState<PowerBiDataset[] | null>(null);

  useEffect(() => {
    const getPowerBiDataAsync = async () => {

      if (isAuthenticated) {
        let powerBiWorkspaces: PowerBiWorkspace[] = workspaces;
        if (!workspaces) {
          powerBiWorkspaces = await PowerBiService.GetWorkspaces();
          setWorkspaces(powerBiWorkspaces);
        }

        let workspace: PowerBiWorkspace = (currentWorkspaceId === MyWorkspace.id) ?
          MyWorkspace :
          powerBiWorkspaces.find(workspace => workspace.id === currentWorkspaceId);

        setCurrentWorkspaceName(workspace.name);
        setCurrentWorkspaceIsReadOnly(workspace.isReadOnly);
        setCurrentWorkspaceIsPremium(workspace.isOnDedicatedCapacity);
        setReports(await PowerBiService.GetReports(currentWorkspaceId));
        setDatasets(await PowerBiService.GetDatasets(currentWorkspaceId));
      }
      else {
        setWorkspaces(null);
        setReports(null);
        setDatasets(null);
      }
    }

    if (isAuthenticated) { getPowerBiDataAsync(); }
    
  }, [currentWorkspaceId, isAuthenticated]);

  const refreshReportList = () => {
    const refreshReportListAsync = async () => {
      setReports(await PowerBiService.GetReports(currentWorkspaceId));
    };
    refreshReportListAsync();
  };

  return (
    <AppContext.Provider value={{
      appContextData: {
        currentWorkspaceId: currentWorkspaceId,
        currentWorkspaceName: currentWorkspaceName,
        currentWorkspaceIsReadOnly: currentWorkspaceIsReadOnly,
        currentWorkspaceIsPremium: currentWorkspaceIsPremium,
        workspaces: workspaces,
        reports: reports,
        datasets: datasets
      }, setCurrentWorkspaceId, refreshReportList
    }}>

      <CssBaseline />
      <BrowserRouter>
        <PageLayout />
      </BrowserRouter>

    </AppContext.Provider>
  )
}

export default App;