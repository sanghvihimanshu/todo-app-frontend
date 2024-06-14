import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs'; 
import {Task} from './box/task.model'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  readonly apiUrl
  constructor(private http: HttpClient) { 
   this.apiUrl = 'http://localhost:8080'; 
  }

  getTasks(): Observable<Task[]> {  
    return this.http.get<Task[]>(`${this.apiUrl}/lists`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/lists`, task);
  }

  updateTask(task: Task): Observable<Task> {
    
    return this.http.patch<Task>(`${this.apiUrl}/lists/${task._id}`, task )
  }

  deleteTask(task: Task): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/lists/${task._id}`);
 }

 login(email: string, password: string): Observable<HttpResponse<any>>{
  return this.http.post<any>(`${this.apiUrl}/user/login`, {email,password},{ observe:'response'}).pipe(
    catchError (error => {
      return throwError(() => error);
    })
  );
}

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/user`, {email,password}, {observe: 'response'}).pipe(
      catchError (error => {
        return throwError(() => error);
      })
    );
  }
}