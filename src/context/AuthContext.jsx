import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, isConfigured } from '../config/firebase';

const AuthContext = createContext();

// Credenciales corporativas de bypass para operación minera sin conexión o demostración
const DEMO_CREDENTIALS = [
  {
    email: 'gerencia@vipcar.pe',
    pass: 'vipcar2026',
    name: 'Ing. Carlos Mendoza',
    cargo: 'Gerente General & Operaciones',
    role: 'ADMIN'
  },
  {
    email: 'admin@vipcar.pe',
    pass: 'vipcar2026',
    name: 'Supervisión Minera VIP CAR',
    cargo: 'Jefe de Control de Flotas',
    role: 'ADMIN'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Gerente',
            cargo: 'Gerencia de Operaciones',
            role: 'ADMIN',
            isDemo: false
          });
          setLoading(false);
        } else {
          // Si no hay sesión en Firebase Auth, verificar si hay sesión demo guardada
          const savedDemo = localStorage.getItem('vipcar_b2b_session');
          if (savedDemo) {
            try {
              const parsed = JSON.parse(savedDemo);
              setUser(parsed);
            } catch {
              localStorage.removeItem('vipcar_b2b_session');
              setUser(null);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      });
    } catch (err) {
      console.warn('Firebase Auth no disponible en este entorno, usando fallback local:', err);
      const savedDemo = localStorage.getItem('vipcar_b2b_session');
      if (savedDemo) {
        try {
          setUser(JSON.parse(savedDemo));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  /**
   * Iniciar sesión corporativa
   * Intenta autenticar contra Firebase Auth primero. Si falla o no está registrado,
   * valida contra las credenciales autorizadas de gerencia para garantizar operatividad.
   */
  const login = async (email, password) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Intentar con Firebase Auth si está configurado
    if (isConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCredential.user;
        const loggedUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Gerente',
          cargo: 'Gerencia de Operaciones',
          role: 'ADMIN',
          isDemo: false
        };
        setUser(loggedUser);
        localStorage.removeItem('vipcar_b2b_session');
        return { success: true, user: loggedUser };
      } catch (fbErr) {
        console.warn('Firebase signIn falló, evaluando credenciales de gerencia autorizadas:', fbErr.code);
        // Continuamos para verificar si son las credenciales autorizadas de bypass
      }
    }

    // 2. Validación de credenciales autorizadas de gerencia (modo operación / demo ejecutiva)
    const matched = DEMO_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === cleanEmail && c.pass === password
    );

    if (matched) {
      const demoUser = {
        uid: 'demo-' + matched.email.replace(/[@.]/g, '-'),
        email: matched.email,
        displayName: matched.name,
        cargo: matched.cargo,
        role: matched.role,
        isDemo: true
      };
      localStorage.setItem('vipcar_b2b_session', JSON.stringify(demoUser));
      setUser(demoUser);
      return { success: true, user: demoUser };
    }

    // 3. Fallo de autenticación
    const errMsg = 'Acceso denegado: Correo corporativo o contraseña incorrectos.';
    setAuthError(errMsg);
    throw new Error(errMsg);
  };

  /**
   * Acceso rápido de demostración / auditoría
   */
  const loginAsDemo = () => {
    const demo = DEMO_CREDENTIALS[0];
    const demoUser = {
      uid: 'demo-gerencia-vipcar',
      email: demo.email,
      displayName: demo.name,
      cargo: demo.cargo,
      role: demo.role,
      isDemo: true
    };
    localStorage.setItem('vipcar_b2b_session', JSON.stringify(demoUser));
    setUser(demoUser);
    setAuthError(null);
    return demoUser;
  };

  /**
   * Cierre de sesión seguro
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Error al cerrar sesión en Firebase:', e);
    }
    localStorage.removeItem('vipcar_b2b_session');
    setUser(null);
    setAuthError(null);
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    login,
    loginAsDemo,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
