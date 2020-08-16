import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Turn, DifficultyLevel } from '../../models/Enumerations';

import { Matrix, Row } from '../../models/tictactoe/Matrix';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import { Index } from '../../models/tictactoe/Index';

@Component({
  selector: 'board-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.scss']
})
export class TictactoeComponent implements OnInit {
  constructor(private readonly modalService: NgbModal) {}

  ngOnInit(): void {
    this.matrix = this.generateMatrix(3, 3);
  }

  turnEnum = Turn;
  difficultyLevel = DifficultyLevel;

  matrix: Matrix;
  turn: Turn = Turn.Player1;
  level: DifficultyLevel = DifficultyLevel.Easy;
  player1Array: Array<Array<number>> = [];
  player2Array: Array<Array<number>> = [];
  indices: Array<number> = [0, 1, 2];
  matchCompleted: boolean = true;
  result: string;
  modal: NgbModalRef;
  mode: boolean = false;
  @ViewChild('resultModal') public resultPopup: TemplateRef<any>;

  generateMatrix(row, col): Matrix {
    let matrix: Matrix = new Matrix();
    matrix.rows = new Array<Row>();
    let i: number = 0,
      j = 0;
    while (i !== row) {
      let row = new Row();
      row.rowNumber = i;
      row.cols = [];
      j = 0;
      while (j !== col) {
        row.cols.push(j);
        j++;
      }
      matrix.rows.push(row);
      i++;
    }

    return matrix;
  }

  showResult() {
    this.modal = this.modalService.open(ModalComponent);
    this.modal.componentInstance.title = 'Result';
    this.modal.componentInstance.content = this.resultPopup;
  }

  onTableClick(event) {
    if (event.target.tagName === 'TD') {
      const selectedIndex = event.target.attributes.data.textContent
        .split(',')
        .map(i => Number(i));
      if (
        !this.checkIfArrayExists(selectedIndex, this.player1Array) &&
        !this.checkIfArrayExists(selectedIndex, this.player2Array)
      ) {
        this.matchCompleted = false;
        this.onPlayerClick(selectedIndex);
        // this.player1Array.push(selectedIndex);
        // this.turn = Turn.Player2;
        // if (this.checkIfWon(this.player1Array)) {
        //   this.matchCompleted = true;
        //   setTimeout(() => {
        //     this.result = 'Player1 Won !!';
        //     this.showResult();
        //     this.resetGame();
        //   }, 500);
        // } else if (
        //   this.player1Array.length + this.player2Array.length !== 9 &&
        //   !this.mode
        // ) {
        //   setTimeout(() => this.autoPlay(), 500);
        // }
      }
    }
  }

  onPlayerClick(selectedIndex: Array<number>) {
    this.matchCompleted = false;
    if (this.turn === Turn.Player1) {
      this.player1Array.push(selectedIndex);
      this.turn = Turn.Player2;
      if (this.checkIfWon(this.player1Array)) {
        this.matchCompleted = true;
        setTimeout(() => {
          this.result = 'Player1 Won !!';
          this.showResult();
          this.resetGame();
        }, 500);
      } else if (
        this.player1Array.length + this.player2Array.length !== 9 &&
        !this.mode
      ) {
        setTimeout(() => this.autoPlay(), 500);
      }
    } else if (this.turn === Turn.Player2 && this.mode) {
      this.player2Array.push(selectedIndex);
      this.turn = Turn.Player1;
      if (this.checkIfWon(this.player2Array)) {
        // this.matchCompleted = true;
        setTimeout(() => {
          this.result = 'Player2 Won !!';
          this.showResult();
          this.resetGame();
        }, 500);
      }
    }
  }

  getCellData(m: number, n: number) {
    return `${m},${n}`;
  }

  checkPlayer1IsBound(cellIndex: string) {
    const selectedIndex = cellIndex.split(',').map(i => Number(i));
    return this.checkIfArrayExists(selectedIndex, this.player1Array);
  }

  checkPlayer2IsBound(cellIndex: string) {
    const selectedIndex = cellIndex.split(',').map(i => Number(i));
    return this.checkIfArrayExists(selectedIndex, this.player2Array);
  }

  autoPlay() {
    let mIndex = this.autoDefensivePlay().IndexArray;
    // let mIndex = this.autoDefensivePlay().IndexArray;

    this.player2Array.push(mIndex);
    if (this.checkIfWon(this.player2Array)) {
      // this.matchCompleted = true;
      setTimeout(() => {
        this.result = 'Computer won !!';
        this.showResult();
        this.resetGame();
      }, 500);
    }
    this.turn = Turn.Player1;
  }

