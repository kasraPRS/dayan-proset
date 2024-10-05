export interface IDateParse {
  dateInput: string;
}
export type DateDisplay = IDateParse & {
  monthYearLabel?: string;
  dateA11yLabel?: string;
  monthYearA11yLabel?: string;
};
export class PersianDateFormats {
  private _parse: IDateParse = {
    dateInput: "jYYYY/jMM/jDD",
  };
  private _display: DateDisplay = {
    dateInput: "jYYYY/jMM/jDD",
    monthYearLabel: "jYYYY jMMMM",
    dateA11yLabel: "jYYYY/jMM/jDD",
    monthYearA11yLabel: "jYYYY jMMMM",
  };

  set parse(parse: IDateParse) {
    this._parse = Object.assign({}, this._parse, parse);
  }

  get parse(): IDateParse {
    return this._parse;
  }

  set display(display: DateDisplay) {
    this._display = Object.assign({}, this._display, display);
  }

  get display(): DateDisplay {
    return this._display;
  }

  updateDateFormat(parse: IDateParse, display?: DateDisplay): any {
    this.parse = parse;
    if (!display) {
      display = parse;
    }
    this.display = display;
  }

  setTimeFormat(show: boolean) {
    this.display.dateInput = show ? "jYYYY/jMM/jDD HH:mm" : "jYYYY/jMM/jDD";
    this.parse.dateInput = show ? "jYYYY/jMM/jDD HH:mm" : "jYYYY/jMM/jDD";
  }
}
