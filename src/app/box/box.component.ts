import { CommonModule,DatePipe } from '@angular/common';
import { Component,OnInit , AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from './task.model';
import { TaskService } from '../task.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  providers:[DatePipe,HttpClientModule],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})

export class BoxComponent {

  inputTask: string = '';
  inputTasks: Task[] = [];
  showInputField: boolean = false;
  editingTask:Task | null =null;
  isEditClick:boolean =false;
  isAddClick:boolean =true; 
  @ViewChild('taskInput') taskInput!: ElementRef; 

  constructor(private datePipe: DatePipe ,private taskService :TaskService ,private authService:AuthService) {}

  ngOnInit() {
    this.getTask();
  }

  ngAfterViewInit() {
    if (this.taskInput) {
      this.taskInput.nativeElement.focus();
    }
  }

  onKeydown(event:any) {
    if(event.key === "Enter") {
      this.displayInputFeild();
    }
  }

  displayInputFeild() {
    this.showInputField=true;
  

    if(this.isAddClick) {
      this.addTask();
    }
    else{
      this.updateTask();
    }
  }

  addTask() {
    const newTask: Task = {
      description: this.inputTask,
      checked: false,
      timestamp: Date.now()
    };

   if(this.inputTask.trim()) {
    this.taskService.addTask(newTask).subscribe(task => {
      this.inputTasks.push(task);
    });
    this.inputTask='';
    
   } 
    else {
        alert('Enter some task from add')
      }
  }

  updateTask() {
    
    const trim = this.inputTask.trim();
  
    if (this.editingTask && trim) {
     
      if (this.editingTask.description !== trim) {
          this.editingTask.description = this.inputTask;
          this.editingTask.timestamp = Date.now();
          this.taskService.updateTask(this.editingTask).subscribe(() => {
          this.inputTask = '';
          this.isEditClick =false;
          this.isAddClick = true;
        });
      } 
      
      else {
        alert('Please make changes to update the task');
        this.isEditClick=true;
        this.isAddClick=true;
      }
    }
    
    else {
      alert('Please enter some text');
    }
      
    this.isEditClick=true;
    this.isAddClick =false;

    if (this.isEditClick && this.editingTask) {
      this.inputTask = this.editingTask.description;
    }
  }
  

   editTask(event:Event,task:Task) {
      event.stopPropagation(); 
      this.isEditClick=true;
      this.isAddClick=false;
      task.checked =false;
      this.inputTask = task.description;
      this.editingTask=task;
      this.taskInput.nativeElement.focus();
      // this.saveList();
    }
 
    changeButton() {
    this.displayInputFeild();
   }

   removeTask(event: MouseEvent, task: Task) {
    event.stopPropagation();
    this.taskService.deleteTask(task).subscribe(() => {
     this.inputTasks = this.inputTasks.filter(t => t._id !== task._id);
    }
   );
    this.inputTask='';
    this.isAddClick=true;
    this.isEditClick=false;
    // this.saveList();
  }
  
  completedTask(task:Task) {  
    
     task.checked = !task.checked;
     task.timestamp = Date.now();
     this.taskService.updateTask(task).subscribe();
     //  console.log(task.checked);
    //  this.saveList();
  }

  getTask() {
    this.taskService.getTasks().subscribe(tasks => {
      this.inputTasks = tasks;
    })
  }

  get uncheckedTaskCount(): number {
    return this.inputTasks.filter(task => !task.checked).length;
  }

  clearAll() {
    if (this.inputTasks.length > 0) {
      this.inputTasks.forEach(task => this.removeTask(new MouseEvent('click') , task));
    } else {
      alert('To-do list is empty');
    }
  
    this.isAddClick=true;
    this.isEditClick=false;
    this.inputTask='';
    // this.inputTasks.splice(total,1);
    // this.saveList(); 
  }

  formatTimestamp(timestamp: number) {
    return this.datePipe.transform(timestamp, 'dd MMM\',\' yyyy \'at\' hh:mm') ;
  }

  onClickedLogout() {
    return this.authService.logout();
  }
}

// Todos
// 1. Icons for Edit and Delete
// 2. Edit Functionality
//    - Clicking on todo item, populate input field with that value
//    - Edit the item and change cta to "Update"
//    - Date to shown like 23rd May, 2024 | 5:45 PM
  //  - Update todo item, the time should be updated