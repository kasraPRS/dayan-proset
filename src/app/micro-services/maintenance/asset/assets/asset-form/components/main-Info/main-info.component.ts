import { HttpContext } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgSelectComponent } from "@ng-select/ng-select";
import {
  Asset,
  AssetApi,
  AssetPriority,
  AssetStatus,
  CodeGeneratorApi,
  GeneratorEntityType,
  Group,
  GroupApi,
  Level,
  LevelApi,
} from "@proset/maintenance-client";
import { finalize } from "rxjs";
import { SHOW_TOAST } from "src/app/interceptors/exception.interceptor";
import { UserPermissions } from "src/app/layouts/menu/enums/menu.enum";
import { formatNumberWithLeadingZero } from "src/app/share/helper/date-utility";
import { LoaderService } from "src/app/share/service/loader.service";
import { AssetStateService } from "../../asset.state.service";

@Component({
  selector: "proset-asset-main-info",
  templateUrl: "./main-info.component.html",
  styleUrl: "./main-info.component.less",
})
export class AssetMainInfoComponent implements OnInit {
  permissions = UserPermissions;
  form: FormGroup;
  levels: Level[];
  groups: Group[];
  statusList: string[] = Object.keys(AssetStatus);
  priorityList: string[] = Object.keys(AssetPriority);
  isLoading: boolean = true;
  inUsedChecked: boolean = false;
  isInUsed: boolean = false;
  editCode: string;

  constructor(
    private levelApi: LevelApi,
    private groupApi: GroupApi,
    private assetApi: AssetApi,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private codeGeneratorService: CodeGeneratorApi,
    private assetStateService: AssetStateService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadDatas();
    this.initValueChanges();

    this.assetStateService.assetDto$.subscribe((assetDto: any) => {
      this.onChangeDto(assetDto);
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [null],
      level: [null, Validators.required],
      group: [null, Validators.required],
      emplacementLocation: [null, Validators.required],
      utilizationDate: [null, Validators.required],
      name: [null, Validators.required],
      code: ["", Validators.required],
      priority: [null, Validators.required],
      status: [null, Validators.required],
      dailyUsageDurationHour: [null, Validators.max(23)],
      dailyUsageDurationMinute: [null, Validators.max(59)],
      description: [null],
      parent: [null],
    });

    this.assetStateService.registerForm(this.form, "AssetMainInfo");
  }

  onChangeDto(assetDto: Asset) {
    if (!this.editCode && assetDto.code) {
      this.editCode = assetDto.code;

      assetDto.level = assetDto.group?.level;
      if (assetDto.level?.id) this.getGroups(assetDto.level?.id);

      if (
        !this.inUsedChecked &&
        assetDto.id &&
        !this.assetStateService.getViewMode()
      ) {
        this.inUsedChecked = true;
        this.checkInUsed(assetDto.id);
      }
    }

    this.form.patchValue(assetDto, { emitEvent: false });

    this.handleDailyUsageDuration();
    this.setDisables();
  }

  private initValueChanges() {
    this.form.get("code")?.valueChanges.subscribe((code) => {
      if (code != this.editCode) if (code) this.checkCode(code);
    });

    this.form.get("level")?.valueChanges.subscribe((level) => {
      this.form.get("group")?.reset(null);
      this.setDisables();
      this.getGroups(level?.id);
    });

    this.form.get("dailyUsageDurationHour")?.valueChanges.subscribe((val) => {
      if (val) {
        this.handleDailyUsageDuration();
      }
    });

    this.form.get("dailyUsageDurationMinute")?.valueChanges.subscribe((val) => {
      if (val) {
        this.handleDailyUsageDuration();
      }
    });

    this.form.get("parent")?.valueChanges.subscribe((val) => {
      const levelCtrl = this.form.get("level");
      const groupCtrl = this.form.get("group");
      if (val) {
        levelCtrl?.reset(
          {
            id: val.levelId,
            name: val.levelName,
          },
          {
            emitEvent: false,
          },
        );
        groupCtrl?.reset(
          {
            id: val.groupId,
            name: val.groupName,
          },
          {
            emitEvent: false,
          },
        );

        levelCtrl?.disable({ emitEvent: false });
        groupCtrl?.disable({ emitEvent: false });
      } else {
        levelCtrl?.enable({ emitEvent: false });
        groupCtrl?.enable({ emitEvent: false });

        this.form.get("level")?.reset(null);
        this.form.get("group")?.reset(null);
      }
    });
  }

  handleDailyUsageDuration() {
    const dailyUsageDurationHour = this.form.get("dailyUsageDurationHour")
      ?.value;
    const dailyUsageDurationMinute = this.form.get("dailyUsageDurationMinute")
      ?.value;
    if (dailyUsageDurationHour)
      this.form
        .get("dailyUsageDurationHour")
        ?.setValue(formatNumberWithLeadingZero(dailyUsageDurationHour), {
          emitEvent: false,
        });

    if (dailyUsageDurationMinute)
      this.form
        .get("dailyUsageDurationMinute")
        ?.setValue(formatNumberWithLeadingZero(dailyUsageDurationMinute), {
          emitEvent: false,
        });
  }

  setDisables() {
    if (!this.isInUsed) {
      if (this.form.get("level")?.value) this.form.get("group")?.enable();
      else this.form.get("group")?.disable();
    }

    if (this.form.get("parent")?.value) {
      this.form.get("level")?.disable({ emitEvent: false });
      this.form.get("group")?.disable({ emitEvent: false });
    }
  }

  getGroups(levelId: number) {
    this.groupApi.getAllGroupByLevelId(levelId).subscribe((res) => {
      this.groups = res;
    });
  }

  checkCode(code: any): void {
    const codeControl = this.form.get("code");
    this.loaderService.setLoading(true);
    this.codeGeneratorService
      .checkCode(code, GeneratorEntityType.ASSET)
      .pipe(finalize(() => this.loaderService.setLoading(false)))
      .subscribe({
        next: () => {
          codeControl?.setErrors(null);
        },
        error: (error) => {
          if (error.status && error.status === 406) {
            this.form.controls["code"].setErrors({ isDuplicate: true });
          } else {
            codeControl?.setErrors(null);
          }
        },
      });
  }

  loadDatas() {
    this.levelApi.getAllLevel().subscribe((res) => {
      this.levels = res;
    });
  }

  onSearch(event: any, select: NgSelectComponent) {
    const searchTerm = event.target.value;
    select.filter(searchTerm);
  }

  onNewLevel() {
    window.open("maintenance/base-info/level/list", "_blank");
  }

  onNewGroup() {
    window.open("maintenance/base-info/group/list", "_blank");
  }

  onNewEmplacementLocation() {
    window.open("maintenance/emplacement-location", "_blank");
  }

  checkInUsed(id: number) {
    if (id) {
      const fields = [
        "code",
        "level",
        "group",
        "emplacementLocation",
        "utilizationDate",
      ];

      const asset = this.assetStateService.getAsset();
      if (asset.parent) {
        fields.push("parent");
      }

      this.loaderService.setLoading(true);
      this.assetApi
        .checkAssetIsInUsed(id, "body", false, {
          context: new HttpContext().set(SHOW_TOAST, false),
        })
        .pipe(finalize(() => this.loaderService.setLoading(false)))
        .subscribe({
          error: (error) => {
            if (error.status && error.status === 406) {
              this.isInUsed = true;
              fields.forEach((field) => {
                this.form.get(field)?.disable({ emitEvent: false });
              });
            }
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.assetStateService.unregisterForm("AssetMainInfo");
  }

  get assetInformation(): any {
    return this.form.get("")?.value || {};
  }
}
