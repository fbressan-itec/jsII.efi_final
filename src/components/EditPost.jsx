import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";
import api from "../api"; 
import { AuthContext } from "../context/AuthContext";
import '../styles/RegisterForm.css';

const validationSchema = Yup.object({
    title: Yup.string().required("El título es obligatorio").max(100, "Máximo 100 caracteres"),
    content: Yup.string().required("El contenido es obligatorio"),
    categoria_id: Yup.number().required("Debe seleccionar una sala/categoría")
});

export default function EditPost() {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const [initialPostValues, setInitialPostValues] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const categoriesData = await api.get("/categories");
                setCategories(categoriesData || []);

                const postData = await api.get(`/posts/${postId}`);
                
                if (user && postData.autor.username !== user.username && user.role !== "admin") {
                    toast.error("No tienes permiso para editar este post.");
                    navigate('/posts');
                    return;
                }

                setInitialPostValues({
                    title: postData.title,
                    content: postData.content,
                    categoria_id: postData.categoria_id,
                });
            } catch (err) {
                console.error("Error al cargar datos del post o categorías:", err);
                toast.error("Error al cargar el post para editar.");
                navigate('/posts');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadData();
        }
    }, [postId, navigate, user]);


    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await api.put(`/posts/${postId}`, values, token);
            toast.success(`Post "${values.title}" actualizado con éxito.`);
            navigate(`/posts`);
        } catch (error) {
            console.error("Error al actualizar el post:", error);
            let message = "Error al editar el post. Verifica tu token y conexión.";
            if (error.response?.data?.Error) {
                message = `Error: ${error.response.data.Error}`;
            }{/* InputTextarea para el contenido */}
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !initialPostValues) {
        return (
            <div className='create-post-container' style={{textAlign: 'center', paddingTop: '100px'}}>
                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
                <p>Cargando datos del post...</p>
            </div>
        );
    }

    const categoryOptions = categories.map(cat => ({
        label: cat.name,
        value: cat.id
    }));


    return (
        <div className='create-post-container'>
            <h2>Editar Post: {initialPostValues.title}</h2>
            <Formik
                initialValues={initialPostValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className='create-post-form'>
                        
                        <div className='form-field'>
                            <label htmlFor="title">Título</label>
                            <Field as={InputText} id='title' name='title' className='p-inputtext p-component' />
                            <ErrorMessage name='title' component='small' className='error' />
                        </div>

                        <div className='form-field'>
                            <label htmlFor="content">Contenido</label>
                            
                            <Field as={InputTextarea} id='content' name='content' rows={10} autoResize className='p-inputtext p-component' />
                            <ErrorMessage name='content' component='small' className='error' />
                        </div>
                        
                        <div className='form-field'>
                            <label htmlFor="categoria_id">Sala / Categoría</label>
                            <Dropdown
                                id="categoria_id"
                                name="categoria_id"
                                options={categoryOptions}
                                value={values.categoria_id}
                                onChange={(e) => setFieldValue('categoria_id', e.value)}
                                placeholder="Selecciona una categoría"
                                className="p-dropdown p-component"
                            />
                            <ErrorMessage name='categoria_id' component='small' className='error' />
                        </div>

                        <div className="form-buttons">
                            <Button 
                                type='submit' 
                                label={isSubmitting ? "Guardando..." : 'Guardar Cambios'} 
                                icon="pi pi-check"
                                className='p-button-success p-button-lg' 
                                disabled={isSubmitting}
                            />
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                className="p-button-secondary p-button-lg"
                                type="button"
                                onClick={() => navigate('/posts')}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}