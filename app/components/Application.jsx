/**
 * Copyright 2016, RadiantBlue Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

const styles = require('./Application.css')

import React, {Component} from 'react'
import {render} from 'react-dom'
import {About} from './About'
import {Help} from './Help'
import {JobStatusList} from './JobStatusList'
import {Login} from './Login'
import {Navigation} from './Navigation'
import {PrimaryMap, MODE_DRAW_BBOX, MODE_NORMAL, MODE_SELECT_IMAGERY, MODE_PRODUCT_LINES} from './PrimaryMap'
import {discover as discoverAlgorithms} from '../api/algorithms'
import {discover as discoverCatalog} from '../api/catalog'
import {discover as discoverExecutor} from '../api/executor'
import {discover as discoverGeoserver} from '../api/geoserver'
import {createCollection} from '../utils/collections'

import {
  KEY_TYPE,
  KEY_STATUS,
  STATUS_SUCCESS,
  TYPE_JOB,
} from '../constants'

export const createApplication = (element) => render(<Application/>, element)

export class Application extends Component {
  constructor() {
    super()
    this.state = Object.assign({
      sessionToken: null,
      route: location.pathname,

      // Services
      catalog: {},
      executor: {},

      // Data Collections
      algorithms: createCollection(),
      jobs: createCollection(),

      // Map state
      bbox: null,
      mapView: null,
      selectedFeature: null,
    }, deserialize())
    this._handleAnchorChange = this._handleAnchorChange.bind(this)
    this._handleBoundingBoxChange = this._handleBoundingBoxChange.bind(this)
    this._handleDismissJobError = this._handleDismissJobError.bind(this)
    this._handleForgetJob = this._handleForgetJob.bind(this)
    this._handleNavigation = this._handleNavigation.bind(this)
    this._handleSearchPageChange = this._handleSearchPageChange.bind(this)
    this._handleSelectFeature = this._handleSelectFeature.bind(this)
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.sessionToken && this.state.sessionToken) {
      this.discoverAlgorithms()
      this.discoverCatalog()
      this.discoverExecutor()
      this.discoverGeoserver()
    }
    serialize(this.state)
  }

  componentDidMount() {
    this.subscribeToHistoryEvents()
    if (this.state.sessionToken) {
      this.discoverAlgorithms()
      this.discoverCatalog()
      this.discoverExecutor()
      this.discoverGeoserver()
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <Navigation
          activeRoute={this.state.route}
          onClick={this._handleNavigation}
        />
        <PrimaryMap
          geoserverUrl={null}
          frames={this._frames}
          detections={this._detections}
          imagery={null}
          isSearching={false}
          view={this.state.mapView}
          catalogApiKey={this.state.catalogApiKey}
          bbox={this.state.bbox}
          mode={this._mapMode}
          selectedFeature={this.state.selectedFeature}
          highlightedFeature={null}
          onBoundingBoxChange={bbox => this.setState({ bbox })}
          onSearchPageChange={this._handleSearchPageChange}
          onSelectFeature={this._handleSelectFeature}
          onViewChange={mapView => this.setState({ mapView })}
        />
        {this.renderRoute()}
      </div>
    )
  }

  renderRoute() {
    if (!this.state.sessionToken) {
      return (
        <Login
          onError={err => this.setState({ error: err })}
          onSuccess={sessionToken => this.setState({ sessionToken })}
        />
      )
    }
    switch (this.state.route) {
      /* eslint-disable indent */
      case '/about':
        return (
          <About
            onDismiss={() => this._handleNavigation({ pathname: '/' })}
          />
        )
    //   case '/create-job':
    //     return (
    //       <CreateJob/>
    //     )
    //   case '/create-product-line':
    //     return (
    //       <CreateProductLine/>
    //     )
      case '/help':
        return (
          <Help
            onDismiss={() => this._handleNavigation({ pathname: '/' })}
          />
        )
      case '/jobs':
        return (
          <JobStatusList
            authToken={this.state.sessionToken}
            activeIds={this._detections.map(d => d.id)}
            error={this.state.jobs.error}
            jobs={this.state.jobs.records}
            onDismissError={this._handleDismissJobError}
            onForgetJob={this._handleForgetJob}
            onNavigateToJob={this._handleNavigation}
          />
        )
    //   case '/product-lines':
    //     return (
    //       <ProductLineList/>
    //     )
      default:
        return (
          <div className={styles.unknownRoute}>
            wat
          </div>
        )
      /* eslint-enable indent */
    }
  }

  //
  // Internals
  //

  get _detections() {
    return []
    // if (this._mapMode !== MODE_PRODUCT_LINES) {
    //   return this.props.detections
    // }
    // return this.props.productLineJobs.selection.length ? this.props.productLineJobs.selection : this.props.productLines
  }

  get _frames() {
    if (this._mapMode !== MODE_PRODUCT_LINES) {
      return this.state.jobs.records
    }
    return []
    // return this.props.productLines.concat(this.props.productLineJobs.selection)
  }

  get _mapMode() {
    switch (location.pathname) {
    case '/create-job': return (this.state.bbox && this.state.imagery) ? MODE_SELECT_IMAGERY : MODE_DRAW_BBOX
    case '/create-product-line': return MODE_DRAW_BBOX
    case '/product-lines': return MODE_PRODUCT_LINES
    default: return MODE_NORMAL
    }
  }

  discoverAlgorithms() {
    this.setState({
      algorithms: this.state.algorithms.$fetching(),
    })
    discoverAlgorithms(this.state.sessionToken)
      .then(algorithms => {
        this.setState({
          algorithms: this.state.algorithms.$records(algorithms)
        })
      })
      .catch(err => {
        this.setState({
          algorithms: this.state.algorithms.$error(err)
        })
      })
  }

  discoverCatalog() {
    this.setState({ catalog: { discovering: true } })
    discoverCatalog(this.state.sessionToken)
      .then(catalog => this.setState({ catalog }))
      .catch(error => this.setState({ catalog: { error }}))
  }

  discoverExecutor() {
    this.setState({ executor: { discovering: true }})
    discoverExecutor(this.state.sessionToken)
      .then(executor => this.setState({ executor }))
      .catch(error => this.setState({ executor: { error }}))
  }

  discoverGeoserver() {
    this.setState({ geoserver: { discovering: true }})
    discoverGeoserver(this.state.sessionToken)
      .then(geoserver => this.setState({ geoserver }))
      .catch(error => this.setState({ geoserver: { error }}))
  }

  _handleAnchorChange(mapAnchor) {
    this.setState({ mapAnchor })
  }

  _handleBoundingBoxChange(bbox) {
    this.setState({ bbox })
  }

  _handleDismissJobError() {
    this.setState({
      jobs: this.state.jobs.$error(null),
    })
  }

  _handleForgetJob(id) {
    this.setState({
      jobs: this.state.jobs.$filter(j => j.id !== id),
    })
  }

  _handleNavigation({pathname = '/', search = '', hash = ''}) {
    history.pushState(null, null, pathname + search + hash)
    this.setState({ route: pathname })
  }

  _handleSelectFeature(feature) {
    this.setState({
      selectedFeature: feature || null,
    })
    this._handleNavigation({
      pathname: this.state.route,
      search:   (feature && feature.properties[KEY_TYPE] === TYPE_JOB) ? `?jobId=${feature.id}` : '',
    })
  }

  _handleSearchPageChange(paging) {
    // this.props.dispatch(searchCatalog(paging.startIndex, paging.count))
  }

  subscribeToHistoryEvents() {
    window.addEventListener('popstate', () => {
      if (this.state.route !== location.pathname) {
        this.setState({ route: location.pathname })
      }
    })
  }
}

