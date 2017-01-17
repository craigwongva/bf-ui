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

export const CLASSIFICATION_BANNER_BACKGROUND = process.env.CLASSIFICATION_BANNER_BACKGROUND
export const CLASSIFICATION_BANNER_FOREGROUND = process.env.CLASSIFICATION_BANNER_FOREGROUND
export const CLASSIFICATION_BANNER_TEXT       = process.env.CLASSIFICATION_BANNER_TEXT

export const API_ROOT = process.env.API_ROOT

const time = {millisecond: 1, second: 1000, minute: 60000}

export const RECORD_POLLING_INTERVAL = 30 * time.second
export const UPDATE_WORKER_INTERVAL = 15 * time.minute

export const BASEMAP_TILE_PROVIDERS = [
  {
    name: 'Grey (Default)',
    url: 'https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png64?access_token=pk.eyJ1IjoiYmF6aWxlcmJ0IiwiYSI6ImNpbmpwcjlrMzB4cHN0dG0zdDJpMWV6ZjkifQ.7Vywvn-z3L6nfSeI4v-Rdg',
    attributions: '&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/about/" target="_blank" rel="noopener">OpenStreetMap</a>',
    maxZoom: 22,
  },
  {
    name: 'Dark Grey',
    url: 'https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png64?access_token=pk.eyJ1IjoiYmF6aWxlcmJ0IiwiYSI6ImNpbmpwcjlrMzB4cHN0dG0zdDJpMWV6ZjkifQ.7Vywvn-z3L6nfSeI4v-Rdg',
    attributions: '&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/about/" target="_blank" rel="noopener">OpenStreetMap</a>',
    maxZoom: 22,
  },
  {
    name: 'Aerial',
    url: 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png64?access_token=pk.eyJ1IjoiYmF6aWxlcmJ0IiwiYSI6ImNpbmpwcjlrMzB4cHN0dG0zdDJpMWV6ZjkifQ.7Vywvn-z3L6nfSeI4v-Rdg',
    attributions: '&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/about/" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://www.digitalglobe.com/" target="_blank" rel="noopener">DigitalGlobe</a>',
    maxZoom: 22,
  },
  {
    name: 'Road/Terrain',
    url: 'https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png64?access_token=pk.eyJ1IjoiYmF6aWxlcmJ0IiwiYSI6ImNpbmpwcjlrMzB4cHN0dG0zdDJpMWV6ZjkifQ.7Vywvn-z3L6nfSeI4v-Rdg',
    attributions: '&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/about/" target="_blank" rel="noopener">OpenStreetMap</a>',
    maxZoom: 22,
  },
]

export const SCENE_TILE_PROVIDERS = [
  {
    prefix: 'landsat',
    url: 'https://tiles{0-3}.planet.com/v0/scenes/landsat/__SCENE_ID__/{z}/{x}/{y}.png?api_key=__API_KEY__',
    maxZoom:  13,
    attributions: '&copy; <a href="https://www.planet.com" target="_blank" rel="noopener">Planet Labs</a> &copy; <a href="https://landsat.usgs.gov" target="_blank" rel="noopener">LANDSAT (USGS)</a>',
  },
  {
    prefix: 'planetscope',
    url: 'https://tiles{0-3}.planet.com/v0/scenes/ortho/__SCENE_ID__/{z}/{x}/{y}.png?api_key=__API_KEY__',
    maxZoom:  13,
    attributions: '&copy; <a href="https://www.planet.com" target="_blank" rel="noopener">Planet Labs (PlanetScope)</a>',
  },
  {
    prefix: 'rapideye',
    url: 'https://tiles{0-3}.planet.com/v0/scenes/rapideye/__SCENE_ID__/{z}/{x}/{y}.png?api_key=__API_KEY__',
    maxZoom:  13,
    attributions: '&copy; <a href="https://www.planet.com" target="_blank" rel="noopener">Planet Labs (RapidEye)</a>',
  },
]
