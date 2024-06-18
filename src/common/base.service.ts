import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, take, tap } from 'rxjs';
import { environment } from '../environment.environment';
import { Entity } from '../../../../types/models/entityBase.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T extends Entity = Entity> {
  private httpClient = inject(HttpClient);
  private url = environment.apiUrl;

  data = signal<T[]>([]);

  getAll<K extends T = T>(type: string) {
    const res = this.httpClient
      .get<{ data: K[] }>(this.url + '/' + type)
      .pipe(
        map((x) => x.data),
        tap((x) => {
          console.log('Get All ', x);
        }),
        take(1)
      )
      .subscribe((x) => {
        this.data.set(x);
      });

    return this.data;
  }

  getById({ id }: { id?: string }) {}

  updateById<K extends T>(data: Partial<K>) {
    this.httpClient
      .put<K[]>(this.url + '/' + data.Type + '/' + data.id, data)
      .pipe(
        tap((x) => {
          console.log('updateById', x);
        })
      )
      .subscribe((x) => {
        this.getAll(data.Type!);
      });
    return this.data;
  }

  add(data: Partial<T>) {
    const res = this.httpClient
      .post(this.url + '/' + data.Type + '/add', data)
      .pipe(
        tap((x) => {
          console.log('add ', x);
          this.getAll(data.Type!);
        })
      );
    return res as Observable<{ id: string }>;
  }

  updateAll(data: T[] | any[]) {
    this.httpClient
      .put(this.url + '/' + (data as any).Type, data)
      .subscribe((x) => {
        console.log('update ', x);
        this.getAll((data as any).Type!);
      });
    return this.data;
  }

  delete(data: T) {
    this.httpClient
      .delete(this.url + '/' + data.Type + '/' + data.id)
      .subscribe((x) => {
        console.log('delete ', x);
        this.getAll(data.Type!);
      });

    return this.data;
  }
}
