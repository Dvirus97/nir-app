import { Routes } from '@angular/router';
import { SemesterPageComponent } from '../pages/semester-page/semester-page.component';
import { CoursePageComponent } from '../pages/course-page/course-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'semester', pathMatch: 'full' },
  { path: 'semester', component: SemesterPageComponent },
  { path: 'course', component: CoursePageComponent },
];
