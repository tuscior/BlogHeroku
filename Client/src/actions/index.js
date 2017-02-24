import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_ADMIN,
  UNAUTH_ADMIN,
  FETCH_POSTS,
  NEW_POST,
  IS_FETCHING,
  ERROR_FETCHING,
  POST_ERROR,
  FETCHING_POST,
  FETCHED_POST,
  EDIT_POST,
  EDIT_ERROR,
  EDIT_FETCHING,
  DELETE_POST,
  DELETE_ERROR,
  DELETE_FETCHING,
  POST_COMMENT,
  ERROR_COMMENT,
  POSTING_COMMENT
} from './types';


const ROOT_URL = 'http://localhost:3090';

export function authAdmin({nickname, password}){
axios.post(`${ROOT_URL}/admin`, {nickname, password})
      .then(response => {
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/home');
        })
      .catch(() => {
        browserHistory.push('/home');
      });
  }
export function getPosts(page){
  page -= 1;
 return function(dispatch){
  dispatch({ type: IS_FETCHING });
  axios.get(`${ROOT_URL}/home?page=${page}`)
      .then(response => {
        dispatch ({
        type: FETCH_POSTS,
        payload: response.data        
      })
      })
      .catch((error) => {
        dispatch({ type: ERROR_FETCHING });
      });
}
}
export function newPost(newpost){
axios({
  url: `${ROOT_URL}/admin/new`, 
  method: 'post',
  data: newpost,
  headers: {'authorization': localStorage.getItem('token'),'content-type': 'multipart/form-data'}
    })
      .then(response => {
        console.log(response);
        browserHistory.push('/home');
      })
      .catch((error) => {
        console.log(error);
      })
}
export function getPost(id){
  return function(dispatch){
  dispatch({ type: FETCHING_POST });
  axios.get(`${ROOT_URL}/post/${id}`)
    .then(response => {
      dispatch({
        type: FETCHED_POST,
        payload: response.data
      })
    })
    .catch((error) => {
      dispatch({ type: POST_ERROR })
    });
  }
}
export function logOut(){
  return function(dispatch){
    dispatch({type: UNAUTH_ADMIN});
    localStorage.removeItem('token');
  }
}

export function editPost(data, id){
return function(dispatch){
  dispatch({ type: EDIT_FETCHING });
  axios({
    url: `${ROOT_URL}/admin/edit/${id}`,
    method: 'post',
    data: data,
    headers: {'authorization': localStorage.getItem('token')}
      })
    .then(response => {
      browserHistory.push('/home');
    })
    .catch((error) => {
      console.log(error);
    })
}
}

export function deletePost(id){
  return function(dispatch){
    axios({
url: `${ROOT_URL}/admin/delete/${id}`,
method: 'post',
headers: {'authorization': localStorage.getItem('token')}
      })
      .then(response => {
        browserHistory.push('/home');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
export function postComment(comment, id){
const link = id;
const data = comment;
  return function(dispatch){
    dispatch({ type: POSTING_COMMENT });
    axios({
      url: `${ROOT_URL}/post/${link}`,
      method: 'post',
      data: data
    })
    .then(response => {
      dispatch({
        type: POST_COMMENT
      })
      })
    .catch((error) => {
      dispatch({
        type: ERROR_COMMENT
      })
    })
  }
}