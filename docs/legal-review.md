# Revisión legal de la demo FrontDesk AI

Revisado: 25 de septiembre de 2026. Alcance: demo comercial orientada a clínicas
dentales de Miami, Florida; interfaz inglesa/española, clínica ficticia, datos locales,
verificación opcional de email/teléfono. No es un dictamen jurídico ni garantiza que
se hayan identificado todas las obligaciones posibles. La jurisdicción del operador,
los pacientes, los contratos y el uso efectivo pueden cambiar el análisis.

## Estado y decisiones implementadas

- Avisos bilingües de privacidad, términos y accesibilidad, enlaces visibles en
  landing/chat/panel y antes de pedir un código real.
- Clínica ficticia, chat programado, ninguna cita confirmada, sin diagnóstico,
  sin precios inventados y sin recepción de solicitudes por una clínica real.
- Demo destinada a adultos; nombre ficticio y no ingresar información clínica.
- Consentimiento separado, no premarcado, para un código a un contacto propio.
  No incluye campañas, venta de datos o seguimiento comercial automático.
- Transparencia de localStorage, cookie de idioma y cookie de seguridad; borrado
  local con confirmación que no elimina otros sitios ni restaura los ejemplos.
- Divulgación de proveedores y de la diferencia entre vencimiento de códigos y
  retención de logs; no se promete que todo desaparece de todos los sistemas en 10 minutos.
- Idiomas, foco visible, teclado, formularios etiquetados y movimiento reducido.
- No se agregaron píxeles publicitarios, analítica de audiencia ni una insignia HIPAA.

## Pendientes que impiden habilitar verificación real

El usuario indicó que no tiene dominio ni servicios de envío. Además faltan el
nombre real del responsable, país de operación y correo atendido para privacidad.
No se inventó una entidad, domicilio ni un correo de soporte. El aviso público
expone ese estado y la API permanece desactivada. Antes de habilitar:

1. Completar los datos de identidad y contacto y revisar ambas traducciones.
2. Elegir y configurar proveedores; documentar retención, región, DPA/subprocesadores,
   transferencias y procedimiento de solicitudes/borrado. Actualizar avisos si difieren
   del flujo descrito. Un flag de entorno no certifica cumplimiento.
3. Acordar cómo atender reclamos, incidentes, bajas y solicitudes de derechos.
4. Revisar el consentimiento SMS y registros aplicables con asesoramiento jurídico.
   El recibo temporal actual no reemplaza el archivo de consentimiento que una
   operación clínica/comercial pueda necesitar.

## Matriz de temas revisados

| Tema | Criterio y consecuencia para este proyecto | Fuente primaria |
| --- | --- | --- |
| HIPAA y BAA | HIPAA depende del rol como entidad cubierta/asociado y del flujo de PHI. Un dentista no queda cubierto solo por su profesión; importan las transacciones reguladas. Antes de procesar datos identificables de pacientes: análisis de rol, seguridad, BAA con clínica y proveedores cuando corresponda. Esta demo no está aprobada para ese uso. | [HHS: entidades cubiertas y asociados](https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html) |
| Promesas de privacidad y brechas de salud | Las afirmaciones deben coincidir con lo que ocurre. No asumir que estar fuera de HIPAA elimina obligaciones. La Health Breach Notification Rule de FTC tiene sujetos y condiciones específicos; evaluar si un futuro producto es proveedor de PHR o entidad relacionada, sin afirmar que toda consulta dental entra automáticamente. | [FTC: HBNR](https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0) |
| Seguridad y brechas en Florida | Identificar información personal protegida, medidas razonables, evaluación de incidentes y obligaciones de notificación aplicables. No se agregaron plazos contractuales inventados a la web; antes de producción hace falta un procedimiento operativo. | [F.S. 501.171](https://www.flsenate.gov/Laws/Statutes/2026/501.171) |
| SMS, llamadas y consentimiento | La norma de Florida incluye textos en su ámbito de llamadas de venta y regula consentimiento y solicitudes. Este flujo solo solicita OTP; no tratar esa autorización como permiso para marketing. Revisar también TCPA/FCC, revocación, horarios y reglas del proveedor antes de mensajes promocionales. | [F.S. 501.059](https://www.flsenate.gov/Laws/Statutes/2026/501.059) |
| Email comercial | El propósito principal del mensaje importa; mezclar promociones puede cambiar el análisis de CAN-SPAM. El código no contiene ofertas. Cualquier campaña futura requiere revisar remitente, domicilio postal, baja y demás requisitos aplicables. | [FTC: CAN-SPAM](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) |
| Privacidad estatal | No afirmar que Florida Digital Bill of Rights aplica por tener visitantes de Florida: tiene definiciones y umbrales de controladores. Reevaluar estados de visitantes, salud del consumidor y actividad real al ampliar mercado. | [F.S. 501.702](https://www.flsenate.gov/Laws/Statutes/2026/501.702) |
| Menores | El aviso 18+ no sustituye analizar conocimiento efectivo, audiencia y reglas de menores si cambia el producto. No pedir edad exacta, datos de niños ni autorización parental en esta demo. | [FTC: privacidad infantil/COPPA](https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy) |
| Accesibilidad | DOJ contempla accesibilidad de servicios web de negocios abiertos al público. WCAG sirve como guía; las mejoras realizadas no son una auditoría independiente ni garantizan conformidad total. Probar con tecnologías de asistencia y atender reportes. | [DOJ: accesibilidad web y ADA](https://www.ada.gov/resources/web-guidance/) |
| Operador fuera de EE. UU. | El país del operador sigue pendiente. Si opera desde Argentina, evaluar protección de datos, registros y transferencias internacionales bajo el régimen aplicable; no se deduce una sede por el idioma ni la zona horaria. | [AAIP: protección de datos](https://www.argentina.gob.ar/aaip/datospersonales) |
| Contratos y oferta comercial | Antes del primer cliente: propuesta firmada con alcance, cargos (incluida oferta Founding Practice si se mantiene), impuestos, cancelación, devoluciones, soporte, propiedad de datos, seguridad y reparto de responsabilidades. La demo no cobra ni crea suscripción. | Decisión de producto; requiere asesoramiento contractual según las partes. |
| Marcas y contenido | Usar nombres de tratamientos de forma descriptiva; no copiar activos, logos, testimonios ni afirmaciones del sitio del video. La nueva animación usa código propio y conserva la identidad original de la demo. | Revisión del material y código del proyecto. |
| Publicidad y transparencia de IA | Mantener visible que es una demo y usa un guion. No prometer resultados garantizados ni hacer pasar ejemplos por pacientes reales. Revisar leyes de divulgación de IA y práctica profesional en las jurisdicciones del despliegue real. | Decisión de producto; revisión jurídica específica pendiente. |

## Antes de recibir pacientes de una clínica real

No basta con publicar estos textos. Se necesita definir responsable/encargado,
base y finalidad del tratamiento, control de acceso y autenticación, segregación de
clientes, almacenamiento central seguro, retención/borrado, gestión de incidentes,
contratos y evaluación HIPAA/leyes estatales. La confirmación de un email no verifica
identidad clínica. El badge local del dashboard no es una credencial de seguridad.

La revisión debe actualizarse si se agregan LLM externos, analytics, anuncios,
grabación de llamadas, calendarios, integraciones clínicas, pagos, otros países o
mensajes de marketing. Esas funciones permanecen fuera del alcance de esta demo.
