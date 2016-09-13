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

import * as moment from 'moment'
import {Client} from '../utils/piazza-client'
import * as worker from './workers/jobs'
import {
  GATEWAY,
  JOBS_WORKER,
  SCHEMA_VERSION,
} from '../config'

import {
  REQUIREMENT_BANDS,
  STATUS_RUNNING,
  TYPE_JOB,
} from '../constants'

interface ParamsCreateJob {
  algorithm: beachfront.Algorithm
  catalogApiKey: string
  executorServiceId: string
  image: beachfront.Scene
  name: string
  sessionToken: string
}

export function createJob({
  catalogApiKey,
  executorServiceId,
  name,
  algorithm,
  image,
  sessionToken,
}: ParamsCreateJob): Promise<beachfront.Job> {
  const client = new Client(GATEWAY, sessionToken)
  return client.post('execute-service', {
    dataInputs: {
      body: {
        content: JSON.stringify({
          algoType:      algorithm.type,
          svcURL:        algorithm.url,
          pzAuthToken:   client.sessionToken,
          pzAddr:        client.gateway,
          dbAuthToken:   catalogApiKey,
          bands:         algorithm.requirements.find(a => a.name === REQUIREMENT_BANDS).literal.split(','),
          metaDataJSON:  image,
          jobName:       name,
        }),
        type:     'body',
        mimeType: 'application/json',
      },
    },
    dataOutput: [
      {
        mimeType: 'application/json',
        type:     'text',
      },
    ],
    serviceId: executorServiceId,
  })
    .then(id => ({
      id,
      geometry: image.geometry,
      properties: {
        __schemaVersion__: SCHEMA_VERSION,
        algorithmName:     algorithm.name,
        createdOn:         moment().toISOString(),
        name:              name,
        sceneCaptureDate:  moment(image.properties.acquiredDate).toISOString(),
        sceneId:           image.id,
        sceneSensorName:   image.properties.sensorName,
        status:            STATUS_RUNNING,
        type:              TYPE_JOB,
      },
      type: 'Feature',
    }))
    .catch(err => {
      console.error('(jobs:create) could not execute:', err)
      throw err
    })
}

interface ParamsStartWorker {
  sessionToken: string
  getRecords(): beachfront.Job[]
  onTerminate(): void
  onUpdate(job: beachfront.Job): void
  onError(error: any): void
}

export function startWorker({
  sessionToken,
  getRecords,
  onTerminate,
  onUpdate,
  onError,
}: ParamsStartWorker) {
  worker.start({
    client:   new Client(GATEWAY, sessionToken),
    interval: JOBS_WORKER.INTERVAL,
    ttl:      JOBS_WORKER.JOB_TTL,
    onError,
    onTerminate,

    getRunningJobs() {
      return getRecords().filter(j => j.properties.status === STATUS_RUNNING)
    },

    onUpdate(jobId, status, geojsonDataId, wmsLayerId, wmsUrl) {
      const record = getRecords().find(j => j.id === jobId)
      const updatedRecord = Object.assign({}, record, {
        properties: Object.assign({}, record.properties, {
          detectionsDataId:  geojsonDataId,
          detectionsLayerId: wmsLayerId,
          status:            status,
        }),
      })
      onUpdate(updatedRecord)
    },
  })
}