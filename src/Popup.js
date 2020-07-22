import React, {Component} from 'react';
import './Popup.css';

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: props.photos,
            currentPhotoId: props.currentPhotoId
        }
        console.log(this.state);
    }

    render() {
        const currentPhotoId = this.state.currentPhotoId;
        const photos = this.state.photos;
        const currentPhotoSrc = photos[currentPhotoId].url;
        return (
            <div className="popup">
                <div className="popupOverlay"></div>
                <div className="popupWindow">
                    <div className="previousButton"></div>
                    <img src={currentPhotoSrc} className="currentPhoto"></img>
                    <div className="nextButton"></div>
                </div>
            </div>
        );
    }
}

export default Popup;