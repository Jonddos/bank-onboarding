export type Product = {
  id: string;
  name: string;
  description: string;
  minInitialAmount: number;
  currency: 'COP';
};

export const PRODUCTS: Product[] = [
  {
    id: 'cta-digital-001',
    name: 'Cuenta Digital Básica',
    description: 'Cuenta de apertura 100% digital con costos mínimos.',
    minInitialAmount: 0,
    currency: 'COP',
  },
  {
    id: 'cta-digital-002',
    name: 'Cuenta Digital Nómina',
    description: 'Cuenta para manejar ingresos recurrentes con beneficios.',
    minInitialAmount: 50_000,
    currency: 'COP',
  },
  {
    id: 'ahorro-001',
    name: 'Ahorro Programado',
    description: 'Ahorro mensual con metas y recordatorios.',
    minInitialAmount: 20_000,
    currency: 'COP',
  },
];
