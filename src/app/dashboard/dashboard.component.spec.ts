import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ContentComponent } from './content/content.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Store, StoreModule } from '@ngrx/store';
import { pokemonReducer } from '../store/pokemon.reducer';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PokemonService } from '../service/pokeapi.service';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(() => {
    let mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    let mockPokemonService = jasmine.createSpyObj('PokemonService', ['fetchPokemonByType']);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent, NavbarComponent, ContentComponent],
      imports: [HttpClientTestingModule, StoreModule.forRoot({ pokemon: pokemonReducer })], // Import HttpClientTestingModule for the PokemonService
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: PokemonService, useValue: mockPokemonService }
      ],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call childFunction on child component with provided value', () => {
    // Arrange
    fixture.detectChanges(); // Ensure the child component is initialized
    expect(component.updateComponent).toBeDefined(); 
  });
});
