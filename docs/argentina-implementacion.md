# Implementación para consultorios odontológicos de Argentina
Revisión: 26 de septiembre de 2026. Plan técnico y comercial; los servicios futuros de este documento todavía no están conectados.

## Decisión recomendada

Empezar con una base de código común, configurable, y una instalación separada por consultorio: proyecto Vercel, proyecto/base Supabase, secretos, usuarios y número WhatsApp propios. Así se reduce el riesgo de mezclar pacientes y se puede exportar o entregar una instalación. Las cuentas pueden ser del cliente con acceso delegado o administradas por el prestador, según contrato. Compartir una cuenta de facturación no autoriza a compartir datos entre consultorios.

El producto empieza como asistente de recepción: horarios, ubicación, respuestas aprobadas, solicitud de contacto/turno y derivación a una persona. La confirmación del turno queda en recepción hasta integrar y probar la agenda. No se ofrece diagnóstico, historia clínica ni atención de emergencias.

## Qué existe y qué falta

| Área | Estado comprobado | Para operar |
| --- | --- | --- |
| Web, diseño e idiomas | Implementados; marca provisional y consultorio ficticio | Configuración real aprobada por el cliente |
| Conversación | Guion y reglas en el navegador | Puede servir como asistente guiado; una IA generativa requeriría conexión servidor y límites |
| Contactos | localStorage por navegador | Base central con autorización y acceso privado |
| Panel | Público y con ejemplos locales | Usuarios del personal, permisos, cierre/revocación de sesiones |
| Email | Adaptador para códigos opcionales, desactivado | Avisos de solicitudes, dominio verificado y pruebas de entrega |
| SMS | Verificación opcional limitada a +1 | No confundir con WhatsApp; adaptar y probar números argentinos si se decide ofrecer SMS |
| WhatsApp | Sin integrar | API oficial, número del consultorio, webhook y bandeja del equipo |
| Turnos | Preferencias, sin reserva real | En una segunda etapa, integración específica con la agenda |
| Privacidad | Avisos de demo y borrado local | Identidad real, contratos, registros/procedimientos y revisión de transferencias |

Cambiar el nombre, comprar un dominio o activar una variable no convierte la demo en un sistema clínico habilitado.

## Dominio: no necesitás uno por empresa

Dominio es la dirección; hosting es el servidor; casilla de correo es otro servicio.

- Para probar, alcanza la URL asignada por Vercel.
- Para tu marca, registrar un dominio propio permite una web comercial y remitentes de correo verificables.
- Para clientes que no tienen dominio: consultorio-a.tumarca.com.ar, consultorio-b.tumarca.com.ar.
- Si el cliente ya tiene dominio: asistente.suconsultorio.com.ar. Hace falta acceso o coordinación DNS, no comprar otro dominio.
- Si pide una marca totalmente independiente, puede registrar su propio dominio. Recomiendo que el consultorio sea su titular.

Los subdominios no se registran ni renuevan por separado en NIC; se configuran en DNS y en el proyecto de hosting. Cada instalación debe aceptar sólo sus dominios autorizados y usar HTTPS. Para empezar, asociarlos individualmente; no hace falta montar un servicio con dominios comodín.

