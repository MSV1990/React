import React from 'react'
import Moment from 'react-moment'
export default ({ from, message , time }) =>
  <p>
    <strong className="name">{from}</strong> <small><Moment>{time}</Moment></small><br/>
    <br/>
    <em>{message}</em>
  </p>