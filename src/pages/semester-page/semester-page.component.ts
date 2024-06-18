import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-semester-page',

  templateUrl: './semester-page.component.html',
  styleUrl: './semester-page.component.scss',
})
export class SemesterPageComponent {
  cdr = inject(ChangeDetectorRef);

  linkArr: { name: string; link: string; id: string }[];
  selectedSemesterId = signal('1');

  constructor() {
    this.linkArr = Array.from({ length: 8 }).map((x, i) => ({
      name: 'semester' + (i + 1),
      link: 'semester' + (i + 1),
      id: i + 1 + '',
    }));

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 1);
  }

  onLinkClick(link: { name: string; link: string; id: string }) {
    this.selectedSemesterId.set(link.id);
    this.cdr.detectChanges();
  }
}
