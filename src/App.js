import React, {Component} from 'react';
import './App.css';
import List from './List.js';
import Popup from './Popup.js';
import LoadingImage from './LoadingImage.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'authors',
            currentAuthorId: undefined,
            currentAlbumId: undefined,
            popup: {
                show: false,
                photos: undefined,
                currentPhotoId: undefined
            }
        }

        this.openAuthor = this.openAuthor.bind(this);
        this.openAlbum = this.openAlbum.bind(this);
        this.goBack = this.goBack.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }

    openAuthor(authorId) {
        console.log('authorId is', authorId);
        this.setState({
            currentScreen: 'albums',
            currentAuthorId: authorId
        });
    }

    openAlbum(albumId) {
        console.log('albumId is', albumId);
        this.setState({
            currentScreen: 'photos',
            currentAlbumId: albumId
        });
    }

    openPopup(currentPhotoId, photos) {
        this.setState({
            popup: {
                show: true,
                photos: photos,
                currentPhotoId: currentPhotoId
            }
        });
    }

    closePopup() {
        this.setState({
            popup: {
                show: false,
                photos: undefined,
                currentPhotoId: undefined
            }
        });
    }

    getCurrentScreenHTML() {
        const currentScreen = this.state.currentScreen;
        switch(currentScreen) {
            case 'authors':
                return <List listAdditionalClasses={["authors"]}
                            elementAdditionalClasses={["author"]}
                            getElementInnerHTML={
                                author => <div className="title authorName">{author.name}</div>
                            }
                            elementsUrl="https://jsonplaceholder.typicode.com/users"
                            onElementClick={this.openAuthor}
                            key={currentScreen}></List>;
            case 'albums':
                return <List listAdditionalClasses={["albums"]}
                            elementAdditionalClasses={["album"]}
                            getElementInnerHTML={
                                (album, resources) =>
                                <div className="albumInfo">
                                    <div className="albumCoverContainer">
                                        <LoadingImage className="albumCover"
                                            src={resources.cover} alt="Album cover">
                                        </LoadingImage>
                                        <div className="amountOfPhoto">{resources.amountOfPhoto}</div>
                                    </div>
                                    <div className="title albumTitle">{album.title}</div>
                                </div>
                            }
                            elementsUrl={
                                "https://jsonplaceholder.typicode.com/users/"
                                + this.state.currentAuthorId + "/albums"
                            }
                            getElementResources={
                                element => ({
                                    cover: {
                                        url: "https://jsonplaceholder.typicode.com/albums/" +
                                            + element.id + "/photos/",
                                        postProcessing: json => json[0].thumbnailUrl
                                    },
                                    amountOfPhoto: {
                                        url: "https://jsonplaceholder.typicode.com/albums/" +
                                            + element.id + "/photos/",
                                        postProcessing: json => json.length
                                    }
                                })
                            }
                            onElementClick={this.openAlbum}
                            key={currentScreen}></List>;
            case 'photos':
                return <List listAdditionalClasses={["photos"]}
                            elementAdditionalClasses={["photo"]}
                            getElementInnerHTML={
                                (photo, resources) =>
                                <div className="photoInfo">
                                    <div className="imageContainer">
                                        <LoadingImage className="photo"
                                            src={resources.thumbnail} alt="Preview">
                                        </LoadingImage>
                                    </div>
                                    <div className="title photoTitle">{photo.title}</div>
                                </div>
                            }
                            elementsUrl={
                                "https://jsonplaceholder.typicode.com/albums/"
                                + this.state.currentAlbumId + "/photos"
                            }
                            getElementResources={
                                element => ({
                                    thumbnail: {
                                        url: "https://jsonplaceholder.typicode.com/photos/"
                                            + element.id,
                                        postProcessing: json => json.thumbnailUrl
                                    }
                                })
                            }
                            onElementClick={(photoId, photos) => this.openPopup(photoId, photos)}
                            key={currentScreen}></List>;
            default:
                return null;
        };
    }

    goBack() {
        const currentScreen = this.state.currentScreen;
        const newCurrentScreen = {
            'albums': 'authors',
            'photos': 'albums'
        }[currentScreen]
        this.setState({currentScreen: newCurrentScreen});
    }

    render() {
        const currentScreen = this.state.currentScreen;
        const popup = this.state.popup;
        return (
            <div className="app">
                <div className="appHeader">
                    {
                        currentScreen === "authors" ?
                        null
                        :
                        <button className="backButton"
                            onClick={this.goBack}>Back</button>
                    }
                </div>
                <div className="appMain">
                    { this.getCurrentScreenHTML() }
                    {
                        popup.show ?
                        <Popup photos={popup.photos}
                            currentPhotoId={popup.currentPhotoId}
                            closeFunction={this.closePopup}></Popup>
                        :
                        null
                    }
                </div>
            </div>
        );
    }
}

export default App;