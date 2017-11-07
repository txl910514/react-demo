import React from 'react'
import User from './User'

class Hello extends React.Component {
  render () {
    return (
      <div>
        <h1>hello world</h1>
        <User user="大王" />
        <User user="招" />
        <User user="王" />
        <User user="买" />
        <User user="码" />
      </div>
    )
  }
}

export default  Hello