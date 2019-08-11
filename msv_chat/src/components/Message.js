import React from 'react'
import Moment from 'react-moment'
export default ({ from, message , time }) =>
  <p>
    <strong className="ChatUsername">{from}</strong> <small><Moment format="YYYY-MM-DD HH:mm:ss">{time}</Moment>&nbsp;:</small><br/>
    <br/>
    <em>{message}</em>
  </p>