import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterPageComponent } from './semester-page/semester-page.component';
import { CoursePageComponent } from './course-page/course-page.component';

import { CourseModule } from '../course/course.module';

@NgModule({
  declarations: [SemesterPageComponent, CoursePageComponent],
  imports: [CommonModule, CourseModule],
  exports: [SemesterPageComponent, CoursePageComponent],
})
export class PagesModule {}
