import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Person } from '../../../../types/models/person.model';
import { map, take, tap } from 'rxjs';

@Injectable()
// {providedIn: 'root'}
export class PersonService {
  private httpClient = inject(HttpClient);
  private url = 'http://localhost:3030/person';

  people = signal<Person[]>([]);

  getAllPeople() {
    this.httpClient
      .get<{ data: Person[] }>(this.url)
      .pipe(
        map((x) => x.data),
        tap((x) => console.log('Get People ', x)),
        take(1)
      )
      .subscribe((people) => this.people.set(people));

    return this.people;
  }

  getById({ id }: { id?: string }) {}

  updateById(person: Partial<Person>) {
    this.httpClient.patch(this.url, person).subscribe((x) => {
      console.log('updateById', x);
      this.getAllPeople();
    });
    return this.people;
  }

  addPerson(person: Person) {
    this.httpClient.post(this.url + '/add', person).subscribe((x) => {
      console.log('addPerson ', x);
      this.getAllPeople();
    });
    return this.people;
  }

  updatePeople(people: Person[] | any[]) {
    this.httpClient.put(this.url, people).subscribe((x) => {
      console.log('updatePeople ', x);
      this.getAllPeople();
    });
    return this.people;
  }

  deletePerson({ id }: { id?: string }) {
    this.httpClient
      .delete('http://localhost:3030/person/' + id)
      .subscribe((x) => {
        console.log('deletePerson ', x);
        this.getAllPeople();
      });

    return this.people;
  }
}
