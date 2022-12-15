import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ITask} from "./itask";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  post(obj:ITask):Observable<ITask>{
    return this.http.post<ITask>('https://angular-material-todo-list-default-rtdb.firebaseio.com/todos.json', obj)
      .pipe(map ((res:ITask) => {
          return {
            ...obj,
            id: res.title,
          }
        })
      );
  }

  getAll():Observable<ITask[]>{
    return this.http.get<ITask[]>('https://angular-material-todo-list-default-rtdb.firebaseio.com/todos.json')
      .pipe( map ( res => {

        return Object.keys(res)
          .map( (key:any) => ({
            ...res[key],
            id: key,
          }))
      }))
  }

  put(obj:ITask, id:string):Observable<ITask>{
    return this.http.put<ITask>(`https://angular-material-todo-list-default-rtdb.firebaseio.com/todos/${id}.json`, obj)
      .pipe(map (res => {
          return {
            ...obj,
            id: res.title,
          }
        })
      );
  }

  delete( id:string):Observable<ITask>{
    return this.http.delete<ITask>(`https://angular-material-todo-list-default-rtdb.firebaseio.com/todos/${id}.json`);
  }
}
