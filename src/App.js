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

    getCurrentScreen() {
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
                                album =>
                                <div className="albumInfo">
                                    <div className="albumName">{album.title}</div>
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
                                photo => <div className="photoName">{photo.title}</div>
                            }
                            elementsUrl={
                                "https://jsonplaceholder.typicode.com/albums/"
                                + this.state.currentAlbumId + "/photos"
                            }
                            onElementClick={null}
                            key={currentScreen}></List>;
            default:
                return null;
        };
    }

    render() {
        return (
            <div className="app">
                <div className="appHeader"></div>
                <div className="appMain">
                    {
                        this.getCurrentScreen()
                    }
                </div>
            </div>
        );
    }
}

export default App;