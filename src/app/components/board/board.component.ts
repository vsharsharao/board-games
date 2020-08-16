import { Component, OnInit } from '@angular/core';
import { Board } from '../../models/Board';
import { BoardsService } from './../../services/boards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boards = this.boardsService.getBoards();
  }
  boards: Array<Board>;
}
