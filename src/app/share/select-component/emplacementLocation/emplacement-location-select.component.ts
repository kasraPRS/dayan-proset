import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { UserPermissions } from "../../../layouts/menu/enums/menu.enum";
import { Config, FieldType } from "../../datatable/type";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as _ from "lodash";
import {
  EmplacementLocation,
  EmplacementLocationApi,
} from "@proset/maintenance-client";

@Component({
  selector: "proset-emplacement-location-select",
  templateUrl: "./emplacement-location-select.component.html",
  styleUrls: ["./emplacement-location-select.component.less"],
})
export class EmplacementLocationSelectComponent implements OnInit, OnChanges {
  @Output() emplacementLocationChange = new EventEmitter<
    EmplacementLocation | EmplacementLocation[]
  >();
  @Input() required = false;
  @Input() disabled = false;
  @Input() multiple = false;
  @Input() value: EmplacementLocation | EmplacementLocation[];

  formGroup: FormGroup;

  emplacementLocationDtoList: EmplacementLocation[] = [];
  permission = UserPermissions;
  emplacementLocationTableConfig: Config;
  label: string;

  constructor(
    private emplacementLocationApi: EmplacementLocationApi,
    private formBuilder: FormBuilder,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes["value"]?.currentValue !== changes["value"]?.previousValue) {
      if (this.value) {
        this.formGroup.controls["emplacementLocation"].setValue(this.value);
      }
    }
  }
  ngOnInit(): void {
    this.emplacementLocationTableConfig =
      this.initEmplacementLocationDatatable();
    this.emplacementLocationApi.getAllEmplacementLocation().subscribe({
      next: (value) => {
        this.emplacementLocationDtoList = value;
      },
    });

    this.formGroup = this.formBuilder.group({
      emplacementLocation: [null],
    });
  }

  onEmplacementLocationChange(
    event: EmplacementLocation,
    selectEmplacementLocation: any,
  ): void {
    const assetField = this.formGroup.get("emplacementLocation");

    const val = this.multiple
      ? this.getUniqeSelectedList((assetField?.value || []).concat([event]))
      : event;

    assetField?.setValue(val);
    this.emplacementLocationChange.emit(val);
    selectEmplacementLocation.close();
  }

  getUniqeSelectedList(items: EmplacementLocation[]) {
    return _.uniqBy(items, (obj) => obj.uuid);
  }
  initEmplacementLocationDatatable(): Config {
    return {
      limitPerPage: 30,
      pagination: false,
      scrollbarH: false,
      text: {
        noResult: "",
      },
      id: "EmplacementLocation List",
      list: [
        {
          type: FieldType.text,
          id: "SHARE_COMPONENT_ACCOUNT_NAME",
          label: "SHARE_COMPONENT.ACCOUNT_TITLE",
          field: "name",
          minWidth: 50,
          width: 250,
          sortable: false,
        },
        {
          type: FieldType.text,
          id: "SHARE_COMPONENT_ACCOUNT_CODE",
          label: "SHARE_COMPONENT.ACCOUNT_CODE",
          field: "code",
          minWidth: 50,
          width: 120,
          sortable: false,
        },
      ],
    };
  }

  goToNewEmplacementLocation() {
    window.open("maintenance/base-info/emplacement-location/list", "_blank");
  }
}
