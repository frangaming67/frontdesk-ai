# Revisión legal preliminar — consultorios odontológicos de Argentina
Revisión de fuentes oficiales: 26 de septiembre de 2026.

Este documento reemplaza el análisis anterior orientado a una clínica ficticia de Miami. Describe el encuadre argentino y tareas pendientes; no es un dictamen ni certifica cumplimiento. El abogado debe revisar los flujos/proveedores elegidos y la jurisdicción del consultorio; el contador debe revisar la situación fiscal del prestador.

## Estado de la aplicación

Es una demo con consultorio ficticio y chat por reglas. Las solicitudes se guardan en localStorage del visitante, no en una base clínica central. El panel no tiene autenticación porque sólo muestra ejemplos y datos de ese navegador. No hay WhatsApp, reserva de turnos ni entrega de solicitudes a un consultorio.

Existe verificación opcional de contacto por email/SMS, inicialmente desactivada. No es identidad clínica ni consentimiento para publicidad. Los datos del responsable siguen pendientes. La marca provisional y el país objetivo no reemplazan la identidad legal de una persona o entidad.

No ingresar datos de pacientes reales en esta demo. Publicar textos o cambiar una variable no valida contratos, seguridad ni prácticas operativas.

## Marco principal: datos de salud

La Ley 25.326 considera sensible la información sobre salud. Sus arts. 7 y 8 requieren un análisis específico: los establecimientos sanitarios y profesionales pueden tratar datos de sus pacientes respetando el secreto profesional. Un checkbox genérico no resuelve por sí solo ese encuadre.

La ley también exige pertinencia, finalidad compatible, protección y confidencialidad. Para este producto, una consulta asociada a un tratamiento puede revelar salud; es una inferencia conservadora para diseñar la protección, no una calificación jurídica de cada mensaje.

Recomendación de alcance: recepción, información administrativa aprobada, solicitud de contacto/turno y derivación humana. Evitar síntomas, fotos, medicación, diagnósticos, antecedentes o documentos de cobertura. Aun así, proteger conversaciones como potencialmente sensibles.

Fuente: [Ley 25.326 actualizada, arts. 2, 4, 7–10](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion).

## Quién responde por los datos

El esquema a validar es: consultorio responsable de los datos de pacientes, prestador del software encargado bajo instrucciones. La gestión comercial/facturación del prestador puede tener otro responsable y finalidades distintas.

