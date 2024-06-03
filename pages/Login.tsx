import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonText, IonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [grantpassword, setGrantPassword] = useState<string>('');

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const history = useHistory();
  const apiUrl = 'http://192.168.30.71:9006/token';
  

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the form from submitting the default way

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', "password");

    try {
      const response = await axios.post(apiUrl, formData);
      console.log("response", response);

      if (response.status === 200) {
        const data = response.data;
        console.log("data", data);

        // Check if the data contains the expected fields
        if (data && data.access_token) {   // it is on basing on token suceess depends on token
          console.log("Login successful, navigating to home page.");
          localStorage.setItem('token', data.access_token);

          history.push('dashboard');
        } else {
          setToastMessage('Invalid username or password.');
          setShowToast(true);
        }
      } else {
        setToastMessage('Failed to login. Please try again.');
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error during login", error);
      setToastMessage('An error occurred. Please try again.');
      setShowToast(true);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <div className="logo-container">
                <IonText color="primary">
                  <h2>Login</h2>
                </IonText>
              </div>
              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonLabel position="floating">Username</IonLabel>
                  <IonInput value={username} onIonChange={e => setUsername(e.detail.value!)} />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
                </IonItem>
                
                <IonButton expand="full" type="submit">
                  Login
                </IonButton>
              </form>
              <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
