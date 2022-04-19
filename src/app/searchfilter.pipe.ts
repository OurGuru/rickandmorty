import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    // return null;
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();

    return value.filter((data) => {
      //return list of characters whose name contains the search term
      return JSON.stringify(data).toLowerCase().includes(args);
    });
  }
}
