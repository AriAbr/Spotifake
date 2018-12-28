import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });
    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentIndex: 0,
      isPlaying: false,
      wasPlaying: false
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  play(index) {
    this.audioElement.play();
    this.setState({ isPlaying:true, wasPlaying: true });
    //change numCell to pause icon
    const newSongNumCell = document.getElementById('songNumCell ' + index);
    const spanElem = document.createElement('span');
    spanElem.className = "ion-pause";
    newSongNumCell.innerText = '';
    newSongNumCell.prepend(spanElem)
  }

  pause(index) {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
    //change numCell to play icon
    const newSongNumCell = document.getElementById('songNumCell ' + index);
    const spanElem = document.createElement('span');
    spanElem.className = "ion-play";
    newSongNumCell.innerText = '';
    newSongNumCell.prepend(spanElem)
  }

  setSong(song, index) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song, currentIndex: index });
  }

  handleSongClick(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause(index);
    } else {
      if (!isSameSong) {
        //reset last songNumCell to number
        const lastSongNumCell = document.getElementById('songNumCell ' + this.state.currentIndex);
        lastSongNumCell.innerText = this.state.currentIndex+1;
        //setState to new song
        this.setSong(song, index) }
      //play new song
      this.play(index);
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    //reset last songNumCell to number
    const lastSongNumCell = document.getElementById('songNumCell ' + this.state.currentIndex);
    lastSongNumCell.innerText = this.state.currentIndex+1;
    //play prev saong, reset current index
    const newIndex = Math.max(0, currentIndex-1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong, newIndex);
    this.play(newIndex);
  }

  handleMouseEnter(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (!isSameSong || !this.state.isPlaying) {
      //change numCell to play icon
      const songNumCell = document.getElementById('songNumCell ' + index);
      const spanElem = document.createElement('span')
      spanElem.className = "ion-play"
      songNumCell.innerText = '';
      songNumCell.prepend(spanElem)
    }
  }

  handleMouseLeave(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (!isSameSong || !this.state.wasPlaying) {
      //change numCell to number. Won't execute on the first song on open even though it is the "current song".
      const songNumCell = document.getElementById('songNumCell ' + index);
      songNumCell.innerText = index+1;
    }
  }

  render() {
    const songs = this.state.album.songs.map( (song, index) =>
      <tr
        className="song"
        key={index}
        onClick={() => this.handleSongClick(song, index)}
        onMouseEnter={() => this.handleMouseEnter(song, index)}
        onMouseLeave={() => this.handleMouseLeave(song, index)}
      >
        <td id={'songNumCell ' + index}>{index+1}</td>
        <td>{song.title}</td>
        <td>{song.duration}</td>
      </tr>
    )
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 id="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
          <table id="song-list">
            <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
            </colgroup>
            <tbody>
              { songs }
            </tbody>
          </table>
          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong= {this.state.currentSong}
            handleSongClick={() => this.handleSongClick(this.state.currentSong, this.state.currentIndex)}
            handlePrevClick={() => this.handlePrevClick()}
          />
        </section>
      </section>
    );
  }
}

export default Album
