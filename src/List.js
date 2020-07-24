import React, {Component} from 'react';
import './List.css';
import loadingAnimation from './images/loadingAnimation.gif';
import errorImage from './images/error.svg';

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
            onElementClick: props.onElementClick,
            abortController: new AbortController(),
            step: 'loading'
        };

        this.fetchData = this.fetchData.bind(this);
        this.setStateIfMounted = this.setStateIfMounted.bind(this);
        this.fetchWithAbortController = this.fetchWithAbortController.bind(this);
    }

    addClasses(baseClass, additionalClasses) {
        return additionalClasses.length === 0 ?
            baseClass
            :
            baseClass + " " + additionalClasses.join(" ");
    }

    componentDidMount() {
        this.mounted = true;
        if (this.state.elementsList === undefined)
            this.fetchData();
    }

    componentWillUnmount() {
        this.state.abortController.abort();
        this.mounted = false;
    }

    setStateIfMounted(...args) {
        if (this.mounted)
            this.setState(...args);
    }

    fetchWithAbortController(url) {
        return fetch(url, {
            signal: this.state.abortController.signal
        });
    }

    fetchData() {
        const elementsUrl = this.state.elementsUrl;
        const getElementAdditionalStyle = this.state.getElementAdditionalStyle;
        this.fetchWithAbortController(elementsUrl)
            .then(response => {
                this.setStateIfMounted({step: 'loaded'});
                return response.json();}
            )
            .then(json => this.setStateIfMounted(state => {
                        const elementsDict = {};
                        json.forEach(element => elementsDict[element.id] = {
                            element: element,
                            additionalStyles: getElementAdditionalStyle ? getElementAdditionalStyle(element) : {},
                            resources: {}
                        });
                        return {elements: elementsDict};
                    },
                    this.fetchElementsResources
                )
            ).catch(error => {
                if (error.name === 'AbortError') return;
                throw error;
            });
    }

    fetchElementsResources() {
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
                this.fetchWithAbortController(url)
                    .then(response => response.json())
                    .then(postProcessing)
                    .then(resource => this.setStateIfMounted(state => {
                                state.elements[elementId].resources[name] = resource;
                                return {elements: state.elements}
                            }
                        )
                    ).catch(error => {
                        if (error.name === 'AbortError') return;
                        throw error;
                    });
            })
        });
    }

    render() {
        const elements = this.state.elements;
        const onElementClick = this.state.onElementClick;
        const listClasses = this.state.listClasses;
        const elementClasses = this.state.elementClasses;
        const step = this.state.step;
        return (
            {
                'loading': <img className={listClasses} src={loadingAnimation} />,
                'loaded': <div className={listClasses}>
                    {
                        elements !== undefined
                        ?
                        Object.values(elements).map(
                            (element, elementIndex) => 
                                <div className="elementCell" key={elementIndex}>
                                    <div className={elementClasses} onClick={
                                            event => {
                                                const elementsWithoutResourcesDict = {};
                                                Object.values(elements).forEach(
                                                    value => elementsWithoutResourcesDict[value.element.id] = value.element
                                                );
                                                onElementClick(element.element.id, elementsWithoutResourcesDict);
                                            }
                                        }>
                                        {this.state.getElementInnerHTML(element.element, element.resources)}
                                    </div>
                                </div>
                        )
                        : null
                    }
                </div>,
                'error': <img className={listClasses} src={errorImage} />
            }[step]
        );
    }
}

export default List;