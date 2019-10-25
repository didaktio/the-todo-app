import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { TodoItem } from 'todo-utils';
import { formatDateShort } from 'todo-utils';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController) { }

  item: TodoItem;
  selectedOption: TodoItem | 'all' = 'all';
  formatDateShort = formatDateShort;

  ngOnInit() { }

}
