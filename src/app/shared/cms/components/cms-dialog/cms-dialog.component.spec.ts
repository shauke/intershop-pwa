import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ContentSlotContainerComponent } from 'ish-shared/cms/containers/content-slot/content-slot.container';

import { CMSDialogComponent } from './cms-dialog.component';

describe('Cms Dialog Component', () => {
  let component: CMSDialogComponent;
  let fixture: ComponentFixture<CMSDialogComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting({ reducers: { configuration: configurationReducer } })],
      declarations: [CMSDialogComponent, MockComponent(ContentSlotContainerComponent), ServerHtmlDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be display pagelet content if content variable is not empty', () => {
    const pagelet = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: { Content: 'testContent' },
    } as ContentPagelet;
    const pageletView = createContentPageletView(pagelet);
    component.pagelet = pageletView;
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('[data-testing-id="dialog-content"]').innerHTML).toBe('testContent');
  });

  it('should be display slot content if slot is not empty', () => {
    const pagelet2 = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {},
      slots: [
        {
          displayName: 'dialog',
          definitionQualifiedName: 'app_sf_responsive_cm:slot.dialog.content.pagelet2-Slot',
          pageletIDs: ['dialogId'],
        },
      ],
    };

    component.pagelet = createContentPageletView(pagelet2);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(
      `<ish-content-slot ng-reflect-slot="app_sf_responsive_cm:slot.dial"></ish-content-slot>`
    );
  });
});
