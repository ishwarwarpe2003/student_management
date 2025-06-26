import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent {
  students = new MatTableDataSource<Student>();
  displayedColumns: string[] = ['name', 'roll', 'marks', 'actions'];
  filterValue: string = '';
  totalStudents: number = 0;
  averageMarks: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.data = data;
        this.students.paginator = this.paginator;
        this.students.sort = this.sort;

        this.updateDashboardStats(data);

        this.students.filterPredicate = (student: Student, filter: string) => {
          return (
            student.name.toLowerCase().includes(filter) ||
            student.roll.toString().toLowerCase().includes(filter) ||
            student.marks.toString().includes(filter)
          );
        };
      },
      error: (err) => {
        console.error('Failed to load students:', err);
        this.snackBar.open('❌ Failed to load students from server.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.students.filter = this.filterValue;
  }

  updateDashboardStats(data: Student[]) {
    this.totalStudents = data.length;
    const totalMarks = data.reduce((sum, s) => sum + s.marks, 0);
    this.averageMarks = data.length ? Math.round(totalMarks / data.length) : 0;
  }

  highlight(text: string): string {
    if (!this.filterValue) return text;
    const regex = new RegExp(`(${this.filterValue})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
  }

  editStudent(id: number) {
    this.router.navigate(['/edit', id]);
  }

  deleteStudent(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(id).subscribe({
          next: () => {
            this.students.data = this.students.data.filter(s => s.id !== id);
            this.updateDashboardStats(this.students.data);
            this.snackBar.open('✅ Student deleted successfully.', 'Close', {
              duration: 3000,
              panelClass: ['snack-success']
            });
          },
          error: (err) => {
            console.error('Failed to delete student:', err);
            this.snackBar.open('❌ Error deleting student.', 'Close', {
              duration: 3000,
              panelClass: ['snack-error']
            });
          }
        });
      }
    });
  }
}
