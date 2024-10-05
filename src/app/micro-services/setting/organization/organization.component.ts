import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Organization, OrganizationApi } from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { LoaderService } from "src/app/share/service/loader.service";

@Component({
  selector: "proset-organization-form",
  templateUrl: "./organization.component.html",
  styleUrl: "./organization.component.less",
})
export class OrganizationFormComponent implements OnInit {
  form: FormGroup;

  organizationDto: Organization = {};
  permission = UserPermissions;

  constructor(
    private loaderService: LoaderService,
    private organizationApi: OrganizationApi,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getOrganizationView();

    this.form.valueChanges.subscribe((value) => {
      this.organizationDto = {
        ...this.organizationDto,
        ...value,
      };
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: [null],
      industry: [null],
      nationalId: [null],
      phone: [null],
      postalCode: [null],
      address: [null],
    });
  }

  getOrganizationView() {
    this.loaderService.setLoading(true);
    this.organizationApi
      .getOrganization()
      .pipe(
        finalize(() => {
          this.loaderService.setLoading(false);
        }),
      )
      .subscribe((res: any) => {
        this.organizationDto = res;
        this.form.patchValue(res, { emitEvent: false });
      });
  }

  public saveOrganization() {
    this.loaderService.setLoading(true);
    if (this.organizationDto.id)
      this.organizationApi
        .updateOrganization(this.organizationDto.id, this.organizationDto)
        .pipe(
          finalize(() => {
            this.loaderService.setLoading(false);
          }),
        )
        .subscribe({
          next: (res) => {
            this.organizationDto = res;
          },
        });
    else
      this.organizationApi
        .createOrganization(this.organizationDto)
        .pipe(
          finalize(() => {
            this.loaderService.setLoading(false);
          }),
        )
        .subscribe({
          next: (res) => {
            this.organizationDto = res;
          },
        });
  }
}
