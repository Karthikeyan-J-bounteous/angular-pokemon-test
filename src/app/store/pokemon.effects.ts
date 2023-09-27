import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { PokemonService } from '../service/pokeapi.service';
import * as PokemonActions from './pokemon.actions';
import { Store } from '@ngrx/store';
import { selectPokedex } from './pokemon.selectors';

@Injectable()
export class PokemonEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private pokemonService: PokemonService
  ) {}

  loadPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadPokemon),
      mergeMap(() =>
        this.pokemonService.fetchPokemon().pipe(
          map((pokemonData) =>
            PokemonActions.loadPokemonSuccess({ pokemon: pokemonData.results })
          ),
          catchError((error) =>
            of(PokemonActions.loadPokemonFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadPokedex$ = createEffect(() => 
  this.actions$.pipe(
    ofType(PokemonActions.fetchPokemon),
    mergeMap(({ name }) =>
    this.pokemonService.fetchPokemonByName(name).pipe(
        map((pokedex) => PokemonActions.loadPokedexSuccess({ pokedex })
        ),
        catchError((error)=> 
        of(PokemonActions.loadPokedexFailure({pokedex_error: error.message})))
    )
    )
  )
  );
}