//
// Internals
//

function enumerate(value) {
  return value ? [].concat(value) : []
}

function deserialize() {
  return {
    algorithms:   createCollection(JSON.parse(localStorage.getItem('algorithms_records')) || []),
    bbox:         JSON.parse(sessionStorage.getItem('bbox')),
    catalog:      JSON.parse(sessionStorage.getItem('catalog')),
    executor:     JSON.parse(sessionStorage.getItem('executor')),
    geoserver:    JSON.parse(sessionStorage.getItem('geoserver')),
    jobs:         createCollection(JSON.parse(localStorage.getItem('jobs_records')) || []),
    mapView:      JSON.parse(sessionStorage.getItem('mapView')),
    sessionToken: sessionStorage.getItem('sessionToken') || null,
    catalogApiKey: localStorage.getItem('catalog_apiKey') || '',  // HACK
  }
}

function serialize(state) {
  console.groupCollapsed('(Application:serialize)')
  console.debug(JSON.stringify(state, null, 2))
  console.groupEnd()
  sessionStorage.setItem('algorithms_records', JSON.stringify(state.algorithms.records))
  sessionStorage.setItem('bbox', JSON.stringify(state.bbox))
  sessionStorage.setItem('catalog', JSON.stringify(state.catalog))
  sessionStorage.setItem('executor', JSON.stringify(state.executor))
  sessionStorage.setItem('geoserver', JSON.stringify(state.geoserver))
  localStorage.setItem('jobs_records', JSON.stringify(state.jobs.records))
  sessionStorage.setItem('mapView', JSON.stringify(state.mapView))
  sessionStorage.setItem('sessionToken', state.sessionToken || '')
  localStorage.setItem('catalog_apiKey', state.catalogApiKey)  // HACK
}
