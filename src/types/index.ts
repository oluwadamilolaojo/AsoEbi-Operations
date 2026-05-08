export type TailoringStatus =
  | 'Awaiting Measurements'
  | 'Virtual Measurement Scheduled'
  | 'Measurements Taken'
  | 'Clothes Being Made'
  | 'Clothes Ready'
  | 'Sent to Abuja'
  | 'In Abuja ✓'

export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid'

export interface Groomsman {
  id: string
  name: string
  phone: string
  amount_owed: number
  amount_paid: number
  payment_status: PaymentStatus
  receipt_url?: string
  receipt_filename?: string
  tailoring_status: TailoringStatus
  notes?: string
  created_at: string
  updated_at: string
}

export const TAILORING_STEPS: TailoringStatus[] = [
  'Awaiting Measurements',
  'Virtual Measurement Scheduled',
  'Measurements Taken',
  'Clothes Being Made',
  'Clothes Ready',
  'Sent to Abuja',
  'In Abuja ✓',
]

export const TAILORING_COLORS: Record<TailoringStatus, string> = {
  'Awaiting Measurements':          'bg-gray-100 text-gray-600',
  'Virtual Measurement Scheduled':  'bg-blue-50 text-blue-700',
  'Measurements Taken':             'bg-indigo-50 text-indigo-700',
  'Clothes Being Made':             'bg-amber-50 text-amber-700',
  'Clothes Ready':                  'bg-emerald-50 text-emerald-700',
  'Sent to Abuja':                  'bg-orange-50 text-orange-700',
  'In Abuja ✓':                     'bg-green-100 text-green-800',
}

export const PAYMENT_COLORS: Record<PaymentStatus, string> = {
  'Unpaid':  'bg-red-50 text-red-700',
  'Partial': 'bg-amber-50 text-amber-700',
  'Paid':    'bg-emerald-50 text-emerald-700',
}
