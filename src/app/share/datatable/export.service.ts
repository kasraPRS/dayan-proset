import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { Config } from "./type";
import { TranslateService } from "@ngx-translate/core";
import { ShareService } from "../service/share.service";

const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

@Injectable({
  providedIn: "root",
})
export class ExportService {
  constructor(
    private shareService: ShareService,
    private translateService: TranslateService,
  ) {}

  exportToExcel(excelFileName: string, rows: any[], config: Config) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    const workbook: XLSX.WorkBook = {
      Sheets: { sheet1: worksheet },
      SheetNames: ["sheet1"],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, baseFileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const today = this.shareService.getJalaliDate(new Date());
    FileSaver.saveAs(data, baseFileName + "_" + today + EXCEL_EXTENSION);
  }
}
