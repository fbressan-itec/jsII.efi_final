import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import api from '../api';
import "../styles/RegisterForm.css"


const validationSchema = Yup.object({
    username: Yup.string().required("El nombre es obligatorio"),
    email: Yup.string().email("Email invalido").required('El email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
    role: Yup.string().required('El rol es obligatorio')
})


export default function RegisterForm() {

    const navigate = useNavigate()
    const [roleOptions, setRoleOptions] = useState([]);

    // get de roles
    const fetchRoles = async () => {
        try {
            const data = await api.get('/roles');
            setRoleOptions(data.roles);
        } catch (error) {
            console.error("Error al cargar los roles desde la API:", error);
            toast.error("No se pudieron cargar los roles del servidor.");
        }
    };
    useEffect(() => {
        fetchRoles();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })

            if (response.ok) {
                toast.success("Usuario registrado con exito")
                resetForm()
                setTimeout(() => navigate('/'), 2000)
            } else {
                toast.error("Hubo un erro al registrar el usuario")
            }
        } catch (error) {
            toast.error("hubo un error con el servidor", error)
        }
    }

    return (
        <div className='register-container'>
            <h2>Crear cuenta</h2>
            <Formik
                initialValues={{ username: '', email: '', password: '', role: null }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, isValid }) => (
                    <Form className='register-form'>
                        <div className='form-field'>
                            <label>Nombre</label>
                            <Field as={InputText} id='username' name='username' />
                            <ErrorMessage name='username' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Email</label>
                            <Field as={InputText} id='email' name='email' />
                            <ErrorMessage name='email' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label>Contraseña</label>
                            <Field as={InputText} id='password' name='password' type='password' />
                            <ErrorMessage name='password' component='small' className='error' />
                        </div>
                        <div className='form-field'>
                            <label htmlFor='role'>Seleccionar Rol</label>
                            <Field
                                name='role'
                                render={({ field }) => (
                                    <Dropdown
                                        {...field}
                                        id='role'
                                        value={field.value}
                                        options={roleOptions}
                                        disabled={roleOptions.length === 0}
                                        onChange={(e) => setFieldValue('role', e.value)}
                                        placeholder={roleOptions.length === 0 ? 'Cargando Roles...' : 'Selecciona un Rol'}
                                        className='p-inputtext-lg w-full'
                                    />
                                )}
                            />
                            <ErrorMessage name='role' component='small' className='error' />
                        </div>
                        <Button type='submit' label={isSubmitting ? "Registrando..." : 'Registrarse'} disabled={isSubmitting || roleOptions.length === 0 || !isValid} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}