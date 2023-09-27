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

  @Input() name: string;
  exp !: string;
  findPokemon$: Observable<Pokedex>;
  pokemon: Pokedex = null;

  constructor(private store: Store, private router: Router) {
   }

   ngOnInit(): void {
    this.findPokemon$ = this.store.select(selectPokemonbyName(this.name));
    this.findPokemon$.subscribe((data) => {
    if(data){
      this.pokemon = data;
      this.loadExp();
    }
});
}

loadExp(){
  this.exp = 'width:' + this.pokemon?.base_experience/8 + '%';
}
loadClass(type: string){
  return ("card__type__button__" + type)
}

onClickCard(name : string){
  this.router.navigate(['/content'], { queryParams: { name: name }, queryParamsHandling: 'merge' });

}

}
