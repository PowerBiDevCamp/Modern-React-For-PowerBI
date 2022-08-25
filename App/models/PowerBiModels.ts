export interface PowerBiWorkspace {
  id: string;
  name: string;
  isOnDedicatedCapacity?: boolean;
  isReadOnly?: boolean;
  capacityId?: string;
}

export interface PowerBiReport {
  id: string;
  embedUrl: string;
  name: string;
  webUrl: string;
  datasetId: string;
  reportType: string;
  isOwnedByMe: boolean;
}

export interface PowerBiDataset {
  name: string;
  createReportEmbedURL: string;
  id: string;
  configuredBy: string;
  isRefreshable: boolean;
  isEffectiveIdentityRequired: boolean;
  isEffectiveIdentityRolesRequired: boolean;
  isOnPremGatewayRequired: boolean;
  targetStorageMode: string;
  createdDate: Date
}

export interface PowerBiExportRequest {
  format: "PDF" | "PNG" | "PPTX"
  powerBIReportConfiguration?: PowerBIReportConfiguration;
  exportStatusCallback?: (ExportStatusMessage: string) => void;
}

export interface PowerBIReportConfiguration {
  settings?: ReportSettings;
  reportLevelFilters?: ReportLevelFilter[];
  defaultBookmark?: ReportBookmark;
  pages?: ReportPage[];
}

export interface ReportLevelFilter {
  filter: string
}

export interface ReportBookmark {
  name?: string;
  state?: string;
}

export interface ReportPage {
  pageName: string;
  visualName?: string;
}


export interface ReportSettings {
  includeHiddenPages: boolean;
  locale: string;
}



export interface PowerBiExportJob {
  id: string;
  createdDateTime: string;
  lastActionDateTime: string;
  reportId: string;
  reportName: string;
  status: string;
  percentComplete: number;
  expirationTime: string;
  resourceFileExtension: string;
  resourceLocation: string;
}

