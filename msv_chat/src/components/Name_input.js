import React, { Component } from 'react'

class NameInput extends Component {
    state = {
        from: 'John Doe',
    }



  render() {
    return (
        <div className="userNameContainer">
        <label className="userNameLabel" htmlFor="name">
          Name:&nbsp;
          <input className="userNameInput"
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.from}
            onChange={e => this.changeName(e.target.value)} 
          />
        </label>
        </div>
    )
  }
}

export default NameInput