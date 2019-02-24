import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home.component';
import { UserEditComponent } from './components/user-edit.component';

// Import artist
import { ArtistListComponent} from './components/artist-list.component';
import { ArtistAddComponent} from './components/artist-add.component';
import { ArtistEditComponent} from './components/artist-edit.component';
import { ArtistDetailComponent} from './components/artist-detail.component';

// Import album
import { AlbumAddComponent } from './components/album-add.component';
import {AlbumEditComponent } from './components/album-edit.component';
import {AlbumDetailComponent } from './components/album-detail.component';

// Import song
import {SongAddComponent } from './components/song-add.component';
import {SongEditComponent } from './components/song-edit.omponent';


const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'artists/:page', component: ArtistListComponent },
    { path: 'artist/create', component: ArtistAddComponent },
    { path: 'artist/edit/:id', component: ArtistEditComponent },
    { path: 'artist/detail/:id', component: ArtistDetailComponent },
    { path: 'album/create/:artist', component: AlbumAddComponent },
    { path: 'album/edit/:id', component: AlbumEditComponent },
    { path: 'album/detail/:id', component: AlbumDetailComponent },
    { path: 'song/create/:album', component: SongAddComponent },
    { path: 'song/edit/:id', component: SongEditComponent },
    { path: 'mi-perfil', component: UserEditComponent },
    { path: '**', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

