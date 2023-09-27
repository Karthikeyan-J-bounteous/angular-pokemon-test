import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Pokedex } from '../interfaces/pokedex';
import { selectPokemonbyName } from '../store/pokemon.selectors';
import { fetchPokemon } from '../store/pokemon.actions';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss']
})
export class DetailsPageComponent {
  // Observable to store the selected Pokemon's data
  findPokemon$: Observable<Pokedex>;

  // Variable to hold the selected Pokemon's data
  pokemon: Pokedex = null;

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Subscribe to query parameters in the route
    this.route.queryParams.subscribe((params) => {
      // Select the Pokemon from the store using its name
      this.findPokemon$ = this.store.select(selectPokemonbyName(params.name));

      // Subscribe to the selected Pokemon's data
      this.findPokemon$.subscribe((data) => {
        if (data) {
          // If data is available in the store, assign it to the 'pokemon' variable
          this.pokemon = data;
        }
        else {
          // If data is not available in the store, dispatch an action to fetch it
          this.store.dispatch(fetchPokemon({ name: params.name }));

          // Navigate to the '/content' route with the Pokemon's name as a query parameter
          // Using queryParamsHandling: 'merge' to preserve existing query parameters
          this.router.navigate(['/content'], { queryParams: { name: params.name }, queryParamsHandling: 'merge' });
        }
      });
    });
  }

  // Function to dynamically generate CSS class for Pokemon types
  loadClass(type: string) {
    return ("details__container__button__" + type);
  }

  // Function to calculate and format the width of progress bars based on experience points
  loadexp(point: number, base?: boolean) {
    if (base) {
      // Calculate width percentage for base experience
      return "width:" + (point * 100 / 700) + "%";
    }
    // Calculate width percentage for regular experience
    return "width:" + (point * 100 / 300) + "%";
  }

  // Function to navigate back to the '/home' route
  redirect() {
    this.router.navigate(['/home']);
  }
}
