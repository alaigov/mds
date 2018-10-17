import axios from 'axios';
import { notification } from 'antd';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { request, success, error } from '@/actions/genericActions';
import * as reducerTypes from '@/constants/reducerTypes';
import * as mineActions from '@/actions/mineActions';
import * as String from '@/constants/strings';
import * as API from '@/constants/API';
import { ENVIRONMENT } from '@/constants/environment'
import { createRequestHeader } from '@/utils/RequestHeaders';

export const createMineRecord = (payload) => (dispatch) => {
  dispatch(request(reducerTypes.CREATE_MINE_RECORD));
  dispatch(showLoading());
  return axios.post(ENVIRONMENT.apiUrl + API.MINE, payload, createRequestHeader())
  .then((response) => {
    notification.success({ message: "Successfully created: " + payload.name, duration: 10 });
    dispatch(success(reducerTypes.CREATE_MINE_RECORD));
    dispatch(hideLoading());
    return response;
  })
  .catch((err) => {
    notification.error({ message: err.response ? err.response.data.error.message : String.ERROR, duration: 10 });
    dispatch(error(reducerTypes.CREATE_MINE_RECORD));
    dispatch(hideLoading());
  });
};

export const updateMineRecord = (id, payload, mineName) => (dispatch) => {
  dispatch(request(reducerTypes.UPDATE_MINE_RECORD));
  dispatch(showLoading());
  return axios.put(ENVIRONMENT.apiUrl + API.MINE + "/" + id , payload, createRequestHeader())
  .then((response) => {
    notification.success({ message: "Successfully updated: " + mineName, duration: 10 });
    dispatch(success(reducerTypes.UPDATE_MINE_RECORD));
    dispatch(hideLoading());
    return response;
  })
  .catch((err) => {
    notification.error({ message: err.response ? err.response.data.error.message : String.ERROR, duration: 10 });
    dispatch(error(reducerTypes.UPDATE_MINE_RECORD));
    dispatch(hideLoading());
  });
};

export const fetchMineRecords = (page, per_page, map) => (dispatch) => {
  dispatch(request(reducerTypes.GET_MINE_RECORDS));
  return axios.get(ENVIRONMENT.apiUrl + API.MINE_LIST_QUERY(page, per_page, map), createRequestHeader())
  .then((response) => {
    dispatch(success(reducerTypes.GET_MINE_RECORDS));
    dispatch(mineActions.storeMineList(response.data));
    return response;
  })
  .catch((err) => {
    notification.error({ message: err.response ? err.response.data.error.message : String.ERROR, duration: 10 });
    dispatch(error(reducerTypes.GET_MINE_RECORD));
  });
};

export const fetchMineRecordById = (mineNo) => (dispatch) => {
  dispatch(showLoading());
  dispatch(request(reducerTypes.GET_MINE_RECORD));
  return axios.get(ENVIRONMENT.apiUrl + API.MINE + "/" + mineNo, createRequestHeader())
  .then((response) => {
    dispatch(success(reducerTypes.GET_MINE_RECORD));
    dispatch(mineActions.storeMine(response.data, mineNo));
    dispatch(mineActions.storeCurrentPermittees(response.data));
    dispatch(hideLoading());
  })
  .catch((err) => {
    notification.error({ message: err.response ? err.response.data.error.message : String.ERROR, duration: 10 });
    dispatch(error(reducerTypes.GET_MINE_RECORD));
    dispatch(hideLoading());
  });
};

export const fetchMineNameList = (search=null) => (dispatch) => {
  dispatch(showLoading());
  dispatch(request(reducerTypes.GET_MINE_NAME_LIST));
  return axios.get(ENVIRONMENT.apiUrl + API.MINE_NAME_LIST(search), createRequestHeader())
    .then((response) => {
      dispatch(success(reducerTypes.GET_MINE_NAME_LIST));
      dispatch(mineActions.storeMineNameList(response.data));
      dispatch(hideLoading());
    })
    .catch((err) => {
      notification.error({ message: err.response ? err.response.data.error.message : String.ERROR, duration: 10 });
      dispatch(error(reducerTypes.GET_MINE_NAME_LIST));
      dispatch(hideLoading());
    });
};

export const fetchStatusOptions = () => (dispatch) => {
  dispatch(request(reducerTypes.GET_STATUS_OPTIONS));
  dispatch(showLoading('modal'));
  return axios.get(ENVIRONMENT.apiUrl + API.MINE_STATUS, createRequestHeader())
    .then((response) => {
      dispatch(success(reducerTypes.GET_STATUS_OPTIONS));
      dispatch(mineActions.storeStatusOptions(response.data));
      dispatch(hideLoading('modal'));
    })
    .catch((err) => {
      notification.error({ message: err.response ? err.response.data.error.message : String.ERROR, duration: 10 });
      dispatch(error(reducerTypes.GET_STATUS_OPTIONS));
      dispatch(hideLoading('modal'));
    });
};