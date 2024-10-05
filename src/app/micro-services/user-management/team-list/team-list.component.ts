import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Team, TeamApi, UserType } from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "../../../share/datatable/type";
import { LoaderService } from "../../../share/service/loader.service";
import { ProsetDialogService } from "../../../share/service/proset-dialog.service";
import { ShareService } from "../../../share/service/share.service";
import { UserManagementService } from "../usermanagement.service";
import { Router } from "@angular/router";
import { TeamFormComponent } from "../team-form/team-form.component";
import { FORM_MODE, LIST_EVENTS } from "src/app/share/enums/enums";
import { EventService } from "src/app/share/service/event.service";
import { FormModalComponent } from "src/app/share/modal-component/form-modal/form-modal.component";

@Component({
  selector: "proset-team-list",
  templateUrl: "./team-list.component.html",
  styleUrl: "./team-list.component.less",
})
export class TeamListComponent implements OnInit {
  protected TeamFormComponent = TeamFormComponent;
  protected readonly userType = UserType;
  config: Config;
  tableRow: Team[] = [];
  userTypeList: string[] = [];
  teamTypeList: string[] = [];
  permission = UserPermissions;
  constructor(
    private shareService: ShareService,
    private translateService: TranslateService,
    private eventService: EventService<LIST_EVENTS>,
    private teamApi: TeamApi,
    private loaderService: LoaderService,
    private dialogService: ProsetDialogService,
  ) {}

  ngOnInit(): void {
    this.config = this.initTeamTable();
    this.getAllTeam();

    this.eventService.listen(LIST_EVENTS.RELOAD_LIST, () => {
      this.getAllTeam();
    });
  }

  getAllTeam() {
    this.teamApi.getAllTeam().subscribe((teamList) => {
      this.tableRow = teamList;
    });
  }

  initTeamTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Team_Table",
      list: [
        {
          type: FieldType.text,
          id: "TEAM_TABLE_CODE",
          label: "TEAM.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "TEAM_TABLE_NAME",
          label: "TEAM.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "TEAM_TABLE_PERSONS",
          label: "TEAM.TABLE.PERSONS",
          field: "personList",
          minWidth: 150,
          width: 94,
          sortable: false,
          commaSeperatedToolTipFiledName: "name",
          translator: (value) => {
            let translate = "";
            translate = this.translateService.instant("TEAM.TABLE.PERSON");
            return value.length.toString().concat(" ").concat(translate);
          },
        },
        {
          type: FieldType.text,
          id: "TEAM_TABLE_DESCRIPTION",
          label: "TEAM.TABLE.DESCRIPTION",
          field: "description",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_CREATED",
          label: "DATATABLE.CREATED",
          field: "created",
          minWidth: 50,
          width: 100,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL.CREATED_BY",
          label: "DATATABLE.CREATED_BY",
          field: "createdByName",
          minWidth: 50,
          width: 122,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED",
          field: "updated",
          minWidth: 50,
          width: 152,
          sortable: false,
          translator: (value) => {
            return value ? this.shareService.getJalaliDate(value) : "-";
          },
        },
        {
          type: FieldType.text,
          id: "GENERAL_UPDATED",
          label: "DATATABLE.UPDATED_BY",
          field: "updatedByName",
          minWidth: 50,
          width: 142,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-edit-2",
          label: "DATATABLE.EDIT",
          tooltip: "DATATABLE.EDIT",
          action: (row): void => this.openTeamForm(row, true),
          permission: [this.permission.TEAM_UPDATE],
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          label: "DATATABLE.DELETE",
          tooltip: "DATATABLE.DELETE",
          action: (row): void => this.deleteTeam(row),
          permission: [this.permission.TEAM_DELETE],
        },
      ],
    };
  }

  openTeamForm(row: Team, editMode: boolean): void {
    this.dialogService
      .showWithFormComponent(FormModalComponent, {
        referenceContent: TeamFormComponent,
        title: "TEAM.TITLE",
        data: {
          viewType: editMode ? FORM_MODE.UPDATE : FORM_MODE.VIEW,
          ...row,
        },
      })
      .afterClosed()
      .subscribe(() => {});
  }

  deleteTeam(row: Team) {
    this.dialogService
      .showConfirm({
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        if (value) {
          this.teamApi
            .deleteTeamById(row.id!)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe(() => this.getAllTeam());
        }
      });
  }

  showFormInViewMode(row: Team): void {
    this.openTeamForm(row, false);
  }
}
