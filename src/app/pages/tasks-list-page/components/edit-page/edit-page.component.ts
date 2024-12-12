import {Component, ElementRef, OnDestroy, OnInit,  ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response, TasksData, TasksListPageService} from '../../tasks-list-page.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-edit-page',
  standalone: false,
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss'
})
export class EditPageComponent implements OnInit, OnDestroy {
  @ViewChild('myModalClose') modalClose!: ElementRef<HTMLButtonElement>;
  form!: FormGroup;

  mode: 'Add' | 'Update' = 'Add';

  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private tlpService: TasksListPageService,
    private toastr: ToastrService
  ) {
    this.createForm();
  }


  ngOnInit() {
    this.subscriptions.push(
      this.tlpService.selectedTask$.subscribe(
        (task: TasksData | null) => {
          if (task) {
            this.patchFormValues(task);
          }
        }
      )
    );
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  patchFormValues(task: TasksData): void {
    this.form.patchValue({
      title: task.title,
      description: task.description
    });

    this.mode = 'Update';
  }

  async onAdd() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let data = this.form.getRawValue();

    data = {
      ...data,
      progress: 'D'
    }

    let response: Response | null = null; // Initialize response to null
    if (this.mode === 'Add') {
      response = await this.tlpService.addTask(data);
    } else if (this.mode === 'Update') {
      response = await this.tlpService.updateTask(data);
    }

    this.modalClose.nativeElement.click();

    if (response && response.errorCode === '0') {
      this.toastr.success(
        this.mode === 'Add' ? 'Task Added Successfully.' : 'Task Updated Successfully.',
        'Success'
      );
    } else {
      this.toastr.error('Failed to process task.', 'Error');
    }

  }

  ngOnDestroy() {
    this.mode = 'Add';
  }
}
