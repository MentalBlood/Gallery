import React, {Component} from 'react';
import './App.css';
import List from './List.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'authors',
            currentAuthorId: undefined,
            currentAlbumId: undefined
        }

        this.openAuthor = this.openAuthor.bind(this);
        this.openAlbum = this.openAlbum.bind(this);
        this.goBack = this.goBack.bind(this);
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

    getCurrentScreenHTML() {
        const currentScreen = this.state.currentScreen;
        switch(currentScreen) {
            case 'authors':
                return <List listAdditionalClasses={["authors"]}
                            elementAdditionalClasses={["author"]}
                            getElementInnerHTML={
                                author => <div className="authorName">{author.name}</div>
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
                                    <img src={resources.cover}></img>
                                    <div className="albumTitle">{album.title}</div>
                                    <div className="amountOfPhoto">{resources.amountOfPhoto}</div>
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
                                    <img src={resources.thumbnail}></img>
                                    <div className="photoTitle">{photo.title}</div>
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
                            onElementClick={() => {}}
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
        return (
            <div className="app">
                <div className="appHeader">
                    {
                        this.state.currentScreen === "authors" ?
                        null
                        :
                        <button className="backButton"
                            onClick={this.goBack}>Back</button>
                    }
                </div>
                <div className="appMain">
                    {
                        this.getCurrentScreenHTML()
                    }
                </div>
            </div>
        );
    }
}

export default App;