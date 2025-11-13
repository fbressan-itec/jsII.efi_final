import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../api"; 
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css"; 

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const navigate = useNavigate();

  const { user, token, logout, isAuthenticated } = useContext(AuthContext);

  //cargar Categorías
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await api.get("/categories", null); 
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar categorías. Verifica la API.");
    } finally {
      setLoadingCategories(false);
    }
  };

  //cagar post por categoria
  useEffect(() => {
    if (!selectedCategory) {
      setPosts([]);
      return;
    }

    const loadPosts = async () => {
      setLoadingPosts(true);
      try {
        const endpoint = `/posts?categoria_id=${selectedCategory.id}`;
        const data = await api.get(endpoint, null); 
        setPosts(data || []);

      } catch (err) {
        console.error(err);
        let message = `Error al cargar posts de ${selectedCategory.name}.`;
        
        if (err.response?.status === 401) {
            message = "Sesión expirada o no autorizado. Vuelve a iniciar sesión.";
            logout(); 
        }

        toast.error(message);
      } finally {
        setLoadingPosts(false);
      }
    };
    loadPosts();
  }, [selectedCategory, token, logout]); 

  // targeta de post
  const postCardContent = (post) => (
      <div className='post-footer-buttons'>
          <small>Por: <strong>{post.autor?.username}</strong></small>
          <Button 
              label="Leer más" 
              icon="pi pi-arrow-right"
              className="p-button-text p-button-info" 
              onClick={() => navigate(`/posts/${post.id}`)}
          />
      </div>
  );

  return (
    <div className="dashboard-view">
      <div className="dashboard-container">
        {/* titulos y subtitulos ternarios */}
        <h1>{selectedCategory ? `Bienvenido a la sala de: ${selectedCategory.name}` : 'Salas de Discucion'}</h1>
        <p className="subtitle">
            {selectedCategory 
                ? 'Explora el tablon de anuncios y participa de una discucion, o crea tu propio anuncio.' 
                : 'Selecciona una sala y explora el tablon de anuncios.'
            }
        </p>

        {/* cargo las targetas de categorias */}
        {!selectedCategory ? (
          <div className="category-selection">
            {loadingCategories ? (
              <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="4" />
            ) : (
              categories.length > 0 ? (
                categories.map(cat => (
                  <Card
                    key={cat.id}
                    title={cat.name}
                    className="category-card"
                    onClick={() => setSelectedCategory(cat)}
                  >
                        <p>{'Explora el contenido de esta sala.'}</p>
                  </Card>
                ))
              ) : (
                <div className="empty-message"><p>No hay categorias disponibles.</p></div>
              )
            )}
          </div>
        ) : (
          /* botones con ternarrio is_auth  */
          <>
            <div className='post-action-bar'>
                <Button
                    label="Volver a Categorías"
                    icon="pi pi-arrow-left"
                    className="p-button-outlined p-button-secondary"
                    onClick={() => setSelectedCategory(null)}
                />
                {isAuthenticated && (
                    //************************************VER CUANDO ME LOGUEO******************** */
                    <Button
                        label={`Crear Post en ${selectedCategory.name}`}
                        icon="pi pi-plus"
                        className="p-button-success p-button-lg"
                        onClick={() => navigate(`/nuevopost`)}
                    />
                )}
            </div>
            {/* cargo todas las tagetas de post, animaciones de spining*/}
            {loadingPosts ? (
              <ProgressSpinner className="posts-loader" style={{width: '50px', height: '50px'}} strokeWidth="4" />
            ) : (
              posts.length > 0 ? (
                <div className="posts-list-grid">
                  {posts.map(post => (
                      <Card 
                          key={post.id} 
                          title={post.title} 
                          subTitle={`Publicado: ${new Date(post.date_time).toLocaleDateString()}`}
                          className="post-card p-shadow-10"
                          footer={postCardContent(post)}
                      >
                          <p className="post-content-snippet">
                              {post.content?.substring(0, 100) || 'Sin contenido'}...
                          </p>
                      </Card>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  <i className="pi pi-file" style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}></i>
                  <p>No hay posts en esta categoría.</p>
                </div>
              )
            )}
            
          </>
        )}
      </div>
    </div>
  );
}