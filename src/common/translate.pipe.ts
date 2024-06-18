import { Pipe, PipeTransform } from '@angular/core';
import { translate } from './translate';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipe implements PipeTransform {
  transform(value: string, args?: string[]): unknown {
    return translate(value, args);
  }
}
