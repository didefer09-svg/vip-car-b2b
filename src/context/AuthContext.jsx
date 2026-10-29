import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, isConfigured } from '../config/firebase';

const AuthContext = createContext();

/**
 * Normaliza los roles soportados en el portal:
 * - 'GERENTE': Acceso total a todo el sistema.
 * - 'TALLER': Acceso exclusivo y restringido al módulo de Mantenimiento.
 */
export const normalizeRole = (role, email = '') => {
  const r = (role || '').toUpperCase();
  const e = (email || '').toLowerCase();
  if (r === 'TALLER' || r === 'MANTENIMIENTO' || e.includes('taller') || e.includes('mantenimiento')) {
    return 'TALLER';
  }
  return 'GERENTE';
};

// Credenciales corporativas oficiales para demostración y operación
export const DEMO_CREDENTIALS = [
  {
    email: 'gerencia@vipcar.pe',
    pass: 'vipcar2026',
    name: 'Ing. Carlos Mendoza',
    cargo: 'Gerente General & Operaciones',
    role: 'GERENTE'
  },
  {
    email: 'admin@vipcar.pe',
    pass: 'vipcar2026',
    name: 'Supervisión Minera VIP CAR',
    cargo: 'Jefe de Control de Flotas',
    role: 'GERENTE'
  },
  {
    email: 'taller@vipcar.pe',
    pass: 'taller2026',
    name: 'Téc. Marco Aurelio Quispe',
    cargo: 'Jefe de Taller & Mantenimiento',
    role: 'TALLER'
  },
  {
    email: 'mantenimiento@vipcar.pe',
    pass: 'taller2026',
    name: 'Área de Mantenimiento Junín',
    cargo: 'Supervisor Mecánico de Patio',
    role: 'TALLER'
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
          const role = normalizeRole(null, firebaseUser.email);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || (role === 'TALLER' ? 'Jefe de Taller' : 'Ing. Carlos Mendoza'),
            cargo: role === 'TALLER' ? 'Jefe de Taller & Mantenimiento' : 'Gerencia de Operaciones',
            role,
            isDemo: false
          });
          setLoading(false);
        } else {
          // Si no hay sesión en Firebase Auth, verificar si hay sesión guardada en localStorage
          const savedDemo = localStorage.getItem('vipcar_b2b_session');
          if (savedDemo) {
            try {
              const parsed = JSON.parse(savedDemo);
              parsed.role = normalizeRole(parsed.role, parsed.email);
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
          const parsed = JSON.parse(savedDemo);
          parsed.role = normalizeRole(parsed.role, parsed.email);
          setUser(parsed);
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
   */
  const login = async (email, password) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Intentar con Firebase Auth si está configurado
    if (isConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const fbUser = userCredential.user;
        const role = normalizeRole(null, fbUser.email);
        const loggedUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (role === 'TALLER' ? 'Jefe de Taller' : 'Ing. Carlos Mendoza'),
          cargo: role === 'TALLER' ? 'Jefe de Taller & Mantenimiento' : 'Gerencia de Operaciones',
          role,
          isDemo: false
        };
        setUser(loggedUser);
        localStorage.removeItem('vipcar_b2b_session');
        return { success: true, user: loggedUser };
      } catch (fbErr) {
        console.warn('Firebase signIn falló, evaluando credenciales autorizadas:', fbErr.code);
      }
    }

    // 2. Validación de credenciales autorizadas (modo operación / demo ejecutiva)
    const matched = DEMO_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === cleanEmail && c.pass === password
    );

    if (matched) {
      const role = normalizeRole(matched.role, matched.email);
      const demoUser = {
        uid: 'demo-' + matched.email.replace(/[@.]/g, '-'),
        email: matched.email,
        displayName: matched.name,
        cargo: matched.cargo,
        role,
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
   * Login Rápido: Perfil 'Gerente' (Acceso Total)
   */
  const loginAsGerente = () => {
    const cred = DEMO_CREDENTIALS[0];
    const demoUser = {
      uid: 'demo-gerente-vipcar',
      email: cred.email,
      displayName: cred.name,
      cargo: cred.cargo,
      role: 'GERENTE',
      isDemo: true
    };
    localStorage.setItem('vipcar_b2b_session', JSON.stringify(demoUser));
    setUser(demoUser);
    setAuthError(null);
    return demoUser;
  };

  /**
   * Login Rápido: Perfil 'Taller / Mantenimiento' (Acceso Restringido)
   */
  const loginAsTaller = () => {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === 'TALLER') || DEMO_CREDENTIALS[2];
    const demoUser = {
      uid: 'demo-taller-vipcar',
      email: cred.email,
      displayName: cred.name,
      cargo: cred.cargo,
      role: 'TALLER',
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
    isGerente: user?.role === 'GERENTE',
    isTaller: user?.role === 'TALLER',
    role: user?.role || null,
    login,
    loginAsGerente,
    loginAsTaller,
    loginAsDemo: loginAsGerente,
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
