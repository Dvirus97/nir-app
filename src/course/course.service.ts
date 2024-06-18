import { Injectable, WritableSignal } from '@angular/core';
import { BaseService } from '../common/base.service';
import { Course } from '../../../../types/models/course.model';
import { Semester } from '../../../../types/models/semester.model';
import { FormArray, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CourseService extends BaseService<Course> {
  constructor() {
    super();
    this.getAll('course');
  }
}

@Injectable({
  providedIn: 'root',
})
export class SemesterService extends BaseService<Semester> {
  constructor() {
    super();
    this.getAll('semester');
  }

  addIdControlToArray(id: string, arr: FormArray) {
    arr.push(new FormControl(id));
  }
}
