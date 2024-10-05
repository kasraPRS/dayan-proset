import { HttpContext } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  Person,
  PersonApi,
  PersonRequest,
  PersonResponse,
  PersonType,
  UserType,
} from "@proset/maintenance-client";
import * as _ from "lodash";
import { finalize } from "rxjs";
import { SHOW_TOAST } from "src/app/interceptors/exception.interceptor";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { LoaderService } from "../../../share/service/loader.service";
import { ProsetDialogService } from "../../../share/service/proset-dialog.service";
import { UserManagementService } from "../usermanagement.service";
import { FORM_MODE } from "src/app/share/enums/enums";
import { PhoneNumberValidatorDirective } from "src/app/share/validation/directives/phone-number-validator.directive";

@Component({
  selector: "proset-person",
  templateUrl: "./person.component.html",
  styleUrl: "./person.component.less",
})
export class PersonComponent implements OnInit {
  @Input() id: number;
  @Input() viewType: FORM_MODE = FORM_MODE.CREATE;
  viewMode = false;
  userTypeList: string[] = [];
  personTypeList: string[] = [];
  personFormGroup: FormGroup;
  person: Person = {};
  personRequest: PersonRequest = {};
  protected readonly UserType = UserType;
  protected readonly PersonType = PersonType;

  permission = UserPermissions;

  constructor(
    private formBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private dialogService: ProsetDialogService,
    private personApi: PersonApi,
    private router: Router,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.initPerson();
    } else {
      this.generateCode();
      this.userManagementService.permissionList.next([]);
      this.userManagementService.wageList.next([]);
    }
    this.viewMode = this.viewType == FORM_MODE.VIEW;
    this.personRequest.permissionList = [];
    this.personRequest.wageList = [];
    this.person.personType = PersonType.NATURAL;
    this.person.userType = UserType.STAFF;
    this.createForm();
    this.userTypeList = Object.keys(UserType);
    this.personTypeList = Object.keys(PersonType);
    this.updateStaffValueAndValidity();

    this.userManagementService.permissionList.subscribe((value) => {
      this.personRequest.permissionList = value.map((p: number) => {
        return {
          id: p,
        };
      });
    });

