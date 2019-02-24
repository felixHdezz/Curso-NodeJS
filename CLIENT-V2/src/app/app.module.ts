import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing,  appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';

import {HomeComponent } from './components/home.component';
import {UserEditComponent } from './components/user-edit.component';

// Import artist
import {ArtistListComponent} from './components/artist-list.component';
import {ArtistAddComponent} from './components/artist-add.component';
import {ArtistEditComponent} from './components/artist-edit.component';
import {ArtistDetailComponent} from './components/artist-detail.component';

// Import album
import {AlbumAddComponent } from './components/album-add.component';
import {AlbumEditComponent } from './components/album-edit.component';
import {AlbumDetailComponent } from './components/album-detail.component';

// Import Song
import {SongAddComponent } from './components/song-add.component';
import {SongEditComponent } from './components/song-edit.omponent';

// Import player
import {PlayerComponent } from './components/player.component';

import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
