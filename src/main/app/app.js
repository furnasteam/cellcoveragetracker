import React from 'react';
import {HomePage} from './pages/home/HomePage';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom'
import './seo/sitemap.xml';
import './seo/robots.txt';
import {Helmet} from 'react-helmet';
import {createDocumentsListRoute, createFullDocumentsListRoute, createHomeRoute, createVisaApplicationFormRoute} from './helpers/appRoutes';
import {configureStore} from './configureStore';


const store = configureStore();
store.subscribe(() => window.__renderedState = store.getState());

export class App extends React.Component {

  render() {

    return ([
      <Provider store={store}>
        <Switch key="1">
          <Route path={createHomeRoute()}
                 component={HomePage}/>
        </Switch>
      </Provider>,
      <Helmet key="2">
        <link rel="icon" sizes="192x192" href={require('./images/favicon-192x192.png')}/>
        <link rel="apple-touch-icon" href={require('./images/favicon-192x192.png')}/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Mobile Way"/>
        <meta property="og:title" content="Анализ покрытия сотовой связи"/>
        <meta property="og:description" content="Анализ покрытия сотовой связи"/>
        <meta property="og:url" content="https://mobileway.furnas.ru"/>
        <meta property="og:locale" content="ru_RU"/>
        <meta property="og:image" content={require('./images/share-facebook.png')}/>
      </Helmet>
    ]);
  }
}
