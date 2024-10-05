import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { NgForOf, NgIf } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { PersonSelectComponent } from "../select-component/person/person-select.component";
import { ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "../share.module";
import { TranslateModule } from "@ngx-translate/core";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from "@angular/material/card";
import { ProsetJalaliDatetimePipe } from "../jalalidate/proset.jalali.datetime.pipe";
import { Event, EventApi } from "@proset/maintenance-client";
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
} from "@angular/material/dialog";
import { LoaderService } from "../service/loader.service";
import { finalize } from "rxjs";

@Component({
  selector: "proset-event",
  standalone: true,
  imports: [
    AccordionModule,
    NgForOf,
    NgIf,
    NgSelectModule,
    PersonSelectComponent,
    ReactiveFormsModule,
    ShareModule,
    TranslateModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCardTitleGroup,
    ProsetJalaliDatetimePipe,
    MatDialogContent,
    MatCardActions,
    MatDialogActions,
    MatDialogModule,
  ],
  templateUrl: "./event.component.html",
  styleUrl: "./event.component.less",
})
export class EventComponent {
  _entityUuid: string;
  @ViewChild("dialogTemplate") dialogTemplate: TemplateRef<any>;
  @Input() titleOfHistory: string;
  set entityUuid(entityUuid: string) {
    this._entityUuid = entityUuid;
  }

  @Input({ required: true })
  get entityUuid() {
    return this._entityUuid;
  }

  eventDtoList: Event[];

  constructor(
    private eventApi: EventApi,
    private _dialogService: MatDialog,
    private _loaderService: LoaderService,
  ) {}

  openEventCart() {
    this.getEventByEntityUuid();
  }

  getEventByEntityUuid() {
    this._loaderService.setLoading(true);
    this.eventApi
      .getEventByEntityUuid(this.entityUuid)
      .pipe(finalize(() => this._loaderService.setLoading(false)))
      .subscribe((response) => {
        if (response) {
          this.eventDtoList = response;
          this._dialogService.open(this.dialogTemplate);
        }
      });
  }
}
