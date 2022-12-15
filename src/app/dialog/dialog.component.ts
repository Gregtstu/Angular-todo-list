import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../shared/api.service";
import {MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ITask} from "../shared/itask";


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
  public formTodo!: FormGroup;
  public actionBtn: string;

  constructor(
    private fb:FormBuilder,
    private apiserv:ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: ITask
  ) {
    this.actionBtn = 'Добавить';
  }

  ngOnInit(): void {
    this.formTodo = this.fb.group({
      title: ['', Validators.required],
      sortHoby: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      radio: ['', Validators.required],
    });
    console.log(this.editData)
    if(this.editData){
      this.actionBtn = 'Исправить';
      this.formTodo.controls['title'].setValue(this.editData.title);
      this.formTodo.controls['sortHoby'].setValue(this.editData.sortHoby);
      this.formTodo.controls['date'].setValue(this.editData.date);
      this.formTodo.controls['description'].setValue(this.editData.description);
      this.formTodo.controls['radio'].setValue(this.editData.radio);
    }
  }

  create() {
    if(this.editData){
      this.update();
    }else {
      if (this.formTodo.valid){
        this.apiserv.post(this.formTodo.value)
          .subscribe({
            next:(res) => {
              alert('Задание успешно добавлено!');
              this.formTodo.reset();
              this.dialogRef.close('save');
            },
            error:(er) => {
              alert('ОШИБКА! Проблемма с сервером');
            }
          });
      }
    }
  }

  update():void{
    this.apiserv.put(this.formTodo.value, this.editData.id)
      .subscribe({
        next:(res) => {
          alert('Задание успешно изменено!');
          this.formTodo.reset();
          this.dialogRef.close('update');
        },
        error:(er) => {
          alert('ОШИБКА! Проблемма с сервером');
        }
      })
  }
}
