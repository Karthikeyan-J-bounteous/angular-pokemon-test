import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectPokemonbyName } from 'src/app/store/pokemon.selectors';
import { Pokedex } from 'src/app/interfaces/pokedex';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {

  @Input() name: string;  // getting name of pokemon assigned from parent (content)
  exp !: string;  // To store the exp of pokemon
  findPokemon$: Observable<Pokedex>;  // observeable to make api call and store pokemon in ngStore
  pokemon: Pokedex = null;

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
    this.findPokemon$ = this.store.select(selectPokemonbyName(this.name));  // making an api call with pokemon to store the detail of a pokemon with detail in ngStore

    // Getting the pokemon detail data from store
    this.findPokemon$.subscribe((data) => {
      if (data) {
        this.pokemon = data;
        this.loadExp();  // helper function to provide exp bar
      }
    });
  }
  // helper function to provide exp bar
  loadExp(): void {
    this.exp = 'width:' + this.pokemon?.base_experience / 8 + '%';
  }

  // helper function to provide class for type accordian
  loadClass(type: string): string {
    return ("card__type__button__" + type)
  }

  // function triggered when card is clicked
  onClickCard(name: string): void {
    //naviagte to content page
    this.router.navigate(['/content'], { queryParams: { name: name }, queryParamsHandling: 'merge' });
  }
}
