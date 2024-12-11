import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TasksListPageComponent} from './pages/tasks-list-page/tasks-list-page.component';
import {EditPageComponent} from './pages/tasks-list-page/components/edit-page/edit-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/tasks-list-page/tasks-list-page.module').then((m) => m.TasksListPageModule)
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
