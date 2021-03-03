import React, { Component } from 'react';
import './css/index.css';
import StoryPanel from './StoryPanel.js'
import sectiondata from './data/sections.json'
import ScrollIntoView from 'react-scroll-into-view'
import * as helper from './Helper.js'
import CesiumViewer from './CesiumViewer.js'
import { Cartesian3 } from 'cesium'

export default class Mediator extends Component {
    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight, panelHeight: window.innerHeight - 100 });

    };


    state = {
        sections: [],
        width: 0,
        height: 0,
        //the years should be read from a file with their corresponding html content
        // sorteddata: [],
        activeId: 0,
        panelHeight: 800,
        minYear: 1945,
        maxYear: 2020,
        pointOfView: null,
        highlightCountries: [],
        animationHighlightCountry: ""

    }
 
    // m_mapFunctions = null
    //"Facility Name", "Status", "Region", "Technology", "Generator Capacity (MW)", "Latitude", "Longitude"


    componentDidMount = function () {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions()
        let i
        for (i = 0; i < sectiondata.sections.length; i++) {
            sectiondata.sections[i].renderparagraphs = this.createPanelContent(sectiondata.sections[i].year, sectiondata.sections[i].paragraphs)

        }
        //   console.log(sectiondata.sections[4].renderparagraphs)
        //read the content from file.
        this.setState({
            sections: sectiondata.sections
        })



        //  console.log(sectiondata.sections)

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }
    allPanels = []
    setActiveID = (id) => {

        this.setState({
            activeId: id
        })
    }


    createPanelContent(year, paragraphs) {

        //read the text from somewhere based on the given year
        let result = [];

        let key = ""
        for (let i = 0; i < paragraphs.length; i++) {
            key = year + "_" + i
            let highlightFilter = {
                "objects": []
            }
            let panToFilter = "";
            let animate = false
            //check for features like links, if its a link, replace the "text" with a hyperlinnk to the "url"
            if (paragraphs[i].features) {
                for (let j = 0; j < paragraphs[i].features.length; j++) {
                    let feature = paragraphs[i].features[j]
                    if (feature.type === "link") {
                        paragraphs[i].text = paragraphs[i].text.replace(feature.text, '<a href="' + feature.url + '" target="_blank">' + feature.text + '</a>')
                        //                console.log(paragraphs[i].text)
                    }
                }
            }
            //if actions aredefined, they are added to the element here.
            if (paragraphs[i].actions) {
                for (let j = 0; j < paragraphs[i].actions.length; j++) {
                    let action = paragraphs[i].actions[j]
                    if (action["highlight"] !== undefined) {


                        //highlight means highlight the words in the text with a class of the same name, and filter things on the map of this name
                        for (let k = 0; k < action.highlight.keywords.length; k++) {
                            //     console.log(action.highlight.keywords[k])
                            paragraphs[i].text = paragraphs[i].text.replace(action.highlight.keywords[k].name, "<span class='bold'>" + action.highlight.keywords[k].name + "</span>")
                            highlightFilter.objects.push(action.highlight.keywords[k])

                            //capitalise first letter otherwise the filter breaks 
                        }
                    }
                    if (action["panTo"] !== undefined) {
                        panToFilter = {
                            "country": action.panTo
                        }
                    }

                    if (action["animation"] !== undefined) {
                        animate = true
                    }
                }

            }
            result.push(
                <div content={paragraphs[i]} id={key} animation={animate} panToFilter={panToFilter} highlightFilter={highlightFilter} />
            )
        }
        return result
    }


    panToCountry = (country) => {
        if (country !== undefined && country !== null) {
            console.log("should pan to country: " + country)

            this.setState({
                pointOfView: [helper.getLocation(country).lat, helper.getLocation(country).lon],

                animation: false
            })
        } else {
            this.setState({
                pointOfView: null,


            })
        }
    }

    animationIndex = 0
    highlightCountries = []
    highlightObjects(objects) {
        //highlight countries on the globe
        this.setState({
            highlightCountries: objects
        })
    }

    doChapterAnimation(objects) {
        console.log("chapterAnimation")
        this.highlightCountries = objects
        this.doAnimation();
    }

    
    sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
 
    doAnimation = () =>{
     

          
             if(this.animationIndex <   this.highlightCountries.length){
                console.log( "animate: " +  this.highlightCountries[this.animationIndex].name)
                this.setState({
                    pointOfView: [helper.getLocation(  this.highlightCountries[this.animationIndex].name).lat, helper.getLocation(  this.highlightCountries[this.animationIndex].name).lon],
                    speed: 0.4,
                    animationHighlightCountry:   this.highlightCountries[this.animationIndex]
                })
            //    await this.sleep(2500)
        
            }else {
                this.setState({
                    pointOfView: "",
                    speed:3 ,
                    animationHighlightCountry: ""
                })
                this.animationIndex = 0
                this.highlightCountries = []
            }


    }
    flightComplete = () => {
        console.log("Flight Complete")
        this.animationIndex++
        this.doAnimation()
    }
    stopAnimation = () => {
        this.setState({
            animation: false
        })
    }
    updateYears(min, max) {
        console.log("update years: " + min + "   " + max)
        this.setState({
            minYear: min,
            maxYear: max
        })
    }
    //capitalise the first letter of  string
    cap(lower) {
        return lower.replace(/^\w/, c => c.toUpperCase());
    }

    render() {
        return (
            <div className="MainContainer">

                <div className="navbar" id="yearNav">
                    {this.state.sections.map(
                        (section, i) =>
                            <NavMenuItem
                                key={i}
                                id={i}
                                chapter={section.chapter}
                                name={section.title}
                                activeId={this.state.activeId}
                            />
                    )}
                </div>
                <div className="Panels topDistance" style={{ height: this.state.panelHeight }}>

                    {this.state.sections.map(
                        (section, i) =>

                            <StoryPanel
                                key={i}
                                id={i}
                                app={this}
                                activeID={this.state.activeId} //the Storypanels figure out if they are the active panel and display accordingly
                                title={section.title}
                                chapter={section.chapter}
                                paragraphs={section.renderparagraphs}
                                period={section.period}
                                height={this.state.height}
                            />
                    )}
                </div>

                <CesiumViewer
                    height={this.state.height}
                    minYear={this.state.minYear}
                    maxYear={this.state.maxYear}
                    highlightCountries={this.state.highlightCountries}
                    pointOfView={this.state.pointOfView}
                    animationHighlightCountry={this.state.animationHighlightCountry}
                    flightComplete = {this.flightComplete}
                />

                <Legend />

            </div>
        );
    }
}



const NavMenuItem = ({ id, name, chapter, activeId }) => (

    <ScrollIntoView
        selector={`#chap_${chapter}`}
        alignToTop={false} >
        <div className={`navItem ${id === activeId ? "navItemActive" : ""} `}> {name} </div>
    </ScrollIntoView>
)



const Legend = ({ }) => {
    return <div className="legend">
        <div className="legendItem">
            <div className="legendLabel">Highlight</div><div className="legendColor" style={{ backgroundColor: "orange" }} />
        </div>
        <div className="legendItem">
            <div className="legendLabel">Established during period</div><div className="legendColor" style={{ backgroundColor: "rgba(0,255,255,0.8)" }} />
        </div>
        <div className="legendItem">
            <div className="legendLabel">Established before period</div><div className="legendColor" style={{ backgroundColor: "rgba(0,255,255,0.4)" }} />
        </div>
    </div>
}