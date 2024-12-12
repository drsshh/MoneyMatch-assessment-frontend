import { TestBed } from '@angular/core/testing';

import { TasksListPageService } from './tasks-list-page.service';

describe('TasksListPageService', () => {
  let service: TasksListPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksListPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
