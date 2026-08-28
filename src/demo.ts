import type { AppData } from './types';

/** A realistic, static sample. It is only ever written to the demo: namespace. */
export function sampleData(): AppData {
  const stamp = '2026-08-20T09:30:00.000Z';
  const receipt = new Blob([
    'Northline Heating & Cooling\nInvoice 1048\nAnnual water-heater safety service completed.\n'
  ], { type: 'text/plain' });
  return {
    home: { id: 'home', name: 'Juniper House', address: '18 Juniper Lane', yearBuilt: '1987', updatedAt: stamp },
    assets: [
      { id: 'water-heater', name: 'Water heater', category: 'Plumbing', location: 'Utility room', make: 'Rheem', model: 'Performance 50', serial: 'RH-2019-4482', installedOn: '2019-11-06', warrantyUntil: '2029-11-06', notes: 'Anode rod checked at annual service.', createdAt: stamp, updatedAt: stamp },
      { id: 'heat-pump', name: 'Heat pump', category: 'HVAC', location: 'Side yard', make: 'Mitsubishi', model: 'MSZ-FS18', serial: 'MUZ-2022-9021', installedOn: '2022-04-19', warrantyUntil: '2032-04-19', notes: 'Filter size: 16 × 25 × 1.', createdAt: stamp, updatedAt: stamp }
    ],
    events: [
      { id: 'heater-service', assetId: 'water-heater', kind: 'service', title: 'Annual water-heater safety service', date: '2026-08-14', contractor: 'Northline Heating & Cooling', cost: 189, notes: 'Pressure relief valve tested. No leaks found.', attachmentIds: ['heater-receipt'], createdAt: stamp, updatedAt: stamp },
      { id: 'panel-inspection', assetId: '', kind: 'inspection', title: 'Electrical panel inspection', date: '2026-04-02', contractor: 'Cedar Electrical', cost: 140, notes: 'Panel labeled and grounding confirmed.', attachmentIds: [], createdAt: stamp, updatedAt: stamp }
    ],
    tasks: [
      { id: 'replace-filter', assetId: 'heat-pump', title: 'Replace heat-pump filter', dueDate: '2026-09-15', repeatMonths: 3, complete: false, createdAt: stamp, updatedAt: stamp },
      { id: 'test-smoke', assetId: '', title: 'Test smoke alarms', dueDate: '2026-10-01', repeatMonths: 6, complete: false, createdAt: stamp, updatedAt: stamp }
    ],
    attachments: [{ id: 'heater-receipt', eventId: 'heater-service', name: 'northline-service-receipt.txt', type: 'text/plain', size: receipt.size, blob: receipt, createdAt: stamp }],
    settings: { id: 'settings', customPackTitle: '', handoverNote: '', presetAssetIds: ['water-heater', 'heat-pump'], updatedAt: stamp }
  };
}
