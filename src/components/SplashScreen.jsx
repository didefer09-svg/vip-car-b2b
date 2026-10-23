import React, { useState } from 'react';
import vipLogo from '../assets/logo-vipcar.png';

export default function SplashScreen({ message = 'Iniciando sistema...' }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#0b0f19] z-50 fixed inset-0 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Destello tenue detrás (radial-gradient rojo oscuro) */}
      <div
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full pointer-events-none opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(185, 28, 28, 0.45) 0%, rgba(127, 29, 29, 0.2) 45%, transparent 70%)',
        }}
      />

      {/* Contenedor Central del Logo */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        {!imgError ? (
          <img
            src={vipLogo}
            alt="VIP CAR"
            onError={() => setImgError(true)}
            className="h-12 sm:h-16 w-auto object-contain filter drop-shadow-[0_4px_24px_rgba(255,99,99,0.35)] transition-transform duration-500"
          />
        ) : (
          /* Placeholder de texto estilizado en itálica roja y blanca si no encuentra la ruta */
          <div className="flex items-center gap-2 text-center font-sans tracking-tight">
            <span className="italic font-black text-4xl sm:text-5xl text-[#ff6363] drop-shadow-[0_2px_12px_rgba(255,99,99,0.5)]">
              VIP
            </span>
            <span className="italic font-black text-4xl sm:text-5xl text-white">
              CAR
            </span>
          </div>
        )}
      </div>

      {/* Barra de carga minimalista animada en la parte inferior */}
      <div className="absolute bottom-12 sm:bottom-16 w-44 sm:w-56 flex flex-col items-center gap-3">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full w-2/5 bg-gradient-to-r from-transparent via-[#ff6363] to-transparent rounded-full absolute inset-y-0"
            style={{
              animation: 'splashLoadingBar 1.6s ease-in-out infinite',
            }}
          />
        </div>
        {message && (
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#626773]">
            {message}
          </span>
        )}
      </div>

      {/* Estilos para la animación de la barra de carga */}
      <style>{`
        @keyframes splashLoadingBar {
          0% {
            left: -40%;
          }
          50% {
            left: 50%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
