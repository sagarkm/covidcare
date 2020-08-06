import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ControlroomPage } from './controlroom.page';

describe('ControlroomPage', () => {
  let component: ControlroomPage;
  let fixture: ComponentFixture<ControlroomPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlroomPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlroomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
