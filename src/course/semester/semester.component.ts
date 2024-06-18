import {
  ChangeDetectorRef,
  Component,
  Signal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToForm } from '../../types/utilTypes';
import {
  E_semesterNumber,
  Semester,
} from '../../../../../types/models/semester.model';
import { enumForSelect } from '../../common/forSelect';
import { Course, E_CourseType } from '../../../../../types/models/course.model';
import { selectArgs } from '../../common/select/select.component';
import { BaseService } from '../../common/base.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { guid } from '../../../../../types/models/helper';
import { CourseService, SemesterService } from '../course.service';

@Component({
  selector: 'app-semester',

  templateUrl: './semester.component.html',
  styleUrl: './semester.component.scss',
})
export class SemesterComponent {
  semesterService = inject(SemesterService);
  courseService = inject(CourseService);
  cdr = inject(ChangeDetectorRef);

  semesters: Signal<Semester[] | undefined>;
  courses: Signal<Course[] | undefined>;

  coursesSelectArgs = computed((): selectArgs<string>[] | undefined => {
    return this.courses()?.map((x) => ({ label: x.name, value: x.id! }));
  });

  semesterId = input('1');

  form?: FormGroup<ToForm<Semester>>;

  selectCourseForm = new FormGroup({
    addCourseInput: new FormControl('123'),
  });

  createForm(value?: Semester) {
    return new FormGroup<ToForm<Semester>>({
      Type: new FormControl('semester'),
      id: new FormControl(value?.id),
      semesterAvg: new FormControl(value?.semesterAvg),
      semesterNumber: new FormControl(value?.semesterNumber),
      totalPoints: new FormControl(value?.totalPoints),
      courses: new FormArray([]),
      coursesIds: new FormArray<any>(
        (value?.coursesIds ?? []).map((x) => new FormControl(x))
      ),
    });
  }

  // coursesIds = computed(() => {
  //   return this.form()?.controls.coursesIds as FormArray<
  //     FormControl<string | null>
  //   >;
  // });
  get coursesIds() {
    return this.form?.controls.coursesIds as FormArray<
      FormControl<string | null>
    >;
  }

  semesterNumberSelectArgs: selectArgs<number>[] = enumForSelect(
    E_semesterNumber
  ).map((x) => ({ label: x.label.substring(1), value: x.value }));

  constructor() {
    this.semesters = this.semesterService.data;
    this.courses = this.courseService.data;

    this.selectCourseForm.valueChanges.subscribe((x) => console.log(x));

    effect(
      () => {
        const semester = this.semesters()?.find(
          (x) => x.id == this.semesterId()
        );
        if (!semester || !this.semesterId()) return;

        this.form = this.createForm(semester);
      },
      { allowSignalWrites: true }
    );
  }

  onClickAddCourse() {
    // this.coursesIds.push(new FormControl(guid.new()));
    this.courseService.add(new Course()).subscribe((res) => {
      this.coursesIds.push(new FormControl(res.id));
      this.cdr.markForCheck(); // manually mark dirty for change detection
      this.semesterService.updateById(this.form?.getRawValue() as Semester);
    });
  }

  onDeleteCourse(
    data: { id?: string | undefined; index?: number | undefined },
    index: number
  ) {
    this.semesterService.updateById(this.form?.getRawValue() as Semester);
  }

  print() {
    console.log(this.form);
  }
}
