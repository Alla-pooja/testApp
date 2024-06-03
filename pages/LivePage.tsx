import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonLabel, IonSelect, IonSelectOption, IonItem, IonButton, IonText, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { getGroupsByClient,getCamerasByGroupID,getCamerasList,getCamerasList_Live } from '../services/Liveapi';
const LivePage: React.FC = () => {
  const[deviceId,setSelecteddevice]=useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCameras, setSelectedCameras] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [liveCamerasList, setLiveCamerasList] = useState<any[]>([]);
  const [clientGroupList, setClientGroupsList] = useState<any[]>([]);
  const [camerasByGroupId, setCamerasByGroup] = useState<any[]>([]);
  const [camerawithoutGroups, setCameraListWithoutGroups] = useState<any[]>([]);
  const [showOptions, setShowOptions] = useState(true);
  const [gridLayout, setGridLayout] = useState({ xs: 12 });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getGroupsByClient((response) => {
      if (response.status === 200) {
        setClientGroupsList(response.data);
        console.log("response",response.data)

      }
    });
  }, []);

  useEffect(() => {
    getCamerasList((response) => {
      if (response.status === 200) {
        if (response.data !== null) {
          setCameraListWithoutGroups(response.data);
          console.log("response",response.data)

        }
      }
    });
  }, []);
 

  useEffect(() => {
    return getCamerasByGroupID(selectedGroup, (response) => {
      if (response.status === 200) {
        setCamerasByGroup(response.data);
        console.log("response", response.data);

      }
    });
  }, [selectedGroup]);

  const handleGroupChange = (event: any) => {
    setLiveCamerasList([]);
    setSelectedCameras([]);
    setCamerasByGroup([]);
    setSelectedGroup(event.target.value);
  };

  const handleSubmit = () => {
    const deviceid = selectedCameras.map((camera) => {
      return selectedGroup ? parseInt(camera.DeviceId, 10) : parseInt(camera.deviceid, 10);
    });
    console.log("selected camera",selectedCameras)
    const deviceIds = selectedCameras.map((camera) => {
      // Use camera ID as device ID
      return camera;
    });
    const groupId = selectedGroup ? selectedGroup : 0; // Set group_id to selectedGroup if it's selected, otherwise set it to 0

    if (deviceid.length === 0) {
      setErrorMessage('Please Select Atleast one Camera');
      return;
    } else {
      setErrorMessage('');
      console.log("device",deviceIds);
      console.log("group",groupId)

      getCamerasList_Live(deviceIds, groupId, (response) => {
        if (response.status === 200) {
          console.log("response of cameras selected", response.data);
          setLiveCamerasList(response.data);
          setSubmitted(true);
        }
      });
    }
  };

  const handleClear = () => {
    setLiveCamerasList([]);
    setSelectedCameras([]);
    setSelectedGroup("");
    setCamerasByGroup([]);
    setSubmitted(false);
  };

  const handleGridLayout = () => {
    if (selectedCameras.length === 1) {
      setGridLayout({ xs: 12 });
    } else if (selectedCameras.length >= 2 && selectedCameras.length <= 4) {
      setGridLayout({ xs: 6 });
    } else {
      const numRows = Math.ceil(selectedCameras.length / 4);
      const numCols = Math.min(4, selectedCameras.length);
      setGridLayout({ xs: 12 / numCols, style: { gridColumnEnd: `span ${numRows}` } });
    }
  };
  const generateIframeSrc = (camera: any) => {
    const streamUrl = `rtsp://admin:92509etg!@24.25.203.192:554/streaming/channels/${camera.channel}`;
    return `https://restreamservers.com:8888/embed_player?urlServer=wss://restreamservers.com:8443&streamName=${encodeURIComponent(streamUrl)}&mediaProviders=WebRTC,Flash,MSE,WSPlayer&autoplay=1`;
  };

  return (
    <IonPage>
       <IonHeader>
        <IonToolbar>
          <IonTitle>Live</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        
        <IonGrid>
          <IonRow>
            {/* <IonCol>
              <IonItem>
                <IonLabel>Group</IonLabel>
                <IonSelect value={selectedGroup} onIonChange={handleGroupChange}>
                  {clientGroupList.map((group) => (
                    <IonSelectOption key={group.Id} value={group.Id}>{group.GroupName}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol> */}
            <IonCol>
              <IonItem>
                <IonLabel>Select Camera</IonLabel>
                <IonSelect multiple={true} value={selectedCameras} onIonChange={(e) => setSelectedCameras(e.detail.value)}>
                  {selectedGroup ? camerasByGroupId.map((camera) => (
                    <IonSelectOption key={camera.DeviceId} value={camera.DeviceId}>{camera.DeviceId} - {camera.devicename}</IonSelectOption>
                  )) : camerawithoutGroups.map((camera) => (
                    <IonSelectOption key={camera.deviceid} value={camera.deviceid}>{camera.deviceid} - {camera.devicename}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonButton color="danger" onClick={handleClear}>Cancel</IonButton>
              <IonButton onClick={handleSubmit}>Submit</IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText color="danger">{errorMessage}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>

        {submitted && liveCamerasList.length > 0 && (
          <IonGrid>
            <IonRow>
              {liveCamerasList.map((camera, index) => (
                <IonCol key={index} size={gridLayout.xs}>
                  <IonCard>
                    <IonCardContent>
                      <IonLabel>{camera.devicename}</IonLabel>
                      <video controls width="100%" src={generateIframeSrc(camera)}
></video>
                      
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LivePage;
