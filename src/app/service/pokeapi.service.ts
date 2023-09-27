import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private all_poke_url: string = "https://pokeapi.co/api/v2/pokemon?limit=1281";
  private url: string = "https://pokeapi.co/api/v2/pokemon/"
  private urlType: string = "https://pokeapi.co/api/v2/type/"
  constructor(private http: HttpClient) { }

  fetchPokemon(): Observable<any> {
    return this.http.get(this.all_poke_url);
  }

  fetchPokemonByName(name: string): Observable<any> {
    return this.http.get(this.url+name);
  }

  fetchPokemonByType(type: String): Observable<any> {
    return this.http.get(this.urlType+type);
  }
}
