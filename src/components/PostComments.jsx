import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "react-toastify";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import "../styles/PostComments.css";

export default function PostComments() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token, isAuthenticated, logout } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/posts/${id}`);
            setPost(data);
            await loadComments();
        } catch (err) {
            console.error("Error cargando el post:", err);
            toast.error("Error al cargar el post. Verifica la API o el token.");
        } finally {
            setLoading(false);
        }
    };

    // cargar comentarios del post
    const loadComments = async () => {
        setLoadingComments(true);
        try {
            const data = await api.get(`/posts/${id}/comments`);
            setComments(data || []);
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
            toast.error("Error al cargar los comentarios.");
        } finally {
            setLoadingComments(false);
        }
    };

    //crear comentario
    const handleCreateComment = async () => {
        if (!newComment.trim()) {
            toast.warning("El comentario no puede estar vacío.");
            return;
        }
        try {
            const body = { content: newComment };
            const data = await api.post(`/posts/${id}/comments`, body, token);
            setComments((prev) => [...prev, data]);
            setNewComment("");
            toast.success("Comentario agregado con éxito.");
        } catch (err) {
            console.error("Error al agregar comentario:", err);
            toast.error("Error al agregar el comentario.");
        }
    };

    // eliminar comentario (solo admin, mod o autor)
    const handleDeleteComment = async (commentId, authorName) => {
        if (!window.confirm(`¿Eliminar el comentario de ${authorName}?`)) return;

        try {
            await api.delete(`/comments/${commentId}`, token);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            toast.success("Comentario eliminado correctamente.");
        } catch (err) {
            console.error("Error al eliminar comentario:", err);

            // manejo de errores
            if (err.response?.status === 403) {
                toast.error("No tienes permisos para eliminar este comentario.");
            } else if (err.response?.status === 404) {
                toast.error("Comentario no encontrado o ya eliminado.");
            } else {
                toast.error("Error al eliminar el comentario.");
            }
        }
    };
    if (loading) {
        return (
            <div className="loading-container">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
            </div>
        );
    }
    if (!post) {
        return <p className="empty-message">Post no encontrado.</p>;
    }
    const isAdmin = user?.role === "admin";

    return (
        <div className="post-comments-container">
            <Button
                label="Volver a los posts"
                icon="pi pi-arrow-left"
                className="p-button-text mb-3"
                onClick={() => navigate("/posts")}
            />
            <Card
                title={post.title}
                subTitle={`Por ${post.autor.username}`}
                className="post-detail-card"
            >
                <p>{post.content}</p>
                <p className="post-date">
                    Publicado el: {new Date(post.date_time).toLocaleString()}
                </p>
            </Card>
            <div className="comments-section">
                <h3>Comentarios</h3>
                {loadingComments ? (
                    <ProgressSpinner style={{ width: "40px", height: "40px" }} strokeWidth="4" />
                ) : comments.length > 0 ? (
                    comments.map((comment) => {
                        const canDelete =
                            user &&
                            (user.role === "admin" ||
                                user.role === "moderator" ||
                                comment.autor.sub === user.id);
                        return (
                            <Card key={comment.id} className="comment-card">
                                <p>{comment.content}</p>
                                <small>
                                    Por: <strong>{comment.autor.username}</strong> -{" "}
                                    {new Date(comment.date_time).toLocaleString()}
                                </small>

                                {canDelete && (
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-danger p-button-sm"
                                        onClick={() =>
                                            handleDeleteComment(comment.id, comment.autor.username)
                                        }
                                    />
                                )}
                            </Card>
                        );
                    })
                ) : (
                    <p className="no-comments">No hay comentarios aún.</p>
                )}
                {isAuthenticated && (
                    <div className="new-comment-form">
                        <h4>Agregar un comentario</h4>
                        <InputTextarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                            placeholder="Escribe tu comentario..."
                            className="w-full"
                        />
                        <Button
                            label="Comentar"
                            icon="pi pi-send"
                            className="p-button-success w-full mt-3 "
                            onClick={handleCreateComment}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
