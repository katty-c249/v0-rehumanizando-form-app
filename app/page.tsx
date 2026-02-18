'use client';

import { useState, useRef, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  event: string;
  data: any;
}

export default function Home() {
  const [formData, setFormData] = useState({
    nombre: '',
    titulo: '',
    descripcion: '',
    requiere_presupuesto: false,
    donacion_voluntaria: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const debugScrollRef = useRef<HTMLDivElement>(null);

  const addLog = (event: string, data: any) => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setLogs((prev) => [...prev, { timestamp, event, data }]);

    // Auto-scroll debug drawer
    setTimeout(() => {
      if (debugScrollRef.current) {
        debugScrollRef.current.scrollTop = debugScrollRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    addLog('field_change', { field: name, value: fieldValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validation
    if (!formData.nombre.trim() || !formData.titulo.trim() || !formData.descripcion.trim()) {
      setSubmitError('Por favor completa todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      nombre: formData.nombre,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      requiere_presupuesto: formData.requiere_presupuesto,
      donacion_voluntaria: formData.donacion_voluntaria,
      timestamp: new Date().toISOString(),
    };

    addLog('submit_attempt', { payload });

    try {
      const response = await fetch('https://hook.us2.make.com/s22hnpnakmdctkzgf0jut566avrgzwxb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.text();
      addLog('webhook_response', { status: response.status, body: responseData });

      if (response.ok) {
        setIsSuccess(true);
        setIsDebugOpen(true);
      } else {
        setSubmitError('Hubo un problema al enviar. Revisa tu conexión e intenta de nuevo.');
      }
    } catch (error) {
      addLog('webhook_response', { status: 'error', body: error instanceof Error ? error.message : 'Unknown error' });
      setSubmitError('Hubo un problema al enviar. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      titulo: '',
      descripcion: '',
      requiere_presupuesto: false,
      donacion_voluntaria: false,
    });
    setIsSuccess(false);
    setSubmitError('');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{ backgroundColor: '#FFF8E7' }}
    >
      {/* Main Card */}
      <div
        className="w-full max-w-[560px] rounded-2xl p-8 shadow-lg"
        style={{ backgroundColor: '#FAF3E0' }}
      >
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#3D2B1F' }}>
                Rehumanizando 💛
              </h1>
              <p className="text-base" style={{ color: '#3D2B1F' }}>
                Comparte tu idea para mejorar nuestra comunidad
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#3D2B1F' }}
                >
                  Nombre *
                </label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{
                    backgroundColor: '#FFF8E7',
                    borderColor: formData.nombre ? '#F4A261' : '#E0D5C7',
                    color: '#3D2B1F',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#F4A261')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = formData.nombre ? '#F4A261' : '#E0D5C7')}
                />
              </div>

              {/* Título de la idea */}
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#3D2B1F' }}
                >
                  Título de la idea *
                </label>
                <input
                  id="titulo"
                  type="text"
                  name="titulo"
                  placeholder="Dale un nombre a tu idea"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                  style={{
                    backgroundColor: '#FFF8E7',
                    borderColor: formData.titulo ? '#F4A261' : '#E0D5C7',
                    color: '#3D2B1F',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#F4A261')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = formData.titulo ? '#F4A261' : '#E0D5C7')}
                />
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#3D2B1F' }}
                >
                  Descripción de la idea *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={4}
                  placeholder="Cuéntanos tu idea con el detalle que quieras. No hay respuestas incorrectas."
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: '#FFF8E7',
                    borderColor: formData.descripcion ? '#F4A261' : '#E0D5C7',
                    color: '#3D2B1F',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#F4A261')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = formData.descripcion ? '#F4A261' : '#E0D5C7')}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 py-2">
                <label className="flex items-center cursor-pointer gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="requiere_presupuesto"
                      checked={formData.requiere_presupuesto}
                      onChange={handleChange}
                      className="appearance-none w-6 h-6 rounded-md border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: '#F4A261',
                        backgroundColor: formData.requiere_presupuesto ? '#F4A261' : '#FFF8E7',
                      }}
                    />
                    {formData.requiere_presupuesto && (
                      <svg
                        className="absolute top-1 left-1 w-4 h-4 text-white pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#3D2B1F' }}>
                    Requiere presupuesto
                  </span>
                </label>

                <label className="flex items-center cursor-pointer gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="donacion_voluntaria"
                      checked={formData.donacion_voluntaria}
                      onChange={handleChange}
                      className="appearance-none w-6 h-6 rounded-md border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: '#F4A261',
                        backgroundColor: formData.donacion_voluntaria ? '#F4A261' : '#FFF8E7',
                      }}
                    />
                    {formData.donacion_voluntaria && (
                      <svg
                        className="absolute top-1 left-1 w-4 h-4 text-white pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: '#3D2B1F' }}>
                    Estoy dispuesta(o) a donar.
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">{submitError}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full font-bold text-white transition-all duration-200 disabled:opacity-75"
                style={{
                  backgroundColor: isSubmitting ? '#E76F51' : '#F4A261',
                }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#E76F51')}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#F4A261')}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar idea'}
              </button>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center space-y-6">
            <div className="text-5xl">💛</div>
            <h2 className="text-2xl font-bold" style={{ color: '#3D2B1F' }}>
              Tu idea fue enviada
            </h2>
            <p className="text-base" style={{ color: '#3D2B1F' }}>
              Amamos que nos escribas.
            </p>
            <button
              onClick={handleReset}
              className="text-base font-semibold underline transition-colors"
              style={{ color: '#F4A261' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#E76F51')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#F4A261')}
            >
              Enviar otra idea
            </button>
          </div>
        )}
      </div>

      {/* Debug Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Toggle Bar */}
        <button
          onClick={() => setIsDebugOpen(!isDebugOpen)}
          className="w-full py-2 px-4 font-mono text-xs text-white transition-all"
          style={{
            backgroundColor: '#1a1a1a',
            borderTop: '1px solid #333',
          }}
        >
          🛠 Debug
        </button>

        {/* Drawer Panel */}
        {isDebugOpen && (
          <div
            className="w-full border-t"
            style={{
              backgroundColor: '#1a1a1a',
              height: '140px',
              borderTopColor: '#333',
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header with Clear Button */}
              <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderBottomColor: '#333' }}>
                <span className="text-xs font-mono" style={{ color: '#00ff88' }}>
                  Console Log
                </span>
                <button
                  onClick={clearLogs}
                  className="text-xs px-2 py-1 rounded transition-colors"
                  style={{ backgroundColor: '#333', color: '#00ff88' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#444')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#333')}
                >
                  Limpiar
                </button>
              </div>

              {/* Log Content */}
              <div
                ref={debugScrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs"
                style={{ color: '#00ff88' }}
              >
                {logs.length === 0 ? (
                  <div style={{ color: '#666' }}>Los eventos aparecerán aquí...</div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="border-l-2 pl-2" style={{ borderLeftColor: '#00ff88' }}>
                      <div style={{ color: '#888' }}>[{log.timestamp}]</div>
                      <div>{`${log.event}: ${JSON.stringify(log.data)}`}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
