import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Character } from '../characters/character.model';
import { CharacterService } from '../characters/character.service';
import { SingleCharacterComponent } from '../characters/single-character/single-character.component';
import { Episode } from './episode.model';
import { EpisodeService } from './episode.service';

@Component({
  selector: 'app-episodes',
  templateUrl: './episodes.component.html',
  styleUrls: ['./episodes.component.css']
})
export class EpisodesComponent implements OnInit, OnDestroy{

  constructor(private episodeService:EpisodeService,
              public dialog: MatDialog,
              ){}

  openDialog(singleCharacter: Character){
    this.dialog.open(SingleCharacterComponent, {
      data: {
        character: singleCharacter
      }
    });
  }
  notEmptyPost = true;
  notscrolly = true;
  episodessPage = 1;
  ngOnInit(): void {
    this.getEpisodes();
  }

  isLoading = false;
  episodes: Episode[] = [];

  getEpisodes(){
    this.isLoading = true;
    if (this.episodeService.nextPage){
      this.episodeService.getEpisodes().subscribe(episodes => {
        this.episodes = this.episodes.concat(episodes);
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
      this.notEmptyPost = false;
    }
  }


  onScroll() {
    console.log('scrolled');
    if (this.notscrolly && this.notEmptyPost) {
      this.notscrolly = false;
      // this.getNextCharacters();
      this.getEpisodes();
      this.notscrolly = true;
    }
  }

  getEpisodeCharacters(episode: number){
    let episodeIds = this.episodes[episode].characters.map(character => character.split('/')[5]);
    let episodeCharacters = episodeIds.join(',');
    this.episodeService.getEpisodeCharacters(episodeCharacters).subscribe(characters => {
      this.episodes[episode-1].charactersFull = characters;
    })
  }

  ngOnDestroy(){
    this.episodeService.nextPage = 'https://rickandmortyapi.com/api/episode?page=1';
  }
}
