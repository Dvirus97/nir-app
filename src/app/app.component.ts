import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PersonModule } from '../person/person.module';
import { CourseModule } from '../course/course.module';
import { PagesModule } from '../pages/pages.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    PersonModule,
    CourseModule,
    PagesModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'nir-app';
  cdr = inject(ChangeDetectorRef);

  linkArr: { name: string; link: string; id: string }[];
  selectedSemesterId = signal('1');
  isCourses = signal(false);

  constructor() {
    this.linkArr = Array.from({ length: 8 }).map((x, i) => ({
      name: 'semester' + (i + 1),
      link: 'semester' + (i + 1),
      id: i + 1 + '',
    }));

    console.log(this.linkArr);
  }

  onLinkClick(link: { name: string; link: string; id: string }) {
    this.isCourses.set(false);
    this.selectedSemesterId.set(link.id);
    this.cdr.detectChanges();
  }

  onCoursesClick() {
    this.isCourses.set(true);
    this.selectedSemesterId.set('');
  }
}
