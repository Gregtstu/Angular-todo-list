import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogComponent} from "./dialog/dialog.component";
import {ApiService} from "./shared/api.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ITask} from "./shared/itask";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public tasks:ITask[];
 // public displayedColumns: string[] = ['N', 'title', 'sortHoby', 'date', 'description', 'radio' , 'actions'];
  displayedColumns: string[] = ['пн', 'title', 'date', 'discription', 'radio', 'sortHoby', 'buttons'];
 public dataSource: MatTableDataSource<ITask>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private apiServ:ApiService) {
    this.tasks = [];
    this.dataSource = new MatTableDataSource(this.tasks);
  }

  ngOnInit(): void {
    this.getallTasks();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '80%',
    }).afterClosed().subscribe(val => {
      if (val === 'save') this.getallTasks();
    })
  }

  getallTasks():void{
    this.apiServ.getAll()
      .subscribe({
        next:(res) => {
          this.tasks = res
          this.dataSource = new MatTableDataSource(this.tasks);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (er) => {
          alert('В базе нет записей!!!');
          this.tasks = [];
          this.dataSource = new MatTableDataSource(this.tasks);
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  edit(row: ITask):void {
    this.dialog.open(DialogComponent, {
      width:'80%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val === 'update') this.getallTasks();
    });
  }

  delete(id:string):void {
    this.apiServ.delete(id)
      .subscribe({
        next:(res) => {
          alert('Задание успешно удадено!');
          this.getallTasks();
        },
        error: (err) => {
          alert('Возникла ОШИБКА!!!');
        }
      })
  }
}
