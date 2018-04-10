import React, {Component} from 'react';
import {withAuth} from '@okta/okta-react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

import {appendMessage, clearMessages, makeRemoteCall, clearRemoteMessages} from "../actions/messages";


const mapStateToProps = state => {
  const {messages} = state;
  return {
    ...messages
  }
}

const mapDispatchToProps = dispatch => {
  return {
    appendMessage: () => dispatch(appendMessage()),
    clearMessages: () => dispatch(clearMessages()),
    makeRemoteCall: auth => dispatch(makeRemoteCall(auth)),
    clearRemoteMessages: () => dispatch(clearRemoteMessages())
  }
}

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(class Home extends Component {
  state = {
    authenticated: null,
    user: null
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  checkAuthentication = async () => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      let user = null;
      if (authenticated)
        user = await this.props.auth.getUser();
      this.setState({authenticated, user});
    }
  }

  login = async () => {
    this.props.auth.login('/');
  }

  logout = async () => {
    await this.props.auth.logout('/');
    window.location.reload();
  }

  render() {
    const {authenticated} = this.state;
    if (authenticated === null) {
      return <div className='info'>Not authenticated</div>
    }

    if (authenticated)
      return this.renderPrivateContent();
    return this.renderPublicContent();
  }

  renderPrivateContent = () => {
    const {email, name} = this.state.user;
    return (
      <div>
        <div className="row">
          <div className="alert alert-info">
            Welcome {name} ({email})
          </div>
        </div>
        <div className="row">
          <div className="col-lg-2">
            <Button>Change Password</Button>
          </div>
          <div className="col-lg-2">
            <Button className="btn-primary" onClick={this.logout}>Logout</Button>
          </div>
        </div>
        <br/><br/>

        <div className="row">
          <div className="col-lg-3">
            <p>Local Message</p>
            <Button className="btn-default" onClick={() => this.props.appendMessage()}>Append Message</Button>
            <Button className="btn-default" onClick={() => this.props.clearMessages()}>Clear Messages</Button>
            <ListGroup>
              {
                this.props.local.map(lm => {
                  return (<ListGroupItem key={lm}>{lm}</ListGroupItem>)
                })
              }
            </ListGroup>
          </div>
          <div className="col-lg-3">
            <Button className="btn-default" onClick={() => this.props.makeRemoteCall(this.props.auth)}
                    disabled={this.props.fetchingRemote}>Make Remote Call</Button>
            <Button className="btn-default" onClick={() => this.props.clearRemoteMessages()}
                    disabled={this.props.fetchingRemote}>Clear Remote Message</Button>
            {this.props.fetchingRemote && <p>Fetching remote data...</p>}
            {this.props.remoteCallError &&
            <p className="has-error">An error has occured while calling remote server.</p>}
            <ListGroup>
              {
                this.props.remote.map(rm => {
                  return (<ListGroupItem key={rm.date}>{rm.message} {rm.date}</ListGroupItem>)
                })
              }
            </ListGroup>
          </div>
        </div>


      </div>
    )
  }

  renderPublicContent = () => {
    return (
      <div>
        <div className="row">
          <div className="info">
            <p>This is some public content.</p>
            <p>Press login to get to the private content</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-2">
            <Button className="btn-primary" onClick={this.login}>Login</Button>
          </div>
          {/*<div className="col-lg-2">*/}
            {/*<Button className="btn-default">Call public API method (see console.log for result)</Button>*/}
          {/*</div>*/}
        </div>
      </div>
    )
  }
}))






