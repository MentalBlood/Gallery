import React, {Component} from 'react';
import './Popup.css';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: props.photos,
            currentPhotoId: props.currentPhotoId,
            closeFunction: props.closeFunction
        }

        this.previousPhoto = this.previousPhoto.bind(this);
        this.nextPhoto = this.nextPhoto.bind(this);
    }

    previousPhoto() {
        const currentPhotoId = this.state.currentPhotoId;
        const previousPhotoId = currentPhotoId - 1;
        const photos = this.state.photos;
        if (photos[previousPhotoId] === undefined) {
            const lastPhotoId = Math.max(...Object.keys(photos));
            this.setState({currentPhotoId: lastPhotoId});
        }
        else
            this.setState({currentPhotoId: previousPhotoId})
    }

    nextPhoto() {
        const currentPhotoId = this.state.currentPhotoId;
        const nextPhotoId = currentPhotoId + 1;
        const photos = this.state.photos;
        if (photos[nextPhotoId] === undefined) {
            const firstPhotoId = Math.min(...Object.keys(photos));
            this.setState({currentPhotoId: firstPhotoId});
        }
        else
            this.setState({currentPhotoId: nextPhotoId})
    }

    render() {
        const currentPhotoId = this.state.currentPhotoId;
        const photos = this.state.photos;
        const currentPhotoSrc = photos[currentPhotoId].url;
        const closeFunction = this.state.closeFunction;
        return (
            <div className="popup">
                <div className="popupOverlay"
                    onClick={closeFunction}></div>
                <div className="popupWindow">
                    <div className="previousButton"
                        onClick={this.previousPhoto}></div>
                    <div className="currentPhotoContainer">
                        <img key={currentPhotoSrc} className="currentPhoto"
                            src={currentPhotoSrc} alt="Slide"/>
                    </div>
                    <div className="nextButton"
                        onClick={this.nextPhoto}></div>
                </div>
            </div>
        );
    }
}

export default Popup;