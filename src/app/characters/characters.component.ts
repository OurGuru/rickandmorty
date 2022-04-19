import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Character } from './character.model';
import { CharacterService } from './character.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SingleCharacterComponent } from './single-character/single-character.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit, OnDestroy {
  // singleCharacter
  constructor(private characterservice: CharacterService,
    private route:ActivatedRoute,
    ) {

      this.route.queryParams.subscribe(params => {
        this.singleCharacterIndex = params['id'];
      })
    }

  characters: Character[] = [];
  charactersPage: number = 1;
  isLoading = true;
  notEmptyPost = true;
  notscrolly = true;
  singleCharacterActive = false;
  singleCharacterIndex: number;
  // singleCharacterParam: Observable<any>;
  singleCharacterName: string;

  singleCharacter: Character



  myControl = new FormControl();
  filteredOptions: Character[];

  autoCompleteSelection(event: any) {

    this.singleCharacter = this.filteredOptions.find(character => character.name === event);
    this.singleCharacterIndex = this.singleCharacter.id;
    this.singleCharacterActive = true;
    // console.log(this.singleCharacterIndex)
    this.filteredOptions = [];
    this.myControl.setValue('');
    // this.myControl.reset('')

  }


  onScroll() {
    console.log('scrolled');
    if (this.notscrolly && this.notEmptyPost) {
      this.notscrolly = false;
      // this.getNextCharacters();
      this.charactersPage++;
      this.getCharacters();
      this.notscrolly = true;
    }
  }

  getCharacters() {
    this.isLoading = true;
    // console.log(this.isLoading)
    if (this.characterservice.nextPage) {
      this.characterservice.getCharacters().subscribe((data: Character[]) => {
        // console.log(data);
        // this.characterservice.nextPage = data['info']['next'];
        this.characters = this.characters.concat(data);
        this.isLoading = false;
      });
    } else {
      this.notEmptyPost = false;
      this.isLoading = false;
    }
    // console.log(this.isLoading)
  }

  query;

  ngOnInit(){
    console.log(this.charactersPage)
    this.getCharacters();
    // console.log(this.singleCharacterName)
    if(this.route.snapshot.queryParamMap.get('id')){
      // this.singleCharacterIndex = this.route.snapshot.queryParamMap.get('id');
      this.characterservice.getCharacterById(+this.route.snapshot.queryParamMap.get('id')).subscribe(data => {
      this.singleCharacter = data;
      this.singleCharacterActive = true;
      })
    }

    this.myControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.isLoading = true)),
        switchMap((value) =>
          this.characterservice.filterCharacters(value).pipe(
            finalize(() => (this.isLoading = false)),
            catchError(() => of([]))
          )
        )
      )
      .subscribe(
        (data) => (this.filteredOptions = data),
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.filteredOptions = [];
        }
      );

  }

  displayFn(subject: any) {
    return subject ? subject.name : undefined;
  }


  ngOnDestroy() {
    this.characterservice.nextPage = 'https://rickandmortyapi.com/api/character?page=1';
  }
}
