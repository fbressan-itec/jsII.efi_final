import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import '../styles/RegisterForm.css';

// validacion yup: no +100 caracteres, min 20 y categoria si o si
const validationSchema = Yup.object({
    title: Yup.string()
        .required("EL titulo es obligatorio")
        .max(100, "El titulo no debe superar los 100 caracteres"),
    content: Yup.string()
        .required("El contenido es obligatorio")
        .min(20, "El contenido debe tener al menos 20 caracteres"),
    categoria_id: Yup.number()
        .required("Debes seleccionar una categoria"),
});


export default function CreatePost() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // categoria con slider
    const fetchCategories = async () => {
        try {
            const data = await api.get('/categories'); 
            const options = data.map(cat => ({ 
                label: cat.name, 
                value: cat.id 
            }));
            setCategoryOptions(options);
        } catch (error) {
            console.error("Error al cargar categoria:", error);
            toast.error("Error al cargar las categoria. Intenta mas tarde.");
        } finally {
            setIsLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    //manda form
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // usamos metodo post
            const response = await api.post('/posts', values, token);

            toast.success("Post creado exitosamente.");
            resetForm();
            
            setTimeout(() => navigate('/posts'), 1500); 

        } catch (error) {
    console.error("Error al crear el post:", error);

    let errorMessage = "Ocurrio un error al crear el post.";
    if (error.response) {
        const data = error.response.data;
        if (error.response.status === 401) {
            errorMessage = "No autorizado. Inicia sesión de nuevo.";
        } else if (data?.Error) {
            errorMessage =
                data.Error.title?.[0] ||
                data.Error.content?.[0] ||
                data.Error.message ||
                "Error de validación: revisa tus campos.";
        }
    }

    toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='register-container'>
            <h2>Publique en el tablon de anuncios</h2>
            <Formik
                initialValues={{ title: '', content: '', categoria_id: null }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, setFieldValue, values, isValid }) => (
                    <Form className='register-form'>
                        
                        <div className='form-field'>
                            <label>Título del Post</label>
                            <Field as={InputText} id='title' name='title' className='p-inputtext-lg' />
                            <ErrorMessage name='title' component='small' className='error' />
                        </div>

                        {/* categoria slidedown */}
                        <div className='form-field'>
                            <label htmlFor='categoria_id'>Categoria</label>
                            <Dropdown
                                id='categoria_id'
                                name='categoria_id'
                                value={values.categoria_id}
                                options={categoryOptions}
                                onChange={(e) => setFieldValue('categoria_id', e.value)}
                                placeholder={isLoadingCategories ? 'Cargando Categorías...' : 'Selecciona una Categoría'}
                                disabled={isLoadingCategories || isSubmitting}
                                className='p-inputtext-lg w-full'
                            />
                            <ErrorMessage name='categoria_id' component='small' className='error' />
                        </div>
                        
                        <div className='form-field'>
                            <label>Contenido</label>
                            <Field 
                                as={InputTextarea} 
                                id='content' 
                                name='content' 
                                rows={8} 
                                className='p-inputtext-lg w-full'
                                style={{ width: '100%' }}
                            />
                            <ErrorMessage name='content' component='small' className='error' />
                        </div>
                        
                        <Button 
                            type='submit' 
                            label={isSubmitting ? "Publicando..." : 'Publicar Post'} 
                            icon="pi pi-send"
                            className='p-button-primary p-button-lg'
                            disabled={isSubmitting || isLoadingCategories || !isValid} 
                        />
                    </Form>
                )}
            </Formik>
        </div>
    )
}