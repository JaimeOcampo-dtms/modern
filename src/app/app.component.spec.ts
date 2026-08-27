import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHashbrown } from '@hashbrownai/angular';
import { AppComponent } from './app.component';
import { ConfigService } from './shared/config.service';

describe('AppComponent', () => {
  let loadConfigSpy: jasmine.Spy;

  beforeEach(async () => {
    loadConfigSpy = jasmine.createSpy('loadConfig');

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ConfigService, useValue: { loadConfig: loadConfigSpy } },
        provideRouter([]),
        provideHashbrown({ baseUrl: 'http://localhost:3000/api/chat' }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should load config during construction', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
    expect(loadConfigSpy).toHaveBeenCalled();
  });

  it('should render the app shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.wrapper')).toBeTruthy();
    expect(compiled.querySelector('app-navbar-cmp')).toBeTruthy();
    expect(compiled.querySelector('app-sidebar-cmp')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-assistant-chat')).toBeTruthy();
  });
});
