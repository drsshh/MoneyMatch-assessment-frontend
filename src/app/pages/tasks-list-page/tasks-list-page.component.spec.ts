import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksListPageComponent } from './tasks-list-page.component';

describe('TasksListPageComponent', () => {
  let component: TasksListPageComponent;
  let fixture: ComponentFixture<TasksListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
