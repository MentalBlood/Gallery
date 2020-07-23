import React, {Component} from 'react';
import loadingAnimation from './images/loadingAnimation.gif';

class LoadingImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }

    render() {
        const image = <img {...this.props} onLoad={
            () => this.setState({loaded: true})
        } style={this.state.loaded ? {} : {display: 'none'}}></img>;
        return (
            <React.Fragment>
                {image}
                {
                    this.state.loaded ?
                    null
                    :
                    <img className={image.props.className} src={loadingAnimation}></img>
                }
            </React.Fragment>
        )
    }
}

export default LoadingImage;