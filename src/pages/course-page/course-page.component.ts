import { Component, inject } from '@angular/core';
import { CourseService } from '../../course/course.service';
import { Course, E_CourseType } from '../../../../../types/models/course.model';

@Component({
  selector: 'app-course-page',

  templateUrl: './course-page.component.html',
  styleUrl: './course-page.component.scss',
})
export class CoursePageComponent {
  courseService = inject(CourseService);

  E_CourseType = E_CourseType;

  courses = this.courseService.data;

  constructor() {
    console.log(this.courses());
  }

  onClickDeleteCourse(course: Course) {
    this.courseService.delete(course);
  }

  onClickAddCourse() {
    // this.coursesIds.push(new FormControl(guid.new()));
    this.courseService.add(new Course()).subscribe((res) => {
      console.log(res.id, ' course added');
    });
  }
}
