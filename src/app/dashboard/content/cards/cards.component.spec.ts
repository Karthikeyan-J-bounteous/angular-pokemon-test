import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardsComponent } from './cards.component';
import { Store, StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { mockPokemon } from 'src/app/mock-data/pokemon.mock';
import { CapitalizePipe } from 'src/app/pipes/capitalize.pipe';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;
  let mockStore: Store;
  let mockRouter: Router;

  beforeEach(() => {
    mockStore = {
      select: jasmine.createSpy('select').and.returnValue(of(mockPokemon)), // Replace with your mock data
    } as any;
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CardsComponent, CapitalizePipe],
      imports: [
        StoreModule.forRoot({}),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set exp when finding a Pokemon', () => {
    component.name = 'Pikachu';
    component.ngOnInit();

    expect(component.pokemon).toEqual(mockPokemon);
    expect(component.exp).toBe('width:14%');
  });

  it('should generate class name based on type', () => {
    const className = component.loadClass('Fire');
    expect(className).toBe('card__type__button__Fire');
  });

  it('should navigate to the content page on card click', () => {
    const name = 'Pikachu';
    component.onClickCard(name);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/content'], {
      queryParams: { name },
      queryParamsHandling: 'merge',
    });
  });
});
