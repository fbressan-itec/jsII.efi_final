import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/themes/lara-dark-purple/theme.css'; 
import 'primeicons/primeicons.css';
import '../styles/Profile.css';  

//---------------------
// Perfil de Usuario  *****PRUEBA**** de ProtectedRoute y un boton que solo ven rol ADMIN
//----------------

export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const isAdmin = user?.role === 'admin'; 

    return (
        <div className='profile-page-container'> 
            
            <div className='profile-content-wrapper'> 

                {/* parte izquierda, datos de usuario */}
                <div className='profile-details-column'>
                    <h2>Mi Perfil</h2>
                    
                    <p className='welcome-message'>
                        ¡Hola, {user?.username} Bienvenido!
                    </p>
                    
                    <div className='profile-field'>
                        <label>ID de Usuario:</label>
                        <p>{user?.id}</p>
                    </div>
                    
                    <div className='profile-field'>
                        <label>Email:</label>
                        <p>{user?.email}</p>
                    </div>

                    <div className='profile-field'>
                        <label>Rol:</label>
                        <p>{user?.role}</p>
                    </div>

                    <div className='profile-field'>
                        <label>Token Expira en:</label>
                        <p>
                            {new Date(user?.exp * 1000).toLocaleDateString()} a las {new Date(user?.exp * 1000).toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {/* parte derecha botones, BOTON ADMIN PRUEBA*/}
                <div className='profile-actions-column'>
                    
                    {/* boton admin */}
                    {isAdmin && (
                        <Button 
                            label="Admin Buttom" 
                            icon="pi pi-cog" 
                            className='p-button-warning p-button-lg logout-button'
                            // *********************** RUTA VACÍA **************** 
                            onClick={() => {}} 
                            style={{ marginBottom: '1rem' }} 
                        />
                    )}

                    <Button 
                        label="Cerrar Sesión" 
                        icon="pi pi-sign-out"
                        className='p-button-danger p-button-lg logout-button' 
                        onClick={handleLogout} 
                    />
                </div>

            </div>
        </div>
    );
}