import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class EventService<T> implements OnDestroy {
  private subject = new Subject();

  emit(eventName: T, payload?: any) {
    this.subject.next({ eventName, payload });
  }

  listen(eventName: T, callback: (event: any) => void) {
    this.subject.asObservable().subscribe((nextObj: any) => {
      if (eventName === nextObj.eventName) {
        callback(nextObj.payload);
      }
    });
  }

  ngOnDestroy(): void {
    this.subject.unsubscribe();
  }
}