  checkIfWon(array: Array<Array<number>>) {
    if (array.length >= 3) {
      let x = array.map(i => i[0]);
      let y = array.map(i => i[1]);
      let rowAndColCheck = this.indices.map(i => {
        return this.valueCount(x, i) >= 3 || this.valueCount(y, i) >= 3;
      });
      if (rowAndColCheck.indexOf(true) >= 0) {
        return true;
      }

      let leftdiagonalLength = array.reduce((count, i) => {
        return (count += i[0] == i[1] ? 1 : 0);
      }, 0);

      if (leftdiagonalLength == 3) return true;

      let rightDiagonalLength = array.reduce((count, i) => {
        return (count += i[0] + i[1] == this.indices[2] ? 1 : 0);
      }, 0);

      if (rightDiagonalLength == 3) return true;
      else if (this.player1Array.length + this.player2Array.length === 9) {
        // this.matchCompleted = true;
        setTimeout(() => {
          this.result = 'Match drawn !!';
          this.showResult();
          this.resetGame();
        }, 500);
      }
    }
  }

  resetGame() {
    this.matchCompleted = true;
    this.turn = Turn.Player1;
    this.player1Array = [];
    this.player2Array = [];
  }

  getProbableIndex(arr: Array<Array<number>>, level: DifficultyLevel): Index {
    let newIndex = new Index();
    const x = arr.map(i => i[0]);
    const y = arr.map(i => i[1]);
    const ld = arr.filter(i => i[0] === i[1]);
    const rd = arr.filter(i => i[0] + i[1] === this.indices.length - 1);
    if (this.level === DifficultyLevel.Hard) {
      for (const i of this.indices) {
        if (x.reduce((xCount, j) => (xCount += j === i ? 1 : 0), 0) > 1) {
          let cols = arr.map(k => {
            if (k[0] === i) {
              return k[1];
            }
          });
          let yIndex = this.indices.filter(k => cols.indexOf(k) < 0);
          if (yIndex && yIndex.length > 0) {
            if (this.checkEmptyBlock([i, yIndex[0]])) {
              newIndex.IndexArray = [i, yIndex[0]];
              return newIndex;
            }
          }
        }
        if (y.reduce((yCount, j) => (yCount += j === i ? 1 : 0), 0) > 1) {
          let rows = arr.map(k => {
            if (k[1] === i) {
              return k[0];
            }
          });
          let xIndex = this.indices.filter(k => rows.indexOf(k) < 0);
          if (xIndex && xIndex.length > 0) {
            if (this.checkEmptyBlock([xIndex[0], i])) {
              newIndex.IndexArray = [xIndex[0], i];
              return newIndex;
            }
          }
        }
        if (ld.length > 1) {
          const ldx = ld.map(i => i[0]);
          const index = this.indices.filter(k => ldx.indexOf(k) < 0);
          if (this.checkEmptyBlock([index[0], index[0]])) {
            newIndex.IndexArray = [index[0], index[0]];
            return newIndex;
          }
        }
        if (rd.length > 1) {
          const rdx = rd.map(i => i[0]);
          const index = this.indices.filter(k => rdx.indexOf(k) < 0);
          if (index.length > 0) {
            let resArr = [index[0], this.indices.length - 1 - index[0]];
            if (this.checkEmptyBlock(resArr)) {
              newIndex.IndexArray = resArr;
              return newIndex;
            }
          }
        }
        if (
          !this.checkIfArrayExists([1, 1], this.player1Array) &&
          !this.checkIfArrayExists([1, 1], this.player2Array)
        ) {
          newIndex.IndexArray = [1, 1];
          return newIndex;
        }
      }
    }
    newIndex.IndexArray = this.generateRandomIndex();
    newIndex.IsRandom = true;
    return newIndex;
  }

  autoAggressivePlay(): Index {
    return this.getProbableIndex(this.player2Array, this.level);
  }

  autoDefensivePlay(): Index {
    if (this.level === DifficultyLevel.Easy) {
      return this.getProbableIndex(this.player1Array, this.level);
    } else {
      let index = this.autoAggressivePlay();
      if (index.IsRandom) {
        return this.getProbableIndex(this.player1Array, this.level);
      } else return index;
    }
  }

  generateRandomIndex(): Array<number> {
    let arrayExists = false;
    let randomArr = [];
    while (!arrayExists) {
      randomArr = [
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3)
      ];
      if (this.checkEmptyBlock(randomArr)) {
        arrayExists = true;
      }
    }
    return randomArr;
  }

  checkEmptyBlock(arr: Array<any>) {
    const comparerArray = this.player1Array.concat(this.player2Array);
    if (comparerArray.length > 0) {
      const res = comparerArray.reduce((count, i) => {
        return (count += arr[0] === i[0] && arr[1] === i[1] ? 1 : 0);
      }, 0);

      if (res !== 0) {
        return false;
      }

      return true;
    }
    return true;
  }

  checkIfArrayExists(comparerArray: Array<any>, arr: Array<any>) {
    const res = arr.reduce((res, i) => {
      return (res +=
        i[0] === comparerArray[0] && i[1] === comparerArray[1] ? 1 : 0);
    }, 0);

    if (res != 0) return true;
    else return false;
  }

  valueCount(array: Array<any>, value: any) {
    let res = 0;
    if (array.length > 0) {
      return array.reduce((res, i) => {
        return (res += i == value ? 1 : 0);
      }, 0);
    }
    return res;
  }
}
