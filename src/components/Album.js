import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';
import { Link } from 'react-router-dom';


class Album extends Component {
  constructor(props) {
    super(props);
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });
    this.state = {
      album: album,
      currentIndex: 0,
      currentSong: album.songs[0],
      currentTime: 0,
      currentVolume: 0.8,
      duration: album.songs[0].duration,
      isPlaying: false,
      wasPlaying: false
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = 0.8;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumeChange: e => {
        this.setState({ currentVolume: this.audioElement.currentVolume});
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumeChange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumeChange);
  }

  updateSongNumCell(songIndex, icon) {
    const songNumCell = document.getElementById('songNumCell ' + songIndex);
    if (!icon) {
      songNumCell.innerText = songIndex+1;
    } else {
      const spanElem = document.createElement('span');
      spanElem.className = `ion-${icon}`;
      songNumCell.innerText = '';
      songNumCell.prepend(spanElem);
    }
  }

  play(index) {
    this.audioElement.play();
    this.setState({ isPlaying:true, wasPlaying: true });
    this.updateSongNumCell(index, "pause");
  }

  pause(index) {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
    this.updateSongNumCell(index, "play");
  }

  setSong(song, index) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song, currentIndex: index });
  }

  formatTime(time) {
    if (time >= 0) {
      const wholeTime = Math.floor(time);
      const seconds = wholeTime%60
      const singleSeconds = seconds%10
      const tensSeconds = (seconds-singleSeconds)/10
      const minutes = (wholeTime-seconds)/60
      return `${minutes}:${tensSeconds}${singleSeconds}`
    } else {
      return "-:--"
    }
  }

  handleSongClick(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause(index);
    } else {
      if (!isSameSong) {
        this.updateSongNumCell(this.state.currentIndex);
        //setState to new song
        this.setSong(song, index) }
      //play new song
      this.play(index);
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    this.updateSongNumCell(this.state.currentIndex);
    //play prev saong, reset current index
    const newIndex = Math.max(0, currentIndex-1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong, newIndex);
    this.play(newIndex);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    this.updateSongNumCell(this.state.currentIndex);
    //play prev song, reset current index
    const newIndex = Math.min(this.state.album.songs.length-1, currentIndex+1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong, newIndex);
    this.play(newIndex);
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value
    this.audioElement.volume = newVolume;
    this.setState({ currentVolume: newVolume });
  }

  handleMouseEnter(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (!isSameSong || !this.state.isPlaying) {
    this.updateSongNumCell(index, "play");
    }
  }

  handleMouseLeave(song, index) {
    const isSameSong = this.state.currentSong === song;
    if (!isSameSong || !this.state.wasPlaying) {
      //Won't change first song to play icon on open even though it is the "current song"
      this.updateSongNumCell(index);
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
        <td className="song-title-cell">{song.title}</td>
        <td>{this.formatTime(song.duration)}</td>
      </tr>
    )
    return (
      <section className="album">
        <header className="inner-header">
          <h1>Bloc Jams</h1>
          <nav>
            <Link to='/'>Home</Link>
            <Link to='/library'>Library</Link>
          </nav>
        </header>
        <section id="album-info">
          <div id="album-header">
            <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
            <div className="album-details">
              <h1 id="album-title">{this.state.album.title}</h1>
              <h2 id="artist">{this.state.album.artist}</h2>
              <div id="release-info">{this.state.album.releaseInfo}</div>
            </div>
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
            currentSong={this.state.currentSong}
            currentTime={this.audioElement.currentTime}
            currentVolume={this.audioElement.volume}
            duration={this.audioElement.duration}
            formatTime={(time) => this.formatTime(time)}
            handleSongClick={() => this.handleSongClick(this.state.currentSong, this.state.currentIndex)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}
          />
        </section>
        <div id="playbar-buffer-space"/>
      </section>
    );
  }
}

export default Album
