import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { loadPokemon } from 'src/app/store/pokemon.actions';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { selectPokemon } from 'src/app/store/pokemon.selectors';
import { pokemonReducer } from 'src/app/store/pokemon.reducer';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent], // Declare the component being tested
      imports: [
        FormsModule, // Import FormsModule for ngModel
        StoreModule.forRoot({ pokemon: pokemonReducer }), // Set up NgRx store for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent); // Create a component fixture for testing
    component = fixture.componentInstance; // Initialize the component instance
    store = TestBed.inject(Store); // Inject the NgRx Store service
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Check if the component was created successfully
  });

  it('should dispatch loadPokemon action on ngOnInit', () => {
    spyOn(store, 'dispatch'); // Create a spy for the store.dispatch method
    component.ngOnInit(); // Call the ngOnInit method of the component
    expect(store.dispatch).toHaveBeenCalledWith(loadPokemon()); // Expect that the loadPokemon action was dispatched
  });

  it('should update suggestions when onSearchInput is called', () => {
    const query = 'pikachu';
    const suggestions = ['Pikachu', 'Pikachu2']; // Mock suggestions
    spyOn(component.searchSubject, 'next');
    spyOn(component, 'getSuggestions').and.returnValue(suggestions);

    component.onSearchInput({ target: { value: query } });
    expect(component.searchSubject.next).toHaveBeenCalledWith(query);
    component.suggestion = suggestions;
    expect(component.suggestion).toEqual(suggestions);
  });


  it('should clear suggestions when onSearchInput is called with an empty query', () => {
    component.suggestion = ['Pikachu']; // Initialize with some suggestions
    component.onSearchInput({ target: { value: '' } }); // Simulate empty user input
    expect(component.suggestion).toEqual([]); // Expect that the suggestions were cleared
  });

  it('should emit values when typeClick is called', () => {
    spyOn(component.valueChanged, 'emit'); // Create a spy for the valueChanged event emitter's emit method
    const type = 'fire'; // Define a sample type
    component.emitValues[0] = "";
    component.emitValues[1] = "";
    component.typeClick(type); // Call the typeClick method
    expect(component.emitValues).toEqual(["", type]); // Expect that values were emitted correctly
    expect(component.valueChanged.emit).toHaveBeenCalledWith(["", type]); // Expect that the emit method was called with the correct values
  });

  it('should update suggestions when getSuggestions is called', () => {
    const query = 'pik';
    const mockData: Pokemon[] = [
      { name: 'pikachu', url: "" },
      { name: 'pikachu2', url: "" },
      { name: 'bulbasaur', url: "" },
    ];

    const pokemonNames: string[] = ["pikachu", "pikachu2", "raichu"];

    component.pokemonName = pokemonNames;
    component.pokemonData = mockData;
    const suggestions = component.getSuggestions(query);
    expect(suggestions).toEqual(['pikachu', 'pikachu2']);
  });

  it('should reset values when typeClick is called with "clear"', () => {
    spyOn(component.valueChanged, 'emit'); // Create a spy for the valueChanged event emitter's emit method
    component.selectedType = 'fire'; // Set a sample selectedType
    component.typeClick('clear'); // Call typeClick with "clear"
    expect(component.selectedType).toEqual('Type'); // Expect that the selectedType was reset
    expect(component.emitValues).toEqual(['', 'clear']); // Expect that values were emitted correctly
    expect(component.valueChanged.emit).toHaveBeenCalledWith(['', 'clear']); // Expect that the emit method was called with the correct values
  });

  it('should emit values when searchEnter is called', () => {
    spyOn(component.valueChanged, 'emit'); // Create a spy for the valueChanged event emitter's emit method
    const query = 'pikachu'; // Define a sample query
    component.searchQuery = query; // Set the component's searchQuery
    component.searchEnter(); // Call the searchEnter method
    expect(component.emitValues).toEqual([query.toLowerCase(), 'clear']); // Expect that values were emitted correctly
    expect(component.valueChanged.emit).toHaveBeenCalledWith([query.toLowerCase(), 'clear']); // Expect that the emit method was called with the correct values
  });
});
