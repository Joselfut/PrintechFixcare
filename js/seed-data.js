const SEED_INCIDENTS = [
  {
    id: "inc-1",
    model: "HP LaserJet Pro M404 / M428",
    code: "Error 59.F0",
    category: "Hardware / Fuser",
    priority: "Alta",
    cause: "Falla de comunicación o movimiento en el motor principal / unidad fusora.",
    steps: [
      "Apagar el equipo, desconectar el cable de corriente y esperar 30 segundos.",
      "Verificar que el cartucho de tóner esté bien asentado y sin obstrucciones visibles.",
      "Conectar directamente a un tomacorriente de pared (evitar regletas o UPS defectuosos) y encender.",
      "Si el error persiste, revisar o reemplazar la unidad fusora / motor principal según diagnóstico."
    ],
    notes: "Confirmar si ocurre al iniciar o justo al enviar un trabajo de impresión.",
    updatedAt: "2026-11-26"
  },
  {
    id: "inc-2",
    model: "Impresoras Láser / Multifuncionales",
    code: "Atasco en bandeja o salida",
    category: "Atascos / Papel",
    priority: "Alta",
    cause: "Papel húmedo, fuera de gramaje, rodillos desgastados o restos de papel en sensores.",
    steps: [
      "Retirar el papel atascado suavemente en el sentido del avance para no rasgarlo.",
      "Inspeccionar el recorrido interno con linterna para descartar pequeños trozos de papel.",
      "Limpiar rodillos de alimentación y verificar calidad/gramaje del papel en bandeja.",
      "Probar con una hoja nueva y verificar el ajuste de las guías laterales."
    ],
    notes: "Evitar papel doblado o reciclado en mal estado.",
    updatedAt: "2026-11-26"
  },
  {
    id: "inc-3",
    model: "Equipos en red corporativa",
    code: "Trabajo no imprime / Cola retenida",
    category: "Red / Drivers",
    priority: "Media",
    cause: "IP dinámica cambiada, servicio de cola bloqueado o controlador incompatible.",
    steps: [
      "Imprimir página de configuración o red desde el panel del equipo para confirmar su IP actual.",
      "Verificar conectividad de red (ping a la IP del equipo) y estado en línea.",
      "Reiniciar el servicio Cola de impresión (Print Spooler) o limpiar trabajos trabados.",
      "Confirmar que el puerto TCP/IP del controlador coincida con la IP del equipo."
    ],
    notes: "Recomendar reserva DHCP o IP estática en equipos de oficina.",
    updatedAt: "2026-11-26"
  }
];
