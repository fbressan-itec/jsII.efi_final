import React, { createContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)

    // token con tiempo limitado
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken)
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded)
                    setToken(storedToken)
                } else {
                    localStorage.removeItem("token")
                }
            } catch (error) {
                console.error("token invalido", error)
                localStorage.removeItem("token")
            }
        }
    }, [])

    // login para conectar con la api
    const login = async (email, password) => {
        try {
            //consulta localhost:5000/login
            const response = await fetch('http://localhost:5000/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            //traigo respuesta de la API
            const data = await response.json()

            if (response.ok) {
                const jwtToken = data.access_token
                if (!jwtToken) {
                    toast.error("Error: Token no recibido.")
                    return false
                }
                // guarda token en localstorage y guarda el user decoded
                localStorage.setItem('token', jwtToken)
                const decoded = jwtDecode(jwtToken)
                setUser(decoded)
                setToken(jwtToken)
                // mensaje tost de exito
                toast.success('Inicio de sesión exitoso. Bienvenido, ' + decoded.username + '!')
                return true

            } else {
                //mensajes de error
                let errorMessage = "Error desconocido al iniciar sesión."
                if (response.status === 401 && data.errors?.credentials) {
                    errorMessage = "Email o Contraseña inválidos."
                } else if (data.errors) {
                    const firstErrorKey = Object.keys(data.errors)[0]
                    errorMessage = data.errors[firstErrorKey][0] || errorMessage
                }
                toast.error(errorMessage)
                return false
            }

        } catch (error) {
            console.error("Error de conexión:", error)
            toast.error("Error de conexión. Verifica que la API esté corriendo.")
            return false
        }
    }
    
    // cerrar sesion (elimina tokesn y user)
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        toast.info("Sesión cerrada con exito. Vuelve pronto!");
    };






    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )

}





//ejemplo para usar en paginas que cambian segun te autenticas o no:
//{!isAuthenticated ? (
//                        <>
//                               //aca lo q va no auenticado
//                        </>
//                        ) : (
//                        <>
//                                //aca lo q va si sos autenticado
//                        </>
//                    )}