    this.userManagementService.wageList.subscribe((value) => {
      this.personRequest.wageList = value;
    });
  }

  initPerson() {
    this.loaderService.setLoading(true);
    this.personApi
      .getPersonById(this.id)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((response: PersonResponse) => {
        if (response) {
          this.person = response;
          this.personFormGroup.patchValue(this.person);
          let permissionIds = _.map(
            response.permissionList,
            (permission: any) => permission.id!,
          );
          if (permissionIds.length)
            this.userManagementService.permissionList.next(permissionIds);
          if (response.wageList?.length)
            this.userManagementService.wageList.next(response.wageList);
        }
      });
  }
  generateCode() {
    this.loaderService.setLoading(true);
    this.personApi
      .generatePersonCode("body", false, {
        context: new HttpContext().set(SHOW_TOAST, false),
      })
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe((value) => {
        this.personFormGroup.controls["code"].setValue(value.code);
        this.personFormGroup.controls["code"].updateValueAndValidity();
      });
  }

  createForm() {
    this.personFormGroup = this.formBuilder.group({
      userType: [null, Validators.required],
      personType: [],
      nationalId: [],
      firstname: [],
      lastname: [],
      name: [],
      tell: [],
      mobile: [null],
      agentName: [],
      code: [{ value: null, disabled: true }, Validators.required],
      email: [null, Validators.email],
      username: [],
      postalCode: [],
      password: [],
      address: [],
    });
  }

  resetForm() {
    this.personFormGroup.reset();
    this.userManagementService.wageList.next([]);
  }

  onUserTypeChange(event: UserType) {
    this.clearValueAndValidity();
    this.person.personType = PersonType.NATURAL;
    this.person.userType = event;
    if (event === UserType.STAFF) {
      this.personFormGroup.controls["personType"].clearValidators();
      this.updateStaffValueAndValidity();
    } else {
      this.personFormGroup.controls["personType"].setValidators(
        Validators.required,
      );
    }
    this.personFormGroup.updateValueAndValidity();
    this.onPersonTypeChange(PersonType.NATURAL);
  }

  onPersonTypeChange(event: PersonType) {
    this.clearValueAndValidity();
    this.person.personType = event;
    const data = this.personFormGroup.getRawValue();
    this.personFormGroup.reset({
      userType: data.userType,
      personType: event,
      code: data.code,
    });
    if (event === PersonType.LEGAL) {
      this.personFormGroup.controls["name"].setValidators(Validators.required);
      this.personFormGroup.controls["name"].updateValueAndValidity();
    }

    if (event === PersonType.NATURAL) {
      this.personFormGroup.controls["firstname"].setValidators(
        Validators.required,
      );
      this.personFormGroup.controls["lastname"].setValidators(
        Validators.required,
      );
      this.personFormGroup.controls["mobile"].setValidators([
        Validators.required,
        PhoneNumberValidatorDirective.getInstance().validate,
      ]);
      this.personFormGroup.controls["firstname"].updateValueAndValidity();
      this.personFormGroup.controls["lastname"].updateValueAndValidity();
      this.personFormGroup.controls["mobile"].updateValueAndValidity();
    }
  }

  updateStaffValueAndValidity() {
    this.personFormGroup.controls["firstname"].setValidators(
      Validators.required,
    );
    this.personFormGroup.controls["lastname"].setValidators(
      Validators.required,
    );
    if (!this.id) {
      this.personFormGroup.controls["username"].setValidators(
        Validators.required,
      );
      this.personFormGroup.controls["password"].setValidators(
        Validators.required,
      );
    } else {
      this.personFormGroup.controls["username"].disable();
      this.personFormGroup.controls["password"].disable();
    }
    this.personFormGroup.controls["mobile"].setValidators(Validators.required);

    this.updateValueAndValidity();
  }

  clearValueAndValidity() {
    this.personFormGroup.controls["firstname"].clearValidators();
    this.personFormGroup.controls["lastname"].clearValidators();
    this.personFormGroup.controls["name"].clearValidators();
    this.personFormGroup.controls["mobile"].clearValidators();
    this.personFormGroup.controls["username"].clearValidators();
    this.personFormGroup.controls["password"].clearValidators();

    this.updateValueAndValidity();
  }

  updateValueAndValidity() {
    this.personFormGroup.controls["firstname"].updateValueAndValidity();
    this.personFormGroup.controls["lastname"].updateValueAndValidity();
    this.personFormGroup.controls["name"].updateValueAndValidity();
    this.personFormGroup.controls["username"].updateValueAndValidity();
    this.personFormGroup.controls["password"].updateValueAndValidity();
    this.personFormGroup.controls["mobile"].updateValueAndValidity();
  }

  onSave() {
    if (
      this.personRequest.personMainInfo?.userType === UserType.STAFF &&
      !this.personRequest.permissionList?.length
    ) {
      this.dialogService.showInfo({
        contentMessage: "MESSAGES.ENTER_ALL_PERMISSION",
      });
    } else {
      this.loaderService.setLoading(true);
      this.personRequest.personMainInfo = {
        ...this.personFormGroup.getRawValue(),
        personType: this.person.personType,
      };

      this.personRequest.permissionList = _.filter(
        this.personRequest.permissionList,
        (obj) => {
          return _.every(obj, (value) => value !== null);
        },
      );

      this.personRequest.permissionList =
        this.personRequest.permissionList?.length &&
        this.person.userType == UserType.STAFF
          ? this.personRequest.permissionList
          : (null as any);

      this.personRequest.wageList = _.filter(
        this.personRequest.wageList,
        (obj) => {
          return _.every(obj, (value) => value !== null);
        },
      );

      this.personRequest.wageList =
        this.person.userType == UserType.STAFF
          ? this.personRequest.wageList
          : (null as any);

      if (this.id) {
        this.personApi
          .updatePersonById(this.id, this.personRequest)
          .pipe(finalize(() => this.loaderService.setLoading(false)))
          .subscribe((value) => {
            this.resetForm();
            this.userManagementService.activeTab.next(0);
            this.personApi.getAllPerson().subscribe((personList) => {
              this.userManagementService.personList.next(personList);
            });
            this.router.navigate(["setting/user-management/person"]);
          });
      } else {
        this.personApi
          .createPerson(this.personRequest)
          .pipe(finalize(() => this.loaderService.setLoading(false)))
          .subscribe((value) => {
            this.resetForm();
            this.userManagementService.activeTab.next(0);
            this.personApi.getAllPerson().subscribe((personList) => {
              this.userManagementService.personList.next(personList);
            });
            this.router.navigate(["setting/user-management/person"]);
          });
      }
    }
  }

  returnToList() {
    this.dialogService
      .showConfirm({
        title: "MESSAGES.BACK_TO_LIST_TITLE",
        contentMessage: "MESSAGES.BACK_TO_LIST",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.router.navigate(["setting/user-management/person"]);
        }
      });
  }
}
