import { Injectable } from '@angular/core';
import { Board } from '../models/Board';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {
  constructor() {}

  getBoards(): Array<Board> {
    let boards = new Array<Board>();

    let board = new Board();
    board.RouterLink = '/boards/tic-tac-toe';
    board.BoardName = 'tic-tac-toe';
    board.ComponentName = 'TictactoeComponent';
    board.ImagePath = './../../assets/images/tictactoe.png';

    boards.push(board);

    return boards;
  }
}
