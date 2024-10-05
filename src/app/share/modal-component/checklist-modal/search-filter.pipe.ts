import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "searchFilter" })
export class SearchFilterPipe implements PipeTransform {
  transform(val: any, args?: any): any {
    return val?.filter(
      (val: string | any[]) =>
        JSON.stringify(val)
          ?.toLowerCase()
          .includes(args?.toLowerCase()),
    );
  }
}
