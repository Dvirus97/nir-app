import {
  Component,
  contentChild,
  effect,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: '[app-copy-tooltip]',
  templateUrl: './copy-tooltip.component.html',
  // template: '',
  styleUrl: './copy-tooltip.component.scss',
})
export class CopyTooltipComponent {
  isCopied = signal(false);

  test = viewChild('test');

  constructor() {
    effect(() => {
      // console.log(this.test());
    });
  }

  onMouseLeaveCopy() {
    this.isCopied.set(false);
  }

  onCopyClick() {
    // navigator.clipboard.writeText(data)
    this.isCopied.set(true);
  }
}
