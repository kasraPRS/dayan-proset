import { NgModule } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { MaterialPersianDateAdapter } from "./date-fns-adapter";

@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "fa-IR" },
    {
      provide: DateAdapter,
      useClass: MaterialPersianDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class DateFnsModule {}

@NgModule({
  imports: [DateFnsModule],
})
export class NgxMatDateFnsModule {}
