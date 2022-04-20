import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from './character.model';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private http:HttpClient) { }

  nextPage = 'https://rickandmortyapi.com/api/character?page=1';
  getCharacters(): Observable<Character[]>{

    return this.http.get<Character[]>(this.nextPage).pipe(
      map(data =>
        {
          this.nextPage = data['info']['next'];
          return data['results'];
        })
    )
  }

  filterCharacters(nameFilter: string): Observable<Character[]>{
    return this.http.get<Character[]>(`https://rickandmortyapi.com/api/character?name=${nameFilter}`)
      .pipe(
        map(data => data['results']),
        map(data => data.filter(character => character.name.toLowerCase().includes(nameFilter.toLowerCase())))
      )
  }

  getCharacterById(id: number|string): Observable<Character>{
    return this.http.get<Character>(`https://rickandmortyapi.com/api/character/${id}`)
  }
}
