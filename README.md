CoCode Sakura v2.0 - Plataforma de Pair Programming
¡Bienvenido al repositorio central de CoCode Sakura! Esta es una plataforma de desarrollo cooperativo en tiempo real orientada al aprendizaje de programación. Está diseñada bajo una arquitectura distribuida que soporta tanto microservicios como sincronización de datos síncrona/asíncrona.

Arquitectura del Sistema (Propuesta y En Desarrollo)
El sistema está migrando hacia una infraestructura robusta dividida en los siguientes componentes:

FRONTEND: Desarrollado en React, utiliza WebSockets (StompJS / SockJS) para capturar los eventos del teclado en tiempo real.

BACKEND CENTRAL: Desarrollado en Spring Boot. Se encarga de gestionar la lógica de las salas colaborativas, los usuarios y la persistencia de datos.

BASE DE DATOS: Integración con Firebase / Firestore para el almacenamiento rápido del estado de los usuarios.

BROKER DE MENSAJES: Implementación de RabbitMQ para el intercambio masivo y asíncrono de eventos de código entre estudiantes concurrentes.

MICROSERVICIO DE IA: Desarrollado en Node.js y Express, corriendo dentro de Docker, el cual se comunica localmente con Ollama usando el modelo Qwen2.5:1.5b.

Componentes Actuales del Proyecto
Frontend (cocode-frontend)
Tecnologías: React, Vite, Firebase Auth.

Características:

Interfaz limpia e interactiva basada en la temática visual Sakura.

Banco de ejercicios interactivos dinámicos (Lecciones 1, 2 y 3 incorporadas).

Panel de colaboración sincrónica simulado (Estructura lista para acoplar tokens de sesión).

Consola del sistema integrada para reflejar respuestas de compilación y notas.

Servicio de IA (cocode-ai-servicio)
Tecnologías: Node.js, Express, Docker.

Modelos: Conectado localmente a qwen2.5:1.5b mediante el endpoint oficial de chat de Ollama.

Misión: Recibe el código escrito por el estudiante junto con las instrucciones del problema, realiza una evaluación estricta y retorna una calificación de 0 a 100 acompañada de los puntos clave a corregir.

Próximos Pasos para el Equipo de Desarrollo
Para habilitar que dos estudiantes puedan editar el mismo código al mismo tiempo dentro de una sala, el pipeline a implementar con Spring Boot y RabbitMQ consiste en:

Levantar RabbitMQ: Configurar un Exchange de tipo Fanout o Topic encargado de distribuir las pulsaciones de teclas (keystrokes) recibidas.

Sockets en Spring Boot: Crear controladores usando @MessageMapping para capturar el flujo de datos proveniente del editor de texto en React.

Suscripción en el Frontend: Implementar el cliente STOMP en la aplicación de React para escuchar la cola correspondiente al ID de la sala activa y actualizar el estado del editor en caliente.

Instrucciones de Despliegue Local con Docker
Para inicializar el ecosistema actual en tu entorno local (Frontend + Servicio de IA), abre una terminal en la raíz del proyecto y ejecuta el siguiente comando:

docker compose down && docker compose up -d

Desarrollado con mucha dedicación por el equipo de CoCode.

Ya lo puedes copiar directamente. Si prefieres meterlo desde la terminal de Fedora sin enredos, solo tendrías que escribir nano README.md, pegar este texto adentro, guardarlo con Ctrl+O y salir con Ctrl+X. ¡Cuéntame si así te queda mucho más cómodo!
