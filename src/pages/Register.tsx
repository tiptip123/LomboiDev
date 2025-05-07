import { 
    IonContent, 
    IonPage, 
    IonInput, 
    IonButton, 
    IonCard, 
    IonCardContent, 
    IonLoading, 
    IonToast, 
    IonText
  } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/SupabaseClient';
import { useState } from 'react';
import './Home.css';

const Register: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (field: keyof typeof formData) => 
    (e: CustomEvent) => {
      setFormData({
        ...formData,
        [field]: e.detail.value!
      });
    };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            student_id: formData.studentId
          },
          emailRedirectTo: window.location.origin + '/home'
        }
      });
      if (error) throw error;
      if (data.session) {
        history.push('/home');
      } else {
        setToastMessage('Registration successful! Please check your email to verify your account.');
        setShowToast(true);
        setTimeout(() => history.push('/home'), 3000);
      }
    } catch (error: unknown) {
      let errorMessage = 'Registration failed';
      if (error instanceof Error) {
        errorMessage = error.message.includes('already registered') 
          ? 'Email already registered' 
          : error.message;
      }
      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
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
              }}>REGISTER</h2>
              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#444', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Full Name</label>
                  <IonInput 
                    type="text" 
                    required 
                    value={formData.fullName}
                    style={{ fontSize: 15, height: 32, border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fafafa', marginBottom: 0 }}
                    onIonChange={handleInputChange('fullName')}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#444', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Student ID</label>
                  <IonInput 
                    type="text" 
                    required 
                    value={formData.studentId}
                    style={{ fontSize: 15, height: 32, border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fafafa', marginBottom: 0 }}
                    onIonChange={handleInputChange('studentId')}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#444', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Email</label>
                  <IonInput 
                    type="email" 
                    required 
                    value={formData.email}
                    style={{ fontSize: 15, height: 32, border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fafafa', marginBottom: 0 }}
                    onIonChange={handleInputChange('email')}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#444', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Password</label>
                  <IonInput 
                    type="password" 
                    required 
                    value={formData.password}
                    style={{ fontSize: 15, height: 32, border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fafafa', marginBottom: 0 }}
                    onIonChange={handleInputChange('password')}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: '#444', fontWeight: 600, fontSize: 15, marginBottom: 4, display: 'block' }}>Confirm Password</label>
                  <IonInput 
                    type="password" 
                    required 
                    value={formData.confirmPassword}
                    style={{ fontSize: 15, height: 32, border: '1px solid #ccc', borderRadius: 5, padding: '4px 10px', background: '#fafafa', marginBottom: 0 }}
                    onIonChange={handleInputChange('confirmPassword')}
                  />
                </div>
                {passwordError && (
                  <IonText color="danger" className="ion-padding">
                    <p style={{ margin: '6px 0 0 0', fontSize: 14 }}>{passwordError}</p>
                  </IonText>
                )}
                <IonButton 
                  expand="block" 
                  type="submit" 
                  style={{ borderRadius: 6, background: '#e75480', fontWeight: 600, fontSize: 16, letterSpacing: 1, marginTop: 12 }}
                >
                  REGISTER
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
                  Already have an account?{' '}
                  <span
                    style={{
                      color: '#e75480',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                    onClick={() => {
                      history.replace('/home');
                    }}
                  >
                    LOGIN
                  </span>
                </span>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
        <IonLoading isOpen={loading} message="Registering..." />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastMessage.includes('successful') ? 'success' : 'danger'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;