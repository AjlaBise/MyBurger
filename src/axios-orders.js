import axios from 'axios';

const instance = axios.create({
    baseURL:'https://react-my-burger-b5173.firebaseio.com/'
});


export default instance;
