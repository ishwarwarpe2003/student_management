import { Routes } from '@angular/router';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add-student', component: AddStudentComponent }, // ✅ Fixed path
  { path: 'students', component: StudentListComponent },
   { path: 'edit/:id', component: EditStudentComponent },
];
