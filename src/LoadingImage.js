import React, {Component} from 'react';
import loadingAnimation from './images/loadingAnimation.gif';
import errorImage from './images/error.svg';

class LoadingImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 'loading'
        }
    }

    render() {
        const step = this.state.step;
        const image = <img key={this.props.src} {...this.props}
            onLoad={() => this.setState({step: 'loaded'})}
            onError={() => this.setState({step: 'error'})}
            style={step === 'loaded' ? {} : {display: 'none'}}></img>;
        return (
            <React.Fragment>
                {image}
                {
                    {
                        'loading': <img className={image.props.className} src={loadingAnimation}></img>,
                        'loaded': null,
                        'error': <img className={image.props.className} src={errorImage}></img>
                    }[step]
                }
            </React.Fragment>
        )
    }
}

export default LoadingImage;