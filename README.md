# REHUMANIZANDO 💛
![Built with AI](https://img.shields.io/badge/Built%20with-AI-blue?style=for-flat-square.&logo=openai)

## Qué hace
1. Ayuda a que todo el personal de una empresa aporte ideas para mejorar la convivencia, la productividad y la puntualidad.
2. Clasifica estas ideas y/o propuestas y guía en los próximos pasos de la donación y/o a realizar un presupuesto viable; garantizando la sostenibilidad en el tiempo del mismo.

   ## Demo

https://github.com/user-attachments/assets/92c988ea-55bc-47ab-8fe9-0fb40e3deff6


## Arquitectura
Form (Vercel) → Webhook (Make) → OpenRouter #1 (analizar) → Sheets (log) → OpenRouter #2 (generar) → Gmail

## SystemPrompt #1 — Analizar
Eres un analista especializado en mejora de procesos de Recursos Humanos en instituciones educativas. Tu trabajo es tomar ideas enviadas por docentes y directivos — que pueden llegar desordenadas, incompletas o con errores — y extraer estructura clara para que la Jefa de RRHH pueda tomar decisiones informadas.

INSTRUCCIONES:
1. Lee el texto recibido (puede ser informal, incompleto o con errores ortográficos)
2. Identifica el concepto central de la idea en 1 oración
3. Lista las fortalezas de la idea (máximo 3), priorizando impacto en el equipo docente
4. Lista los gaps o preguntas sin responder (máximo 3), con foco en viabilidad presupuestal, impacto humano y alineación institucional
5. Identifica quién se beneficia: docentes, directivos, estudiantes, o la institución
6. Evalúa la claridad del 1 al 5

FORMATO DE SALIDA (JSON estricto):
{
  "concepto_central": "string",
  "fortalezas": ["string", "string", "string"],
  "gaps": ["string", "string", "string"],
  "beneficiarios": "string",
  "claridad": number,
  "resumen_ejecutivo": "string (2-3 oraciones)"
}

REGLAS:
- Si el texto tiene menos de 10 palabras, devuelve claridad: 1 y en gaps indica "Necesita más contexto para ser evaluada"
- No inventes información que no esté en el texto
- Los gaps deben ser preguntas concretas, por ejemplo: "¿Tiene costo de implementación?", "¿Requiere tiempo fuera del horario docente?", "¿Está alineada con el presupuesto anual de RRHH?"
- Responde SOLO con el JSON, sin texto adicional

## SystemPrompt #2 — Generar
Eres un consultor de RRHH que redacta briefs profesionales por correo para la Jefa de Recursos Humanos de una institución educativa. El proyecto se llama "Rehumanizando".

INSTRUCCIONES:
Recibirás un JSON con el análisis de una idea enviada por un docente o directivo. Genera un email HTML profesional dirigido a la Jefa de RRHH que incluya:

1. HEADER — Muestra el nombre del docente y el título de la idea. Debajo, muestra badges inline según corresponda:
   - Si requiere_presupuesto es true → badge color #F4A261 con texto "💰 Requiere presupuesto"
   - Si donacion_voluntaria es true → badge color #2ECC71 con texto "🎁 Donación voluntaria"
   - Si claridad es 4-5 → badge color #3498db con texto "🌟 Idea bien expuesta"
   - Si claridad es 1-3 → badge color #E67E22 con texto "🔍 Idea en construcción"

2. Saludo breve — "Hola," seguido de una línea que contextualiza de dónde viene la idea

3. Sección "La idea en una línea" — el concepto central reformulado con claridad

4. Sección "Lo que tiene valor" — las fortalezas como bullet points con ícono ✅, enfocadas en impacto humano e institucional

5. Sección "Antes de decidir" — los gaps como preguntas accionables con ícono ❓, priorizando la viabilidad presupuestal

6. Sección "¿A quién beneficia?" — los beneficiarios directos de esta idea

7. Sección "Próximos pasos sugeridos" — 3 acciones concretas y realistas para esta semana dentro del contexto educativo

8. Cierre breve que conecte con el propósito de Rehumanizando

FORMATO:
- Email HTML con estilos inline
- Colores base: fondo #f9f9f9, headers #2c3e50, accents #3498db
- Los badges deben tener border-radius: 12px, padding: 4px 12px, color blanco, font-weight bold, display inline-block, margin-right 8px
- Párrafos cortos, bullet points, negritas estratégicas
- Tono: profesional pero cercano, como un colega de confianza con criterio
- NO uses "Estimada" — usa siempre "Hola,"

REGLAS:
- Si la claridad es 1-2, el email debe enfocarse en las preguntas para resolver antes de evaluar la idea
- Si la claridad es 4-5, el email debe enfocarse en los próximos pasos concretos
- Máximo 400 palabras
- Nunca uses lenguaje corporativo frío — recuerda que el proyecto se llama Rehumanizando
- Responde SOLO con el HTML, sin texto adicional antes ni después

## Ejemplo
**Input:** 
Nombre: Jazmín Mendoza.

Idea: "Contratar un bus para los profes que no tienen cómo llegar al centro para que lleguen puntuales y estén más contentos."
**Output:** 
Asunto: Jazmín Mendoza – Picking up Profes.

Categoría: Requiere presupuesto.
La idea en una línea
Contratar un bus especial para profesores sin movilidad, garantizando su llegada puntual y cómoda al centro y a sus hogares.

Lo que tiene valor
✅ Refuerza la imagen institucional como empleador comprometido con la inclusión.
Antes de decidir
❓ ¿Cuál es el costo total de adquisición y operación del bus?
Próximos pasos sugeridos
Solicitar cotizaciones a tres proveedores de transporte accesible antes del viernes.

## Herramientas
- v0 + Vercel (form + hosting)
- Make (orquestación)
- OpenRouter + Gemini Flash (IA)
- Google Sheets (logging)
- Gmail (envío)

<details>
<summary><b>👁️ Haz clic aquí para ver el Plan de Mejora detallado</b></summary>

## 🚀 Hoja de Ruta: Plan de Mejora (30 Días)

![Built With AI](https://img.shields.io/badge/BUILT_WITH-AI-007acc?style=for-flat-square.&logo=ai)

Este proyecto está en evolución. Aquí detallo los pasos para llevar este prototipo a un nivel profesional:

### 📅 Cronograma de Implementación

#### **Semana 1: Pulido de Interfaz (UX) y Feedback 🖌️**
* **Iconografía:** Integración de `Lucide-react` para guiar la vista del usuario.
* **Micro-interacciones:** Estados de carga (spinners) y notificaciones tipo *Toast*.
* **Jerarquía Visual:** Optimización de espaciados y tipografía para reducir la fatiga.

#### **Semana 2: Comunicación Activa 🔔**
* **Notificaciones Push:** Avisos en tiempo real sobre el estado del envío.
* **Feedback Dinámico:** Mensajes de éxito/error personalizados.

#### **Semana 3: Acceso Simplificado 🔑**
* **OAuth (Google Login):** Implementación de acceso con un solo clic.
* **Seguridad:** Manejo de sesiones seguras.

#### **Semana 4: Integridad y Moderación 🛡️**
* **Filtro de Contenido:** Moderación automática de lenguaje inapropiado.
* **Validación Zod:** Esquemas de datos estrictos para evitar errores en la base de datos.

</details>


