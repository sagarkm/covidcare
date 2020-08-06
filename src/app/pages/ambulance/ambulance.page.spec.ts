import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmbulancePage } from './ambulance.page';

describe('AmbulancePage', () => {
  let component: AmbulancePage;
  let fixture: ComponentFixture<AmbulancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbulancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmbulancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
