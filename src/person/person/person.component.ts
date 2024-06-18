import { Component, effect, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Person } from '../../../../../types/models/person.model';
import { ToForm } from '../../types/utilTypes';
import { PersonService } from '../person.service';
import { concatMap, debounceTime, delay, fromEvent, of, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { guid } from '../../../../../types/models/helper';
import { translate } from '../../common/translate';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
})
export class PersonComponent {
  isCopied = signal(false);

  personService = inject(PersonService);
  inEditMode = signal(false);

  people = signal<Person[]>([]);

  get peopleArray() {
    type personFormArray = FormArray<FormGroup<ToForm<Person>>>;
    return this.form.controls.people as personFormArray;
  }

  newPersonGroup(person?: Person) {
    return new FormGroup<ToForm<Person>>({
      id: new FormControl(person?.id),
      name: new FormControl(person?.name),
      age: new FormControl(person?.age),
    });
  }

  form = new FormGroup<ToForm<{ people: Person[] }>>(
    { people: new FormArray([]) },
    { updateOn: 'blur' }
  );

  constructor() {
    this.people = this.personService.getAllPeople();
    effect(() => {
      this.updatePersonArray(this.people());
      this.updateDisabled(this.inEditMode());
    });

    effect(() => {
      const inEditMode = this.inEditMode();
      console.log('inEditMode');
      this.updateDisabled(inEditMode);
    });

    // const documentKeyPress = toSignal(
    //   fromEvent<KeyboardEvent>(document, 'keypress').pipe(
    //     concatMap((x) => of(x).pipe(delay(100))),
    //     tap((e) => {
    //       if (e?.code == 'KeyS' && e.ctrlKey == true) {
    //         console.log('save');
    //         this.onClickEditBtn();
    //       }
    //     })
    //   )
    // );
    // effect(() => {
    //   documentKeyPress();
    // });
  }

  private updateDisabled(inEditMode: boolean) {
    this.peopleArray.controls.forEach((control) => {
      if (inEditMode) {
        control.enable({ emitEvent: true });
      } else {
        control.disable({ emitEvent: true });
      }
    });
  }

  updatePersonArray(data: Person[], options?: { emitEvent?: boolean }) {
    this.peopleArray.clear({ emitEvent: options?.emitEvent });
    data.forEach((person) => {
      this.peopleArray.push(this.newPersonGroup(person), {
        emitEvent: options?.emitEvent,
      });
    });
  }

  onClickEditBtn() {
    const inEditMode = this.inEditMode();
    this.inEditMode.update((x) => !x);
    if (inEditMode) {
      if (this.form) {
        this.personService.updatePeople(this.peopleArray.getRawValue());
      }
    }
  }

  onCopyBtnClick(prop: keyof Person) {
    const text = this.peopleArray.value.map((x) => x[prop]).join(', ');
    console.log(text);
    copyToClipboard(text);
    this.isCopied.set(true);
  }
  onCopyBtnMouseLeave() {
    this.isCopied.set(false);
  }

  onClickAddPerson() {
    this.peopleArray.push(this.newPersonGroup());
    this.personService.addPerson({});
  }

  onClickDeletePerson(id?: string | null) {
    if (id) {
      const index = this.people().findIndex((x) => x.id == id);
      this.peopleArray.removeAt(index);
      this.personService.deletePerson({ id });
    }
  }
}
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

console.log(translate('message1', ['דביר', 'ברטה']));
