import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course/course.component';
import { SemesterComponent } from './semester/semester.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from '../common/select/select.component';

const component = [CourseComponent, SemesterComponent];

@NgModule({
  declarations: [component],
  imports: [CommonModule, ReactiveFormsModule, SelectComponent],
  exports: [component],
})
export class CourseModule {}
