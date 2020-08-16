import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TictactoeComponent } from './components/tictactoe/tictactoe.component';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { NavComponent } from './components/nav/nav.component';
import { BoardComponent } from './components/board/board.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [AppComponent, TictactoeComponent, ModalComponent, NavComponent, BoardComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [NgbActiveModal],
  bootstrap: [AppComponent]
})
export class AppModule {}
