import React from 'react'
import Moment from 'react-moment'
export default ({ from, message , time }) =>
    <div className="message">
    <span><strong className="ChatUsername">{from}</strong><small><Moment className="time-right" format="YYYY-MM-DD HH:mm:ss">{time}</Moment></small></span>
    <p><em>{message}</em><br/></p></div>
