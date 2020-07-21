import React, {Component} from 'react';
import './App.css';
import Authors from './Authors.js';
import Albums from './Albums.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'authors',
            currentAuthorId: undefined
        }

        this.openAuthor = this.openAuthor.bind(this);
        this.getCurrentScreenComponent = this.getCurrentScreenComponent.bind(this);
    }

    openAuthor(authorId) {
        this.setState({
            currentScreen: 'albums',
            currentAuthorId: authorId
        });
    }

    getCurrentScreenComponent() {
        const currentScreen = this.state.currentScreen;
        switch(currentScreen) {
            case 'authors':
                return <Authors onAuthorClick={this.openAuthor}></Authors>;
            case 'albums':
                return <Albums></Albums>;
        }
    }

    render() {
        return (
            <div className="app">
                <div className="appHeader"></div>
                <div className="appMain">
                    {
                        this.getCurrentScreenComponent()
                    }
                </div>
            </div>
        );
    }
}

export default App;