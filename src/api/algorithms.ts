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

import {Promise} from 'axios'
import {getClient} from './session'

export function lookup(): Promise<beachfront.Algorithm[]> {
  const client = getClient()
  return client.get('/v0/algorithm')
    .then(response => response.data.algorithms.map(normalize))
    .catch(err => {
      console.error('(algorithms:lookup) Failed:', err)
      throw err
    })
}

function normalize(descriptor): beachfront.Algorithm {
  return {
    description:   descriptor.description,
    id:            descriptor.service_id,
    maxCloudCover: descriptor.max_cloud_cover,
    name:          descriptor.name,
    type:          descriptor.interface,
  }
}
