import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from './firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const LECCIONES = [
  {
    id: 1,
    titulo: "🌸 Lección 1: Creación de Objetos Básicos",
    instrucciones: "Crea un objeto llamado 'persona' en JavaScript. Debe tener las propiedades 'nombre' (string) y 'edad' (number). Además, añade un método llamado 'saludar' que retorne 'Hola'.",
    codigoInicial: "const persona = {\n  nombre: 'Ana',\n  edad: 20,\n  saludar: function() { return 'Hola'; }\n};"
  },
  {
    id: 2,
    titulo: "⚡ Lección 2: Arreglos y Métodos Avanzados",
    instrucciones: "Dado un arreglo de números llamado 'notas', usa el método '.filter()' para obtener únicamente las calificaciones mayores o iguales a 3.0.",
    codigoInicial: "const notas = [4.5, 2.8, 3.0, 1.5, 5.0];\n// Escribe tu filtro aquí abajo\nconst aprobadas = "
  },
  {
    id: 3,
    titulo: "🚀 Lección 3: Asincronismo con Promesas",
    instrucciones: "Crea una función llamada 'cargarDatos' que retorne una nueva Promesa. La promesa debe resolverse con el texto 'Conexión Exitosa con Spring Boot' tras 2 segundos usando setTimeout.",
    codigoInicial: "function cargarDatos() {\n  return new Promise((resolve) => {\n    // Tu código aquí\n  });\n}"
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [leccionActual, setLeccionActual] = useState(0);
  const [codigo, setCodigo] = useState(LECCIONES[0].codigoInicial);
  const [resultadoIA, setResultadoIA] = useState(null);
  const [cargando, setCargando] = useState(false);
  
  // Estados para simular la colaboración en tiempo real (RabbitMQ / WebSockets)
  const [sala, setSala] = useState('');
  const [conectadoASala, setConectadoASala] = useState(false);
  const [companero, setCompanero] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await setDoc(doc(db, "usuarios", currentUser.uid), {
          nombre: currentUser.displayName,
          email: currentUser.email,
          foto: currentUser.photoURL,
          ultimoAcceso: new Date()
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  // Cambiar de lección actualiza el editor
  const cambiarLeccion = (index) => {
    setLeccionActual(index);
    setCodigo(LECCIONES[index].codigoInicial);
    setResultadoIA(null);
  };

  // Simulación de conexión a la cola de RabbitMQ mediante Spring Boot
  const handleConectarSala = (e) => {
    e.preventDefault();
    if (!sala.trim()) return;
    setConectadoASala(true);
    // Simulamos que se conecta otro estudiante a la sesión concurrentemente
    setTimeout(() => {
      setCompanero("Carlos Mendoza");
    }, 2000);
  };

  if (!user) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF5F6', backgroundImage: 'radial-gradient(#D87093 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
        <div style={{ backgroundColor: '#FFF', padding: '60px', borderRadius: '40px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(216, 112, 147, 0.2)', border: '1px solid #F0E2E5', maxWidth: '450px', width: '90%' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🌸</div>
          <h1 style={{ color: '#D87093', fontSize: '32px', margin: '0 0 10px 0', fontWeight: '700' }}>CoCode Sakura</h1>
          <p style={{ color: '#8A7679', marginBottom: '40px', fontSize: '18px', lineHeight: '1.5' }}>Entorno Cooperativo de Pair Programming en Tiempo Real.</p>
          <button onClick={() => signInWithPopup(auth, googleProvider)} style={{ width: '100%', padding: '18px', backgroundColor: '#D87093', color: '#FFF', border: 'none', borderRadius: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(216, 112, 147, 0.3)' }}>
             Iniciar Sesión con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#FAF5F6', fontFamily: 'sans-serif', color: '#3C2F31' }}>
      
      {/* HEADER DE LA APP */}
      <nav style={{ backgroundColor: '#FFF', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F0E2E5', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '28px' }}>🌸</span>
          <h2 style={{ color: '#D87093', margin: 0, fontWeight: '700', letterSpacing: '-0.5px' }}>CoCode Sakura <span style={{ fontSize: '12px', backgroundColor: '#FCE4EC', color: '#D87093', padding: '4px 8px', borderRadius: '10px', marginLeft: '10px' }}>v2.0 Beta</span></h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {conectadoASala && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#4CAF50', borderRadius: '50%', display: 'inline-block' }}></span>
              Sala: {sala}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={user.photoURL} alt="avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', border: '2px solid #D87093' }} />
            <span style={{ fontWeight: '600', fontSize: '14px' }}>{user.displayName}</span>
          </div>
          <button onClick={() => signOut(auth)} style={{ padding: '8px 16px', backgroundColor: '#FAF5F6', border: '1px solid #F0E2E5', borderRadius: '10px', color: '#A3707A', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Salir</button>
        </div>
      </nav>

      {/* CONTENEDOR PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', padding: '25px', gap: '25px', overflow: 'hidden' }}>
        
        {/* PANEL IZQUIERDO: SELECCIÓN Y CONTENIDO DE TAREAS */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '350px' }}>
          
          {/* Selector de Tareas disponibles */}
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '24px', border: '1px solid #F0E2E5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#A3707A', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📚 Banco de Ejercicios</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LECCIONES.map((lec, idx) => (
                <button key={lec.id} onClick={() => cambiarLeccion(idx)} style={{ width: '100%', padding: '12px 15px', textAlign: 'left', backgroundColor: leccionActual === idx ? '#FFF0F5' : '#FFF', border: leccionActual === idx ? '2px solid #D87093' : '1px solid #F0E2E5', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <span style={{ fontWeight: leccionActual === idx ? 'bold' : 'normal', color: leccionActual === idx ? '#D87093' : '#554044', fontSize: '14px' }}>{lec.titulo}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Caja de instrucciones del ejercicio seleccionado */}
          <div style={{ flex: 1, backgroundColor: '#FFF', padding: '25px', borderRadius: '24px', border: '1px solid #F0E2E5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', overflowY: 'auto' }}>
            <h3 style={{ color: '#D87093', marginTop: 0, fontSize: '20px' }}>Instrucciones</h3>
            <p style={{ color: '#554044', lineHeight: '1.6', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{LECCIONES[leccionActual].instrucciones}</p>
          </div>

          {/* MODULO DE COLABORACIÓN (REPRESENTACIÓN DE RABBITMQ/SPRING BOOT) */}
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '24px', border: '1px solid #F0E2E5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h3 style={{ color: '#A3707A', margin: '0 0 12px 0', fontSize: '15px' }}>👥 Conectividad Síncrona (Pair Programming)</h3>
            
            {!conectadoASala ? (
              <form onSubmit={handleConectarSala} style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Código de sala (Ej: SAKURA-202)" value={sala} onChange={(e) => setSala(e.target.value)} style={{ flex: 1, padding: '12px 15px', borderRadius: '12px', border: '1px solid #F0E2E5', outline: 'none', fontSize: '14px' }} />
                <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#D87093', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Conectarse</button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '14px', color: '#554044' }}>🟢 Suscrito al exchange de RabbitMQ en la sala <strong>{sala}</strong></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#FAF5F6', padding: '12px', borderRadius: '12px', border: '1px solid #F0E2E5' }}>
                  <div style={{ fontSize: '13px', color: '#8A7679' }}>Estudiantes en la sesión:</div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>• {user.displayName} (Tú)</div>
                  {companero ? (
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#D87093' }}>• {companero} <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '2px 6px', borderRadius: '8px', marginLeft: '5px' }}>Editando al tiempo</span></div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#A3707A', italic: 'true' }}>⌛ Esperando al otro desarrollador...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DERECHA: EDITOR DE CÓDIGO Y RETROALIMENTACIÓN */}
        <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header del editor */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2E2527', padding: '10px 20px', borderRadius: '24px 24px 0 0', margin: '0 0 -20px 0' }}>
            <span style={{ color: '#FFB6C1', fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold' }}>workspace_sakura.js</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#FF5F56', borderRadius: '50%' }}></span>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#FFBD2E', borderRadius: '50%' }}></span>
              <span style={{ width: '10px', height: '10px', backgroundColor: '#27C93F', borderRadius: '50%' }}></span>
            </div>
          </div>

          {/* Área de Texto / Editor */}
          <div style={{ flex: 1, backgroundColor: '#2E2527', borderRadius: '0 0 24px 24px', padding: '25px', display: 'flex', boxShadow: '0 12px 28px rgba(0,0,0,0.15)' }}>
            <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} style={{ flex: 1, backgroundColor: 'transparent', color: '#FBEFF1', border: 'none', resize: 'none', fontFamily: 'monospace', fontSize: '16px', outline: 'none', lineHeight: '1.6' }} />
          </div>

          {/* Botón de Acción Principal */}
          <button style={{ padding: '20px', backgroundColor: '#FF69B4', color: '#FFF', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 16px rgba(255, 105, 180, 0.25)', transition: 'transform 0.1s' }}>
             🚀 Compilar y Evaluar Ejercicio
          </button>

          {/* Panel de resultados / Consola */}
          <div style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '20px', border: '1px solid #FFB6C1', minHeight: '100px', maxHeight: '180px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px', color: '#3C2F31', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <strong>📟 Consola del Sistema:</strong><br/>
            {resultadoIA ? resultadoIA : "Listo para compilar. Conéctate a una sala para habilitar el envío de mensajes asíncronos."}
          </div>
        </div>

      </div>
    </div>
  );
}
