import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksListPageService {

  private _tasksList = new BehaviorSubject<TasksData[]>([]);
  tasksList$ = this._tasksList.asObservable();

  setTasksList(tasks: TasksData[]): void {
    this._tasksList.next(tasks);
  }

  get tasksList(): TasksData[] | null {
    return this._tasksList.value;
  }

  private selectedTaskSubject = new BehaviorSubject<TasksData | null>(null);
  selectedTask$ = this.selectedTaskSubject.asObservable(); // Observable to listen to changes

  setSelectedTask(task: TasksData | null): void {
    this.selectedTaskSubject.next(task); // Emit the new selected task
  }

  get selectedTask(): TasksData | null {
    return this.selectedTaskSubject.value;
  }

  constructor(
    private http: HttpClient
  ) { }

  async getTasks(): Promise<TasksData[]> {
    let response: getTasksResponse;

    response = await firstValueFrom(
      this.http.post<getTasksResponse>('/tasks/gettasks', null)
    );

    this.setTasksList(response.tasks);

    return response.tasks;
  }

  async addTask(task: TasksData): Promise<Response> {
    let response: Response;

    response = await firstValueFrom(
      this.http.post<Response>('/tasks/createtask', task)
    );

    if (response.errorCode === '0') {
      const currentTasks = this.tasksList || [];
      this.setTasksList([...currentTasks, task]);
    }

    return response;
  }

  async deleteTask(task: TasksData){
    let response: Response;

    response = await firstValueFrom(
      this.http.post<Response>('/tasks/deletetask', task)
    );

    if (response.errorCode === '0') {
      const currentTasks = this.tasksList || [];
      const updatedTasks = currentTasks.filter(t => t.id !== task.id);
      this.setTasksList(updatedTasks);
    }

    this.setSelectedTask(null);
    return response;
  }

  async updateTask(task: TasksData): Promise<Response> {
    let response: Response;

    response = await firstValueFrom(
      this.http.post<Response>('/tasks/updatetask', task)
    );

    if (response.errorCode === '0') {
      const currentTasks = this.tasksList || [];
      const updatedTasks = currentTasks.map(t =>
        t.id === task.id ? task : t
      );
      this.setTasksList(updatedTasks);
    }

    this.setSelectedTask(null);
    return response;
  }

  async deleteAllTasks(): Promise<Response> {
    let response: Response;

    response = await firstValueFrom(
      this.http.post<Response>('/tasks/deletealltasks', null)
    );

    return response;
  }
}

export interface Response {
  errorCode: string;
  errorDescr: string;
}
export interface TasksData {
  id: string;
  title: string;
  description: string;
  progress:
    'F' | // Finished
    'R' | // Removed
    'D'; // Not yet do
}

interface getTasksResponse extends Response {
  tasks: TasksData[];
}




