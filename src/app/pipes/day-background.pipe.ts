import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'dayBackground'
})
export class DayBackgroundPipe implements PipeTransform {

  transform(value: Date, args?: moment.Moment): any {
    if (value.getMonth() !== args.month()) {
      return 'lightGray';
    }
    return '';
  }
}
