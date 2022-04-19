import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Character } from '../character.model';


@Component({
  selector: 'app-single-character',
  templateUrl: './single-character.component.html',
  styleUrls: ['./single-character.component.css']
})
export class SingleCharacterComponent implements OnInit, OnDestroy {

  id:number;
  singleCharacter: Character = this.data.character;
  private sub: any;
  constructor(private route:ActivatedRoute,
              public dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    // const singleCharacter = this.data.character;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(this.id);
   }
  );
   console.log(this.data);
   console.log(this.data);
  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
