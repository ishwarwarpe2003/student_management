import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalStudents: number = 0;
  averageMarks: number = 0;
  students: Student[] = [];
  filteredStudents: Student[] = [];
  selectedMarksFilter = '';

  constructor(
    private studentService: StudentService,
    private router: Router,
    private titleService: Title // ✅ Inject Title service
  ) {}

  ngOnInit(): void {
  this.titleService.setTitle('📊 Dashboard - Student Management System'); // ✅ Set browser tab title
  this.loadStudentStats();
}

  loadStudentStats(): void {
    this.studentService.getStudents().subscribe(data => {
      this.students = data;
      this.filteredStudents = data; // Show all by default
      this.totalStudents = data.length;
      this.averageMarks = this.calculateAverage(data);
    });
  }

  calculateAverage(students: Student[]): number {
    if (!students.length) return 0;
    const total = students.reduce((sum, s) => sum + s.marks, 0);
    return +(total / students.length).toFixed(2);
  }

  filterByMarks(option: string): void {
    this.selectedMarksFilter = option;

    switch (option) {
      case 'above75':
        this.filteredStudents = this.students.filter(s => s.marks > 75);
        break;
      case 'below50':
        this.filteredStudents = this.students.filter(s => s.marks < 50);
        break;
      case 'between50to75':
        this.filteredStudents = this.students.filter(s => s.marks >= 50 && s.marks <= 75);
        break;
      default:
        this.filteredStudents = this.students;
        break;
    }
  }

  goToAddStudent() {
    this.router.navigate(['/add']);
  }

  goToStudentList() {
    this.router.navigate(['/students']);
  }

  goToStudent(id: number) {
    this.router.navigate(['/edit', id]);
  }
}
