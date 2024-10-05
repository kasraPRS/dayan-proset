import { EventEmitter, Injectable } from "@angular/core";
import {
  KanbanCardFieldType,
  KanbanCardSortOrderType,
  KanbanCardSortType,
  KanbanConfig,
} from "../types/type";
import { Observable, Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class KanbanConfigService {
  private readonly localStorageKey = "kanbanConfig";
  private configSubject = new Subject<KanbanConfig>();

  constructor() {}

  get config(): KanbanConfig {
    const storedConfig = localStorage.getItem(this.localStorageKey);
    return storedConfig
      ? JSON.parse(storedConfig)
      : {
          sortField: KanbanCardSortType.START_DATE,
          showFields: Object.keys(KanbanCardFieldType),
          sortOrder: KanbanCardSortOrderType.ASC,
        };
  }

  set config(config: KanbanConfig) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(config));
    this.configSubject.next(config);
  }

  getConfigObservable(): Observable<KanbanConfig> {
    return this.configSubject.asObservable();
  }
}
