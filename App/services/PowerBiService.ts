import { msalInstance } from './../index';
import { PowerBiPermissionScopes } from "../AuthConfig";
import {
  PowerBiWorkspace, PowerBiReport, PowerBiDataset,
  PowerBiExportJob, PowerBiExportRequest
} from "./../models/PowerBiModels";

const PowerBiApiRoot: string = "https://api.powerbi.com/v1.0/myorg/";

export const MyWorkspace: PowerBiWorkspace = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "MyWorkspace",
  isReadOnly: false,
  isOnDedicatedCapacity: true
}

export default class PowerBiService {

  static GetAccessToken = async (): Promise<string> => {
    const account = msalInstance?.getActiveAccount();
    if (account) {
      const response = await msalInstance.acquireTokenSilent({
        scopes: PowerBiPermissionScopes,
        account: account
      });

      return response.accessToken;
    }
    else {
      return "";
    }


  };

  static GetWorkspaces = async (): Promise<PowerBiWorkspace[]> => {
    var restUrl = PowerBiApiRoot + "groups/";

    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }

  static GetWorkspace = async (WorkspaceId: string): Promise<PowerBiWorkspace> => {

    if (WorkspaceId === MyWorkspace.id) {
      return new Promise<PowerBiWorkspace>(resolve => resolve(MyWorkspace))
    }

    var restUrl = PowerBiApiRoot + "groups/" + "?$filter=id eq '" + WorkspaceId + "'";
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then(response => { return response.value[0]; });
  }

  static GetReports = async (WorkspaceId: string): Promise<PowerBiReport[]> => {
    var restUrl: string;
    if (WorkspaceId === MyWorkspace.id) {
      restUrl = PowerBiApiRoot + "/Reports/";
    }
    else {
      restUrl = PowerBiApiRoot + "groups/" + WorkspaceId + "/Reports/";
    }
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }

  static GetReport = async (WorkspaceId: string, ReportId: string): Promise<PowerBiReport> => {
    var restUrl: string;
    if (WorkspaceId === MyWorkspace.id) {
      restUrl = PowerBiApiRoot + "Reports/" + ReportId;
    }
    else {
      restUrl = PowerBiApiRoot + "groups/" + WorkspaceId + "/reports/" + ReportId;
    }
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then(response => { return response; });
  }

  static GetDatasets = async (WorkspaceId: string): Promise<PowerBiDataset[]> => {
    var restUrl: string;
    if (WorkspaceId === MyWorkspace.id) {
      restUrl = PowerBiApiRoot + "datasets/";
    }
    else {
      restUrl = PowerBiApiRoot + "groups/" + WorkspaceId + "/datasets/";
    }

    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then(response => { return response.value; });
  }

  static GetDataset = async (WorkspaceId: string, DatasetId: string): Promise<PowerBiDataset> => {
    var restUrl: string;
    if (WorkspaceId === MyWorkspace.id) {
      restUrl = PowerBiApiRoot + "datasets/" + DatasetId;
    }
    else {
      restUrl = PowerBiApiRoot + "groups/" + WorkspaceId + "/datasets/" + DatasetId;
    }
    return fetch(restUrl, {
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then(response => { return response; });
  }

  static ExportReport = async (WorkspaceId: string, ReportId: string, ExportRequest: PowerBiExportRequest): Promise<void> => {

    console.log("ExportReport");

    const setExportStatusMessage = ExportRequest.exportStatusCallback;

    console.log("setExportStatusMessage", setExportStatusMessage);

    let exportJob: PowerBiExportJob = await PowerBiService.StartExportReportJob(WorkspaceId, ReportId, ExportRequest);

    if (setExportStatusMessage) { setExportStatusMessage("[" + exportJob.percentComplete + "%] " + exportJob.status); }

    let waitTime = "";

    while (exportJob.status !== "Succeeded" && exportJob.status !== "Failed") {
      await new Promise(f => setTimeout(f, 1000));
      if (setExportStatusMessage) { setExportStatusMessage("[" + exportJob.percentComplete + "%] " + exportJob.status + waitTime); }
      exportJob = await PowerBiService.GetExportReportJobStatus(WorkspaceId, ReportId, exportJob.id);
      console.log(exportJob.status);
      waitTime += ".";
    }

    if (setExportStatusMessage) { setExportStatusMessage("[" + exportJob.percentComplete + "%] " + exportJob.status + waitTime); }

    await fetch(exportJob.resourceLocation, {
      method: 'GET',
      headers: { "Authorization": "Bearer " + await this.GetAccessToken() }
    }).then((res) => { return res.blob(); })
      .then((data) => {
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = exportJob.reportName + exportJob.resourceFileExtension;
        a.click();
      });

    return;

  }

  static StartExportReportJob = async (WorkspaceId: string, ReportId: string, exportRequest: PowerBiExportRequest): Promise<PowerBiExportJob> => {

   var restUrl: string;
    if (WorkspaceId === MyWorkspace.id) {
      restUrl = PowerBiApiRoot + "reports/" + ReportId + "/ExportTo";
    }
    else {
      restUrl = PowerBiApiRoot + "groups/" + WorkspaceId + "/reports/" + ReportId + "/ExportTo";
    }

    let postBody = JSON.stringify(exportRequest);

    return fetch(restUrl, {
      method: 'POST',
      body: postBody,
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then((response: PowerBiExportJob) => {
        return response;
      });
  }

  static GetExportReportJobStatus = async (WorkspaceId: string, ReportId: string, ExportId: string): Promise<PowerBiExportJob> => {

    var restUrl: string;
    if (WorkspaceId === MyWorkspace.id) {
      restUrl = PowerBiApiRoot + "reports/" + ReportId + "/exports/" + ExportId;
    }
    else {
      restUrl = PowerBiApiRoot + "groups/" + WorkspaceId + "/reports/" + ReportId + "/exports/" + ExportId;
    }

    return fetch(restUrl, {
      mode: 'cors',
      headers: {
        "Accept": "application/json;odata.metadata=minimal;",
        "Authorization": "Bearer " + await this.GetAccessToken()
      }
    }).then(response => response.json())
      .then((response: PowerBiExportJob) => {
        return response;
      });
  }


}