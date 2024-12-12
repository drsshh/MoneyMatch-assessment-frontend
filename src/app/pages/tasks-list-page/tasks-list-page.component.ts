import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TasksData, TasksListPageService} from './tasks-list-page.service';

@Component({
  selector: 'app-tasks-list-page',
  standalone: false,
  templateUrl: './tasks-list-page.component.html',
  styleUrl: './tasks-list-page.component.scss'
})
export class TasksListPageComponent implements OnInit{
  @ViewChild('myModalAdd') modalAdd!: ElementRef<HTMLButtonElement>;

  tasks: TasksData[] = [];

  constructor(
    private tlpService: TasksListPageService
  ) {
  }

  ngOnInit() {
    this.getTasks();
  }

  async getTasks() {
    this.tasks = await this.tlpService.getTasks();
  }
  async deleteAll() {
    await this.tlpService.deleteAllTasks();

    this.tasks = [];
  }

  async removeTask(task: TasksData){
    this.tlpService.setSelectedTask(task);

    await this.tlpService.deleteTask(task);
  }

  async editTask(task: TasksData){
    this.tlpService.setSelectedTask(task);  // This will notify subscribers

    console.log(this.tlpService.selectedTask);
    this.modalAdd.nativeElement.click();
  }
}
