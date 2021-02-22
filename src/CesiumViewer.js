import React, { Fragment, PureComponent } from 'react';
import { Viewer, Entity, PolygonGraphics, LabelGraphics, EntityDescription, CameraFlyTo, ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
import { Cartesian3, PolygonHierarchy, ScreenSpaceEventType } from 'cesium';
import * as helper from './Helper.js'
//import countries from "./data/countries_min.geojson"
export default class CesiumViewer extends PureComponent {
    constructor(props) {
        super(props);
        this.viewerRef = React.createRef();
        this.sceneRef = React.createRef();
    }


    //admin: land
    //continent
    //subregion
    state = {
        entities: []
    }

    componentDidMount() {
        //convert country data to cesium entities.

        fetch(process.env.PUBLIC_URL + "/mergedMigrations.json").then((response) => response.json()).then(countries => this.initialize(countries));

    }

    compnentDidUpdate() {
        console.log("...")
    }
    initialize(countries) {

        let entities = []
        let i
        for (i = 0; i < countries.features.length; i++) {
            let feature = countries.features[i]
            let coords = feature.geometry.coordinates
            let name = feature.properties.admin
            let geometry
            //console.log(name)
            if (feature.geometry.type === "Polygon") {
                let flatcoords = coords[0].flat()

                geometry = new PolygonHierarchy(Cartesian3.fromDegreesArray(flatcoords))
                entities.push({ country: name, name: name, geometry: geometry, properties: feature.properties, popupText: this.getPolicyText(feature.properties.migrationpolicies) })
                // geometry = PolygonGeometry.createGeometry(hierarchy)
            } else {
                geometry = []
                let flatcoords
                for (let j = 0; j < coords.length; j++) {
                    flatcoords = coords[j][0].flat()
                    geometry = new PolygonHierarchy(Cartesian3.fromDegreesArray(flatcoords))
                    entities.push({ country: name, name: name + j, geometry: geometry, properties: feature.properties, popupText: this.getPolicyText(feature.properties.migrationpolicies) })
                }

                // entities.push({ name: name, children: children })
            }

        }
        this.setState({
            entities: entities
        })

    }


    render() {
        return <div className="cesiumViewer" style={{ height: this.props.height }}>

            <Viewer
                ref={e => { this.viewer = e }}
                style={{ height: this.props.height - 100, }}
                timeline={false}
                homeButton={false}

                fullscreenButton={false}
                vrButton={false}
                animation={false}
                scene3DOnly={true}
                baseLayerPicker={true}

            >
                {this.props.pointOfView ?
                    <CameraFlyTo
                        destination={Cartesian3.fromDegrees(this.props.pointOfView[1], this.props.pointOfView[0], this.viewer.cesiumElement.scene.camera.positionCartographic.height)}

                        duration={3}
                    />
                    :
                    ""
                }
                {this.state.entities.map(
                    (entity, i) =>

                        <Entity
                            key={i}
                            name={entity.country}
                            //onMouseEnter={ () => this.action( entity.country,  "Mouse Enter")}
                            //onMouseLeave={ () => this.action(entity.country,"Mouse Leave")}
                            onMouseDown={() => this.action(entity.country, entity.popupText)}

                        >
                            <EntityDescription
                                resizeInfoBox={true}
                            >

                                {entity.popupText}


                            </EntityDescription>
                            <PolygonGraphics

                                hierarchy={entity.geometry}
                                fill={true}
                                show={true}
                                material={this.getColor(entity.properties)}
                                outline={true}
                                height={0}


                            />


                          
                       
                        </Entity>
                )}

            </Viewer>
        </div>
    }

    action = (name, action) => {
        console.log(name)
        console.log(action)

    }
    getPropertyComparator = (propers, type) => {
        //console.log(propers)
        switch (type) {
            case "country":
                return propers.admin
            case "continent":
                return propers.continent
            case "subregion":
                return propers.subregion

        }

    }


    getColor = (propers) => {
        const HIGHLIGHT_WITH_POLICY = Cesium.Color.ORANGE.withAlpha(0.7)
        const HIGHLIGHT_NO_POLICY = Cesium.Color.ORANGE.withAlpha(0.4)
        const ACTIVE_POLICY_ESTABLISHED_IN_PERIOD = Cesium.Color.AQUA.withAlpha(0.7)
        const ACTIVE_HISTORICAL_POLICY = Cesium.Color.AQUA.withAlpha(0.4)

        const ANIMATION_HIGHLIGHT_COLOR = Cesium.Color.AQUAMARINE.withAlpha(0.7)

        const NOPOLICY = Cesium.Color.TRANSPARENT
        //    console.log(this.props.highlightCountries)
        if (propers.migrationpolicies) {
            /*     if (this.props.animationHighlightCountry.name !== undefined && animationHighlightCountry.name === this.getPropertyComparator(propers, this.props.animationHighlightCountry.type)) {  //animation
                      return helper.ANIMATION_HIGHLIGHT_COLOR
                  }
      */
            for (let i = 0; i < this.props.highlightCountries.length; i++) {
                if (this.props.highlightCountries[i].name === this.getPropertyComparator(propers, this.props.highlightCountries[i].type)) {
                    //is country in the list of highlighted countries?
                    //      console.log(this.props.highlightCountries[i].name)
                    if (this.hasActivePolicyInPeriod(propers.migrationpolicies)) { // has an active policy
                        //      console.log("highlight with policy")
                        return HIGHLIGHT_WITH_POLICY
                    } else {
                        //    console.log("highlight with no policy")
                        return HIGHLIGHT_NO_POLICY
                    }
                }

            }
            let policies = propers.migrationpolicies
            for (let i = 0; i < policies.length; i++) {
                let startPolicy = policies[i]["Year of establishment"]
                let endPolicy = policies[i]["Year of disestablishment"]

                if (startPolicy !== "Nil" && startPolicy !== undefined && endPolicy !== undefined) {

                    if ((parseInt(startPolicy.substr(0, 4)) <= this.props.maxYear) && ((endPolicy === "Nil") || (parseInt(endPolicy.substr(0, 4)) > this.props.minYear))) {
                        //             console.log("has active Policy")
                        if (parseInt(startPolicy.substr(0, 4)) < this.props.minYear) {
                            //      console.log("hhistorical policy")
                            return ACTIVE_HISTORICAL_POLICY  //active policy established before the period
                        } else {
                            //        console.log("established in period")
                            return ACTIVE_POLICY_ESTABLISHED_IN_PERIOD
                        }
                    } else {
                        //no active policy
                        //      console.log("no policy")
                        return NOPOLICY
                    }
                }
            }
            //    console.log("no policy")
        }

        return NOPOLICY
    }

    hasActivePolicyInPeriod = (policies) => {
        //console.log("...")
        if (policies) {

            for (let i = 0; i < policies.length; i++) {
                let start = policies[i]["Year of establishment"]
                let end = policies[i]["Year of disestablishment"]

                if (start !== "Nil" && start !== undefined && end !== undefined) {

                    if ((parseInt(start.substr(0, 4)) <= this.props.maxYear) && ((end === "Nil") || (parseInt(end.substr(0, 4)) > this.props.minYear))) {
                        //             console.log("has active Policy")
                        return true
                    }
                }
            }
        }
        return false
    }
    getPolicyText = (policies, minYear, maxYear) => {
        //   console.log(policies)
        if (policies) {
            for (let i = 0; i < policies.length; i++) {
                let start = policies[i]["Year of establishment"]
                let end = policies[i]["Year of disestablishment"]
                if (start !== "Nil" && start !== undefined && end !== undefined) {
                    // if ((parseInt(start.substr(0, 4)) <= maxYear) && ((end === "Nil") || (parseInt(end.substr(0, 4)) > minYear))) {
                   return <Fragment>
                        <h3>Institution Name:  </h3> {policies[i]["Institution name"]} <br /> 
                        <h3>Institution Overview:  </h3>  {policies[i]["Institution Overview"]} <br />
                        <h3> Year of establishment: </h3> {policies[i]["Year of establishment"]}<br />
                        <h3> Year of disestablishment: </h3> {policies[i]["Year of disestablishment"]}<br />
                    </Fragment>

                    // }
                }
            }
        }

        return <Fragment> No active Policy in this period. </Fragment>
    }
}


