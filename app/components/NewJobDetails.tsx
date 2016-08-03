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

const styles: any = require('./NewJobDetails.css')

import * as React from 'react'

interface Props {
  name: string
  onNameChange(value: string)
}

export default class NewJobDetails extends React.Component<Props, {}> {
  refs: any

  constructor() {
    super()
    this.emitNameChange = this.emitNameChange.bind(this)
  }

  componentDidMount() {
    this.refs.name.value = this.props.name
  }

  componentWillReceiveProps(nextProps) {
    if (this.refs.name.value !== nextProps.name) {
      this.refs.name.value = nextProps.name
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <h2>Job Details</h2>
        <label className={styles.field}>
          <span>Name</span>
          <input ref="name" onChange={this.emitNameChange}/>
        </label>
      </div>
    )
  }

  private emitNameChange() {
    this.props.onNameChange(this.refs.name.value)
  }
}
