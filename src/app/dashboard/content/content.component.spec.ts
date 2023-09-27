import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentComponent } from './content.component';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { PokemonService } from 'src/app/service/pokeapi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockPokemon, mockPokemonData } from 'src/app/mock-data/pokemon.mock';
import { pokemonReducer } from 'src/app/store/pokemon.reducer';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockPokemonService = jasmine.createSpyObj('PokemonService', ['fetchPokemonByType']);
    
    TestBed.configureTestingModule({
      declarations: [ContentComponent],
      imports: [HttpClientTestingModule, StoreModule.forRoot({ pokemon: pokemonReducer })], // Import HttpClientTestingModule for the PokemonService
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: PokemonService, useValue: mockPokemonService }
      ],
    });

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should update range and dispatch fetchPokemon when selectNext is called', () => {
    // Arrange
    component.pokemonList = mockPokemonData;
    component.range = [0, 20];
  
    // Act
    component.selectNext();
  
    // Assert
    expect(component.range).toEqual([20, 20]);
    expect(mockStore.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({ type: '[Pokedex] Fetch Pokemon' }));
    // Add more assertions as needed.
  });

  it('should update range and disable right button when selectNext reaches the end of the list', () => {
    // Arrange
    component.pokemonList = mockPokemonData
    component.range = [1260, 20];

    // Act
    component.selectNext();

    // Assert
    expect(component.range).toEqual([1260, 20]);
    expect(component.rightDisable).toBe(true);
    // Add more assertions as needed.
  });

  it('should update range and enable right button when selectPrevious is called', () => {
    // Arrange
    component.pokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ];
    component.range = [2, 2];

    // Act
    component.selectPrevious();

    // Assert
    expect(component.range).toEqual([0, 2]);
    expect(component.rightDisable).toBe(false);
    // Add more assertions as needed.
  });

  it('should handle childFunction when searchFilter is empty', () => {
    // Arrange
    spyOn(component, 'checkNav');
    spyOn(component, 'getItemsFromIndex');
    component.allPokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ];
    component.pokemonList = [...component.allPokemonList];
    component.range = [2, 2];
    component.searchFilter = ["", "clear"];

    // Act
    component.childFunction(component.searchFilter);

    // Assert
    expect(component.searchFilter).toEqual(["", "clear"]);
    expect(component.range).toEqual([0, 20]);
    expect(component.max_load).toEqual(0);
    expect(component.pokemonList).toEqual(component.allPokemonList);
    expect(component.checkNav).toHaveBeenCalled();
    expect(component.getItemsFromIndex).toHaveBeenCalled();
    // Add more assertions as needed.
  });

  it('should handle childFunction when searchFilter has name filter', () => {
    // Arrange
    spyOn(component, 'checkNav');
    spyOn(component, 'getItemsFromIndex');
    component.allPokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ];
    component.pokemonList = [...component.allPokemonList];
    component.range = [2, 2];
    component.searchFilter = ["bulb", "clear"];

    // Act
    component.childFunction(component.searchFilter);

    // Assert
    expect(component.searchFilter).toEqual(["bulb", "clear"]);
    expect(component.range).toEqual([0, 20]);
    expect(component.max_load).toEqual(0);
    expect(component.pokemonList).toEqual(component.allPokemonList.filter(pokemon => pokemon.name.includes('bulb')));
    expect(component.checkNav).toHaveBeenCalled();
    expect(component.getItemsFromIndex).toHaveBeenCalled();
    // Add more assertions as needed.
  });

  it('should handle childFunction when searchFilter has type filter', () => {
    // Arrange
    spyOn(component, 'checkNav');
    spyOn(component, 'getItemsFromIndex');
    const typeData = {
      pokemon: [
        { pokemon: { name: 'bulbasaur' } },
        { pokemon: { name: 'ivysaur' } },
      ],
    };
    mockPokemonService.fetchPokemonByType.and.returnValue(of(typeData));
    component.allPokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ];
    component.pokemonList = [...component.allPokemonList];
    component.range = [2, 2];
    component.searchFilter = ["", "grass"];

    // Act
    component.childFunction(component.searchFilter);

    // Assert
    expect(component.searchFilter).toEqual(["", "grass"]);
    expect(component.range).toEqual([0, 20]);
    expect(component.max_load).toEqual(0);
    expect(mockPokemonService.fetchPokemonByType).toHaveBeenCalledWith("grass");
    expect(component.checkNav).toHaveBeenCalled();
    expect(component.getItemsFromIndex).toHaveBeenCalled();
    // Add more assertions as needed.
  });

  it('should handle childFunction when searchFilter has both name and type filters', () => {
    // Arrange
    spyOn(component, 'checkNav');
    spyOn(component, 'getItemsFromIndex');
    const typeData = {
      pokemon: [
        { pokemon: { name: 'bulbasaur' } },
        { pokemon: { name: 'ivysaur' } },
      ],
    };
    mockPokemonService.fetchPokemonByType.and.returnValue(of(typeData));
    component.allPokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ];
    component.pokemonList = [...component.allPokemonList];
    component.range = [2, 2];
    component.searchFilter = ["bulb", "grass"];

    // Act
    component.childFunction(component.searchFilter);

    // Assert
    expect(component.searchFilter).toEqual(["bulb", "grass"]);
    expect(component.range).toEqual([0, 20]);
    expect(component.max_load).toEqual(0);
    expect(mockPokemonService.fetchPokemonByType).toHaveBeenCalledWith("grass");
    expect(component.checkNav).toHaveBeenCalled();
    expect(component.getItemsFromIndex).toHaveBeenCalled();
    // Add more assertions as needed.
  });

  it('should disable right button and enable left button when checkNav is called with a long list', () => {
    // Arrange
    component.pokemonList= mockPokemonData

    // Act
    component.checkNav();

    // Assert
    expect(component.rightDisable).toBe(false);
    expect(component.leftDisable).toBe(true);
    // Add more assertions as needed.
  });

  it('should disable both navigation buttons when checkNav is called with a short list', () => {
    // Arrange
    component.pokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      // Add more Pokemon objects as needed for testing.
    ];

    // Act
    component.checkNav();

    // Assert
    expect(component.rightDisable).toBe(true);
    expect(component.leftDisable).toBe(true);
    // Add more assertions as needed.
  });

  it('should update range and disable left button when selectPrevious is called and at the beginning of the list', () => {
    // Arrange
    component.pokemonList = [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ];
    component.range = [0, 2];

    // Act
    component.selectPrevious();

    // Assert
    expect(component.range).toEqual([0, 2]);
    expect(component.leftDisable).toBe(true);
    // Add more assertions as needed.
  });

  // Add more test cases for other methods and scenarios as needed.

  afterEach(() => {
    // Add any additional cleanup if necessary.
  });
});
