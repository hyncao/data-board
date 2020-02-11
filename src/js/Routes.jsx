import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { getTitle, preUrl } from 'app/lib/utils';
import * as containers from './containers';
import '../styles/index.scss';

const globalAppSource = preUrl;
const title = getTitle();

const routeConfig = [
  { title, path: 'index.html', component: 'Home' },
  { title, path: 'index', component: 'Home' },
];

const SetTitleRoute = ({ title, ...rest }) => {
  if (title) {
    document.title = title;
    window.ant.setTitle(title);
  }
  return <Route {...rest} exact />;
};

const Routes = () => (
  <BrowserRouter>
    <Switch>
      {routeConfig.map((item, index) => (
        <SetTitleRoute
          key={index}
          title={item.title}
          path={globalAppSource + item.path}
          component={containers[item.component]}
        />
      ))}
      <Redirect path="*" to={`${globalAppSource}index`} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
