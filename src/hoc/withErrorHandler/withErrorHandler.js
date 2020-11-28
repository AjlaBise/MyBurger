import React from 'react';
import { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';


const withErrorHandler = (WrappedComponent, axios) => {
   return class extends Component {
      state = {
          error:null
      }
    componentDidMount () {
        axios.interceptors.request.use(req => {
            this.setState({error:null})
            return req;
        });
        axios.interceptors.response.use(null, error => {
            this.setState({error: error})
            
        });
    }

    errorConfirmeHandler = () => {
        this.setState({error: null});
    }
      render() {
        return (
            <Aux>
                <Modal show={this.state.error}
                modalClosed={this.errorConfirmeHandler}>
                    {this.state.error ? this.state.error.message : null}
                </Modal>
            <WrappedComponent {...this.props}/>
            </Aux>
        );
      }

   }
}

export default withErrorHandler
