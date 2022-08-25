import React from 'react';

import { PowerBiWorkspace, PowerBiReport, PowerBiDataset } from './models/PowerBiModels';

export interface AppContextData {
    workspaces?: PowerBiWorkspace[];
    currentWorkspaceId?: string;
    currentWorkspaceName?: string;
    currentWorkspaceIsReadOnly?: boolean;
    currentWorkspaceIsPremium?: boolean;    
    reports?: PowerBiReport[];
    datasets?: PowerBiDataset[];
    workspaceArtifactsLoading?: boolean
}

export const AppContextDataDefaults: AppContextData = {
    currentWorkspaceId: null,
    currentWorkspaceName: null,
    currentWorkspaceIsReadOnly: null,
    currentWorkspaceIsPremium: null,
    workspaces: null,
    reports: null,
    datasets: null,
    workspaceArtifactsLoading: false
}

export interface AppContextProps {
    appContextData: AppContextData;
    setCurrentWorkspaceId: (WorkspaceId: string) => void;
    refreshReportList: () => void;
  }

  export const AppContext = React.createContext<AppContextProps>({
    appContextData: AppContextDataDefaults,
    setCurrentWorkspaceId: (WorkspaceId: string) => {},
    refreshReportList: () => {}
  });