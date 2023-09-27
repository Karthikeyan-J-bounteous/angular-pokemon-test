import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PokemonState } from './pokemon.reducer';

const selectPokemonState = createFeatureSelector<PokemonState>('pokemon');

export const selectPokemon = createSelector(
  selectPokemonState,
  (state) => state.pokemon
);

export const selectError = createSelector(
  selectPokemonState,
  (state) => state.error
);

export const selectPokemonbyName = (name: string) => createSelector(
  selectPokemonState,
  (state) =>
      state.pokedexData.find((pokemon) => pokemon.name === name)
);

export const selectPokedex = createSelector(
    selectPokemonState,
    (state) => state.pokedexData
  );

  export const selectPokedexError = createSelector(
    selectPokemonState,
    (state) => state.pokedex_error
  );
