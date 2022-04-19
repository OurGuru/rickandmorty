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
  // episodesPage: number = 1;
  // notEmptyPost = true;
  // notscrolly = true;
  // singleEpisodeActive = false;
  // // singleEpisodeIndex: number;
  // singleEpisode: any;

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
    //make a list of the IDs of the characters in the episode then make convert the list to a comma separated string
    console.log(episode)
    let episodeIds = this.episodes[episode].characters.map(character => character.split('/')[5]);
    // console.log(episodeIds)
    let episodeCharacters = episodeIds.join(',');
    // console.log(episodeCharacters)
    // console.log(episode)
    this.episodeService.getEpisodeCharacters(episodeCharacters).subscribe(characters => {
      this.episodes[episode-1].charactersFull = characters;
      // characters.map(character => {
      //   console.log(this.episodes[episode])

      //   this.episodes[episode].charactersFull.push(character)
      // } )
    })
  }

  ngOnDestroy(){
    this.episodeService.nextPage = 'https://rickandmortyapi.com/api/episode?page=1';
  }
}
