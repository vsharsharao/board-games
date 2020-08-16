import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}

  @Input() content: TemplateRef<any>;
  @Input() title: string;
  @Output() emitAction = new EventEmitter();
  ngOnInit() {}
}
