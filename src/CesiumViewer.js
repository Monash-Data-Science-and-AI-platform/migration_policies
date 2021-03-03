import React, { Fragment, PureComponent } from 'react';
import { Viewer, Entity, PolygonGraphics, EntityDescription, CameraFlyTo } from 'resium';
import { Cartesian3, PolygonHierarchy, Color } from 'cesium';

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


    initialize(countries) {

        let entities = []
        let i
        for (i = 0; i < countries.features.length; i++) {
            let feature = countries.features[i]
            let coords = feature.geometry.coordinates
            let name = feature.properties.admin
            let geometry
            console.log(name)
            if (feature.geometry.type === "Polygon") {
                let flatcoords = coords[0].flat()

                geometry = new PolygonHierarchy(Cartesian3.fromDegreesArray(flatcoords))
                if (feature.properties.migrationpolicies) {

                    entities.push({ country: name, name: name, geometry: geometry, properties: feature.properties })

                }
                // geometry = PolygonGeometry.createGeometry(hierarchy)
            } else {
                geometry = []
                let flatcoords
                for (let j = 0; j < coords.length; j++) {

                    flatcoords = coords[j][0].flat()
                    geometry = new PolygonHierarchy(Cartesian3.fromDegreesArray(flatcoords))
                    if (feature.properties.migrationpolicies) {

                        entities.push({ country: name, name: name + j, geometry: geometry, properties: feature.properties })

                    }
                    //  entities.push({ country: name, name: name + j, geometry: geometry, properties: feature.properties, popupText: this.getPolicyText(feature.properties.migrationpolicies) })
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
                
                baseLayerPicker={true}

            >
                {this.props.pointOfView ?
                    <CameraFlyTo
                        destination={Cartesian3.fromDegrees(this.props.pointOfView[1], this.props.pointOfView[0], this.viewer.cesiumElement.scene.camera.positionCartographic.height)}

                        duration={this.props.speed}
                        onComplete={() => this.props.flightComplete()}
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
                        //onMouseDown={() => this.action(entity.country, entity.popupText)}

                        >


                            <EntityDescription
                                resizeInfoBox={true}
                            >
                                {this.hasActivePolicyInPeriod(entity.properties.migrationpolicies) ?
                                    this.getPolicyText(entity.properties.migrationpolicies)
                                    :
                                    <Fragment> No policy in current period.</Fragment>
                                }

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
        const HIGHLIGHT_WITH_POLICY = Color.ORANGE.withAlpha(0.7)
        const HIGHLIGHT_NO_POLICY = Color.ORANGE.withAlpha(0.4)
        const ACTIVE_POLICY_ESTABLISHED_IN_PERIOD = Color.AQUA.withAlpha(0.7)
        const ACTIVE_HISTORICAL_POLICY = Color.AQUA.withAlpha(0.4)

        const ANIMATION_HIGHLIGHT_COLOR = Color.YELLOW.withAlpha(1)

        const NOPOLICY = Color.TRANSPARENT
        //    console.log(this.props.highlightCountries)
        if (propers.migrationpolicies) {
                 if (this.props.animationHighlightCountry.name !== undefined && this.props.animationHighlightCountry.name === this.getPropertyComparator(propers, this.props.animationHighlightCountry.type)) {  //animation
                      return ANIMATION_HIGHLIGHT_COLOR
                  }
      
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

                    if ((parseInt(startPolicy.substr(0, 4)) <= this.props.maxYear) && ((endPolicy === "Nil") || (parseInt(endPolicy.substr(0, 4)) >= this.props.minYear))) {
                        //             console.log("has active Policy")
                        if (parseInt(startPolicy.substr(0, 4)) < this.props.minYear) {
                            //      console.log("hhistorical policy")
                            return ACTIVE_HISTORICAL_POLICY  //active policy established before the period
                        } else {
                            //        console.log("established in period")
                            return ACTIVE_POLICY_ESTABLISHED_IN_PERIOD
                        }
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
    getPolicyText = (policies) => {
          // console.log(policies)
        if (policies) {
            let infoBoxContent = []
            for (let i = 0; i < policies.length; i++) {
                let start = policies[i]["Year of establishment"]
                let end = policies[i]["Year of disestablishment"]
                if (start !== "Nil" && start !== undefined && end !== undefined) {
                    if ((parseInt(start.substr(0, 4)) <= this.props.maxYear) && ((end === "Nil") || (parseInt(end.substr(0, 4)) > this.props.minYear))) {
                    
                    let element = <Fragment key={i}><h3>Institution Name:  </h3> {policies[i]["Institution name"]} <br /> <h4> {policies[i]["Year of establishment"]} -{policies[i]["Year of disestablishment"]}</h4> <h4>Institution Overview:  </h4>  {policies[i]["Institution Overview"]} </Fragment>
                  //  console.log(element)
                    infoBoxContent.push(element)

                    }
                }

            }
            //console.log(infoBoxContent)
            return infoBoxContent
        }
        return <Fragment> No active Policy in this period. </Fragment>
    }
}


