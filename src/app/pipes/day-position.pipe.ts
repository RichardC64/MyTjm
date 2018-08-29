import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayPosition'
})
export class DayPositionPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 0: return 'Matin';
      case 1: return 'Après-midi';
      default: return '';
    }
  }

}
