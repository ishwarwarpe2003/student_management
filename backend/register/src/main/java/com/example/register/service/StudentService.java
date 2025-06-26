
package com.example.register.service;

import com.example.register.model.Student;
import com.example.register.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return repository.findById(id);
    }

    public Student addStudent(Student student) {
        return repository.save(student);
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        return repository.findById(id)
            .map(student -> {
                student.setName(updatedStudent.getName());
                student.setRoll(updatedStudent.getRoll());
                student.setMarks(updatedStudent.getMarks());
                return repository.save(student);
            })
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }


    public void deleteStudent(Long id) {
        repository.deleteById(id);
    }
}