Antes de captar datos, informar identidad y domicilio del responsable real, finalidad, destinatarios, obligatoriedad/opcionalidad y consecuencias, además de derechos. La marca del software sola no alcanza. [Obligaciones de responsables — AAIP](https://www.argentina.gob.ar/node/53779).

El acuerdo de tratamiento debe regular instrucciones, confidencialidad y seguridad. La propuesta contractual debería además especificar subproveedores autorizados, soporte, incidentes, acceso delegado, exportación y devolución/eliminación al terminar. No reutilizar datos del consultorio para fines propios. [Decreto 1558/2001, art. 25](https://www.argentina.gob.ar/normativa/nacional/70368/texto).

## Registro de bases y derechos

La AAIP interpreta que las bases destinadas a proporcionar informes incluyen el uso interno. Determinar con asesoramiento los registros del consultorio y los de la propia actividad comercial; no asumir que una base está exenta porque no se vende. [Bases a informar](https://www.argentina.gob.ar/aaip/datospersonales/responsables/basesainformar), [trámites AAIP](https://www.argentina.gob.ar/aaip/datospersonales/tramites).

Preparar un canal atendido y un procedimiento: acceso en diez días corridos; rectificación, actualización o supresión en cinco días hábiles, con las excepciones aplicables. Verificar identidad del solicitante de forma proporcional. No prometer borrar información cuya conservación sea exigible. [Derechos — AAIP](https://www.argentina.gob.ar/aaip/datospersonales/derechos).

El botón actual sólo borra localStorage de ese navegador. Una futura base central necesita mecanismos propios; tampoco se borran automáticamente logs, copias o datos de proveedores externos.

## Nube y transferencias internacionales

No se identificó una obligación general de alojar todo en Argentina. Sí deben revisarse las transferencias. EE.UU. y Brasil no figuran en la lista de destinos adecuados publicada por AAIP consultada; elegir São Paulo por cercanía no resuelve este punto.

Identificar países y accesos de hosting, base, backups, email, WhatsApp, soporte e IA. Evaluar el mecanismo aplicable —por ejemplo, cláusulas modelo— y no asumir que un contrato GDPR genérico alcanza. Elegir una región adecuada tampoco cubre automáticamente transferencias posteriores de subproveedores.

Fuente: [AAIP: transferencias internacionales](https://www.argentina.gob.ar/transferencias-internacionales).

## Si se incorporan historias clínicas

Si el servicio pasa a registrar actuaciones profesionales, odontogramas o documentación clínica, revisar Ley 26.529 y normativa local. La ley exige protección del registro; contempla entrega de copia en 48 horas, salvo urgencia, y custodia mínima de diez años desde la última actuación.

Esto no significa que toda solicitud administrativa sea historia clínica. La retención debe distinguir categorías; no aplicar indiscriminadamente un botón de “borrar contactos” a documentación clínica. La Ley 27.706 también merece revisión si se desarrolla un módulo de historia clínica electrónica.

Fuentes: [Ley 26.529 actualizada](https://www.argentina.gob.ar/normativa/nacional/160432/actualizacion), [Ley 27.706](https://www.argentina.gob.ar/normativa/nacional/ley-27706-380710/texto).

## Email, WhatsApp y publicidad

Separar atención solicitada, recordatorios y campañas publicitarias. Guardar finalidad/canal/versiones de permisos necesarios; pedir un turno o un código no equivale a aceptar promociones.

Para publicidad, revisar mecanismos de retiro/bloqueo y Registro No Llame con sus excepciones. No cargar la agenda de pacientes como audiencia comercial por defecto. [Decreto 1558/2001, art. 27](https://www.argentina.gob.ar/normativa/nacional/70368/texto), [AAIP: obligaciones No Llame](https://www.argentina.gob.ar/noticias/registro-no-llame-la-aaip-brinda-informacion-para-garantizar-el-cumplimiento-de-la-ley).

Los requisitos de Meta sobre permiso, plantillas y atención humana se suman al encuadre argentino. No sustituyen confidencialidad sanitaria ni revisión de proveedores. [Política WhatsApp](https://whatsappbusiness.com/policy/).

Recomendación: avisos breves sin información de salud y enlace al panel autenticado; política de bajas; no enviar conversaciones completas por correo.

## Medidas técnicas propuestas

Son decisiones de diseño derivadas del riesgo, no una lista de tecnologías exigidas literalmente por una ley:

- Usuarios nominados, roles, MFA administrativo y revocación.
- Aislamiento de consultorios comprobado en consultas y modificaciones.
- Claves y tokens sólo en servidor; cifrado y permisos mínimos.
- Registro de acceso/cambios sin duplicar datos clínicos en logs.
- Copias con restauración probada, exportación y plazos de conservación por categoría.
- Manejo de incidentes, contacto responsable y obligaciones contractuales de aviso.
- Intervención humana, límites del asistente y respuestas aprobadas por el consultorio.
- Gestión de representantes antes de admitir libremente datos de menores.
- Revisión del proveedor y condiciones de uso antes de enviar datos a una IA.

## Marca, dominio y facturación

La disponibilidad de dominio no equivale a disponibilidad de marca. Buscar denominaciones similares y evaluar clases antes de registrar. “Asistente Dental” es sólo el nombre provisional de trabajo; no se afirma exclusividad. [INPI: búsqueda](https://www.argentina.gob.ar/node/230501), [registro](https://www.argentina.gob.ar/node/36576).

ARCA indica comprobantes C para operaciones de monotributistas y E para exportación cuando corresponda. Cobrar en dólares a un cliente argentino no convierte por sí solo el servicio en exportación. [ARCA: comprobantes](https://www.arca.gob.ar/facturacion/monotributo/comprobantes.asp), [exportación de servicios](https://www.arca.gob.ar/monotributo/exportacion-servicios/).

Con contador: alta/actividad, categoría y condiciones del régimen, Ingresos Brutos de la jurisdicción, Convenio Multilateral si corresponde, moneda y documentación. Falta conocer domicilio fiscal y modalidad de actividad. [Monotributo unificado](https://www.arca.gob.ar/monotributo/ayuda/monotributo-unificado.asp).

El contrato comercial debe especificar alcance, cargos, impuestos, límites de uso, soporte, disponibilidad ofrecida, cancelación, entrega de datos y responsabilidades. Evitar prometer resultados o disponibilidad que no se pueden sostener.

## Antes del primer paciente real

1. Identificar prestador, consultorio, provincia, usuarios autorizados y circuito de atención.
2. Revisar con abogado roles, salud, menores, contratos, avisos, transferencias y conservación.
3. Revisar registros AAIP y situación fiscal con los profesionales correspondientes.
4. Elegir proveedores/cuentas/regiones después de esa revisión.
5. Implementar base central, seguridad y control de accesos antes de habilitar captación.
6. Probar aislamiento, entrega de solicitudes, errores, bajas, exportación y restauración.
7. Completar identidad/contacto real y los documentos del consultorio.
8. Habilitar un piloto acotado con responsables de atención definidos.

Para pasos de hosting, dominios, correo, WhatsApp y costos, ver [plan de implementación](argentina-implementacion.md).
