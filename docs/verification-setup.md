# Activar confirmación por email y SMS

Estado inicial: **desactivada**. El dueño aún no tiene dominio ni proveedores.
El producto se prepara para Argentina. El adaptador SMS actual aún acepta sólo
numeración +1; no está listo para números argentinos ni es una integración WhatsApp.
Ver [plan para Argentina](argentina-implementacion.md) antes de elegir los canales.
La demo ficticia se puede publicar y probar sin cuentas, claves ni gastos.
No se creó ninguna cuenta ni se contrató ningún servicio durante esta implementación.

## Qué confirma

El visitante ingresa un contacto, marca una autorización explícita y solicita un
código. Solo después de ingresar correctamente ese código se marca el contacto
como verificado. No confirma una cita, no envía una solicitud a una clínica y no
habilita publicidad. El dashboard sigue siendo local, sin usuarios ni base central.

## Configuración necesaria en Vercel

En Project → Settings → Environment Variables, usar los nombres de `.env.example`.
Agregar secretos solo en Vercel o `.env.local` ignorado por Git; nunca en el chat,
commits, capturas o variables `NEXT_PUBLIC_`. No activar en previews por defecto.

| Variable | Valor esperado |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Origen público exacto, por ejemplo `https://frontdesk-ai-flame.vercel.app` |
| `LEGAL_OPERATOR_NAME` | Nombre real del responsable, persona o entidad |
| `LEGAL_OPERATOR_COUNTRY` | País real de operación |
| `LEGAL_OPERATOR_ADDRESS` | Domicilio real del responsable, visible en el aviso de privacidad |
| `LEGAL_CONTACT_EMAIL` | Buzón atendido para privacidad, soporte y accesibilidad |
| `VERIFICATION_SECRET` | Secreto aleatorio de al menos 32 caracteres, exclusivo de este proyecto |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | URL HTTPS y token privado de una base Redis de este proyecto |
| `RESEND_API_KEY` | Clave con permiso para enviar desde el dominio verificado |
| `VERIFICATION_EMAIL_FROM` | Nombre del producto y dirección en un dominio verificado, por ejemplo `Asistente Dental <verify@tu-dominio.com>` |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` | Credenciales privadas de Twilio |
| `TWILIO_VERIFY_SERVICE_SID` | Servicio Verify con código de 6 dígitos y 10 minutos de vigencia |
| `CONTACT_PRIVACY_REVIEWED` | `true` solo después de revisar identidad, avisos, proveedores, retenciones y consentimiento |
| `CONTACT_VERIFICATION_ENABLED` | `true` al terminar la configuración y revisión |

Se puede activar **solo email** o **solo SMS**: el canal sin credenciales permanece
deshabilitado. Upstash y los datos legales se necesitan para cualquiera de los dos.
El dominio personalizado no es obligatorio para alojar en Vercel. Para email a
destinatarios reales, Resend requiere verificar un dominio del remitente con sus
registros DNS; no sirve un remitente inventado. [Dominios de Resend](https://resend.com/docs/dashboard/domains/introduction).

SMS usa Twilio Verify, no mensajes de marketing ni un CRM. La versión inicial
acepta números +1 (incluye países/territorios del plan norteamericano); limitar los
países permitidos en Twilio a los realmente necesarios. Mantener Fraud Guard y
Geo Permissions habilitados, configurar topes/alertas de gasto y revisar los
requisitos de registro y opt-out correspondientes a la cuenta y al tráfico.
Las cuentas trial tienen restricciones de destinatarios.
[Verifications](https://www.twilio.com/docs/verify/api/verification) ·
[Protecciones y límites](https://www.twilio.com/docs/verify/api/programmable-rate-limits).

## Protecciones implementadas

- API POST del mismo origen; JSON limitado a 2 KiB, validación de destino/código,
  respuestas sin detalles privados del proveedor y sin caché.
- Cookie de sesión HttpOnly, SameSite=Strict, Secure en producción, 30 minutos.
- Redis persistente entre instancias de Vercel; límites incrementados con Lua
  atómico. Si Redis falla, no se envía.
- Máximo 1 envío por destino/minuto, 3/hora por destino, 5/hora por sesión,
  10/hora por IP, 50 totales por ventana de 24 horas. Intentos fallidos del proveedor
  también cuentan. Estas ventanas comienzan con el primer intento.
- Máximo 5 intentos por código y 60 verificaciones/hora por IP. Contacto y sesión
  deben coincidir. Consumo único mediante eliminación atómica.
- Email: 6 dígitos aleatorios criptográficos; HMAC almacenado, nunca código plano.
  Resend recibe solo destino, código y texto transaccional, con idempotency key.
- SMS: Twilio crea y comprueba el código. La aplicación no almacena el código.
- Desafíos expiran en 10 minutos; contadores en hasta 24 horas. Las claves usan
  HMAC, no destinos ni IP en claro. La retención de logs de proveedores es separada.

La IP se obtiene del encabezado que Vercel sobrescribe en su edge:
[x-vercel-forwarded-for](https://vercel.com/docs/headers/request-headers).
Otros hosts comparten un bucket conservador hasta configurar un proxy confiable.
No añadir reintentos automáticos de entrega: un timeout puede ocurrir después de
que el proveedor aceptó el mensaje. La UI lo explica sin afirmar entrega.

El indicador verificado guardado con el lead es informativo y editable por quien
controle ese navegador. **No sirve como autenticación ni prueba durable de consentimiento.**
Para una clínica real hacen falta autenticación, almacenamiento central, autorización,
auditoría y una política de conservación acordada por separado.

## Prueba antes de habilitar al público

1. Configurar cuentas y revisar sus acuerdos, retención de registros y regiones.
   Completar la identidad/contacto del responsable en los avisos.
2. Desplegar un entorno privado de prueba con origen propio y destinatarios propios
   autorizados. No enviar a contactos de prospectos para probar.
3. Solicitar un código en inglés y español; comprobar recepción, spam, código
   erróneo, vencimiento, reenvío, teléfono/email diferente y reutilización.
4. Comprobar el estado del contacto en su detalle y que no aparezca un código en
   el historial. Confirmar límites y que ninguna solicitud vaya a una clínica.
5. Desplegar producción y comprobar `/api/verification`. Si ambos valores son
   `false`, falta al menos un requisito; esto es intencional, no un envío simulado.

Para apagar los envíos: `CONTACT_VERIFICATION_ENABLED=false` y redeploy.
Si hay abuso activo, además revocar/deshabilitar el proveedor; no esperar al deploy.

Las pruebas automatizadas usan dobles de proveedores y verifican las llamadas HTTP,
los controles y el flujo del servicio. **No prueban entrega de mensajes reales.**
Documentación API: [Resend](https://resend.com/docs/api-reference/emails/send-email),
[Twilio Check](https://www.twilio.com/docs/verify/api/verification-check),
[Upstash REST](https://upstash.com/docs/redis/features/restapi).
