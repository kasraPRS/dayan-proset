import { HttpBackend } from "@angular/common/http";
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";

export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    { prefix: "./assets/translate/general/", suffix: ".json" },
    { prefix: "./assets/translate/general/menu/", suffix: ".json" },
    {
      prefix: "./assets/translate/maintenance/asset/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/work-orders/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/work-request/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/salary-definition/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/activity/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/work-orders/work-log/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/repair-planning/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/production-line/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/work-center/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/level/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/group/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/failure-mode/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/team/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/part/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/emplacement-location/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/measurement/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/cost-center/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/setting/user-management/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/report/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/setting/organization/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/setting/start-code/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/checklist/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/failure-detection-method/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/failure-reason/",
      suffix: ".json",
    },
    {
      prefix: "./assets/translate/maintenance/failure-mechanism/",
      suffix: ".json",
    },
  ]);
}
