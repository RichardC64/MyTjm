import { Pipe, PipeTransform } from '@angular/core';
import { DayPosition, ITjmEvent } from '@entities';

@Pipe({
  name: 'eventColor'
})
export class EventColorPipe implements PipeTransform {

  transform(value: ITjmEvent, args?: any): any {
    if (value == null) { return null; }
    switch (parseInt(value.datas.dayPosition.toString(), null)) {
      case DayPosition.morning:
        return 'primary';
      case DayPosition.afternoon:
        return 'accent';
      default:
        return '';
    }
  }
}
