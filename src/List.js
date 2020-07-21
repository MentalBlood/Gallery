import React, {Component} from 'react';
import './List.css';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClasses: this.addClasses("list", props.listAdditionalClasses),
            elementClasses: this.addClasses("element", props.elementAdditionalClasses),
            getElementInnerHTML: props.getElementInnerHTML,
            elementsUrl: props.elementsUrl,
            getElementResources: props.getElementResources,
            elements: undefined,
            onElementClick: props.onElementClick
        };

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData() {
        console.log('fetchElements()');
        const elementsUrl = this.state.elementsUrl;
        const getElementAdditionalStyle = this.state.getElementAdditionalStyle;
        fetch(elementsUrl)
            .then(response => response.json())
            .then(json => this.setState(state => {
                        const elementsDict = {};
                        json.forEach(element => elementsDict[element.id] = {
                            element: element,
                            additionalStyles: getElementAdditionalStyle ? getElementAdditionalStyle(element) : {},
                            resources: {}
                        });
                        return {elements: elementsDict};
                    },
                    () => {console.log('setState finished'); this.fetchElementsResources()}
                )
            );
    }

    fetchElementsResources() {
        console.log('fetchElementsResources()');
        const getElementResources = this.state.getElementResources;
        if (getElementResources === undefined)
            return;
        const elements = this.state.elements;
        Object.values(elements).forEach(element => {
            const elementId = element.element.id;
            const resourcesData = getElementResources(element.element);
            Object.entries(resourcesData).forEach(resourceData => {
                const name = resourceData[0];
                const url = resourceData[1].url;
                const postProcessing = resourceData[1].postProcessing;
                fetch(url)
                    .then(response => response.json())
                    .then(postProcessing)
                    .then(resource => this.setState(state => {
                                state.elements[elementId].resources[name] = resource;
                                return {elements: state.elements}
                            }
                        )
                    )
            })
        });
    }

    componentDidMount() {
        if (this.state.elementsList === undefined)
            this.fetchData();
    }

    addClasses(baseClass, additionalClasses) {
        return additionalClasses.length === 0 ?
            baseClass
            :
            baseClass + " " + additionalClasses.join(" ");
    }

    render() {
        const elements = this.state.elements;
        const onElementClick = this.state.onElementClick;
        const listClasses = this.state.listClasses;
        const elementClasses = this.state.elementClasses;
        return (
            <div className={listClasses}>
                {
                    elements !== undefined
                    ?
                    Object.values(elements).map(
                        (element, elementIndex) => 
                            <div className="elementCell" key={elementIndex}>
                                <div className={elementClasses} onClick={event => onElementClick(element.element.id)}>
                                    {this.state.getElementInnerHTML(element.element, element.resources)}
                                </div>
                            </div>
                    )
                    : null
                }
            </div>
        );
    }
}

export default List;