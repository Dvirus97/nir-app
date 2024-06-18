import {
  Component,
  Inject,
  Signal,
  SkipSelf,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { BaseService } from '../../common/base.service';
import { Course, E_CourseType } from '../../../../../types/models/course.model';
import { Semester } from '../../../../../types/models/semester.model';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormControlDirective,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { ToForm } from '../../types/utilTypes';
import { enumForSelect } from '../../common/forSelect';
import { CourseService, SemesterService } from '../course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
  // viewProviders: [
  //   {
  //     provide: FormGroupDirective,
  //     useFactory: () =>
  //       inject(FormGroupDirective, { skipSelf: true, optional: true }),
  //   },
  // ],
})
export class CourseComponent {
  courseService = inject(CourseService);
  semesterService = inject(SemesterService);
  formGroupDirective = inject(FormGroupDirective);

  courseId = input<string | null>();
  index = input<number>();
  deleteCourse = output<{ id?: string; index?: number }>();
  // courses: Signal<Course[] | undefined>;
  courses = signal<Course[] | undefined>(undefined);
  CourseType = enumForSelect(E_CourseType);

  form = signal<FormGroup<ToForm<Course>> | undefined>(undefined);

  get semesterFormGroup() {
    return this.formGroupDirective.form as FormGroup<ToForm<Semester>>;
  }
  get courseIdsFormArray() {
    return this.semesterFormGroup.controls.coursesIds as FormArray<
      FormGroup<ToForm<string>>
    >;
  }

  createForm(value?: Course) {
    return new FormGroup<ToForm<Course>>({
      id: new FormControl(value?.id),
      Type: new FormControl('course'),
      courseType: new FormControl(value?.courseType),
      grade: new FormControl(value?.grade),
      name: new FormControl(value?.name),
      points: new FormControl(value?.points),
    });
  }

  constructor() {
    this.courses = this.courseService.data;

    effect(
      () => {
        const course = this.courses()?.find((x) => x.id == this.courseId());
        if (!course || !course.id) {
          return;
        }
        this.form.set(this.createForm(course));
      },
      { allowSignalWrites: true }
    );
  }

  onClickSaveBtn() {
    this.courseService.updateById<Course>(this.form()?.getRawValue() as Course);
  }

  onClickDeleteBtn() {
    let index = this.index();
    if (!index) {
      index = this.courseIdsFormArray.value.findIndex(
        (x) => x == this.courseId()
      );
    }
    this.courseIdsFormArray.removeAt(index);

    this.deleteCourse.emit({
      id: this.form()?.getRawValue().id!,
      index,
    });
  }
}

// const index = this.courseIdsFormArray.controls.findIndex(
//   (x) => x.value == this.courseId()
// );
// this.courseIdsFormArray.removeAt(index);
// console.log(index);
// const val = this.semesterFormGroup.value as Semester;
// console.log(val);
// this.semesterService.updateById(val);
