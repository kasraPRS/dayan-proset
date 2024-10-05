import { Directive } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive()
export abstract class BaseReactive {
  private _destroy$?: Subject<void>;

  protected takeUntilDestroy = <T>() => {
    if (!this._destroy$) {
      this._destroy$ = new Subject<void>();
    }
    return takeUntil<T>(this._destroy$);
  };

  ngOnDestroy(): void {
    if (this._destroy$) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }
}
``;
