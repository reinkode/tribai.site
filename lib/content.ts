export type Lang = "en" | "es";

export interface ChatMessage {
  role: "user" | "ai";
  text: { en: string; es: string };
}

export const content = {
  nav: {
    services: { en: "Services", es: "Servicios" },
    about: { en: "About", es: "Nosotros" },
    team: { en: "Team", es: "Equipo" },
    process: { en: "How We Work", es: "Cómo Trabajamos" },
    contact: { en: "Contact", es: "Contacto" },
    cta: { en: "Start a Project", es: "Iniciar Proyecto" },
    allServices: { en: "All services", es: "Todos los servicios" },
  },

  hero: {
    badge: { en: "AI-Powered Digital Agency", es: "Agencia Digital Impulsada por IA" },
    titleA: { en: "INTELLIGENCE,", es: "INTELIGENCIA," },
    titleB: { en: "ENGINEERED.", es: "INGENIERÍA APLICADA." },
    subtitle: {
      en: "TribAI converges solid business with intelligent technology — custom software, applied artificial intelligence, social growth and living communities.",
      es: "TribAI converge el negocio sólido con la tecnología inteligente — software a medida, inteligencia artificial aplicada, crecimiento en redes y comunidades vivas.",
    },
    ctaPrimary: { en: "Start a Project", es: "Iniciar un Proyecto" },
    ctaSecondary: { en: "Explore Services", es: "Explorar Servicios" },
    signals: {
      en: ["PRODUCT & SOFTWARE", "APPLIED AI", "DATA & AUTOMATION", "AUDIENCE & COMMUNITY"],
      es: ["PRODUCTO Y SOFTWARE", "IA APLICADA", "DATOS Y AUTOMATIZACIÓN", "AUDIENCIA Y COMUNIDAD"],
    },
    scroll: { en: "scroll to explore", es: "desliza para explorar" },
    chatTitle: { en: "TribAI · Assistant", es: "TribAI · Asistente" },
    chatStatus: { en: "online", es: "en línea" },
    chatInput: { en: "Ask something...", es: "Pregunta algo..." },
    script: [
      {
        role: "user",
        text: {
          en: "Hey TribAI, what can you do for my business?",
          es: "Hola TribAI, ¿qué puedes hacer por mi negocio?",
        },
      },
      {
        role: "ai",
        text: {
          en: "We engineer custom software that scales with your ambition.",
          es: "Ingeniamos software a medida que escala con tu ambición.",
        },
      },
      {
        role: "ai",
        text: {
          en: "We integrate AI that automates the repetitive and amplifies the creative.",
          es: "Integramos IA que automatiza lo repetitivo y amplifica lo creativo.",
        },
      },
      {
        role: "ai",
        text: {
          en: "And we grow your brand through social media and living communities.",
          es: "Y hacemos crecer tu marca con redes sociales y comunidades vivas.",
        },
      },
      {
        role: "user",
        text: { en: "Impressive. Let's talk.", es: "Impresionante. Hablemos." },
      },
      {
        role: "ai",
        text: {
          en: "Great choice. The future starts below.",
          es: "Excelente decisión. El futuro comienza abajo.",
        },
      },
    ] as ChatMessage[],
  },

  marquee: {
    items: {
      en: [
        "SOFTWARE DEVELOPMENT",
        "AI IMPLEMENTATION",
        "SOCIAL MEDIA GROWTH",
        "COMMUNITY BUILDING",
        "AUTOMATION",
        "DATA INTELLIGENCE",
      ],
      es: [
        "DESARROLLO DE SOFTWARE",
        "IMPLEMENTACIÓN DE IA",
        "CRECIMIENTO EN REDES",
        "CREACIÓN DE COMUNIDADES",
        "AUTOMATIZACIÓN",
        "INTELIGENCIA DE DATOS",
      ],
    },
  },

  serviceOverview: {
    tag: { en: "// HOW OUR SERVICES CONNECT", es: "// CÓMO SE CONECTAN NUESTROS SERVICIOS" },
    title: { en: "One partner across the", es: "Un solo aliado para todo el" },
    titleAccent: { en: "digital journey", es: "recorrido digital" },
    subtitle: {
      en: "Six connected services organized around the work that moves an organization forward: building, intelligence and growth.",
      es: "Seis servicios conectados, organizados alrededor del trabajo que hace avanzar a una organización: construir, inteligencia y crecimiento.",
    },
    explore: { en: "Explore service", es: "Explorar servicio" },
    pillars: [
      {
        code: "01",
        label: { en: "BUILD", es: "CONSTRUIR" },
        title: { en: "Digital products & foundations", es: "Productos y bases digitales" },
        desc: {
          en: "The platforms, systems and data foundations that turn ambitious ideas into dependable operations.",
          es: "Las plataformas, sistemas y bases de datos que convierten ideas ambiciosas en operaciones confiables.",
        },
        serviceSlugs: ["software-development", "data-strategy"],
      },
      {
        code: "02",
        label: { en: "INTELLIGENCE", es: "INTELIGENCIA" },
        title: { en: "AI systems & automation", es: "Sistemas de IA y automatización" },
        desc: {
          en: "Practical intelligence embedded into the workflows, decisions and conversations that matter.",
          es: "Inteligencia práctica integrada en los flujos, decisiones y conversaciones que más importan.",
        },
        serviceSlugs: ["ai-implementation", "chatbots-automation"],
      },
      {
        code: "03",
        label: { en: "GROWTH", es: "CRECIMIENTO" },
        title: { en: "Audience & community systems", es: "Sistemas de audiencia y comunidad" },
        desc: {
          en: "The strategy and operating systems that build attention, participation and long-term momentum.",
          es: "La estrategia y los sistemas operativos que construyen atención, participación e impulso a largo plazo.",
        },
        serviceSlugs: ["social-media-growth", "community-building"],
      },
    ],
  },

  operatingModel: {
    tag: { en: "// HOW WE ENGAGE", es: "// CÓMO NOS INVOLUCRAMOS" },
    title: { en: "Strategy, execution and", es: "Estrategia, ejecución y" },
    titleAccent: { en: "continuous evolution", es: "evolución continua" },
    subtitle: {
      en: "Our practices work as one system, so your roadmap can move from the first question to a stronger operating model without changing partners.",
      es: "Nuestras prácticas funcionan como un sistema, para que tu hoja de ruta avance desde la primera pregunta hasta un modelo operativo más sólido sin cambiar de aliado.",
    },
    stages: [
      {
        code: "A",
        title: { en: "Frame the opportunity", es: "Definir la oportunidad" },
        desc: {
          en: "Clarify the business case, users, systems and priorities before production work begins.",
          es: "Aclarar el caso de negocio, usuarios, sistemas y prioridades antes de iniciar la producción.",
        },
      },
      {
        code: "B",
        title: { en: "Build the right system", es: "Construir el sistema correcto" },
        desc: {
          en: "Bring product, data and intelligence together in a delivery plan that fits the operation.",
          es: "Unir producto, datos e inteligencia en un plan de entrega que se ajuste a la operación.",
        },
      },
      {
        code: "C",
        title: { en: "Activate and improve", es: "Activar y mejorar" },
        desc: {
          en: "Connect delivery to your audience and teams, then refine what matters as conditions change.",
          es: "Conectar la entrega con tu audiencia y equipos, y luego refinar lo importante a medida que cambian las condiciones.",
        },
      },
    ],
  },

  services: {
    tag: { en: "// COMPLETE SERVICE DIRECTORY", es: "// DIRECTORIO COMPLETO DE SERVICIOS" },
    title: { en: "Explore our", es: "Explora nuestros" },
    titleAccent: { en: "services", es: "servicios" },
    subtitle: {
      en: "Every service has a dedicated focus, detailed scope and a clear place within the broader work.",
      es: "Cada servicio tiene un enfoque especializado, alcance detallado y un lugar claro dentro del trabajo integral.",
    },
    viewMore: { en: "Learn more", es: "Conocer más" },
    items: [
      {
        slug: "software-development",
        icon: "code",
        title: { en: "Software Development", es: "Desarrollo de Software" },
        desc: {
          en: "Web platforms, mobile apps and internal tools engineered to scale — from MVP to enterprise.",
          es: "Plataformas web, apps móviles y herramientas internas diseñadas para escalar — de MVP a empresa.",
        },
        page: {
          tag: { en: "// CUSTOM ENGINEERING", es: "// INGENIERÍA A MEDIDA" },
          headline: {
            en: "Software built around your business — not the other way around.",
            es: "Software construido alrededor de tu negocio — no al revés.",
          },
          overview: [
            {
              en: "Off-the-shelf tools force your team to work their way. We do the opposite: we design and build web platforms, mobile applications and internal tools that adapt to your processes and become the operational backbone of your company. Every line of code exists to solve a real problem of your business.",
              es: "Las herramientas genéricas obligan a tu equipo a trabajar a su manera. Nosotros hacemos lo contrario: diseñamos y construimos plataformas web, aplicaciones móviles y herramientas internas que se adaptan a tus procesos y se convierten en la columna vertebral operativa de tu empresa. Cada línea de código existe para resolver un problema real de tu negocio.",
            },
            {
              en: "From the first wireframe to production infrastructure, our engineers own the entire lifecycle: UX architecture, development, QA, DevOps and long-term maintenance. You get a product that scales with your ambition — with clean code your future team will thank you for.",
              es: "Desde el primer wireframe hasta la infraestructura de producción, nuestros ingenieros se hacen cargo de todo el ciclo: arquitectura UX, desarrollo, QA, DevOps y mantenimiento a largo plazo. Obtienes un producto que escala con tu ambición — con código limpio por el que tu equipo futuro te lo agradecerá.",
            },
          ],
          featuresLabel: { en: "WHAT WE BUILD", es: "QUÉ CONSTRUIMOS" },
          features: [
            {
              title: { en: "Custom Web Platforms", es: "Plataformas Web a Medida" },
              desc: {
                en: "SaaS products, marketplaces, portals and dashboards with modern stacks like Next.js, React and Node.",
                es: "Productos SaaS, marketplaces, portales y dashboards con stacks modernos como Next.js, React y Node.",
              },
            },
            {
              title: { en: "Mobile Applications", es: "Aplicaciones Móviles" },
              desc: {
                en: "iOS and Android apps from a single codebase with React Native or Flutter, published to the stores.",
                es: "Apps para iOS y Android desde una sola base de código con React Native o Flutter, publicadas en las tiendas.",
              },
            },
            {
              title: { en: "Internal Tools & Dashboards", es: "Herramientas Internas y Dashboards" },
              desc: {
                en: "CRMs, admin panels and ops tools that save your team hours of manual work every week.",
                es: "CRMs, paneles de administración y herramientas operativas que ahorran a tu equipo horas de trabajo manual cada semana.",
              },
            },
            {
              title: { en: "APIs & Integrations", es: "APIs e Integraciones" },
              desc: {
                en: "Robust REST/GraphQL APIs and integrations with your existing ERP, CRM or payment stack.",
                es: "APIs REST/GraphQL robustas e integraciones con tu ERP, CRM o pasarela de pagos existente.",
              },
            },
            {
              title: { en: "Cloud Architecture & DevOps", es: "Arquitectura Cloud y DevOps" },
              desc: {
                en: "Scalable infrastructure on AWS, GCP or Vercel with CI/CD pipelines and automated testing.",
                es: "Infraestructura escalable en AWS, GCP o Vercel con pipelines CI/CD y pruebas automatizadas.",
              },
            },
            {
              title: { en: "Maintenance & Evolution", es: "Mantenimiento y Evolución" },
              desc: {
                en: "Monitoring, security patches and continuous improvement so your product never falls behind.",
                es: "Monitoreo, parches de seguridad y mejora continua para que tu producto nunca se quede atrás.",
              },
            },
          ],
          deliverablesLabel: { en: "WHAT YOU GET", es: "QUÉ RECIBES" },
          deliverables: [
            { en: "Full source code in your repository — you own 100%", es: "Código fuente completo en tu repositorio — eres dueño del 100%" },
            { en: "Staging and production environments", es: "Entornos de staging y producción" },
            { en: "CI/CD pipeline with automated tests", es: "Pipeline CI/CD con pruebas automatizadas" },
            { en: "Technical documentation and API docs", es: "Documentación técnica y de APIs" },
            { en: "Deployment on the cloud of your choice", es: "Despliegue en la nube que elijas" },
            { en: "Handover and training sessions for your team", es: "Sesiones de transferencia y capacitación para tu equipo" },
          ],
          faqsLabel: { en: "COMMON QUESTIONS", es: "PREGUNTAS FRECUENTES" },
          faqs: [
            {
              q: { en: "How long does an MVP take?", es: "¿Cuánto tarda un MVP?" },
              a: {
                en: "A focused MVP typically takes 8–12 weeks from kickoff to launch. We define a tight scope in the discovery phase and ship in weekly increments you can test from week one.",
                es: "Un MVP enfocado suele tomar de 8 a 12 semanas desde el inicio hasta el lanzamiento. Definimos un alcance preciso en la fase de descubrimiento y entregamos en incrementos semanales que puedes probar desde la primera semana.",
              },
            },
            {
              q: { en: "Can you take over an existing codebase?", es: "¿Pueden hacerse cargo de un código existente?" },
              a: {
                en: "Yes. We start with a technical audit to map the current state, then stabilize and refactor before adding new features. You'll get an honest assessment before committing to anything.",
                es: "Sí. Comenzamos con una auditoría técnica para mapear el estado actual, luego estabilizamos y refactorizamos antes de añadir funcionalidades. Recibirás una evaluación honesta antes de comprometerte a nada.",
              },
            },
            {
              q: { en: "Who owns the intellectual property?", es: "¿Quién es dueño de la propiedad intelectual?" },
              a: {
                en: "You do — 100%, from day one. All code, designs and documentation are created in accounts and repositories you own.",
                es: "Tú — 100%, desde el día uno. Todo el código, diseños y documentación se crean en cuentas y repositorios de tu propiedad.",
              },
            },
          ],
        },
      },
      {
        slug: "ai-implementation",
        icon: "brain",
        title: { en: "AI Implementation", es: "Implementación de IA" },
        desc: {
          en: "LLM integrations, intelligent agents, computer vision and ML pipelines tailored to your workflow.",
          es: "Integraciones de LLMs, agentes inteligentes, visión computacional y pipelines de ML adaptados a tu flujo de trabajo.",
        },
        page: {
          tag: { en: "// APPLIED ARTIFICIAL INTELLIGENCE", es: "// INTELIGENCIA ARTIFICIAL APLICADA" },
          headline: {
            en: "Practical AI that pays for itself.",
            es: "IA práctica que se paga sola.",
          },
          overview: [
            {
              en: "Artificial intelligence is not a magic trick — it's a lever. We identify the processes where AI genuinely saves money or creates revenue in your business, then implement it with production-grade rigor. No demos that break in the real world; systems that work under real load with real users.",
              es: "La inteligencia artificial no es un truco de magia — es una palanca. Identificamos los procesos donde la IA genuinamente ahorra dinero o genera ingresos en tu negocio, y la implementamos con rigor de producción. Nada de demos que se rompen en el mundo real; sistemas que funcionan bajo carga real con usuarios reales.",
            },
            {
              en: "From integrating large language models into your product to training custom models on your data, we cover the full spectrum — always with evaluation frameworks, monitoring and privacy controls built in from day one.",
              es: "Desde integrar modelos de lenguaje en tu producto hasta entrenar modelos personalizados con tus datos, cubrimos todo el espectro — siempre con frameworks de evaluación, monitoreo y controles de privacidad integrados desde el primer día.",
            },
          ],
          featuresLabel: { en: "WHAT WE IMPLEMENT", es: "QUÉ IMPLEMENTAMOS" },
          features: [
            {
              title: { en: "LLM Integration & Prompt Systems", es: "Integración de LLMs y Sistemas de Prompts" },
              desc: {
                en: "GPT, Claude and open-source models wired into your product with structured prompts, guardrails and caching.",
                es: "GPT, Claude y modelos open-source integrados en tu producto con prompts estructurados, guardarraíles y caché.",
              },
            },
            {
              title: { en: "Custom AI Agents", es: "Agentes de IA a Medida" },
              desc: {
                en: "Autonomous agents that research, plan and execute multi-step tasks — from sales outreach to ops coordination.",
                es: "Agentes autónomos que investigan, planifican y ejecutan tareas de múltiples pasos — desde prospección de ventas hasta coordinación operativa.",
              },
            },
            {
              title: { en: "RAG — Chat With Your Data", es: "RAG — Chatea Con Tus Datos" },
              desc: {
                en: "Ask questions in natural language over your documents, wikis and databases with accurate, cited answers.",
                es: "Haz preguntas en lenguaje natural sobre tus documentos, wikis y bases de datos con respuestas precisas y citadas.",
              },
            },
            {
              title: { en: "Document Intelligence", es: "Inteligencia de Documentos" },
              desc: {
                en: "OCR and extraction pipelines that turn invoices, contracts and forms into structured, searchable data.",
                es: "Pipelines de OCR y extracción que convierten facturas, contratos y formularios en datos estructurados y buscables.",
              },
            },
            {
              title: { en: "Predictive ML Models", es: "Modelos Predictivos de ML" },
              desc: {
                en: "Demand forecasting, churn prediction, pricing optimization and recommendation systems trained on your data.",
                es: "Pronóstico de demanda, predicción de abandono, optimización de precios y sistemas de recomendación entrenados con tus datos.",
              },
            },
            {
              title: { en: "MLOps & Monitoring", es: "MLOps y Monitoreo" },
              desc: {
                en: "Model versioning, performance dashboards and drift alerts so your AI keeps its quality over time.",
                es: "Versionado de modelos, dashboards de rendimiento y alertas de deriva para que tu IA mantenga su calidad con el tiempo.",
              },
            },
          ],
          deliverablesLabel: { en: "WHAT YOU GET", es: "QUÉ RECIBES" },
          deliverables: [
            { en: "AI features running in production, not just prototypes", es: "Funcionalidades de IA en producción, no solo prototipos" },
            { en: "Evaluation suite with measurable accuracy targets", es: "Suite de evaluación con objetivos de precisión medibles" },
            { en: "Privacy controls — your data never trains public models", es: "Controles de privacidad — tus datos nunca entrenan modelos públicos" },
            { en: "Monitoring dashboard for cost, latency and quality", es: "Dashboard de monitoreo de costo, latencia y calidad" },
            { en: "Documentation and playbooks for your team", es: "Documentación y manuales para tu equipo" },
            { en: "Training session so your team can operate the system", es: "Sesión de capacitación para que tu equipo opere el sistema" },
          ],
          faqsLabel: { en: "COMMON QUESTIONS", es: "PREGUNTAS FRECUENTES" },
          faqs: [
            {
              q: { en: "Do I need a lot of data to use AI?", es: "¿Necesito muchos datos para usar IA?" },
              a: {
                en: "Not necessarily. LLM-based solutions work well with little or no training data. For custom machine learning we start with a data audit and tell you honestly what's possible — sometimes a small, clean dataset is enough.",
                es: "No necesariamente. Las soluciones basadas en LLMs funcionan bien con pocos o ningún dato de entrenamiento. Para machine learning personalizado comenzamos con una auditoría de datos y te decimos honestamente qué es posible — a veces un dataset pequeño y limpio es suficiente.",
              },
            },
            {
              q: { en: "How do you handle data privacy and security?", es: "¿Cómo manejan la privacidad y seguridad de los datos?" },
              a: {
                en: "We sign NDAs by default, use enterprise APIs that don't train on your data, and can deploy fully private models in your VPC or on-premises for sensitive workloads.",
                es: "Firmamos NDAs por defecto, usamos APIs empresariales que no entrenan con tus datos, y podemos desplegar modelos completamente privados en tu VPC o on-premise para cargas sensibles.",
              },
            },
            {
              q: { en: "Which AI models do you work with?", es: "¿Con qué modelos de IA trabajan?" },
              a: {
                en: "We're model-agnostic: OpenAI, Anthropic, Gemini and open-source models like Llama and Qwen. We choose per project based on quality, cost and privacy — never by hype.",
                es: "Somos agnósticos al modelo: OpenAI, Anthropic, Gemini y modelos open-source como Llama y Qwen. Elegimos según calidad, costo y privacidad de cada proyecto — nunca por moda.",
              },
            },
          ],
        },
      },
      {
        slug: "social-media-growth",
        icon: "rocket",
        title: { en: "Social Media Growth", es: "Potenciación de Redes Sociales" },
        desc: {
          en: "Content systems, paid strategy and analytics that turn followers into a loyal audience.",
          es: "Sistemas de contenido, estrategia pagada y analítica que convierten seguidores en audiencia leal.",
        },
        page: {
          tag: { en: "// AMPLIFY YOUR VOICE", es: "// AMPLIFICA TU VOZ" },
          headline: {
            en: "From posting to positioning.",
            es: "De publicar a posicionar.",
          },
          overview: [
            {
              en: "Posting consistently is not a strategy. We build content systems that make your brand impossible to ignore: a clear editorial angle, formats that hook in the first second, and distribution tuned to each platform's algorithm — from TikTok and Instagram to LinkedIn and X.",
              es: "Publicar con constancia no es una estrategia. Construimos sistemas de contenido que hacen tu marca imposible de ignorar: un ángulo editorial claro, formatos que enganchan en el primer segundo y distribución afinada al algoritmo de cada plataforma — de TikTok e Instagram a LinkedIn y X.",
            },
            {
              en: "Organic and paid work as one engine: content tells you what resonates, paid media amplifies what works, and analytics close the loop. The result is growth you can measure — in followers, yes, but more importantly in leads, sales and brand authority.",
              es: "Lo orgánico y lo pagado funcionan como un solo motor: el contenido te dice qué resuena, los medios pagados amplifican lo que funciona, y la analítica cierra el ciclo. El resultado es un crecimiento que puedes medir — en seguidores, sí, pero más importante aún en prospectos, ventas y autoridad de marca.",
            },
          ],
          featuresLabel: { en: "WHAT WE RUN", es: "QUÉ GESTIONAMOS" },
          features: [
            {
              title: { en: "Content Strategy & Calendar", es: "Estrategia de Contenido y Calendario" },
              desc: {
                en: "A data-backed editorial plan with pillars, formats and a monthly calendar your team can actually sustain.",
                es: "Un plan editorial basado en datos con pilares, formatos y un calendario mensual que tu equipo realmente puede sostener.",
              },
            },
            {
              title: { en: "Short-Form Video Systems", es: "Sistemas de Video Corto" },
              desc: {
                en: "Reels, TikToks and Shorts engineered around hooks, retention and trends — produced in weekly batches.",
                es: "Reels, TikToks y Shorts diseñados alrededor de ganchos, retención y tendencias — producidos en lotes semanales.",
              },
            },
            {
              title: { en: "Paid Social Campaigns", es: "Campañas de Social Ads" },
              desc: {
                en: "Meta, TikTok and LinkedIn ads with creative testing frameworks that scale what converts profitably.",
                es: "Anuncios en Meta, TikTok y LinkedIn con marcos de prueba creativa que escalan lo que convierte con rentabilidad.",
              },
            },
            {
              title: { en: "Influencer & Collab Programs", es: "Programas de Influencers y Colaboraciones" },
              desc: {
                en: "We identify, negotiate and manage creators who genuinely align with your brand and audience.",
                es: "Identificamos, negociamos y gestionamos creadores que genuinamente se alinean con tu marca y audiencia.",
              },
            },
            {
              title: { en: "Community Management", es: "Gestión de Comunidad" },
              desc: {
                en: "Daily engagement, comment strategy and DM workflows that turn passive followers into active fans.",
                es: "Engagement diario, estrategia de comentarios y flujos de DM que convierten seguidores pasivos en fans activos.",
              },
            },
            {
              title: { en: "Analytics & Reporting", es: "Analítica y Reportes" },
              desc: {
                en: "Monthly dashboards tying every post and campaign to reach, engagement, leads and revenue.",
                es: "Dashboards mensuales que vinculan cada publicación y campaña con alcance, interacción, prospectos e ingresos.",
              },
            },
          ],
          deliverablesLabel: { en: "WHAT YOU GET", es: "QUÉ RECIBES" },
          deliverables: [
            { en: "Monthly content calendar with pillars and formats", es: "Calendario mensual de contenido con pilares y formatos" },
            { en: "Produced creative assets — video, design and copy", es: "Assets creativos producidos — video, diseño y copy" },
            { en: "Paid campaigns live with weekly optimization", es: "Campañas pagadas activas con optimización semanal" },
            { en: "Influencer pipeline with negotiated agreements", es: "Pipeline de influencers con acuerdos negociados" },
            { en: "Monthly growth report tied to business metrics", es: "Reporte mensual de crecimiento vinculado a métricas de negocio" },
            { en: "Playbook documenting your winning formulas", es: "Manual documentando tus fórmulas ganadoras" },
          ],
          faqsLabel: { en: "COMMON QUESTIONS", es: "PREGUNTAS FRECUENTES" },
          faqs: [
            {
              q: { en: "How fast will I see growth?", es: "¿Qué tan rápido veré crecimiento?" },
              a: {
                en: "Expect meaningful traction in 90 days: the first month builds foundations, the second tests formats, the third compounds what works. We set milestone targets together and report against them monthly.",
                es: "Espéra traction significativa en 90 días: el primer mes construye bases, el segundo prueba formatos, el tercero capitaliza lo que funciona. Fijamos objetivos por hitos juntos y reportamos contra ellos cada mes.",
              },
            },
            {
              q: { en: "Do you create the content or just advise?", es: "¿Crean el contenido o solo asesoran?" },
              a: {
                en: "We do both, end to end: strategy, scripting, filming guidance, editing, design, copywriting and publishing. You approve everything through a simple review flow before it goes live.",
                es: "Hacemos ambos, de principio a fin: estrategia, guiones, dirección de grabación, edición, diseño, copywriting y publicación. Tú apruebas todo mediante un flujo de revisión simple antes de que salga a la luz.",
              },
            },
            {
              q: { en: "Which platforms should my brand be on?", es: "¿En qué plataformas debería estar mi marca?" },
              a: {
                en: "The ones your audience actually uses. We analyze your customers and competitors, then recommend a focused mix — usually 2 platforms done excellently beat 5 done poorly.",
                es: "En las que tu audiencia realmente usa. Analizamos tus clientes y competidores, y recomendamos una combinación enfocada — normalmente 2 plataformas hechas con excelencia superan a 5 hechas mal.",
              },
            },
          ],
        },
      },
      {
        slug: "community-building",
        icon: "users",
        title: { en: "Community Building", es: "Creación de Comunidades" },
        desc: {
          en: "We design, launch and nurture communities that give your brand a living, breathing tribe.",
          es: "Diseñamos, lanzamos y nutrimos comunidades que le dan a tu marca una tribu viva y activa.",
        },
        page: {
          tag: { en: "// YOUR BRAND'S TRIBE", es: "// LA TRIBU DE TU MARCA" },
          headline: {
            en: "Audiences rent attention. Communities own it.",
            es: "La audiencia alquila la atención. La comunidad la posee.",
          },
          overview: [
            {
              en: "Followers can disappear with an algorithm change; a community can't. We design and run branded communities where your customers become participants — helping each other, creating content for you and defending your brand because it genuinely belongs to them.",
              es: "Los seguidores pueden desaparecer con un cambio de algoritmo; una comunidad, no. Diseñamos y gestionamos comunidades de marca donde tus clientes se convierten en participantes — ayudándose entre ellos, creando contenido para ti y defendiendo tu marca porque genuinamente les pertenece.",
            },
            {
              en: "From a Discord server for your product to a private network for your top customers, we handle architecture, onboarding, rituals, moderation and events — the unglamorous work that makes a community feel alive instead of like a ghost town.",
              es: "Desde un servidor de Discord para tu producto hasta una red privada para tus mejores clientes, nos encargamos de la arquitectura, el onboarding, los rituales, la moderación y los eventos — el trabajo poco glamoroso que hace que una comunidad se sienta viva en lugar de un pueblo fantasma.",
            },
          ],
          featuresLabel: { en: "WHAT WE BUILD", es: "QUÉ CONSTRUIMOS" },
          features: [
            {
              title: { en: "Community Strategy & Architecture", es: "Estrategia y Arquitectura de Comunidad" },
              desc: {
                en: "Purpose, member personas and the channel structure that matches how your people actually gather.",
                es: "Propósito, perfiles de miembro y la estructura de canales que se ajusta a cómo tu gente realmente se reúne.",
              },
            },
            {
              title: { en: "Discord & Telegram Setup", es: "Configuración de Discord y Telegram" },
              desc: {
                en: "Servers built right: roles, permissions, bots, verification and a design that feels unmistakably yours.",
                es: "Servidores bien construidos: roles, permisos, bots, verificación y un diseño inconfundiblemente tuyo.",
              },
            },
            {
              title: { en: "Onboarding & Rituals", es: "Onboarding y Rituales" },
              desc: {
                en: "Welcome flows, weekly rituals and traditions that turn first-time members into regulars.",
                es: "Flujos de bienvenida, rituales semanales y tradiciones que convierten a los nuevos miembros en habituales.",
              },
            },
            {
              title: { en: "Ambassador & Moderation Programs", es: "Programas de Embajadores y Moderación" },
              desc: {
                en: "We recruit, train and reward the members who keep the culture healthy around the clock.",
                es: "Reclutamos, capacitamos y recompensamos a los miembros que mantienen la cultura sana las 24 horas.",
              },
            },
            {
              title: { en: "Events & Activations", es: "Eventos y Activaciones" },
              desc: {
                en: "AMAs, challenges, meetups and launch events that give the community reasons to keep coming back.",
                es: "AMAs, retos, encuentros y eventos de lanzamiento que dan a la comunidad razones para volver.",
              },
            },
            {
              title: { en: "Health Metrics & Retention", es: "Métricas de Salud y Retención" },
              desc: {
                en: "Participation, retention and sentiment dashboards so you always know how your tribe is doing.",
                es: "Dashboards de participación, retención y sentimiento para que siempre sepas cómo está tu tribu.",
              },
            },
          ],
          deliverablesLabel: { en: "WHAT YOU GET", es: "QUÉ RECIBES" },
          deliverables: [
            { en: "Launched community on Discord, Telegram or your platform", es: "Comunidad lanzada en Discord, Telegram o tu plataforma" },
            { en: "Roles, permissions and automated moderation flows", es: "Roles, permisos y flujos de moderación automatizada" },
            { en: "Onboarding journeys and welcome sequences", es: "Jornadas de onboarding y secuencias de bienvenida" },
            { en: "Moderation handbook and ambassador program", es: "Manual de moderación y programa de embajadores" },
            { en: "Monthly community health report", es: "Reporte mensual de salud de la comunidad" },
            { en: "Event calendar with programmed activations", es: "Calendario de eventos con activaciones programadas" },
          ],
          faqsLabel: { en: "COMMON QUESTIONS", es: "PREGUNTAS FRECUENTES" },
          faqs: [
            {
              q: { en: "Discord or Telegram — which is better?", es: "¿Discord o Telegram — cuál es mejor?" },
              a: {
                en: "It depends on your audience and use case: Discord excels for structured, always-on communities around products or brands; Telegram shines for broadcast-plus-chat in regions where it's dominant. We recommend based on where your members already are.",
                es: "Depende de tu audiencia y caso de uso: Discord sobresale en comunidades estructuradas y siempre activas alrededor de productos o marcas; Telegram brilla en difusión más chat en regiones donde domina. Recomendamos según dónde ya están tus miembros.",
              },
            },
            {
              q: { en: "How do you keep the community active?", es: "¿Cómo mantienen activa la comunidad?" },
              a: {
                en: "With rituals and reasons: consistent programming (weekly events, prompts, challenges), fast moderation, and members being given real roles and recognition. Activity is designed, not hoped for.",
                es: "Con rituales y razones: programación constante (eventos semanales, dinámicas, retos), moderación rápida y miembros con roles y reconocimiento reales. La actividad se diseña, no se espera.",
              },
            },
            {
              q: { en: "Can you moderate 24/7?", es: "¿Pueden moderar 24/7?" },
              a: {
                en: "We combine automated moderation (bots for spam, raids and rule enforcement) with trained human moderators covering your peak hours, plus escalation protocols for sensitive situations.",
                es: "Combinamos moderación automatizada (bots para spam, raids y cumplimiento de reglas) con moderadores humanos capacitados cubriendo tus horas pico, más protocolos de escalación para situaciones sensibles.",
              },
            },
          ],
        },
      },
      {
        slug: "chatbots-automation",
        icon: "bot",
        title: { en: "Chatbots & Automation", es: "Chatbots y Automatización" },
        desc: {
          en: "24/7 conversational agents that qualify leads, support customers and streamline operations.",
          es: "Agentes conversacionales 24/7 que califican prospectos, atienden clientes y optimizan operaciones.",
        },
        page: {
          tag: { en: "// ALWAYS-ON OPERATIONS", es: "// OPERACIONES SIEMPRE ACTIVAS" },
          headline: {
            en: "Your hardest-working teammate is awake 24/7.",
            es: "Tu compañero que más trabaja está despierto 24/7.",
          },
          overview: [
            {
              en: "Every unanswered message is a lead gone cold or a customer left frustrated. We build conversational agents that answer instantly on your website, WhatsApp, Instagram and Messenger — trained on your business, speaking in your brand's tone, and knowing exactly when to hand off to a human.",
              es: "Cada mensaje sin respuesta es un prospecto que se enfría o un cliente frustrado. Construimos agentes conversacionales que responden al instante en tu sitio web, WhatsApp, Instagram y Messenger — entrenados con tu negocio, hablando en el tono de tu marca y sabiendo exactamente cuándo escalar a un humano.",
            },
            {
              en: "Beyond chat, we automate the workflows around them: lead capture routed straight to your CRM, appointment scheduling, order updates, internal notifications. Your team stops copy-pasting and starts doing the work that actually needs them.",
              es: "Más allá del chat, automatizamos los flujos de trabajo a su alrededor: captura de prospectos enviada directamente a tu CRM, agendamiento de citas, actualizaciones de pedidos, notificaciones internas. Tu equipo deja de copiar y pegar y empieza a hacer el trabajo que realmente los necesita.",
            },
          ],
          featuresLabel: { en: "WHAT WE BUILD", es: "QUÉ CONSTRUIMOS" },
          features: [
            {
              title: { en: "Customer Support Bots", es: "Bots de Atención al Cliente" },
              desc: {
                en: "Agents trained on your help center that resolve the repetitive 80% and escalate the rest with full context.",
                es: "Agentes entrenados con tu centro de ayuda que resuelven el 80% repetitivo y escalan el resto con contexto completo.",
              },
            },
            {
              title: { en: "Lead Qualification & Routing", es: "Calificación y Enrutamiento de Prospectos" },
              desc: {
                en: "Conversations that qualify budget, need and timing, then book meetings or alert your sales team instantly.",
                es: "Conversaciones que califican presupuesto, necesidad y momento, luego agendan reuniones o alertan a tu equipo de ventas al instante.",
              },
            },
            {
              title: { en: "Omnichannel Deployment", es: "Despliegue Omnicanal" },
              desc: {
                en: "One brain across your website widget, WhatsApp, Instagram DMs, Messenger and Slack — same knowledge, same tone.",
                es: "Un solo cerebro en tu widget web, WhatsApp, DMs de Instagram, Messenger y Slack — mismo conocimiento, mismo tono.",
              },
            },
            {
              title: { en: "Workflow Automation", es: "Automatización de Flujos" },
              desc: {
                en: "Connections across your stack — CRM updates, invoices, notifications — via custom code or Zapier, Make and n8n.",
                es: "Conexiones en todo tu stack — actualizaciones de CRM, facturas, notificaciones — vía código personalizado o Zapier, Make y n8n.",
              },
            },
            {
              title: { en: "Internal Copilots", es: "Copilotos Internos" },
              desc: {
                en: "Private assistants for your team over your docs, SOPs and data — onboarding, HR and ops questions answered instantly.",
                es: "Asistentes privados para tu equipo sobre tus documentos, SOPs y datos — preguntas de onboarding, RRHH y operaciones respondidas al instante.",
              },
            },
            {
              title: { en: "Human Handoff & Analytics", es: "Transferencia Humana y Analítica" },
              desc: {
                en: "Smooth escalation to your team with conversation summaries, plus dashboards for volume and resolution rates.",
                es: "Escalamiento fluido a tu equipo con resúmenes de conversación, más dashboards de volumen y tasas de resolución.",
              },
            },
          ],
          deliverablesLabel: { en: "WHAT YOU GET", es: "QUÉ RECIBES" },
          deliverables: [
            { en: "Bot deployed on your channels, live in production", es: "Bot desplegado en tus canales, activo en producción" },
            { en: "Knowledge base ingestion from your docs and site", es: "Ingesta de base de conocimiento desde tus documentos y sitio" },
            { en: "Human handoff flows with CRM sync", es: "Flujos de transferencia humana con sincronización al CRM" },
            { en: "Conversation analytics dashboard", es: "Dashboard de analítica de conversaciones" },
            { en: "Automated workflows connecting your tools", es: "Flujos automatizados conectando tus herramientas" },
            { en: "Documentation and admin training", es: "Documentación y capacitación de administradores" },
          ],
          faqsLabel: { en: "COMMON QUESTIONS", es: "PREGUNTAS FRECUENTES" },
          faqs: [
            {
              q: { en: "Will it sound robotic?", es: "¿Sonará robótico?" },
              a: {
                en: "No. Modern agents, trained on your tone and real conversations, are indistinguishable from a good human agent for the vast majority of interactions — and we always design a graceful human handoff for the rest.",
                es: "No. Los agentes modernos, entrenados con tu tono y conversaciones reales, son indistinguibles de un buen agente humano en la gran mayoría de las interacciones — y siempre diseñamos una transferencia humana elegante para el resto.",
              },
            },
            {
              q: { en: "What happens when the bot doesn't know an answer?", es: "¿Qué pasa cuando el bot no sabe una respuesta?" },
              a: {
                en: "It says so honestly, collects the visitor's contact info and escalates to your team with full context. Every unresolved question becomes training material to make the bot smarter.",
                es: "Lo dice con honestidad, recopila los datos de contacto del visitante y escala a tu equipo con contexto completo. Cada pregunta sin resolver se convierte en material de entrenamiento para hacer el bot más inteligente.",
              },
            },
            {
              q: { en: "How long does deployment take?", es: "¿Cuánto tarda el despliegue?" },
              a: {
                en: "A first version answering your top 20 questions goes live in 2–3 weeks. We then iterate weekly, expanding coverage based on real conversation data.",
                es: "Una primera versión respondiendo tus 20 preguntas principales sale en vivo en 2–3 semanas. Luego iteramos semanalmente, expandiendo cobertura con datos de conversaciones reales.",
              },
            },
          ],
        },
      },
      {
        slug: "data-strategy",
        icon: "chart",
        title: { en: "Data & Strategy", es: "Datos y Estrategia" },
        desc: {
          en: "Dashboards, predictive insights and digital roadmaps that turn raw data into decisions.",
          es: "Dashboards, insights predictivos y hojas de ruta digitales que convierten datos en decisiones.",
        },
        page: {
          tag: { en: "// DECISIONS, NOT GUESSES", es: "// DECISIONES, NO CONJETURAS" },
          headline: {
            en: "Turn data into your unfair advantage.",
            es: "Convierte los datos en tu ventaja injusta.",
          },
          overview: [
            {
              en: "Most companies drown in data and starve for insight. We build the layer between the two: reliable tracking, clean data models, dashboards your team actually opens, and analyses that answer the questions keeping you up at night — where to spend, what to fix, what to build next.",
              es: "La mayoría de las empresas se ahogan en datos y mueren de hambre por insights. Construimos la capa entre ambos: tracking confiable, modelos de datos limpios, dashboards que tu equipo realmente abre y análisis que responden las preguntas que te quitan el sueño — dónde gastar, qué arreglar, qué construir después.",
            },
            {
              en: "Strategy is the other half: a digital transformation roadmap that sequences software, AI, social and community initiatives against impact and effort — so every step builds on the last and your technology investments finally compound.",
              es: "La estrategia es la otra mitad: una hoja de ruta de transformación digital que secuencia iniciativas de software, IA, redes y comunidades según impacto y esfuerzo — para que cada paso construya sobre el anterior y tus inversiones tecnológicas finalmente se capitalicen.",
            },
          ],
          featuresLabel: { en: "WHAT WE DELIVER", es: "QUÉ ENTREGAMOS" },
          features: [
            {
              title: { en: "Analytics Audit & Tracking", es: "Auditoría de Analítica y Tracking" },
              desc: {
                en: "We fix the foundation: event tracking, attribution and data hygiene across web, app and ads platforms.",
                es: "Arreglamos la base: tracking de eventos, atribución e higiene de datos en web, app y plataformas de anuncios.",
              },
            },
            {
              title: { en: "Executive Dashboards", es: "Dashboards Ejecutivos" },
              desc: {
                en: "Real-time dashboards in Looker Studio, Power BI or custom builds — the metrics that matter, zero noise.",
                es: "Dashboards en tiempo real en Looker Studio, Power BI o a medida — las métricas que importan, cero ruido.",
              },
            },
            {
              title: { en: "Predictive Analytics", es: "Analítica Predictiva" },
              desc: {
                en: "Forecasting and scenario models for revenue, demand and churn — so you decide with the future in view.",
                es: "Modelos de pronóstico y escenarios para ingresos, demanda y abandono — para decidir con el futuro a la vista.",
              },
            },
            {
              title: { en: "Segmentation & LTV", es: "Segmentación y LTV" },
              desc: {
                en: "Know your best customers: segmentation, cohort analysis and lifetime-value modeling that focus your spend.",
                es: "Conoce a tus mejores clientes: segmentación, análisis de cohortes y modelado de valor de vida que enfoca tu gasto.",
              },
            },
            {
              title: { en: "Digital Transformation Roadmap", es: "Hoja de Ruta de Transformación Digital" },
              desc: {
                en: "A sequenced plan across software, AI, social and community — impact-ranked, budget-aware and realistic.",
                es: "Un plan secuenciado de software, IA, redes y comunidades — ordenado por impacto, consciente del presupuesto y realista.",
              },
            },
            {
              title: { en: "Enablement & Training", es: "Capacitación y Entrenamiento" },
              desc: {
                en: "Workshops that make your team fluent in the data: reading dashboards, running experiments, asking better questions.",
                es: "Talleres que hacen a tu equipo fluido con los datos: leer dashboards, ejecutar experimentos, hacer mejores preguntas.",
              },
            },
          ],
          deliverablesLabel: { en: "WHAT YOU GET", es: "QUÉ RECIBES" },
          deliverables: [
            { en: "Tracking plan implemented and verified", es: "Plan de tracking implementado y verificado" },
            { en: "Live dashboards for every key metric", es: "Dashboards activos para cada métrica clave" },
            { en: "Data model and documentation your team can extend", es: "Modelo de datos y documentación que tu equipo puede extender" },
            { en: "Predictive models with documented accuracy", es: "Modelos predictivos con precisión documentada" },
            { en: "12–24 month digital transformation roadmap", es: "Hoja de ruta de transformación digital de 12–24 meses" },
            { en: "Training workshops and office hours", es: "Talleres de capacitación y horas de consulta" },
          ],
          faqsLabel: { en: "COMMON QUESTIONS", es: "PREGUNTAS FRECUENTES" },
          faqs: [
            {
              q: { en: "Our data is a mess. Is that a problem?", es: "Nuestros datos son un desastre. ¿Es eso un problema?" },
              a: {
                en: "It's the norm, not the exception. Every engagement starts with a cleanup and instrumentation phase — by the time dashboards go live, the underlying data is trustworthy.",
                es: "Es la norma, no la excepción. Cada proyecto comienza con una fase de limpieza e instrumentación — para cuando los dashboards están activos, los datos subyacentes son confiables.",
              },
            },
            {
              q: { en: "Which tools do you work with?", es: "¿Con qué herramientas trabajan?" },
              a: {
                en: "We're stack-agnostic: GA4, Segment, BigQuery, Looker Studio, Power BI, Metabase, dbt and custom solutions. We recommend what fits your team and budget — and document everything so you're never locked in.",
                es: "Somos agnósticos al stack: GA4, Segment, BigQuery, Looker Studio, Power BI, Metabase, dbt y soluciones a medida. Recomendamos lo que se ajusta a tu equipo y presupuesto — y documentamos todo para que nunca quedes atado.",
              },
            },
            {
              q: { en: "BI or data science — what do I need first?", es: "¿BI o ciencia de datos — qué necesito primero?" },
              a: {
                en: "Almost always BI first: know where you stand before predicting where you're going. Our roadmap sequences both so early insights fund later sophistication.",
                es: "Casi siempre BI primero: saber dónde estás antes de predecir a dónde vas. Nuestra hoja de ruta secuencia ambos para que los insights tempranos financien la sofisticación posterior.",
              },
            },
          ],
        },
      },
    ],
  },

  servicePage: {
    backToServices: { en: "Back to services", es: "Volver a servicios" },
    ctaTitle: { en: "Ready to start?", es: "¿Listo para empezar?" },
    ctaSubtitle: {
      en: "Tell us about your project and we'll design a plan tailored to your goals.",
      es: "Cuéntanos sobre tu proyecto y diseñaremos un plan adaptado a tus objetivos.",
    },
    ctaButton: { en: "Start this project", es: "Iniciar este proyecto" },
    relatedLabel: { en: "// RELATED SERVICES", es: "// SERVICIOS RELACIONADOS" },
    exploreAll: { en: "Explore all services", es: "Explorar todos los servicios" },
    nextSteps: { en: "Explore more", es: "Explora más" },
  },

  about: {
    tag: { en: "// WHO WE ARE", es: "// QUIÉNES SOMOS" },
    title: { en: "The convergence of", es: "La convergencia de lo" },
    titleAccent: { en: "tribe & tech", es: "tribu y tecnología" },
    body: {
      en: "TribAI was born from a simple conviction: the businesses of tomorrow are built where solid, human foundations meet intelligent technology. Like our symbol — three triangles united around a single center — we unite engineering, intelligence and community into one force.",
      es: "TribAI nace de una convicción simple: los negocios del mañana se construyen donde las bases humanas sólidas se encuentran con la tecnología inteligente. Como nuestro símbolo — tres triángulos unidos en un solo centro — unimos ingeniería, inteligencia y comunidad en una sola fuerza.",
    },
    mission: {
      label: { en: "MISSION", es: "MISIÓN" },
      text: {
        en: "To impact a new horizon where quality of life is enriched by the efficiency, sustainability and comfort of our innovations.",
        es: "Impactar un nuevo horizonte donde la calidad de vida se vea enormemente enriquecida por la eficiencia, sostenibilidad y comodidad de nuestras innovaciones.",
      },
    },
    vision: {
      label: { en: "VISION", es: "VISIÓN" },
      text: {
        en: "To revolutionize every sector we touch, making organizations protagonists of the promise that artificial intelligence holds.",
        es: "Revolucionar cada sector que tocamos, haciendo a las organizaciones protagonistas de las bondades que promete la inteligencia artificial.",
      },
    },
    values: {
      label: { en: "VALUES", es: "VALORES" },
      items: [
        {
          name: { en: "Innovation", es: "Innovación" },
          desc: {
            en: "Experimental creators, remodeling how we interact with virtual and physical spaces.",
            es: "Creadores experimentales, remodelando cómo interactuamos con espacios virtuales y físicos.",
          },
        },
        {
          name: { en: "Transparency", es: "Transparencia" },
          desc: {
            en: "Absolute clarity that builds trust in every delivery, every line of code.",
            es: "Claridad absoluta que construye confianza en cada entrega, cada línea de código.",
          },
        },
        {
          name: { en: "Social Responsibility", es: "Responsabilidad Social" },
          desc: {
            en: "Technology in service of an admirable transformation of our society.",
            es: "Tecnología al servicio de una admirable transformación de nuestra sociedad.",
          },
        },
      ],
    },
    traits: {
      en: [
        "INTELLIGENT",
        "INNOVATIVE",
        "SOPHISTICATED",
        "HONEST",
        "FUTURISTIC",
        "PROFESSIONAL",
        "RESPECTFUL",
        "RESPONSIBLE",
      ],
      es: [
        "INTELIGENTE",
        "INNOVADORA",
        "SOFISTICADA",
        "HONESTA",
        "FUTURISTA",
        "PROFESIONAL",
        "RESPETUOSA",
        "RESPONSABLE",
      ],
    },
    team: {
      tag: { en: "// THE TRIBAI TEAM", es: "// EL EQUIPO TRIBAI" },
      title: { en: "One team, aligned around", es: "Un equipo, alineado alrededor de" },
      titleAccent: { en: "the work ahead", es: "el trabajo por delante" },
      body: {
        en: "TribAI brings product, engineering, intelligence, data and growth disciplines into one coordinated delivery model. The mix is shaped by the work in front of you, so every project can move with shared context and a clear direction.",
        es: "TribAI reúne disciplinas de producto, ingeniería, inteligencia, datos y crecimiento en un modelo de entrega coordinado. La combinación se define según el trabajo que tienes por delante, para que cada proyecto avance con contexto compartido y una dirección clara.",
      },
      disciplines: [
        {
          code: "01",
          icon: "code",
          title: { en: "Product & Engineering", es: "Producto e Ingeniería" },
          desc: {
            en: "Digital products, platforms and the technical foundations that support day-to-day operations.",
            es: "Productos digitales, plataformas y las bases técnicas que respaldan las operaciones diarias.",
          },
          serviceSlugs: ["software-development"],
        },
        {
          code: "02",
          icon: "brain",
          title: { en: "Applied AI & Automation", es: "IA Aplicada y Automatización" },
          desc: {
            en: "Intelligent systems and connected workflows designed around practical business needs.",
            es: "Sistemas inteligentes y flujos conectados diseñados alrededor de necesidades reales de negocio.",
          },
          serviceSlugs: ["ai-implementation", "chatbots-automation"],
        },
        {
          code: "03",
          icon: "chart",
          title: { en: "Data & Strategy", es: "Datos y Estrategia" },
          desc: {
            en: "Measurement, decision support and roadmaps that give each initiative an informed direction.",
            es: "Medición, soporte para decisiones y hojas de ruta que dan una dirección informada a cada iniciativa.",
          },
          serviceSlugs: ["data-strategy"],
        },
        {
          code: "04",
          icon: "users",
          title: { en: "Audience & Community", es: "Audiencia y Comunidad" },
          desc: {
            en: "Content, participation and community systems that connect organizations with the people they serve.",
            es: "Sistemas de contenido, participación y comunidad que conectan a las organizaciones con las personas a las que sirven.",
          },
          serviceSlugs: ["social-media-growth", "community-building"],
        },
      ],
    },
  },

  process: {
    tag: { en: "// HOW WE WORK", es: "// CÓMO TRABAJAMOS" },
    title: { en: "From idea to", es: "De la idea a la" },
    titleAccent: { en: "intelligence", es: "inteligencia" },
    steps: [
      {
        num: "01",
        title: { en: "Discover", es: "Descubrir" },
        desc: {
          en: "We dive into your business, audience and goals to map the opportunity.",
          es: "Nos sumergimos en tu negocio, audiencia y objetivos para mapear la oportunidad.",
        },
      },
      {
        num: "02",
        title: { en: "Design", es: "Diseñar" },
        desc: {
          en: "We prototype intelligent experiences — interfaces, agents and architectures.",
          es: "Prototipamos experiencias inteligentes — interfaces, agentes y arquitecturas.",
        },
      },
      {
        num: "03",
        title: { en: "Build", es: "Construir" },
        desc: {
          en: "Agile sprints ship production-grade software, tested and hardened.",
          es: "Sprints ágiles entregan software de producción, probado y robusto.",
        },
      },
      {
        num: "04",
        title: { en: "Evolve", es: "Evolucionar" },
        desc: {
          en: "We measure, learn and iterate — your product keeps getting smarter.",
          es: "Medimos, aprendemos e iteramos — tu producto se vuelve más inteligente.",
        },
      },
    ],
  },

  contact: {
    tag: { en: "// START THE CONVERSATION", es: "// INICIA LA CONVERSACIÓN" },
    title: { en: "Let's build what's", es: "Construyamos lo que" },
    titleAccent: { en: "next.", es: "viene." },
    subtitle: {
      en: "Tell us about your project. Our team will reply within 24 hours.",
      es: "Cuéntanos sobre tu proyecto. Nuestro equipo responderá en menos de 24 horas.",
    },
    name: { en: "Your name", es: "Tu nombre" },
    email: { en: "Email", es: "Correo electrónico" },
    service: { en: "What do you need?", es: "¿Qué necesitas?" },
    serviceOptions: {
      en: [
        "Software Development",
        "AI Implementation",
        "Social Media Growth",
        "Community Building",
        "Chatbots & Automation",
        "Data & Strategy",
        "Something else",
      ],
      es: [
        "Desarrollo de Software",
        "Implementación de IA",
        "Potenciación de Redes",
        "Creación de Comunidades",
        "Chatbots y Automatización",
        "Datos y Estrategia",
        "Otra cosa",
      ],
    },
    message: { en: "Tell us about your project...", es: "Cuéntanos sobre tu proyecto..." },
    send: { en: "Send Message", es: "Enviar Mensaje" },
    sending: { en: "Sending...", es: "Enviando..." },
    sent: {
      en: "Message received. We'll be in touch within 24 hours.",
      es: "Mensaje recibido. Te contactaremos en menos de 24 horas.",
    },
    sentConfirm: {
      en: "Check your inbox and confirm your email address with the button we just sent you.",
      es: "Revisa tu bandeja de entrada y confirma tu correo con el botón que acabamos de enviarte.",
    },
    error: {
      en: "Something went wrong. Please try again or email us directly.",
      es: "Algo salió mal. Inténtalo de nuevo o escríbenos directamente.",
    },
    direct: { en: "Or reach us directly", es: "O contáctanos directamente" },
    location: { en: "Sharjah, UAE · Worldwide", es: "Sharjah, EAU · En todo el mundo" },
  },

  confirmation: {
    okTitle: { en: "Email confirmed", es: "Correo confirmado" },
    okBody: {
      en: "Thanks for confirming. Your message is already with our team — we'll reply within 24 hours.",
      es: "Gracias por confirmar. Tu mensaje ya está con nuestro equipo — te responderemos en menos de 24 horas.",
    },
    alreadyTitle: { en: "Already confirmed", es: "Ya estaba confirmado" },
    alreadyBody: {
      en: "This link had already been used. Your message is with our team — there's nothing else you need to do.",
      es: "Este enlace ya había sido usado. Tu mensaje está con nuestro equipo; no necesitas hacer nada más.",
    },
    invalidTitle: { en: "Invalid link", es: "Enlace no válido" },
    invalidBody: {
      en: "This confirmation link is invalid or incomplete. If you copied it from the email, make sure you copied the entire address.",
      es: "Este enlace de confirmación no es válido o está incompleto. Si lo copiaste del correo, revisa que hayas copiado la dirección completa.",
    },
    errorTitle: { en: "Couldn't confirm right now", es: "No pudimos confirmar ahora" },
    errorBody: {
      en: "Something went wrong on our side. Please try again in a few minutes.",
      es: "Algo falló de nuestro lado. Inténtalo de nuevo en unos minutos.",
    },
    backHome: { en: "Back to tribai.site", es: "Volver a tribai.site" },
  },

  widget: {
    launcher: { en: "Chat with TribAI", es: "Chatea con TribAI" },
    title: { en: "TribAI Assistant", es: "Asistente TribAI" },
    subtitle: { en: "Typically replies instantly", es: "Normalmente responde al instante" },
    greeting: {
      en: "Hello. I'm the TribAI assistant. Ask me about our services, AI, or how to start a project.",
      es: "Hola. Soy el asistente de TribAI. Pregúntame sobre nuestros servicios, IA, o cómo iniciar un proyecto.",
    },
    placeholder: { en: "Type a message...", es: "Escribe un mensaje..." },
    suggestions: {
      en: ["What services do you offer?", "How much does it cost?", "How do we start?"],
      es: ["¿Qué servicios ofrecen?", "¿Cuánto cuesta?", "¿Cómo empezamos?"],
    },
    fallback: {
      en: "Great question. Our team can answer it in detail — write to contact@tribai.site or use the contact form below.",
      es: "Buena pregunta. Nuestro equipo puede responderla en detalle — escribe a contact@tribai.site o usa el formulario de contacto abajo.",
    },
    offlineBadge: { en: "Offline", es: "Desconectado" },
    responses: [
      {
        match: { en: ["service", "offer", "what do you do"], es: ["servicio", "ofrecen", "qué hacen"] },
        reply: {
          en: "We offer six core services: custom software, AI implementation, social media growth, community building, chatbots & automation, and data strategy. Each one has its own page with full details.",
          es: "Ofrecemos seis servicios principales: software a medida, implementación de IA, crecimiento en redes sociales, creación de comunidades, chatbots y automatización, y estrategia de datos. Cada uno tiene su propia página con todos los detalles.",
        },
      },
      {
        match: { en: ["cost", "price", "much", "budget"], es: ["costo", "precio", "cuánto", "cuesta", "presupuesto"] },
        reply: {
          en: "Every project is unique, so we build custom quotes after a short discovery call. Use the contact form and we'll send a tailored estimate within 24 hours.",
          es: "Cada proyecto es único, así que preparamos cotizaciones personalizadas tras una breve llamada de descubrimiento. Usa el formulario de contacto y enviaremos una estimación en 24 horas.",
        },
      },
      {
        match: { en: ["start", "begin", "project", "hire"], es: ["empezar", "comenzar", "proyecto", "contratar"] },
        reply: {
          en: "Starting is easy: send us a message through the contact form with your idea, and we'll schedule a free discovery call within 24 hours.",
          es: "Empezar es fácil: envíanos un mensaje con tu idea a través del formulario de contacto y agendaremos una llamada de descubrimiento gratuita en 24 horas.",
        },
      },
      {
        match: { en: ["ai", "artificial", "intelligence", "llm", "chatbot"], es: ["ia", "inteligencia", "artificial", "llm", "chatbot"] },
        reply: {
          en: "AI is our core. We integrate LLMs, build intelligent agents, automate workflows and add vision or predictive analytics to your product — always tailored to your data and goals.",
          es: "La IA es nuestro núcleo. Integramos LLMs, construimos agentes inteligentes, automatizamos flujos de trabajo y añadimos visión o analítica predictiva a tu producto — siempre adaptado a tus datos y objetivos.",
        },
      },
      {
        match: { en: ["social", "media", "instagram", "tiktok", "followers"], es: ["redes", "social", "instagram", "tiktok", "seguidores"] },
        reply: {
          en: "Our social media growth system combines content strategy, paid campaigns and analytics to grow an audience that actually converts.",
          es: "Nuestro sistema de crecimiento en redes combina estrategia de contenido, campañas pagadas y analítica para hacer crecer una audiencia que realmente convierte.",
        },
      },
      {
        match: { en: ["community", "discord", "tribe"], es: ["comunidad", "discord", "tribu"] },
        reply: {
          en: "We design and nurture communities — from Discord servers to brand ecosystems — that turn your audience into a loyal tribe around your product.",
          es: "Diseñamos y nutrimos comunidades — desde servidores de Discord hasta ecosistemas de marca — que convierten tu audiencia en una tribu leal alrededor de tu producto.",
        },
      },
      {
        match: { en: ["hello", "hi", "hey"], es: ["hola", "buenas", "hey"] },
        reply: {
          en: "Hello. How can I help you today? Ask me about our services, pricing or how to start.",
          es: "Hola. ¿Cómo puedo ayudarte hoy? Pregúntame sobre nuestros servicios, precios o cómo empezar.",
        },
      },
      {
        match: { en: ["contact", "email", "mail", "phone"], es: ["contacto", "correo", "teléfono", "email"] },
        reply: {
          en: "You can reach us at contact@tribai.site or through the contact form at the bottom of this page. We reply within 24 hours.",
          es: "Puedes escribirnos a contact@tribai.site o a través del formulario de contacto al final de esta página. Respondemos en menos de 24 horas.",
        },
      },
    ],
  },

  footer: {
    tagline: {
      en: "Intelligence, engineered for the businesses of tomorrow.",
      es: "Inteligencia, diseñada para los negocios del mañana.",
    },
    servicesLabel: { en: "Services", es: "Servicios" },
    companyLabel: { en: "Company", es: "Empresa" },
    serviceOverview: { en: "How services connect", es: "Cómo se conectan los servicios" },
    rights: { en: "All rights reserved.", es: "Todos los derechos reservados." },
    madeWith: { en: "Built with intelligence", es: "Construido con inteligencia" },
  },
} as const;

export type ServiceItem = (typeof content.services.items)[number];

export const serviceSlugs = content.services.items.map((s) => s.slug);

export function getService(slug: string): ServiceItem | undefined {
  return content.services.items.find((s) => s.slug === slug);
}
