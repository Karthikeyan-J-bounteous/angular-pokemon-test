import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { PokemonService } from 'src/app/service/pokeapi.service';
import { fetchPokemon } from 'src/app/store/pokemon.actions';
import { Pokemon } from 'src/app/interfaces/pokemon';
import { selectPokemon } from 'src/app/store/pokemon.selectors';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  pokemonObservable$: Observable<Pokemon[]>;  // Observeable to fetch all pokemon list
  searchFilter: [String, String] = ["", "clear"];  // filter to load class from parent
  pokemonList: Pokemon[];  // Store List of pokemon after sorting
  allPokemonList: Pokemon[]; // Store List of all pokemons from store
  pokemonRange: Pokemon[];  // store 20 pokemons per page
  max_load: number = 0;  // To check how many pokemon has been loaded into store
  range: [number, number] = [0, 20]; // To change the pages 

  rightDisable: boolean = false;  // Disable Button for selecting next 20 pokemon button
  leftDisable: boolean = true;  // Disable Button for selecting previous 20 pokemon button

  constructor(private store: Store, private pokemonService: PokemonService) {
    this.pokemonObservable$ = this.store.select(selectPokemon);  // Intitalizing store selector
  }

  ngOnInit(): void {

    // Fetching all pokemon data from store
    this.pokemonObservable$.subscribe((pokemonList: Pokemon[]) => {
      this.allPokemonList = pokemonList;
      this.pokemonList = this.allPokemonList;  // Initially all pokemon is sorted pokemon list
      this.getItemsFromIndex();  // calling this function to load 20 pokemons. fetching 20 pokemons from backend and storing it in store
    });
  }

  // calling this function to load 20 pokemons. fetching 20 pokemons from backend and storing it in store
  getItemsFromIndex() {
    // Slicing 20 pokemon based on first value of range
    this.pokemonRange = this.pokemonList.slice(this.range[0], this.range[0] + this.range[1]);

    // for last page number of pokemon balance
    if (this.max_load < this.range[0] + 20) {
      for (let poke of this.pokemonRange) {
        this.store.dispatch(fetchPokemon({ name: poke.name }));
      }
      this.max_load = this.max_load < this.range[0] ? this.range[0] : this.max_load;
    }
  }

  // Used to pass value from parent Dashboard to child Content
  childFunction(value: [String, String]) {
    this.searchFilter = value;  // Updating search Filter values
    this.range = [0, 20];  // Setting the range back to 0 i.e. vack to first content page
    this.max_load = 0;  // Changing max_load to 0, as next set 20 may or maybe not be stored in store
    this.pokemonList = this.allPokemonList;  // Initializing filtered pokemon list to all pokemon list

    // Condition if filter is cleared
    if (this.searchFilter[0] == "" && this.searchFilter[1] == 'clear') {
      this.checkNav();
      this.getItemsFromIndex();
    }

    // Condition if in filter contains some search value and type is clear
    else if (this.searchFilter[0] != "" && this.searchFilter[1] == 'clear') {
      //  filtering pokemon based on search query
      this.pokemonList = this.allPokemonList.filter(pokemon => pokemon.name.includes(<string>this.searchFilter[0]));
      this.checkNav();
      this.getItemsFromIndex();
    }

    // Condition if in filter contains no search value and has some type is clicked
    else if (this.searchFilter[0] == "" && this.searchFilter[1] != 'clear') {

      // Calling an api call to get the pokemon list based on type
      this.pokemonService.fetchPokemonByType(this.searchFilter[1]).subscribe((data) => {
        let sortedByType: any = [];
        data.pokemon.forEach((poke: any) => {
          sortedByType.push(poke.pokemon.name);  // storing pokemon name from api data into a list
        });
        this.pokemonList = this.allPokemonList.filter(pokemon => sortedByType.includes(pokemon.name));  // filtering all pokemon name from the names of pokemon od that type 
        this.checkNav()
        this.getItemsFromIndex();
      });
    }
    
    // Condition if in filter contains some search value and has some type
    else if (this.searchFilter[0] != "" && this.searchFilter[1] != 'clear') {

      // Calling an api call to get the pokemon list based on type
      this.pokemonService.fetchPokemonByType(this.searchFilter[1]).subscribe((data) => {
        let sortedByType: any = [];
        data.pokemon.forEach((poke: any) => {
          sortedByType.push(poke.pokemon.name);  // storing pokemon name from api data into a list
        });

        // filtering all pokemon name from the names of pokemon od that type and search query
        this.pokemonList = this.allPokemonList.filter(pokemon => sortedByType.includes(pokemon.name) && pokemon.name.includes(<string>this.searchFilter[0]));
        this.checkNav();
        this.getItemsFromIndex();
      });
    }
  }

  // used to disable left or right page nav button
  checkNav() {
    if (this.pokemonList.length > 20) {
      this.rightDisable = false;
      this.leftDisable = true;
    }
    else {
      this.rightDisable = true;
      this.leftDisable = true;
    }
  }

  // used to go to next page of 20 cards
  selectNext() {
    if (this.range[0] + this.range[1] < this.pokemonList.length) {
      this.range[0] += this.range[1];
      this.getItemsFromIndex();
      this.leftDisable = false;
    }
    if (this.range[0] + this.range[1] > this.pokemonList.length) {
      this.rightDisable = true;
    }
  }

  // used to go to previous page of 20 cards
  selectPrevious() {
    if (this.range[0] - this.range[1] > 0) {
      this.range[0] -= this.range[1];
      this.getItemsFromIndex();
      this.rightDisable = false;
    }
    else if (this.range[0] - this.range[1] == 0) {
      this.range[0] -= this.range[1];
      this.getItemsFromIndex();
      this.leftDisable = true;
    }
    else {
      this.leftDisable = true;
    }
  }
}






