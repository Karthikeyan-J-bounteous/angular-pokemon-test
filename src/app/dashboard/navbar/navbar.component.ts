import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadPokemon } from 'src/app/store/pokemon.actions';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { selectPokemon } from 'src/app/store/pokemon.selectors';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  collapsed: boolean = true; // Initialize a boolean variable for managing collapsed state
  @Output() valueChanged = new EventEmitter<[String, String]>(); // Create an output event emitter for communicating changes
  emitValues: [String, String] = ["", "clear"]; // Initialize an array for emitting values
  selectedType: string = "Type"; // Initialize a string for the selected type filter

  typeNames = [
    "clear",
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
    "unknown",
    "shadow"
  ];

  pokemonData: Pokemon[] = []; // Initialize an array to store Pokemon data
  pokemonName: string[] = []; // Initialize an array to store Pokemon names
  suggestion: string[] = []; // Initialize an array for search suggestions
  searchQuery = ''; // Initialize a string for the search query
  searchSubject = new Subject<string>(); // Create a subject for handling search input changes

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Subscribe to changes in the search input with debounce and distinctUntilChanged
    this.searchSubject
    .pipe(
      debounceTime(400), // Adjust the debounce time as needed (milliseconds)
      distinctUntilChanged()
    )
    .subscribe(query => {
      // Update suggestions based on the search query
      this.suggestion = this.getSuggestions(query);
    });

    // Dispatch the action to load Pokemon data from the store
    this.store.dispatch(loadPokemon());

    // Subscribe to changes in the Pokemon data from the store
    this.store.select(selectPokemon).subscribe((data) => {
      if (data) {
        // Update the component's Pokemon data and Pokemon names
        this.pokemonData = data;
        this.pokemonName = [];
        this.pokemonData.forEach((pokemon) => {
          this.pokemonName.push(pokemon.name);
        })
      }
    });
  }

  // Handle changes in the search input
  onSearchInput(event: any) {
    const query = event.target.value;
    if(query){
      this.searchSubject.next(query); // Emit the search query to the subject
    }
    else{
      this.suggestion = []; // Clear suggestions if the query is empty
    }
  }

  // Generate search suggestions based on the query
  getSuggestions(query: string): string[] {
    return this.pokemonName.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Generate CSS class for the type filter buttons
  loadClass(type: string){
    return "navbar__filters__button__"+type;
  }

  // Handle a click on a type filter button
  typeClick(type: string){
    if(type === 'clear'){
      this.selectedType = 'Type'; // Reset the selected type to the default label
      this.emitValues[0] = ''; // Clear the first value in emitValues
      this.searchQuery = ""; // Clear the search query
    }
    else{
      this.selectedType = type; // Update the selected type
    }
    this.emitValues[1] = type; // Update the second value in emitValues
    this.valueChanged.emit(this.emitValues); // Emit the updated values
  }

  // Handle pressing Enter in the search input
  searchEnter(){
    this.emitValues[0] = this.searchQuery.toLowerCase(); // Update the first value in emitValues with the lowercase query
    this.valueChanged.emit(this.emitValues); // Emit the updated values
  }
}
