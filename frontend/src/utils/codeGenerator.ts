/**
 * Utilidad para generar códigos únicos para diferentes tipos de documentos
 */

/**
 * Genera un código con formato: PREFIJO-YYYYMMDD-NUMERO
 * @param prefix - Prefijo del código (ej: 'QTE', 'ORD', 'PUR', 'RET', 'INV')
 * @param sequence - Número secuencial (opcional)
 * @returns Código generado
 */
export const generateCode = (prefix: string, sequence?: number): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const dateStr = `${year}${month}${day}`;
  
  if (sequence !== undefined) {
    const seqStr = String(sequence).padStart(4, '0');
    return `${prefix}-${dateStr}-${seqStr}`;
  }
  
  // Si no hay secuencia, usar timestamp para más unicidad
  const time = String(date.getHours()).padStart(2, '0') + 
               String(date.getMinutes()).padStart(2, '0') + 
               String(date.getSeconds()).padStart(2, '0');
  
  return `${prefix}-${dateStr}-${time}`;
};

/**
 * Genera un código de cotización
 * @param sequence - Número secuencial (opcional)
 * @returns Código de cotización (ej: QTE-20251013-0001)
 */
export const generateQuoteCode = (sequence?: number): string => {
  return generateCode('QTE', sequence);
};

/**
 * Genera un código de orden de compra
 * @param sequence - Número secuencial (opcional)
 * @returns Código de orden de compra (ej: ORD-20251013-0001)
 */
export const generateBuyOrderCode = (sequence?: number): string => {
  return generateCode('ORD', sequence);
};

/**
 * Genera un código de compra
 * @param sequence - Número secuencial (opcional)
 * @returns Código de compra (ej: PUR-20251013-0001)
 */
export const generatePurchaseCode = (sequence?: number): string => {
  return generateCode('PUR', sequence);
};

/**
 * Genera un código de retaceo
 * @param sequence - Número secuencial (opcional)
 * @returns Código de retaceo (ej: RET-20251013-0001)
 */
export const generateRetaceoCode = (sequence?: number): string => {
  return generateCode('RET', sequence);
};

/**
 * Genera un número de factura
 * @param sequence - Número secuencial (opcional)
 * @returns Número de factura (ej: INV-20251013-0001)
 */
export const generateInvoiceNumber = (sequence?: number): string => {
  return generateCode('INV', sequence);
};

/**
 * Genera el siguiente número en secuencia basado en una lista de códigos existentes
 * @param codes - Array de códigos existentes
 * @param prefix - Prefijo a buscar
 * @returns Siguiente número en secuencia
 */
export const getNextSequence = (codes: string[], prefix: string): number => {
  if (codes.length === 0) return 1;
  
  const prefixPattern = new RegExp(`^${prefix}-\\d{8}-(\\d+)$`);
  
  const sequences = codes
    .map(code => {
      const match = code.match(prefixPattern);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(seq => seq > 0);
  
  if (sequences.length === 0) return 1;
  
  return Math.max(...sequences) + 1;
};

/**
 * Valida si un código tiene el formato correcto
 * @param code - Código a validar
 * @param prefix - Prefijo esperado
 * @returns true si el código es válido
 */
export const isValidCode = (code: string, prefix: string): boolean => {
  const pattern = new RegExp(`^${prefix}-\\d{8}-\\d+$`);
  return pattern.test(code);
};
