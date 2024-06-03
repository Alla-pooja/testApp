import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { home, list, archive,cameraOutline, camera, logOut } from 'ionicons/icons'; // Import icons you need
import { Dashboard, DashboardCustomizeRounded, DashboardOutlined } from '@mui/icons-material';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    iosIcon: home,
    mdIcon: home
  },
  {
    title: 'Audits',
    url: '/audits',
    iosIcon: list,
    mdIcon: list
  },
  {
    title: 'Archives',
    url: '/archives',
    iosIcon: archive,
    mdIcon: archive
  },
  {
    title: 'Live',
    url: '/live',
    iosIcon: cameraOutline,
    mdIcon: camera
  },
  {
    title: 'Logout',
    url: '/login',
    iosIcon: logOut,
    mdIcon: logOut
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
