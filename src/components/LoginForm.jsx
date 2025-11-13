import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import "../styles/RegisterForm.css"; // usamos el mismo CSS que el register

const validationSchema = Yup.object({ 
  email: Yup.string().email("Email inválido").required('El email es obligatorio'),
  password: Yup.string().required('La contraseña es obligatoria')
});

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext); 

  // Si ya está autenticado, redirige al home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values) => {
    const success = await login(values.email, values.password); 
  };

  return (
    <div className='register-container'> {/* mismo estilo que el register */}
      <h2>Iniciar Sesión</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className='register-form'> 
            <div className='form-field'>
              <label htmlFor='email'>Email</label>
              <Field 
                as={InputText} 
                id='email' 
                name='email' 
                placeholder='tu.email@ejemplo.com'
                className='p-inputtext-lg'
              />
              <ErrorMessage name='email' component='small' className='error' />
            </div>
            
            <div className='form-field'>
              <label htmlFor='password'>Contraseña</label>
              <Field 
                as={InputText} 
                id='password' 
                name='password' 
                type='password'
                placeholder='********'
                className='p-inputtext-lg'
              />
              <ErrorMessage name='password' component='small' className='error' />
            </div>

            <Button 
              type='submit' 
              label={isSubmitting ? "Accediendo..." : 'Acceder'} 
              className='p-button-secondary p-button-lg'
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div> 
  );
}