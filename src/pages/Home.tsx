// src/pages/Home.tsx
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonLoading,
  IonToast,
  IonCheckbox
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/SupabaseClient';
import { useState, useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
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

      // Optionally store credentials for demo
      if (remember) {
        localStorage.setItem('auto_email', email);
        localStorage.setItem('auto_password', password);
      } else {
        localStorage.removeItem('auto_email');
        localStorage.removeItem('auto_password');
      }

      setToastMessage('Login successful!');
      setShowToast(true);
      history.push('/dashboard');
    } catch (error: unknown) {
      setToastMessage(error instanceof Error ? error.message : 'An error occurred');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Automated login if credentials are stored (for demo purposes)
  useEffect(() => {
    const savedEmail = localStorage.getItem('auto_email');
    const savedPassword = localStorage.getItem('auto_password');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setTimeout(() => {
        handleLogin({} as unknown as React.FormEvent);
      }, 500);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <div style={{
          maxWidth: 370,
          margin: '60px auto',
          padding: '0 12px'
        }}>
          <IonCard style={{
            borderRadius: 14,
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            padding: '8px 0'
          }}>
            <IonCardContent>
              <h2 style={{
                textAlign: 'left',
                fontWeight: 700,
                fontSize: 20,
                margin: '0 0 18px 0',
                letterSpacing: 1
              }}>LOGIN</h2>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#444', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Email</label>
                  <IonInput
                    type="email"
                    required
                    value={email}
                    style={{ fontSize: 15, height: 32, border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fafafa', marginBottom: 0 }}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#444', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Password</label>
                  <IonInput
                    type="password"
                    required
                    value={password}
                    style={{ fontSize: 15, height: 32, border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fafafa', marginBottom: 0 }}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                  <IonCheckbox
                    checked={remember}
                    onIonChange={e => setRemember(e.detail.checked)}
                    style={{ marginRight: 8, '--checkbox-background-checked': '#e75480' }}
                  />
                  <span style={{ fontSize: 15, color: '#444' }}>Remember me?</span>
                </div>
                <IonButton
                  expand="block"
                  type="submit"
                  style={{ borderRadius: 6, background: '#e75480', fontWeight: 600, fontSize: 16, letterSpacing: 1 }}
                >
                  LOGIN
                </IonButton>
              </form>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '22px 0 10px 0'
              }}>
                <div style={{
                  flex: 1,
                  height: 1,
                  background: '#eee'
                }} />
                <span style={{
                  margin: '0 12px',
                  color: '#aaa',
                  fontWeight: 500,
                  fontSize: 13,
                  background: '#fff',
                  padding: '0 8px',
                  borderRadius: 4,
                  border: '1px solid #eee'
                }}>OR</span>
                <div style={{
                  flex: 1,
                  height: 1,
                  background: '#eee'
                }} />
              </div>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <span style={{ color: '#444', fontSize: 15 }}>
                  Need an account?{' '}
                  <span
                    style={{
                      color: '#e75480',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                    onClick={() => history.push('/register')}
                  >
                    SIGN UP
                  </span>
                </span>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
        <IonLoading isOpen={loading} message="Logging in..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;