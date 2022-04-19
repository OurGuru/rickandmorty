import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Episode } from "./episode.model";
import { Character } from "../characters/character.model";

@Injectable({
  providedIn: 'root'
})
export class EpisodeService{
  constructor(private http:HttpClient){}

  nextPage = 'https://rickandmortyapi.com/api/episode?page=1';
  characters: Character[] = [];
  charactersList;

  getEpisodes(): Observable<Episode[]>{
    if (this.nextPage === null){
      return null;
    }
    return this.http.get<Episode[]>(this.nextPage)
      .pipe(
        map(data => {
          console.log(data);
          this.nextPage = data['info']['next'];
          return data['results'];
        })
      )
  }

  getEpisode(id: number): Observable<Episode>{
    return this.http.get<Episode>(`https://rickandmortyapi.com/api/episode/${id}`);
  }

  getCharacters(characters: string[]): Observable<Character[]>{
    return this.http.get<Character[]>(`https://rickandmortyapi.com/api/character?id=${characters}`)
      .pipe(
        map(data => data['results'])
      )
  }
  getEpisodeCharacters(id: string): Observable<Character[]>{
    return this.http.get<Character[]>(`https://rickandmortyapi.com/api/character/${id}`)
      // .pipe(
      //   map(data => data['characters'])
      // )
  }

}
