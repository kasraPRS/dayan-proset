import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {
  Person,
  PersonApi,
  PersonType,
  UserType,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { Config, FieldType } from "../../../share/datatable/type";
import { LoaderService } from "../../../share/service/loader.service";
import { ProsetDialogService } from "../../../share/service/proset-dialog.service";
import { ShareService } from "../../../share/service/share.service";
import { UserManagementService } from "../usermanagement.service";
import { Router } from "@angular/router";

@Component({
  selector: "proset-person-list",
  templateUrl: "./person-list.component.html",
  styleUrl: "./person-list.component.less",
})
export class PersonListComponent implements OnInit {
  config: Config;
  filterNumber: number;
  tableRow: Person[] = [];
  filterForm: FormGroup;
  userTypeList: string[] = [];
  personTypeList: string[] = [];

  permission = UserPermissions;
  constructor(
    private shareService: ShareService,
    private translateService: TranslateService,
    private userManagementService: UserManagementService,
    private personApi: PersonApi,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private dialogService: ProsetDialogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.config = this.initPersonTable();
    this.userManagementService.personList.subscribe((value) => {
      this.tableRow = [...value];
    });

    this.getAllPerson();
    this.createFilterForm();
    this.userTypeList = Object.keys(UserType);
    this.personTypeList = Object.keys(PersonType);
  }

  getAllPerson() {
    this.personApi.getAllPerson().subscribe((personList) => {
      this.userManagementService.personList.next(personList);
      this.tableRow = personList;
    });
  }
  createFilterForm() {
    this.filterForm = this.formBuilder.group({
      userType: [],
      personType: [],
      fromCode: [],
      toCode: [],
      name: [],
      firstname: [],
      lastname: [],
      username: [],
    });
  }
  onFilterForm(event: any) {}
  onUserTypeChange(event: UserType) {}
  onPersonTypeChange(event: UserType) {}
  initPersonTable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "Person_Table",
      list: [
        {
          type: FieldType.text,
          id: "PERSON_TABLE_USER_TYPE",
          label: "PERSON.TABLE.USER_TYPE",
          field: "userType",
          minWidth: 50,
          width: 113,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("PERSON.USER_TYPE." + value)
              : " - ";
          },
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_NUMBER_PLATE",
          label: "PERSON.TABLE.PERSON_TYPE",
          field: "personType",
          minWidth: 50,
          width: 110,
          sortable: false,
          translator: (value) => {
            return value
              ? this.translateService.instant("PERSON.PERSON_TYPE." + value)
              : " - ";
          },
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_NAME",
          label: "PERSON.TABLE.NAME",
          field: "name",
          minWidth: 50,
          width: 300,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.FIRST_NAME",
          field: "firstname",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.LAST_NAME",
          field: "lastname",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.CODE",
          field: "code",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.USER_NAME",
          field: "username",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.NATIONAL_CODE",
          field: "nationalCode",
          minWidth: 150,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.MOBILE",
          field: "mobile",
          minWidth: 100,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.TELL",
          field: "tell",
          minWidth: 100,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.EMAIL",
          field: "email",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.POSTAL_CODE",
          field: "postalCode",
          minWidth: 50,
          width: 94,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "ACTIVITY_TABLE_CODE",
          label: "PERSON.TABLE.ADDRESS",
          field: "address",
          minWidth: 300,
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
        {
          type: FieldType.status,
          id: "GENERAL_UPDATED",
          label: "PERSON.TABLE.IS_ACTIVE",
          field: "isActive",
          minWidth: 50,
          width: 142,
          sortable: false,
        },
      ],
      actions: [
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-edit-2",
          tooltip: "DATATABLE.EDIT",
          action: (row): void => this.updatePerson(row),
          label: "DATATABLE.EDIT",
          permission: [this.permission.USER_MANAGEMENT_UPDATE],
        },
        {
          id: "DATATABLE_EDIT",
          icon: "isax isax-trash",
          tooltip: "DATATABLE.DELETE",
          label: "DATATABLE.DELETE",
          action: (row): void => this.deletePerson(row),
          permission: [this.permission.USER_MANAGEMENT_DELETE],
        },
      ],
    };
  }

  updatePerson(row: Person) {
    this.router.navigate(["setting/user-management/person/update", row.id]);
  }

  deletePerson(row: Person) {
    this.dialogService
      .showConfirm({
        contentMessage: "MESSAGES.DELETE_CONFIRM",
      })
      .afterClosed()
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        if (value) {
          this.personApi
            .deletePerson(row.id!)
            .pipe(finalize(() => this.loaderService.setLoading(false)))
            .subscribe(() => this.getAllPerson());
        }
      });
  }

  showFormInViewMode(row: Person): void {
    this.router.navigate(["setting/user-management/person/view", row.id]);
  }

  protected readonly userType = UserType;
}
