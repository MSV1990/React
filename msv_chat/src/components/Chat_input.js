import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import smiley from '../imgs/smiley.png'
class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }
  state = {
    message: '',
    smile: {visibility: 'hidden',},
  }


  smileWindowSwitch = (e) => {
    e.preventDefault()
    if(this.state.smile.visibility === 'hidden'){
      this.setState({
        smile: {visibility: 'visible',}
      })
      return
    }
    if(this.state.smile.visibility === 'visible'){
      this.setState({
        smile: {visibility: 'hidden',}
      })
      return
    }
  }

  addEmoji = (e) => {
    console.log(e)
    let emoji = e.native;
    this.setState({
      message: this.state.message + emoji
    })
  }


  render() {
    return (
      <>
      <form
        action="."
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmitMessage(this.state.message + '📫')
          this.setState({ message: '' })
        }}
      >
        <img src={smiley} alt='smile' className="smiley_faces" onClick={this.smileWindowSwitch}></img>
        <input
        className="message_input"
          type="text"
          placeholder={'Enter message...'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
          onFocus={e => this.setState({ smile: {visibility: 'hidden',} })}
        />
        <input className="button_send" value={'           '} type="submit" />
      </form>
      <span style={this.state.smile}>
   <Picker 
   onSelect={this.addEmoji}
   style={{ position: 'fixed', bottom: '6vw', left: '0vw', width: '45vw', }}
   title='Pick your emoji…' emoji='point_up'
   set='apple'
    />
     </span>
      </>
    )
  }
}

export default ChatInput