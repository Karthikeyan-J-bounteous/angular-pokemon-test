import { TestBed } from '@angular/core/testing';
import { PokemonService } from './pokeapi.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService],
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch Pokemon list', () => {
    const mockResponse = { results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }] };
    
    service.fetchPokemon().subscribe((data) => {
      expect(data.results.length).toBe(2);
      expect(data.results[0].name).toBe('bulbasaur');
      expect(data.results[1].name).toBe('ivysaur');
    });

    const req = httpMock.expectOne(service['all_poke_url']);
    expect(req.request.method).toBe('GET');
    
    req.flush(mockResponse);
  });

  it('should fetch Pokemon by name', () => {
    const mockResponse = { name: 'bulbasaur' };
    const pokemonName = 'bulbasaur';
    
    service.fetchPokemonByName(pokemonName).subscribe((data) => {
      expect(data.name).toBe('bulbasaur');
    });

    const req = httpMock.expectOne(service['url'] + pokemonName);
    expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
  });

  it('should fetch Pokemon by type', () => {
    const mockResponse = { name: 'fire' };
    const type = 'fire';
    
    service.fetchPokemonByType(type).subscribe((data) => {
      expect(data.name).toBe('fire');
    });

    const req = httpMock.expectOne(service['urlType'] + type);
    expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