NIC publica ARS 8.500 para alta/renovación anual .com.ar y ARS 25.500 para .ar. Verificar el importe al pagar; no se compró ningún dominio. [Aranceles NIC](https://nic.ar/dominios/aranceles). [Dominios en Vercel](https://vercel.com/docs/domains/working-with-domains).

## Nombre: producto y consultorio son cosas distintas

Nombre provisional del producto: **Asistente Dental**. Nombre ficticio de la demo: **Consultorio Demo**. Ambos se configuran; no representan una marca registrada ni un prestador de salud real.

Opciones para explorar: **Recepcia**, **Turnalia**, **Nexo Dental**. Son ideas creativas: no verifiqué disponibilidad marcaria, fonética, societaria, de redes ni de dominios. No conviene gastar en logos o dominio hasta elegir una terna y revisar antecedentes.

El paciente debería identificar claramente a su consultorio. La marca del software puede aparecer como proveedor de la tecnología, sin confundirse con el responsable de su atención.

Registrar un dominio no otorga derechos sobre una marca. Buscar nombres idénticos y similares y evaluar las clases pertinentes para software/servicios. [INPI: búsqueda](https://www.argentina.gob.ar/node/230501), [registro](https://www.argentina.gob.ar/node/36576).

## Correo: tres funciones diferentes

1. **Remitente automático**: avisos@notificaciones.tumarca.com.ar, por ejemplo. Se verifica el dominio/subdominio con Resend y registros DNS SPF/DKIM; configurar DMARC. No inventar un remitente @gmail.com para enviar desde esa API.
2. **Destinatario**: el correo que recepción ya utiliza, incluso una casilla Gmail. No necesita comprar otra para recibir avisos.
3. **Correo humano/Reply-To**: dirección atendida por el consultorio para respuestas. Una casilla recepcion@suconsultorio.com.ar requiere un proveedor de correo o una cuenta corporativa que ya exista.

Comprar dominio no crea una casilla de correo. Resend permite recepción programática, pero no equivale a una bandeja humana preparada. Agregar registros de envío sin reemplazar por error los MX del correo existente.

Los avisos propuestos contienen “Hay una nueva solicitud” y un enlace al panel privado. No incluir síntomas, tratamientos ni conversaciones en asunto/cuerpo. No activar seguimiento de aperturas o clics para esta función sin una necesidad y revisión específicas. Primero guardar la solicitud; después enviar. Registrar fallos y reintentar con deduplicación.

Fuentes: [dominios Resend](https://resend.com/docs/dashboard/domains/introduction), [agregar dominio](https://resend.com/docs/add-a-domain), [DMARC](https://resend.com/docs/dashboard/domains/dmarc).

## WhatsApp: integración oficial por consultorio

Un enlace wa.me abre WhatsApp: no conecta el historial a la base ni hace responder automáticamente al asistente.

Para una integración real se necesita portfolio comercial Meta, cuenta WhatsApp Business (WABA), número del consultorio y la configuración/permisos aplicables. Recomiendo que número y cuenta sean del cliente, con acceso delegado al prestador.

El desarrollo incluye:
- Webhook HTTPS: recibe mensajes y estados; verifica autenticidad y evita procesar dos veces el mismo evento.
- Servicio de respuestas: consulta la información aprobada y envía mediante la API oficial.
- Base central y bandeja: el equipo puede intervenir, pausar automatización y continuar la conversación.
- Plantillas y autorizaciones: cumplir las reglas de contacto y de mensajes fuera de la ventana de atención.
- Errores y costos: límites, registros sin secretos, reintentos y topes de consumo.

La política de WhatsApp regula permiso de contacto, bajas y uso de plantillas aprobadas para iniciar o retomar fuera de la ventana de 24 horas, además de una vía clara de atención humana. No reutilizar teléfonos de solicitudes como lista automática de publicidad. [Política oficial](https://whatsappbusiness.com/policy/).

Si ya usa WhatsApp Business App, comprobar si su cuenta y modalidad de alta admiten coexistencia App/API antes de migrar el número. No prometer que conservará todo el funcionamiento actual sin esa comprobación. [Alta de usuarios de Business App](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users).

No se confirmó una tarifa argentina actual de Meta en esta revisión: su tabla técnica respondió con restricciones de acceso. Tratar WhatsApp como gasto variable y revisar la tarifa vigente al contratar; no prometer servicio gratuito permanente. [Tarifario Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing). Como alternativa, Twilio publica USD 0,005 por mensaje entrante o saliente más cargos de Meta. [Twilio](https://www.twilio.com/en-us/whatsapp/pricing).

La API oficial no elimina las obligaciones de privacidad ni reemplaza un sistema clínico.

## Base de datos y acceso privado

Propuesta: PostgreSQL administrado mediante Supabase, con un proyecto por consultorio al principio.

| Datos | Uso propuesto |
| --- | --- |
| Configuración del consultorio | Identidad, horarios, información aprobada y canales |
| Personal y permisos | Usuarios nominados, rol y accesos revocables |
| Contactos y solicitudes | Datos mínimos para devolver el contacto, estado y preferencias |
| Consentimientos | Finalidad, canal, versión del aviso y fecha; separado de marketing |
| Auditoría | Quién accedió o modificó registros, evitando copiar datos clínicos en logs |
| Cola de avisos | Entregas pendientes, fallidas y completadas; reintentos sin duplicados |

Los mensajes completos requieren una decisión aparte de finalidad, acceso y conservación. No guardarlos indefinidamente por defecto ni usarlos para entrenar modelos. Las conversaciones pueden revelar salud aunque el formulario no pida diagnósticos.

Autenticación y autorización deben existir antes de conectar el panel a datos reales. Usar RLS/permisos, claves administrativas sólo en servidor, MFA para administradores y revisión del aislamiento. La URL difícil de adivinar no protege datos. [RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

Plan de respaldo: copias, restauración probada y exportación al finalizar el servicio. Supabase Pro incluye copias diarias con retención de siete días; no incluyen los archivos del almacenamiento de objetos. [Backups](https://supabase.com/docs/guides/platform/backups). La región se elige después de revisar contratos, transferencias y subproveedores, no sólo latencia.

## Costos de referencia, antes de impuestos y consumo extra

| Concepto | Referencia publicada |
| --- | --- |
| Vercel Pro | USD 20/mes; plan compartido entre proyectos, más consumo |
| Supabase Pro | USD 25/mes para organización con primer proyecto Micro cubierto; cada Micro adicional desde USD 10/mes |
| Resend gratuito | 3.000 emails/mes, máximo 100 diarios, dentro del plan publicado |
| Resend Pro | USD 20/mes, hasta 50.000 emails según plan |
| Dominio .com.ar | ARS 8.500 por año según arancel consultado |
| WhatsApp, IA, casilla humana y excedentes | Variables, presupuestar aparte |

Ejemplo técnico: una instalación con Vercel Pro + un Supabase Micro parte de USD 45/mes, usando email gratuito dentro de sus límites. Tres proyectos Micro en la misma organización Supabase sumarían USD 45/mes de base de datos; con un plan Vercel de USD 20 serían USD 65/mes antes de extras. Es cálculo sobre los planes publicados, no un presupuesto completo ni una recomendación de compartir usuarios/datos.

Si cada cliente paga organizaciones independientes, los costos base se repiten. No confundir ahorro de infraestructura con margen neto: incluir soporte, mantenimiento, comisiones, impuestos y contingencias.

Fuentes: [Vercel](https://vercel.com/pricing), [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq), [Resend](https://resend.com/pricing). Vercel Hobby es para uso personal no comercial: [condiciones](https://vercel.com/docs/plans/hobby).

## Secuencia de puesta en marcha

1. Elegir cliente piloto, identidad real, alcance y responsable del proyecto.
2. Firmar propuesta y acuerdo de tratamiento; revisar salud, transferencias, proveedores y jurisdicción. Ver [revisión argentina](legal-review.md).
3. Elegir nombre/dominio, titularidad de cuentas y modalidad de facturación.
4. Implementar base central, autenticación, permisos, auditoría, exportación y conservación.
5. Configurar y probar avisos por correo con destinatarios autorizados.
6. Configurar número/WABA del consultorio e implementar WhatsApp oficial y atención humana.
7. Cargar información que el consultorio haya aprobado; corregir cualquier respuesta inventada.
8. Probar desde dos dispositivos: solicitud, panel, aviso, respuesta y estado. Probar también acceso ajeno denegado, duplicados, caída de proveedores y restauración.
9. Capacitar recepción, habilitar gradualmente y medir consultas entregadas/atendidas.
10. Integrar agenda o IA generativa sólo con alcance y pruebas propios.

## Información y cuentas que faltan

No hay cliente, nombre definitivo, dominio ni identidad del operador completada. Tampoco se ha conectado una base central o WhatsApp. Para activar harán falta cuentas de proveedores, configuración DNS, responsables/usuarios del consultorio, destinatario real, número elegible y autorizaciones. Las claves se colocan en el gestor de secretos del hosting; no se piden por chat, no van a GitHub ni a variables públicas.

La revisión deja decisiones y tareas concretas. No se compraron dominios, crearon cuentas, enviaron mensajes ni habilitaron datos de pacientes.
