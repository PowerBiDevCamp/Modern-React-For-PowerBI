import React from 'react';

import { PowerBiWorkspace, PowerBiReport, PowerBiDataset } from './models/PowerBiModels';
import { MyWorkspace } from './services/PowerBiService';


export interface AppContextData {
    workspaces?: PowerBiWorkspace[];
    currentWorkspaceId?: string;
    currentWorkspaceName?: string;
    currentWorkspaceIsReadOnly?: boolean;
    currentWorkspaceIsPremium?: boolean;    
    reports?: PowerBiReport[];
    datasets?: PowerBiDataset[];
}

export const AppContextDataDefaults: AppContextData = {
    currentWorkspaceId: MyWorkspace.id,
    currentWorkspaceName: MyWorkspace.name,
    currentWorkspaceIsReadOnly: MyWorkspace.isReadOnly,
    currentWorkspaceIsPremium: MyWorkspace.isOnDedicatedCapacity,
    workspaces: null,
    reports: null,
    datasets: null
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