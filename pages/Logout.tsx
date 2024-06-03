import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, useHistory } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} exact={true} />
          <PrivateRoute path="/dashboard" component={Dashboard} exact={true} />
          <Redirect from="/" to="/login" exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

// PrivateRoute Component to protect routes
const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('token') ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default App;
