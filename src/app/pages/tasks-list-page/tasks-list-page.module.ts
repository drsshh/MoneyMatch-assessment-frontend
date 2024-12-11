import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TasksListPageComponent} from './tasks-list-page.component';
import {EditPageComponent} from './components/edit-page/edit-page.component';
import {SharedModule} from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TasksListPageComponent,
    children: [
      {
        path: ':mode',
        component: EditPageComponent
      }
    ]
  }
];

@NgModule({
  declarations: [TasksListPageComponent, EditPageComponent],
  imports: [ SharedModule, RouterModule.forChild(routes)]
})
export class TasksListPageModule { }
