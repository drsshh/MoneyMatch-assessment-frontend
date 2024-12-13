import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TasksListPageService {

  filterReq: GetTaskRequest = {
    value: 'All'
  };

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
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  async getTasks(req: GetTaskRequest): Promise<TasksData[]> {
    let response: getTasksResponse;

    response = await firstValueFrom(
      this.http.post<getTasksResponse>('/tasks/gettasks', req)
    );

    if (response.errorCode === '0') {
      this.setTasksList(response.tasks);

      this.toastr.success(
        'Tasks list updated.',
        'Success'
      );
    } else {
      this.toastr.error('Failed to process task.', 'Error');
    }


    return response.tasks;
  }

  async addTask(task: TasksData): Promise<Response> {
    let response: Response;

    response = await firstValueFrom(
      this.http.post<Response>('/tasks/createtask', task)
    );

    if (response.errorCode === '0') {
      const currentTasks: TasksData[] = this.tasksList || [];
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
      const currentTasks: TasksData[] = this.tasksList || [];
      const updatedTasks: TasksData[] = currentTasks.filter(t => t.id !== task.id);
      this.setTasksList(updatedTasks);

      this.toastr.success(
        'Task Updated Successfully.',
        'Success'
      );
    } else {
      this.toastr.error('Failed to process task.', 'Error');
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
      const currentTasks: TasksData[] = this.tasksList || [];
      let updatedTasks: TasksData[];

      if (task.progress === 'F') {
        updatedTasks = currentTasks.filter(t => t.id !== task.id);
      } else {
        updatedTasks = currentTasks.map(t =>
          t.id === task.id ? task : t
        );
      }

      this.setTasksList(updatedTasks);

      this.toastr.success(
        'Task Updated Successfully.',
        'Success'
      );
    } else {
      this.toastr.error('Failed to process task.', 'Error');
    }

    this.setSelectedTask(null);
    return response;
  }

  async deleteAllTasks(): Promise<Response> {
    let response: Response;

    response = await firstValueFrom(
      this.http.post<Response>('/tasks/deletealltasks', null)
    );

    this.setTasksList([]);

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

export interface GetTaskRequest {
  value: string;
}




