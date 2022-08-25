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
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(null);
  const [currentWorkspaceName, setCurrentWorkspaceName] = useState<string>(null);
  const [currentWorkspaceIsReadOnly, setCurrentWorkspaceIsReadOnly] = useState<boolean>(null);
  const [currentWorkspaceIsPremium, setCurrentWorkspaceIsPremium] = useState<boolean>(null);
  const [reports, setReports] = useState<PowerBiReport[] | null>(null);
  const [datasets, setDatasets] = useState<PowerBiDataset[] | null>(null);
  const [workspaceArtifactsLoading, setWorkspaceArtifactsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getPowerBiDataAsync = async () => {

      if (isAuthenticated) {
        let powerBiWorkspaces: PowerBiWorkspace[] = workspaces;
        if (!workspaces) {
          powerBiWorkspaces = await PowerBiService.GetWorkspaces();
          setWorkspaces(powerBiWorkspaces);
        }

        if(!currentWorkspaceId){
          return;
        }

        let workspace: PowerBiWorkspace = (currentWorkspaceId === MyWorkspace.id) ?
          MyWorkspace :
          powerBiWorkspaces.find(workspace => workspace.id === currentWorkspaceId);
console.log("Got here");
console.log(workspace);

        setCurrentWorkspaceName(workspace.name);
        setCurrentWorkspaceIsReadOnly(workspace.isReadOnly);
        setCurrentWorkspaceIsPremium(workspace.isOnDedicatedCapacity);
        setWorkspaceArtifactsLoading(true);
        setReports(await PowerBiService.GetReports(currentWorkspaceId));
        setDatasets(await PowerBiService.GetDatasets(currentWorkspaceId));
        await new Promise(f => setTimeout(f, 1000));
        setWorkspaceArtifactsLoading(false);
      }
      else {
        setWorkspaces(null);
        setReports(null);
        setDatasets(null);
      }
    }

    if (isAuthenticated && currentWorkspaceId) {
       getPowerBiDataAsync(); 
    }

    if (isAuthenticated && !currentWorkspaceId) {
      setCurrentWorkspaceId(MyWorkspace.id); 
   }

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
        datasets: datasets,
        workspaceArtifactsLoading: workspaceArtifactsLoading,
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