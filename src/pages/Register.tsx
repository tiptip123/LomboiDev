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
    IonBackButton, 
    IonButtons,
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
          // Immediate session created (email confirmation not required)
          history.push('/home');
        } else {
          // Email confirmation required
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
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonTitle>Register</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonLoading isOpen={loading} message="Registering..." />
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            color={toastMessage.includes('successful') ? 'success' : 'danger'}
          />
  
          <IonGrid className="ion-justify-content-center">
            <IonRow>
              <IonCol size="12" sizeMd="8" sizeLg="6">
                <IonCard>
                  <IonCardContent>
                    <form onSubmit={handleRegister}>
                      <IonItem>
                        <IonLabel position="floating">Full Name</IonLabel>
                        <IonInput 
                          type="text" 
                          required 
                          value={formData.fullName}
                          onIonChange={handleInputChange('fullName')}
                        />
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="floating">Student ID</IonLabel>
                        <IonInput 
                          type="text" 
                          required 
                          value={formData.studentId}
                          onIonChange={handleInputChange('studentId')}
                        />
                      </IonItem>
  
                      <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput 
                          type="email" 
                          required 
                          value={formData.email}
                          onIonChange={handleInputChange('email')}
                        />
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput 
                          type="password" 
                          required 
                          value={formData.password}
                          onIonChange={handleInputChange('password')}
                        />
                      </IonItem>
                      
                      <IonItem>
                        <IonLabel position="floating">Confirm Password</IonLabel>
                        <IonInput 
                          type="password" 
                          required 
                          value={formData.confirmPassword}
                          onIonChange={handleInputChange('confirmPassword')}
                        />
                      </IonItem>
  
                      {passwordError && (
                        <IonText color="danger" className="ion-padding">
                          <p>{passwordError}</p>
                        </IonText>
                      )}
                      
                      <IonButton 
                        expand="block" 
                        type="submit" 
                        className="ion-margin-top"
                      >
                        Register
                      </IonButton>
                    </form>
                    
                    <IonButton 
                      expand="block" 
                      fill="clear" 
                      className="ion-margin-top" 
                      onClick={() => history.push('/home')}
                    >
                      Already have an account? Login
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Register;