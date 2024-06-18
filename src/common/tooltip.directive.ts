import {
  Directive,
  ElementRef,
  contentChild,
  effect,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  tooltipText = contentChild<ElementRef<HTMLElement>>('tooltipText');

  constructor(private el: ElementRef<HTMLButtonElement>) {
    el.nativeElement.classList.add('tooltip');

    effect(() => {
      if (this.tooltipText()) {
        this.tooltipText()?.nativeElement.classList.add('tooltip-text');
        const placeHolder = el.nativeElement.querySelector('placeHolder');
        placeHolder?.remove();
      } else {
        const placeHolder = document.createElement('span');
        placeHolder.classList.add('tooltip-text', 'placeHolder');
        placeHolder.textContent = '#tooltipText';
        el.nativeElement.append(placeHolder);
      }
    });
  }
}
