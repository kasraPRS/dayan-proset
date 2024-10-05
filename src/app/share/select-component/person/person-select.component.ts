import { NgIf } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from "@angular/material/card";
import { Router } from "@angular/router";
import {
  NgSelectComponent,
  NgSelectConfig,
  NgSelectModule,
} from "@ng-select/ng-select";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Person, PersonApi, UserType } from "@proset/maintenance-client";
import { UserPermissions } from "../../../layouts/menu/enums/menu.enum";
import { ProsetPermissionDirective } from "../../security/proset-permission.directive";

@Component({
  selector: "proset-person-select",
  standalone: true,
  imports: [
    NgIf,
    NgSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardTitleGroup,
    FormsModule,
    ProsetPermissionDirective,
  ],
  templateUrl: "./person-select.component.html",
  styleUrl: "./person-select.component.less",
})
export class PersonSelectComponent implements OnInit {
  @ViewChild("personSelect", { static: false })
  personSelect: NgSelectComponent;
  @Output() personChange = new EventEmitter<Person>();
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input({ required: true }) userType: UserType;

  private _value: Person | Person[];
  @Input() get value(): Person | Person[] {
    return this._value;
  }

  set value(person: Person | Person[]) {
    this.person = person;
    this._value = person;
  }

  permission = UserPermissions;
  personDtoList: Person[] = [];
  person: Person | Person[];

  constructor(
    private personApi: PersonApi,
    private config: NgSelectConfig,
    private translateService: TranslateService,
    private router: Router,
  ) {
    this.config.notFoundText = this.translateService.instant(
      "GENERAL.NOT_FOUND_MESSAGE",
    );
  }

  ngOnInit(): void {
    this.getPersonInfo();
  }

  getPersonInfo(): void {
    switch (this.userType) {
      case UserType.CONTRACTOR: {
        this.personApi
          .getAllPersonByUserType(UserType.CONTRACTOR)
          .subscribe((response) => {
            this.personDtoList = response;
          });
        break;
      }
      case UserType.STAFF: {
        this.personApi
          .getAllPersonByUserType(UserType.STAFF)
          .subscribe((response) => {
            this.personDtoList = response;
          });
        break;
      }
      case UserType.SUPPLIER: {
        this.personApi
          .getAllPersonByUserType(UserType.SUPPLIER)
          .subscribe((response) => {
            this.personDtoList = response;
          });
        break;
      }
    }
  }

  onPersonChange(event: Person): void {
    this.person = event;
    this.personChange.emit(event);
  }

  onOpenPersonWindow(): void {
    window.open("setting/user-management/person/form", "_blank");
  }

  onPersonSearch(item: any) {
    const searchKey = item.target.value;
    this.personSelect.filter(searchKey);
  }

  searchPerson(searchTerm: string, item: Person) {
    return item.name?.includes(searchTerm) || item.id?.toString() == searchTerm;
  }
}
