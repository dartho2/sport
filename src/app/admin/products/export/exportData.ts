import * as XLSX from "xlsx";

export class exportData {
  static exportToExcel(tableId: string, name?: string) {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(targetTableElm);
    console.log('ws', ws)
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}