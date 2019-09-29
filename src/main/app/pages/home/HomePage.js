import React from 'react';
import './home.scss';
import {Helmet} from 'react-helmet';
import {
  applyFiltersAction,
  getMap,
  getPlatform,
  getRoutesAction,
  selectFrom,
  selectLevels,
  selectProviders,
  selectRoutesApiData,
  selectStandards,
  selectTo,
  setFromAction, setLevelsAction, setProvidersAction, setStandardsAction,
  setToAction,
  test2Action,
  testAction
} from './HomePageModel';
import {connect} from 'react-redux';
import {LocationSelect} from '../../components/location-select/LocationSelect';
import {getData, isApiDataPending} from '../../models/ApiDataModel';
import {changeSearchValueAction} from '../../components/location-select/LocationSelectModel';
import find from 'lodash/find';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import {Checkbox} from '../../components/checkbox/Checkbox';


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
    this.props.getRoutes();
  };

  handleToSelect = (location) => {
    this.props.setTo(location);
    this.props.getRoutes();
  };

  handleResetClick = () => {
    this.props.setFrom(null);
    this.props.setTo(null);
    this.props.changeSearchValue('from', '');
    this.props.changeSearchValue('to', '');
  };

  onProviderFilterChange(checked, provider) {
    const {providers, setProviders, applyFilters} = this.props;
    if (checked) {
      setProviders([...providers, provider]);
    } else {
      setProviders(filter(providers, p => p !== provider));
    }
    applyFilters();
  }

  onLevelFilterChange(checked, level) {
    const {levels, setLevels, applyFilters} = this.props;
    if (checked) {
      setLevels([...levels, level]);
    } else {
      setLevels(filter(levels, p => p !== level));
    }
    applyFilters();
  }

  onStandardFilterChange(checked, standard) {
    const {standards, setStandards, applyFilters} = this.props;
    if (checked) {
      setStandards([...standards, standard]);
    } else {
      setStandards(filter(standards, p => p !== standard));
    }
    applyFilters();
  }

  renderTableRowData(providerName) {
    const providerData = find(this.props.routesApiData::getData().stat.operatorStats, stat => stat.operatorName === providerName);
    return [
      <td>{providerData ? `${providerData.percentNone}%` : '一'}</td>,
      <td>{providerData ? `${providerData.percent2G}%` : '一'}</td>,
      <td>{providerData ? `${providerData.percent3G}%` : '一'}</td>,
      <td>{providerData ? `${providerData.percent4G}%` : '一'}</td>,
    ]
  }

  render() {
    const {routesApiData, from, to, standards, levels, providers} = this.props;
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
                              searchValue={from ? from.title : 'А'}
                              onLocationSelect={this.handleFromSelect}/>
            </div>
            <div className="home__to">
              <LocationSelect id="to"
                              searchValue={to ? to.title : 'Т'}
                              onLocationSelect={this.handleToSelect}/>
            </div>
            <div className="home__reset-link" onClick={this.handleResetClick}>Сбросить</div>
            {routesApiData::getData() &&
            <div>
              <div class="home__divider"></div>
              <div className="home__analytics">
                <div className="home__analytics-icon"></div>
                <div className="home__analytics-title">Анализ связи</div>
              </div>
              <table className="home__table">
                <thead>
                <tr>
                  <th></th>
                  <th className="no">нет сети</th>
                  <th>2G</th>
                  <th>3G</th>
                  <th>4G</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td className="operator">MTC</td>
                  {this.renderTableRowData('MTS')}
                </tr>
                <tr>
                  <td className="operator">Билайн</td>
                  {this.renderTableRowData('Beeline')}
                </tr>
                <tr>
                  <td className="operator">Мегафон</td>
                  {this.renderTableRowData('Megafon')}
                </tr>
                <tr>
                  <td className="operator">Теле 2</td>
                  {this.renderTableRowData('Tele2')}
                </tr>
                <tr>
                  <td className="operator">Тинькофф</td>
                  {this.renderTableRowData('Tinkoff')}
                </tr>
                </tbody>
              </table>
              <div className="home__divider"></div>
              <div className="home__filter">
                <div className="home__filter-icon"></div>
                <div className="home__filter-title">Фильтры</div>
              </div>
              <div className="home__filter-provider">
                По операторам
              </div>
              <Checkbox checked={includes(providers, 'MTS')} onChange={(checked) => this.onProviderFilterChange(checked, 'MTS')} label="MTC"></Checkbox>
              <Checkbox checked={includes(providers, 'Beeline')} onChange={(checked) => this.onProviderFilterChange(checked, 'Beeline')} label="Билайн"></Checkbox>
              <Checkbox checked={includes(providers, 'Megafon')} onChange={(checked) => this.onProviderFilterChange(checked, 'Megafon')} label="Мегафон"></Checkbox>
              <Checkbox checked={includes(providers, 'Tele2')} onChange={(checked) => this.onProviderFilterChange(checked, 'Tele2')} label="Теле2"></Checkbox>
              <Checkbox checked={includes(providers, 'Tinkoff')} onChange={(checked) => this.onProviderFilterChange(checked, 'Tinkoff')} label="Тинькофф"></Checkbox>
              <div className="home__filter-quality">
                По качеству связи
              </div>
              <Checkbox checked={includes(levels, 4)} onChange={(checked) => this.onLevelFilterChange(checked, 4)} label="Отлично"></Checkbox>
              <Checkbox checked={includes(levels, 3)} onChange={(checked) => this.onLevelFilterChange(checked, 3)} label="Хорошо"></Checkbox>
              <Checkbox checked={includes(levels, 2)} onChange={(checked) => this.onLevelFilterChange(checked, 2)} label="Плохо"></Checkbox>
              <div className="home__filter-standard">
                По стандарту сотовой связи
              </div>
              <Checkbox checked={includes(standards, '4G')} onChange={(checked) => this.onStandardFilterChange(checked, '4G')} label="4G"></Checkbox>
              <Checkbox checked={includes(standards, '3G')} onChange={(checked) => this.onStandardFilterChange(checked, '3G')} label="3G"></Checkbox>
              <Checkbox checked={includes(standards, '2G')} onChange={(checked) => this.onStandardFilterChange(checked, '2G')} label="2G"></Checkbox>
            </div>}
            <div className="home__legend">
              <div className="home__legend-circle home__legend-circle-mts"></div>
              <div className="home__legend-provider">MTC</div>
              <div className="home__legend-circle home__legend-circle-beeline"></div>
              <div className="home__legend-provider">Билайн</div>
              <div className="home__legend-circle home__legend-circle-megafon"></div>
              <div className="home__legend-provider">Мегафон</div>
              <div className="home__legend-circle home__legend-circle-tele2"></div>
              <div className="home__legend-provider">Теле2</div>
              <div className="home__legend-circle home__legend-circle-tinkoff"></div>
              <div className="home__legend-provider">Тинькофф</div>
            </div>
          </div>
          {routesApiData::isApiDataPending() &&
          <div className="home__overlay">
            <div className="home__big-loader">
            </div>
          </div>}
          <div id="mapContainer">
          </div>
          {/*<Header/>*/}
          {/*<Footer/>*/}
        </div>
      ]
    );
  }

}

const mapStateToProps = (state) => ({
  from: selectFrom(state),
  to: selectTo(state),
  routesApiData: selectRoutesApiData(state),
  providers: selectProviders(state),
  levels: selectLevels(state),
  standards: selectStandards(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getRoutes: () => dispatch(getRoutesAction()),
  setTo: (to) => dispatch(setToAction(to)),
  setFrom: (from) => dispatch(setFromAction(from)),
  changeSearchValue: (id, value) => dispatch(changeSearchValueAction(id, value)),
  setProviders: (providers) => dispatch(setProvidersAction(providers)),
  setStandards: (standards) => dispatch(setStandardsAction(standards)),
  setLevels: (levels) => dispatch(setLevelsAction(levels)),
  applyFilters: () => dispatch(applyFiltersAction())
});

export const HomePage = connect(mapStateToProps, mapDispatchToProps)(HomePageComponent);


