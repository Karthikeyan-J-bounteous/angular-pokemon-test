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
  pokemonObservable$: Observable<Pokemon[]>;
  searchFilter: [String, String] = ["", "clear"];
  pokemonList: Pokemon[];
  allPokemonList: Pokemon[];
  pokemonRange: Pokemon[];
  max_load: number = 0;
  range: [number, number] = [0, 20];

  rightDisable: boolean = false;
  leftDisable: boolean = true;

  constructor(private store: Store, private pokemonService: PokemonService) {
    this.pokemonObservable$ = this.store.select(selectPokemon);
  }

  ngOnInit(): void {
    this.pokemonObservable$.subscribe((pokemonList: Pokemon[]) => {
      this.allPokemonList = pokemonList;
      this.pokemonList = this.allPokemonList;
      this.getItemsFromIndex();
    });
  }

  getItemsFromIndex() {
    this.pokemonRange = this.pokemonList.slice(this.range[0], this.range[0] + this.range[1]);

    if (this.max_load < this.range[0] + 20) {
      for (let poke of this.pokemonRange) {
        this.store.dispatch(fetchPokemon({ name: poke.name }));
      }
      this.max_load = this.max_load < this.range[0] ? this.range[0] : this.max_load;
    }
  }

  childFunction(value: [String, String]) {
    this.searchFilter = value;
    this.range = [0, 20];
    this.max_load = 0;
    this.pokemonList = this.allPokemonList;

    if (this.searchFilter[0] == "" && this.searchFilter[1] == 'clear') {
      this.checkNav();
      this.getItemsFromIndex();
    }

    else if (this.searchFilter[0] != "" && this.searchFilter[1] == 'clear') {
      this.pokemonList = this.allPokemonList.filter(pokemon => pokemon.name.includes(<string>this.searchFilter[0]));
      this.checkNav();
      this.getItemsFromIndex();
    }

    else if (this.searchFilter[0] == "" && this.searchFilter[1] != 'clear') {
      this.pokemonService.fetchPokemonByType(this.searchFilter[1]).subscribe((data) => {
        let sortedByType: any = [];
        data.pokemon.forEach((poke: any) => {
          sortedByType.push(poke.pokemon.name);
          this.pokemonList = this.allPokemonList.filter(pokemon => sortedByType.includes(pokemon.name));
        });
        this.checkNav()
        this.getItemsFromIndex();
      });
    }

    else if (this.searchFilter[0] != "" && this.searchFilter[1] != 'clear'){
      this.pokemonService.fetchPokemonByType(this.searchFilter[1]).subscribe((data) => {
        let sortedByType: any = [];
        data.pokemon.forEach((poke: any) => {
          sortedByType.push(poke.pokemon.name);
          this.pokemonList = this.allPokemonList.filter(pokemon => sortedByType.includes(pokemon.name));
          this.pokemonList = this.pokemonList.filter(pokemon => pokemon.name.includes(<string>this.searchFilter[0]));
        });
        this.checkNav();
        this.getItemsFromIndex();
      });
    } 
  }

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

  selectNext() {
    if (this.range[0] + this.range[1] < this.pokemonList.length) {
      this.range[0] += this.range[1];
      this.getItemsFromIndex();
      this.leftDisable = false;
    }
    if(this.range[0] + this.range[1] > this.pokemonList.length) {
      this.rightDisable = true;
    }
  }

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






