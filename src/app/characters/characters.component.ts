import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Character } from './character.model';
import { CharacterService } from './character.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SingleCharacterComponent } from './single-character/single-character.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit, OnDestroy {
  constructor(private characterservice: CharacterService,
              private route:ActivatedRoute,
              private router: Router,
              public dialog: MatDialog
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
  singleCharacterIndex: number;
  singleCharacterName: string;

  singleCharacter: Character



  myControl = new FormControl();
  filteredOptions: Character[];

  openDialog(singleCharacter: Character){
    let dialogRef = this.dialog.open(SingleCharacterComponent, {
      data: {
        character: singleCharacter
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/characters'], {queryParams: {id: null}});
    });
  }

  autoCompleteSelection(event: any) {

    this.singleCharacter = this.filteredOptions.find(character => character.name === event);
    this.filteredOptions = [];
    this.myControl.setValue('');
    this.openDialog(this.singleCharacter);
    // this.router.navigate(['/characters'], {queryParams: {id: this.singleCharacter.id}});


  }


  onScroll() {
    console.log('scrolled');
    if (this.notscrolly && this.notEmptyPost) {
      this.notscrolly = false;
      this.charactersPage++;
      this.getCharacters();
      this.notscrolly = true;
    }
  }

  getCharacters() {
    this.isLoading = true;
    if (this.characterservice.nextPage) {
      this.characterservice.getCharacters().subscribe((data: Character[]) => {
        this.characters = this.characters.concat(data);
        this.isLoading = false;
      });
    } else {
      this.notEmptyPost = false;
      this.isLoading = false;
    }
  }

  query;

  ngOnInit(){
    this.getCharacters();
    if(this.route.snapshot.queryParamMap.get('id')){
      this.characterservice.getCharacterById(+this.route.snapshot.queryParamMap.get('id')).subscribe(data => {
      this.singleCharacter = data;
      this.openDialog(this.singleCharacter);
    })
    }

    this.myControl.valueChanges
      .pipe(
        filter(value => value.length > 1),
        startWith(),
        debounceTime(500),
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
