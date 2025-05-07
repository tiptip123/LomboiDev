// src/pages/Home.tsx
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  IonCard,
  IonCardContent,
  IonLoading,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/SupabaseClient';
import { useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Login successful
      setToastMessage('Login successful!');
      setShowToast(true);
      // Redirect to dashboard or home page after login
      history.push('/dashboard');
    } catch (error: unknown) {
      setToastMessage(error instanceof Error ? error.message : 'An error occurred');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Logging in..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />

        <IonGrid className="ion-justify-content-center">
          <IonRow>
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <IonCard>
                <IonCardContent>
                  <form onSubmit={handleLogin}>
                    <IonItem>
                      <IonLabel position="floating">Email</IonLabel>
                      <IonInput 
                        type="email" 
                        required 
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                      />
                    </IonItem>
                    
                    <IonItem>
                      <IonLabel position="floating">Password</IonLabel>
                      <IonInput 
                        type="password" 
                        required 
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                      />
                    </IonItem>
                    
                    <IonButton 
                      expand="block" 
                      type="submit" 
                      className="ion-margin-top"
                    >
                      Login
                    </IonButton>
                    
                    <IonButton 
                      expand="block" 
                      fill="clear" 
                      onClick={() => history.push('/register')}
                    >
                      Don't have an account? Register
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;