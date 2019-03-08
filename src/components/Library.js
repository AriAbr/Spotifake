import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';

class Library extends Component {
  constructor (props) {
    super(props);
    this.state = { albums: albumData }
  }

  render () {
    return (
      <section className='library'>
        <header className="inner-header">
          <h1>Spotifake</h1>
          <nav>
            <Link to='/'>Home</Link>
            <Link to='/library'>Library</Link>
          </nav>
        </header>
        <section id="library-albums">
          {
            this.state.albums.map ( (album, index) =>
              <Link to={`/album/${album.slug}`} key={index} className="library-album">
                <img src={album.albumCover} alt={album.title}  className="library-album-cover" />
                <div>{album.title}</div>
                <div>{album.artist}</div>
                <div>{album.songs.length} songs</div>
              </Link>
            )
          }
        </section>
      </section>
    );
  }
}

export default Library;
