import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPageComponent } from './details-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { Pokedex } from '../interfaces/pokedex';
import { fetchPokemon } from '../store/pokemon.actions';
import { pokemonReducer } from '../store/pokemon.reducer';
import { mockPokemon } from '../mock-data/pokemon.mock';

describe('DetailsPageComponent', () => {
  let fixture: ComponentFixture<DetailsPageComponent>;
  let component: DetailsPageComponent;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockRouter: Partial<Router>;
  let mockStore: Store;

  beforeEach(() => {
    mockActivatedRoute = {
      queryParams: of({ name: 'testName' }),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      declarations: [DetailsPageComponent],
      imports: [StoreModule.forRoot({ pokemon: pokemonReducer })],
      providers: [
        Store,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
    });

    fixture = TestBed.createComponent(DetailsPageComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and set Pokemon data when data is available', () => {
    const mockPokemonData: Pokedex = mockPokemon;
    spyOn(mockStore, 'select').and.returnValue(of(mockPokemonData));
    component.ngOnInit();
    expect(mockStore.select).toHaveBeenCalled();
    expect(component.pokemon).toEqual(mockPokemonData);
  });

  it('should dispatch fetchPokemon and navigate when data is not available', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch').and.callThrough();
    spyOn(mockStore, 'select').and.returnValue(of(undefined));
    component.ngOnInit();
    expect(mockStore.select).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(fetchPokemon({ name: 'testName' }));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/content'], {
      queryParams: { name: 'testName' },
      queryParamsHandling: 'merge',
    });
  });

  it('should handle errors when fetching data', () => {
    spyOn(mockStore, 'select').and.returnValue(throwError('Error'));
    spyOn(console, 'error');
    component.ngOnInit();
    expect(mockStore.select).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error..!');
  });

  it('should return class name based on type', () => {
    const type = 'fire';
    const result = component.loadClass(type);
    expect(result).toBe('details__container__button__fire');
  });

  it('should return class name based on type', () => {
    const type = 'fire';
    const result = component.loadClass(type);
    expect(result).toBe('details__container__button__fire');
  });

  it('should calculate width based on points and base', () => {
    const points = 99;
    const base = false;
    const result = component.loadexp(points, base);
    expect(result).toBe('width:33%');
  });

  it('should calculate width based on points and base (base=true)', () => {
    const points = 200;
    const base = true;
    const result = component.loadexp(points, base);
    expect(result).toBe('width:28.571428571428573%');
  });

  it('should navigate to home', () => {
    component.redirect();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
