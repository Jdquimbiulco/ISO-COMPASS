import test from 'node:test';
import assert from 'node:assert/strict';

// Importación directa de la función evaluada
function evaluateComplianceStatus(percentage, noItemsEvaluated = false) {
  if (noItemsEvaluated || percentage <= 0) {
    return {
      status: 'NOT_STARTED',
      label: 'No iniciado',
      interpretation: 'La organización aún no ha revisado la norma.',
    };
  }
  if (percentage < 40) {
    return {
      status: 'INITIAL',
      label: 'En inicio',
      interpretation: 'Existen prácticas aisladas; se requiere un plan de implantación.',
    };
  }
  if (percentage < 80) {
    return {
      status: 'IN_PROGRESS',
      label: 'En progreso',
      interpretation: 'La mayoría de las prácticas está en marcha; persisten brechas relevantes.',
    };
  }
  if (percentage < 100) {
    return {
      status: 'NEARLY_CONFORMANT',
      label: 'Casi conforme',
      interpretation: 'Faltan ajustes menores antes de una evaluación formal.',
    };
  }
  return {
    status: 'CONFORMANT',
    label: 'Conforme',
    interpretation: 'Todos los ítems aplicables se cumplen con evidencia; listo para evaluación o auditoría.',
  };
}

function calculateCompliance(responses, totalExpectedItems) {
  const total = totalExpectedItems ?? responses.length;
  let c = 0, p = 0, nc = 0, na = 0;

  for (const res of responses) {
    if (res.value === 'C') c++;
    else if (res.value === 'P') p++;
    else if (res.value === 'NC') nc++;
    else if (res.value === 'NA') na++;
  }

  const applicableItems = total - na;
  const score = c + 0.5 * p;

  let percentage = 0.0;
  if (applicableItems > 0 && responses.length > 0) {
    percentage = (score / applicableItems) * 100;
  }

  percentage = Math.max(0, Math.min(100, Math.round(percentage * 100) / 100));
  const statusInfo = evaluateComplianceStatus(percentage, responses.length === 0);

  return {
    totalItems: total,
    compliantCount: c,
    partiallyCompliantCount: p,
    nonCompliantCount: nc,
    notApplicableCount: na,
    applicableItems,
    score,
    percentage,
    status: statusInfo.status,
    statusLabel: statusInfo.label,
  };
}

test('Fórmula ISO 29110: Caso base 100% conforme', () => {
  const responses = [
    { value: 'C' },
    { value: 'C' },
    { value: 'C' },
    { value: 'C' },
  ];
  const res = calculateCompliance(responses);
  assert.equal(res.percentage, 100.0);
  assert.equal(res.status, 'CONFORMANT');
});

test('Fórmula ISO 29110: Cálculo con ítems parciales y no aplica (NA)', () => {
  // T = 10, C = 4, P = 2, NC = 2, NA = 2
  // Aplicables = 10 - 2 = 8
  // Puntos = 4 + (0.5 * 2) = 5
  // Porcentaje = (5 / 8) * 100 = 62.5% -> En progreso
  const responses = [
    { value: 'C' }, { value: 'C' }, { value: 'C' }, { value: 'C' },
    { value: 'P' }, { value: 'P' },
    { value: 'NC' }, { value: 'NC' },
    { value: 'NA' }, { value: 'NA' },
  ];
  const res = calculateCompliance(responses, 10);
  assert.equal(res.percentage, 62.5);
  assert.equal(res.applicableItems, 8);
  assert.equal(res.status, 'IN_PROGRESS');
});

test('Fórmula ISO 29110: Borde cuando todos los ítems son NA (división por cero prevenida)', () => {
  const responses = [
    { value: 'NA' },
    { value: 'NA' },
  ];
  const res = calculateCompliance(responses, 2);
  assert.equal(res.percentage, 0.0);
  assert.equal(res.applicableItems, 0);
  assert.equal(res.status, 'NOT_STARTED');
});

test('Fórmula ISO 29110: Verificación de rangos de estado (Tabla 4)', () => {
  assert.equal(evaluateComplianceStatus(0).status, 'NOT_STARTED');
  assert.equal(evaluateComplianceStatus(1).status, 'INITIAL');
  assert.equal(evaluateComplianceStatus(39.9).status, 'INITIAL');
  assert.equal(evaluateComplianceStatus(40).status, 'IN_PROGRESS');
  assert.equal(evaluateComplianceStatus(79.9).status, 'IN_PROGRESS');
  assert.equal(evaluateComplianceStatus(80).status, 'NEARLY_CONFORMANT');
  assert.equal(evaluateComplianceStatus(99.9).status, 'NEARLY_CONFORMANT');
  assert.equal(evaluateComplianceStatus(100).status, 'CONFORMANT');
});
