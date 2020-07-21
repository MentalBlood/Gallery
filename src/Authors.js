import React, {Component} from 'react';
import './Authors.css';

class Authors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authorsList: undefined
        };

        this.fetchAuthors = this.fetchAuthors.bind(this);
    }

    fetchAuthors() {
        console.log('fetchAuthors()');
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => this.setState({authorsList: json}));
    }

    componentWillMount() {
        if (this.state.authorsList === undefined)
            this.fetchAuthors();
    }

    render() {
        const authorsList = this.state.authorsList;
        return (
            <div className="authors">
                {
                    authorsList !== undefined
                    ?
                    authorsList.map(
                        (author, authorIndex) =>
                        <div className="authorCell" key={authorIndex}>
                            <div className="author">
                                <div className="authorName">{author.name}</div>
                            </div>
                        </div>
                    )
                    : null
                }
            </div>
        );
    }
}

export default Authors;