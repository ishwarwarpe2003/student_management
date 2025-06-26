import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-student.component.html',
})
export class AddStudentComponent {
  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      roll: ['', Validators.required],
      marks: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  onSubmit() {
  if (this.studentForm.valid) {
    const student: Student = this.studentForm.value;
    this.studentService.addStudent(student).subscribe({
      next: () => {
        this.snackBar.open('✅ Student added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snack-success']
        });

        // Reset form and remove red borders (untouched and pristine)
        this.studentForm.reset();
        this.studentForm.markAsPristine();
        this.studentForm.markAsUntouched();
        this.studentForm.updateValueAndValidity();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('❌ Failed to add student. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }
}

}
