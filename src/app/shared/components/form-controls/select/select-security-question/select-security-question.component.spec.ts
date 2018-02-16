import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectSecurityQuestionComponent } from './select-security-question.component';

describe('Select Security Question Component', () => {
  let component: SelectSecurityQuestionComponent;
  let fixture: ComponentFixture<SelectSecurityQuestionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectSecurityQuestionComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SelectSecurityQuestionComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          securityQuestion: new FormControl()
        });
        component.form = form;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('securityQuestion', 'control Name should be <securityQuestion>');
    expect(component.label).toEqual('account.security_question.label', 'label key should be <account.security_question.label>');
  });

  it('should get and display security questions on creation', () => {
    fixture.detectChanges();
    expect(component.options.length).toEqual(5, '5 questions are in the options array'); // ToDo: questions are retrieved from a service
    expect(element.querySelector('select[data-testing-id=securityQuestion]')).toBeTruthy('security question select is rendered');
  });
});