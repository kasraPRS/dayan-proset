import {
  HttpBackend,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgSelectModule } from "@ng-select/ng-select";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { BASE_PATH as maintenance } from "@proset/maintenance-client";
import { FilePickerModule } from "ngx-awesome-uploader";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ShareModule } from "./share/share.module";
import { HttpLoaderFactory } from "./translate-http-loader-factory";

import { HighchartsChartModule } from "highcharts-angular";
import { NgxPrintModule } from "ngx-print";
import { environment } from "../environments/environment";
import { AuthenticationModule } from "./authenticatation/authentication.module";
import { authenticationInterceptor } from "./interceptors/authentication.interceptor";
import { exceptionInterceptor } from "./interceptors/exception.interceptor";
import { LayoutsModule } from "./layouts/layouts.module";
import { HomeModule } from "./micro-services/home/home.module";
import { ProsetMaintenanceModule } from "./micro-services/maintenance/proset-maintenance.module";
import { UserManagementModule } from "./micro-services/user-management/userManagement.module";
import { SettingModule } from "./micro-services/setting/setting.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    HomeModule,
    AccordionModule,
    BrowserModule,
    AppRoutingModule,
    FilePickerModule,
    HttpClientModule,
    ShareModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    AccordionModule,
    HighchartsChartModule,
    LayoutsModule,
    NgxPrintModule,
    ProsetMaintenanceModule,
    AuthenticationModule,
    SettingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(
      withInterceptors([exceptionInterceptor, authenticationInterceptor]),
    ),
    { provide: maintenance, useValue: environment.MAINTENANCE_SERVICE },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
