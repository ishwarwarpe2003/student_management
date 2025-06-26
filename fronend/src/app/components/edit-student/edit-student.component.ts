import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './edit-student.component.html'
})
export class EditStudentComponent implements OnInit {
  studentForm: FormGroup;
  studentId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      roll: ['', Validators.required],
      marks: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getStudent(this.studentId).subscribe({
      next: (student) => {
        this.studentForm.patchValue(student);
      },
      error: (err) => {
        console.error('Failed to fetch student:', err);
        this.snackBar.open('❌ Student not found or server error.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
        this.router.navigate(['/students']);
      }
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const updatedStudent: Student = {
        id: this.studentId,
        ...this.studentForm.value
      };

      this.studentService.updateStudent(this.studentId, updatedStudent).subscribe({
        next: () => {
          this.snackBar.open('✅ Student updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.router.navigate(['/students']);
        },
        error: (err) => {
          console.error('Failed to update student:', err);
          this.snackBar.open('❌ Failed to update student. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }
}
