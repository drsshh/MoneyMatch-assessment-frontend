import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GetTaskRequest, TasksData, TasksListPageService} from './tasks-list-page.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tasks-list-page',
  standalone: false,
  templateUrl: './tasks-list-page.component.html',
  styleUrl: './tasks-list-page.component.scss'
})
export class TasksListPageComponent implements OnInit{
  @ViewChild('myModalAdd') modalAdd!: ElementRef<HTMLButtonElement>;

  tasks: TasksData[] = [];

  subscription: Subscription[] = [];

  filterList: FilterData[] = [
    {
      value: 'F',
      label: 'Finished'
    },
    {
      value: 'D',
      label: 'Not done'
    },
    {
      value: 'R',
      label: 'Removed'
    },
    {
      value: 'All',
      label: 'All'
    }
  ]

  requestData: GetTaskRequest = {
    value: 'All'
  };

  constructor(
    private tlpService: TasksListPageService
  ) {
  }

  ngOnInit() {
    this.getTasks();

    this.subscription.push(
      this.tlpService.tasksList$.subscribe(
        (tasks: TasksData[]) => {
          this.tasks = tasks;
        }
      )
    )
  }

  async getTasks() {
    this.requestData = {
      value: 'All'
    }
    this.tasks = await this.tlpService.getTasks(this.requestData);
  }
  async deleteAll() {
    await this.tlpService.deleteAllTasks();
  }

  async removeTask(task: TasksData){
    this.tlpService.setSelectedTask(task);

    await this.tlpService.deleteTask(task);
  }

  async editTask(task: TasksData){
    this.tlpService.setSelectedTask(task);

    console.log(this.tlpService.selectedTask);
    this.modalAdd.nativeElement.click();
  }

  async onFilter(filter: FilterData) {
    this.requestData = {
      value: filter.value
    }
    this.tasks = await this.tlpService.getTasks(this.requestData);
  }
}

interface FilterData {
  value: string;
  label: string;
}
