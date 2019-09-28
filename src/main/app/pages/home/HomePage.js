import React from 'react';
import './home.scss';
import {Helmet} from 'react-helmet';
import {getMap, getPlatform, getRoutesAction, setFromAction, setToAction, test2Action, testAction} from './HomePageModel';
import {Button} from '../../components/button/Button';
import {connect} from 'react-redux';
import {LocationSelect} from '../../components/location-select/LocationSelect';


class HomePageComponent extends React.Component {

  componentDidMount() {
    var platform = getPlatform();
    // Obtain the default map types from the platform object
    var map = getMap();
  }

  handleClick = () => {
    this.props.getRoutes();
  };

  handleFromSelect = (location) => {
    this.props.setFrom(location);
  };

  handleToSelect = (location) => {
    this.props.setTo(location);
  };

  render() {
    return (
      [
        <Helmet key="1">
          <title>Трекер покрытия сотовой связи</title>
          <meta name="description"
                content="Трекер покрытия сотовой связи"/>
          <link rel="canonical" href="https://cellcoveragetracker.furnas.ru"/>
        </Helmet>,
        <div className="home"
             key="2">
          <div className="home__panel">
            <div className="home__route">
              Укажите маршрут
            </div>
            <div className="home__route-image"></div>
            <div className="home__from">
              <LocationSelect id="from"
                              onLocationSelect={this.handleFromSelect}/>
            </div>
            <div className="home__to">
              <LocationSelect id="to"
                              onLocationSelect={this.handleToSelect}/>
            </div>
          </div>
          <div id="mapContainer">
          </div>
          {/*<Header/>*/}
          {/*<Footer/>*/}
        </div>
      ]
    );
  }

}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getRoutes: () => dispatch(getRoutesAction()),
  setTo: (to) => dispatch(setToAction(to)),
  setFrom: (from) => dispatch(setFromAction(from)),
});

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(HomePageComponent);


