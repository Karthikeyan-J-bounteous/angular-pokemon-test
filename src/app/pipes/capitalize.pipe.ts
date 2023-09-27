import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const words = value.split('-').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return words.join(' ');
  }

}
