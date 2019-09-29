import {createApiData, selectApiData} from '../../redux/ApiDataModel';
import {call, fork, put, select, takeEvery} from 'redux-saga/effects';
import {getData, isApiDataSuccess} from '../../models/ApiDataModel';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';

export const HomeAction = {
  GET_ROUTES: 'HomeAction.GET_ROUTES',
  SET_TO: 'HomeAction.SET_TO',
  SET_FROM: 'HomeAction.SET_FROM',
  SET_PROVIDERS: 'HomeAction.SET_PROVIDERS',
  SET_LEVELS: 'HomeAction.SET_LEVELS',
  SET_STANDARDS: 'HomeAction.SET_STANDARDS',
  APPLY_FILTERS: 'HomeAction.APPLY_FILTERS'
};

let platform;

let map;

let ui;

export function getPlatform() {
  if (!platform) {
    platform = new H.service.Platform({
      app_id: 'nCSzEMs5Mt4xNwpSu67q',
      app_code: 'BKcZWZqhrhY2sMaIlmKh6Q',
      useHTTPS: true
    });
  }
  return platform;
}

export function getMap() {
  if (!map) {
    var maptypes = platform.createDefaultLayers();
    map = new H.Map(
      document.getElementById('mapContainer'),
      maptypes.normal.map,
      {
        zoom: 7,
        center: {lng: 37.35, lat: 53.55}
      });
    var mapEvents = new H.mapevents.MapEvents(map);

// Add event listeners:
    map.addEventListener('tap', function (evt) {
      // Log 'tap' and 'mouse' events:
      console.log(evt.type, evt.currentPointer.type);
    });

    ui = H.ui.UI.createDefault(map, maptypes);

// Instantiate the default behavior, providing the mapEvents object:
    var behavior = new H.mapevents.Behavior(mapEvents);
    window.map = map;
  }
  return map;
}

export function setToAction(to) {
  return {type: HomeAction.SET_TO, payload: {to}};
}

export function setFromAction(from) {
  return {type: HomeAction.SET_FROM, payload: {from}};
}

export function setProvidersAction(providers) {
  return {type: HomeAction.SET_PROVIDERS, payload: {providers}};
}

export function setLevelsAction(levels) {
  return {type: HomeAction.SET_LEVELS, payload: {levels}};
}

export function applyFiltersAction() {
  return {type: HomeAction.APPLY_FILTERS};
}

export function setStandardsAction(standards) {
  return {type: HomeAction.SET_STANDARDS, payload: {standards}};
}

export function getRoutesAction() {
  return {type: HomeAction.GET_ROUTES};
}

const GET_ROUTES_API_DATA_KEY = "Home.GET_ROUTES_API_DATA_KEY";

const DEFAULT_STATE = {
  providers: [],
  standards: [],
  levels: []
};

export function reduceHome(state = DEFAULT_STATE, action) {
  const {type, payload} = action;

  switch (type) {
    case HomeAction.SET_TO: {
      state = {...state};
      state.to = payload.to;
      break;
    }
    case HomeAction.SET_FROM: {
      state = {...state};
      state.from = payload.from;
      break;
    }
    case HomeAction.SET_PROVIDERS: {
      state = {...state};
      state.providers = payload.providers;
      break;
    }
    case HomeAction.SET_STANDARDS: {
      state = {...state};
      state.standards = payload.standards;
      break;
    }
    case HomeAction.SET_LEVELS: {
      state = {...state};
      state.levels = payload.levels;
      break;
    }
  }

  return state;
}

export function selectHome(state) {
  return state.home;
}

export function selectFrom(state) {
  return selectHome(state).from;
}

export function selectTo(state) {
  return selectHome(state).to;
}

export function selectProviders(state) {
  return selectHome(state).providers;
}

export function selectLevels(state) {
  return selectHome(state).levels;
}

export function selectStandards(state) {
  return selectHome(state).standards;
}

export function selectRoutesApiData(state) {
  return selectApiData(state, GET_ROUTES_API_DATA_KEY);
}

function addPolylineToMap(map, route, bounds) {
  var lineString = new H.geo.LineString();

  forEach(route, item => {
    lineString.pushPoint({
      lat: item.latitude,
      lng: item.longitude
    })
  });

  const object = new H.map.Polyline(
    lineString, {style: {lineWidth: 4}}
  );

  map.addObject(object);
  if (bounds) {
    map.setViewBounds(object.getBounds())
  }
}

function addCircleToMap(map, point) {

  function getLevelOpacity(level) {
    switch (level) {
      case 4: {
        return '0.7'
      }
      case 3: {
        return '0.5'
      }
      default: {
        return '0.3'
      }
    }
  }

  function getColor(point) {
    switch (point.operatorName) {
      case 'Tele2':
        return `rgba(104, 189, 255, ${getLevelOpacity(point.level)})`;
      case 'MTS':
        return `rgba(255, 104, 104, ${getLevelOpacity(point.level)})`;
      case 'Tinkoff':
        return `rgba(255, 224, 104, ${getLevelOpacity(point.level)})`;
      case 'Beeline':
        return `rgba(255, 180, 104, ${getLevelOpacity(point.level)})`;
      case 'Megafon':
        return `rgba(167, 221, 80, ${getLevelOpacity(point.level)})`;
    }
  }

  map.addObject(new H.map.Circle(
    // The central point of the circle
    {lat: point.latitude, lng: point.longitude},
    // The radius of the circle in meters
    100,
    {
      style: {
        strokeColor: 'rgba(55, 85, 170, 0)', // Color of the perimeter
        lineWidth: 2,
        fillColor: getColor(point) || 'rgba(55, 85, 170, 0.5)' // Color of the circle
      }
    }
  ));
}

function addPointsToMap(map, points) {
  forEach(points, point => addCircleToMap(map, point))
}

function* getRoutesSaga() {
  const from = yield select(selectFrom);
  const to = yield select(selectTo);

  if (!to || !from) {
    return;
  }

  const routesApiData = yield call(createApiData, GET_ROUTES_API_DATA_KEY, 'https://cellcoverage.azurewebsites.net/api/Search/RouteInfo', {from, to});

  yield put(setProvidersAction([]));
  yield put(setLevelsAction([]));
  yield put(setStandardsAction([]));

  if (routesApiData::isApiDataSuccess() && routesApiData::getData()) {
    getMap().removeObjects(getMap().getObjects());
    addPolylineToMap(getMap(), routesApiData::getData().route, true);
    addPointsToMap(getMap(), routesApiData::getData().points)
  }

}

function* applyFiltersSaga() {
  const routesApiData = yield select(selectRoutesApiData);
  if (routesApiData::isApiDataSuccess() && routesApiData::getData()) {
    getMap().removeObjects(getMap().getObjects());
    addPolylineToMap(getMap(), routesApiData::getData().route);
    const providers = yield select(selectProviders);
    const levels = yield select(selectLevels);
    const standards = yield select(selectStandards);
    const filteredPoints = filter(routesApiData::getData().points, point => {
      let result = true;
      if (!isEmpty(providers)) {
        result = result && includes(providers, point.operatorName)
      }
      if (!isEmpty(levels)) {
        result = result && includes(levels, point.level);
      }
      if (!isEmpty(standards)) {
        result = result && includes(standards, point.cellType);
      }
      return result
    });
    addPointsToMap(getMap(), filteredPoints)
  }
}

function* watch() {
  yield takeEvery(HomeAction.GET_ROUTES, getRoutesSaga);
  yield takeEvery(HomeAction.APPLY_FILTERS, applyFiltersSaga);
}

export function* watchHome() {
  yield fork(watch);
}
