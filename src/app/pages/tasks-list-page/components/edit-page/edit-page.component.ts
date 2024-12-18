import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Response, TasksData, TasksListPageService} from '../../tasks-list-page.service';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-page',
  standalone: false,
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss'
})
export class EditPageComponent implements OnInit, AfterViewInit {
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

  ngAfterViewInit() {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', this.onModalHidden.bind(this));
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      progress: ['D', Validators.required]
    });
  }

  patchFormValues(task: TasksData): void {
    this.form.patchValue({
      title: task.title,
      description: task.description,
      progress: task.progress
    });

    this.mode = 'Update';
  }

  async onAdd() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let data = this.form.getRawValue();

    let response: Response | null = null;
    if (this.mode === 'Add') {
      response = await this.tlpService.addTask(data);
    } else if (this.mode === 'Update') {

      data = {
        ...data,
        id: this.tlpService.selectedTask?.id
      };

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

  onModalHidden(){
    this.tlpService.setSelectedTask(null);
    this.form.reset();
    this.mode = 'Add';
  }

}
