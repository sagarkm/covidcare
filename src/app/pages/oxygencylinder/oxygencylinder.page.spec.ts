import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OxygencylinderPage } from './oxygencylinder.page';

describe('OxygencylinderPage', () => {
  let component: OxygencylinderPage;
  let fixture: ComponentFixture<OxygencylinderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OxygencylinderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OxygencylinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
