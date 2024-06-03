import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonImg,
  IonModal,
  IonInput,
  IonTextarea,
  IonAlert,
  IonIcon,
  IonText,
  IonList,
  IonItemDivider,IonButtons,
} from '@ionic/react';
import { playCircle, share, cloudDownload, arrowBack, arrowForward, close } from 'ionicons/icons';
import dayjs from 'dayjs';
import { DateAdapter } from 'chart.js';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
 import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { getCamerasList,getCamerasByGroupID,getCamerasList_Live,getGroupsByClient,getClientEscalatedVideos } from '../services/Liveapi';
import axios from 'axios';
const AuditsPage: React.FC = () => {
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedCameras, setSelectedCameras] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogImage, setOpenDialogImage] = useState(false);
  const [escalatedVideos, setEscalatedVideos] = useState<any[]>([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isValidFrom, setIsValidFrom] = useState(false);
  const [isValidTo, setIsValidTo] = useState(false);
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [clientGroupList, setClientGroupsList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [camerasByGroupId, setCamerasByGroup] = useState([]);
  const [camerawithoutGroups, setCameraListWithoutGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorFromdate, setFromDateErrorMessage] = useState('');
  const [errorTodate, setToErrorMessage] = useState('');
  const [currentDeviceVideos, setCurrentDeviceVideos] = useState<any[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  useEffect(() => {
    getCamerasList((response: any) => {
      if (response.status === 200 && response.data !== null) {
        setCameraListWithoutGroups(response.data);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      getCamerasByGroupID(selectedGroup, (response: any) => {
        if (response.status === 200 && response.data !== null) {
          setCamerasByGroup(response.data);
        }
      });
    }
  }, [selectedGroup]);

  useEffect(() => {
    getGroupsByClient((response: any) => {
      if (response.status === 200) {
        setClientGroupsList(response.data);
      }
    });
  }, []);

  const handleFromDateChange = (date: any) => {
    setFromDate(date);
    setIsValidFrom(!!date);
  };

  const handleToDateChange = (date: any) => {
    const adjustedDate = dayjs(date).endOf('day');
    setToDate(adjustedDate);
  };

  const handleGroupChange = (event: any) => {
    setSelectedGroup(event.detail.value);
  };

  const handleSubmit = () => {

    console.log('selectedCameras', selectedCameras)
    const deviceIds = selectedCameras.map((camera) => {
      return clientGroupList.length !== 0 ? camera.DeviceId : camera.deviceid;
    });

    if (deviceIds.length === 0 || !fromDate || !toDate) {
      let count = 0;
      if (!fromDate) setFromDateErrorMessage('Please Select From Date');
      else setFromDateErrorMessage('');
      if (!toDate) setToErrorMessage('Please Select To Date');
      else setToErrorMessage('');
      if (deviceIds.length === 0) setErrorMessage('Please Select At Least One Camera');
      else setErrorMessage('');
      if (count !== 0) return;
    } else {
      setFromDateErrorMessage('');
      setToErrorMessage('');
      setErrorMessage('');

      const data = {
        camera_id: deviceIds,
        start_time: fromDate.format('YYYY-MM-DD HH:mm:ss'),
        end_time: toDate.format('YYYY-MM-DD HH:mm:ss')
      };

      getClientEscalatedVideos(data, (response: any) => {
        if (response.status === 200 && response.data !== null) {
          setEscalatedVideos(response.data);
        }
      });
    }
  };

  const handlePlayVideo = (deviceID: any) => {
    const deviceVideos = escalatedVideos.filter((item) => item.deviceid === deviceID);
    setCurrentDeviceVideos(deviceVideos);
    setCurrentDeviceIndex(0);
    setOpenDialog(true);
  };

  const handlePrevious = () => {
    if (currentDeviceIndex > 0) setCurrentDeviceIndex(currentDeviceIndex - 1);
  };

  const handleNext = () => {
    if (currentDeviceIndex < currentDeviceVideos.length - 1) setCurrentDeviceIndex(currentDeviceIndex + 1);
  };

  const handleShare = () => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Shared Video&body=Please find the video link below:%0D%0A${url}`;
    } else {
      alert('Please enter an email address.');
    }
  };

  const handleSpeedChange = (event: any) => {
    setSelectedSpeed(event.detail.value);
    const video = document.getElementById('videoPlayer') as HTMLVideoElement;
    if (video) video.playbackRate = event.detail.value;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDialogImage(false);
  };

  const handlePlayImage = (item: any) => {
    setImageURL(item.snapshot_url);
    setOpenDialogImage(true);
  };

  const uniqueEscalatedVideos = escalatedVideos.filter(
    (item, index, self) => index === self.findIndex((t) => t.deviceid === item.deviceid)
  );

  const handleDownload = (videoUrl: any) => {
    // Logic to download the video
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Escalated Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="2">
                  <IonItem>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="From Date"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        renderInput={(params) => <IonInput {...params} />}
                      />
                    </LocalizationProvider>
                  </IonItem>
                  {errorFromdate && <IonText color="danger">{errorFromdate}</IonText>}
                </IonCol>
                <IonCol size="2">
                  <IonItem>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="To Date"
                        value={toDate}
                        onChange={handleToDateChange}
                        renderInput={(params) => <IonInput {...params} />}
                      />
                    </LocalizationProvider>
                  </IonItem>
                  {errorTodate && <IonText color="danger">{errorTodate}</IonText>}
                </IonCol>
                {clientGroupList.length > 0 && (
                  <IonCol size="3">
                    <IonItem>
                      <IonLabel>Group</IonLabel>
                      <IonSelect value={selectedGroup} onIonChange={handleGroupChange}>
                        {clientGroupList.map((group) => (
                          <IonSelectOption key={group.Id} value={group.Id}>
                            {group.GroupName}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                )}
                <IonCol size="3">
                  <IonItem>
                    <IonLabel>Camera</IonLabel>
                    <IonSelect multiple value={selectedCameras} onIonChange={(e) => setSelectedCameras(e.detail.value)}>
                      {(clientGroupList.length > 0 ? camerasByGroupId : camerawithoutGroups).map((camera) => (
                        <IonSelectOption key={camera.deviceid} value={camera}>
                          {camera.devicename}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  {errorMessage && <IonText color="danger">{errorMessage}</IonText>}
                </IonCol>
                <IonCol size="2">
                  <IonButton onClick={handleSubmit}>Submit</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
        <IonGrid>
          <IonRow>
            {uniqueEscalatedVideos.map((item) => (
              <IonCol size="12" sizeSm="6" sizeMd="4" key={item.deviceid}>
                <IonCard>
                  <IonCardContent>
                    <IonItem>
                      <IonLabel>{item.devicename}</IonLabel>
                      <IonButton slot="end" onClick={() => handlePlayVideo(item.deviceid)}>
                        <IonIcon icon={playCircle} />
                      </IonButton>
                    </IonItem>
                    <video
                      id="videoPlayer"
                      controls
                      width="100%"
                      style={{ maxHeight: '200px' }}
                      src={item.play_url}
                    />
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonModal isOpen={openDialog} onDidDismiss={handleCloseDialog}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{currentDeviceVideos.length > 0 && currentDeviceVideos[currentDeviceIndex].devicename}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={handleCloseDialog}>
                  <IonIcon icon={close} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <video id="videoPlayer" controls width="100%">
              {currentDeviceVideos.length > 0 && (
                <source src={currentDeviceVideos[currentDeviceIndex].video_url} type="video/mp4" />
              )}
            </video>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonButton expand="block" disabled={currentDeviceIndex === 0} onClick={handlePrevious}>
                    <IonIcon icon={arrowBack} />
                  </IonButton>
                </IonCol>
                <IonCol size="6">
                  <IonButton expand="block" disabled={currentDeviceIndex === currentDeviceVideos.length - 1} onClick={handleNext}>
                    <IonIcon icon={arrowForward} />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            <IonItem>
              <IonLabel>Email</IonLabel>
              <IonInput value={email} placeholder="Enter Email" onIonChange={(e) => setEmail(e.detail.value!)} />
              <IonButton onClick={handleShare}>
                <IonIcon icon={share} />
              </IonButton>
            </IonItem>
            <IonItem>
              <IonLabel>Download</IonLabel>
              <IonButton onClick={() => handleDownload(currentDeviceVideos[currentDeviceIndex].video_url)}>
                <IonIcon icon={cloudDownload} />
              </IonButton>
            </IonItem>
            <IonItem>
              <IonLabel>Playback Speed</IonLabel>
              <IonSelect value={selectedSpeed} onIonChange={handleSpeedChange}>
                <IonSelectOption value={0.5}>0.5x</IonSelectOption>
                <IonSelectOption value={1}>1x</IonSelectOption>
                <IonSelectOption value={1.5}>1.5x</IonSelectOption>
                <IonSelectOption value={2}>2x</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonContent>
        </IonModal>

        {errorMessage && (
          <IonAlert
            isOpen={!!errorMessage}
            onDidDismiss={() => setErrorMessage('')}
            header="Error"
            message={errorMessage}
            buttons={['OK']}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default AuditsPage;
