import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  Inject,
  Input,
  Optional,
  Output,
  SkipSelf,
  ViewChild,
} from "@angular/core";
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import * as moment_ from "jalali-moment";
import { PersianDateFormats } from "./datepickerAdapter/date-fns-formats";

const moment = moment_;
export type Moment = moment_.Moment;

@Component({
  selector: "proset-datepicker",
  templateUrl: "./proset-datepicker.component.html",
  styleUrls: ["./proset-datepicker.component.less"],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useClass: PersianDateFormats,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProsetDatepickerComponent),
      multi: true,
    },
  ],
})
export class ProsetDatepickerComponent
  implements ControlValueAccessor, AfterViewInit
{
  @ViewChild("picker") private picker: MatDatepicker<Date>;

  //TODO: this type must be Date.
  @Output() dateChange = new EventEmitter<any>();

  //TODO: implement today date button
  @Input() uiTodayBtnEnable = false;
  @Input() dateInitValue = false;
  @Input() disabled: boolean;

  @Input() label = "";
  @Input() placeholder = "";

  date = new FormControl();
  time = {};

  //TODO: implement sale mali
  _max: Date | null;
  @Input()
  get max(): Date | null {
    return this._max ? this._max : null;
  }

  set max(max: Date | null) {
    if (max) {
      const momentDate = moment(max);
      this._max = momentDate.isValid() ? momentDate.toDate() : null;
    } else this._max = null;
  }

  _min: Date | null;
  @Input()
  get min(): Date | null {
    return this._min ? this._min : null;
  }

  set min(min: Date | null) {
    if (min) {
      const momentDate = moment(min);
      this._min = momentDate.isValid() ? momentDate.toDate() : null;
    } else this._min = null;
  }

  @Input() touchUi = false;

  @Input() public formControlName: string;

  dateFormat = "YYYY-MM-DD";
  dateTimeFormat = "YYYY-MM-DDTHH:mm:ss";

  public constructor(
    @Optional()
    @Host()
    @SkipSelf()
    protected parentFormContainer: ControlContainer,
    public elementRef: ElementRef,
    @Inject(MAT_DATE_FORMATS) public matDateFormat: PersianDateFormats,
  ) {}

  ngAfterViewInit(): void {
    if (this.showTime) {
      const nowTime = moment();
      this.setTime(nowTime);
    }

    if (this.dateInitValue) {
      this.enFormatTransform(moment(new Date()).set(this.time));
    }
  }

  _showTime = false;
  @Input()
  set showTime(show: boolean) {
    this._showTime = show;
    this.matDateFormat.setTimeFormat(show);
  }

  get showTime() {
    return this._showTime;
  }

  setTime(date: any) {
    const momentTime = moment(date).locale("fa");
    this.time = {
      hour: momentTime.hour(),
      minute: momentTime.minute(),
      second: momentTime.second(),
    };
  }

  onChange = (date?: any) => {};

  onTouched = () => {};

  _takeFocusAway = (datepicker: MatDatepicker<Moment>) => {};

  writeValue(date: any): void {
    this.date.setValue(date);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.date[disabled ? "disable" : "enable"]();
  }

  dateChangeHandler(chosenDate?: Moment) {
    this.showTime && chosenDate?.set(this.time as moment_.MomentSetObject);
    this.enFormatTransform(chosenDate);
  }

  openDatepicker(datepicker: MatDatepicker<Moment>) {
    if (!datepicker.opened) {
      datepicker.open();
    }
  }

  private enFormatTransform(val: any) {
    const momDate = moment(val);
    if (!val || !momDate.isValid) {
      this.onChange(undefined);
      this.dateChange.emit(undefined);
    } else {
      if (this.showTime) {
        momDate.set(this.time);
      }

      this.date.setValue(momDate.toDate());

      const fDate = momDate
        .locale("en")
        .format(this.showTime ? this.dateTimeFormat : this.dateFormat);

      this.onChange(fDate);
      this.dateChange.emit(momDate);
    }
  }

  removeKeyDown(event: KeyboardEvent) {
    if (
      event.which === 8 ||
      event.keyCode === 8 ||
      event.key.toLowerCase() == "backspace"
    ) {
      this.date.reset(null);
      this.onChange(null);
      this.dateChange.emit(null);
      return;
    }
    event.preventDefault();
  }
}
