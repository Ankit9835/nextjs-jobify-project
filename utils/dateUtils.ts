// utils/dateUtils.ts
import { format } from 'date-fns';

export function formatDate(date: string | number | Date) {
  return format(new Date(date), 'MM/dd/yyyy');
}
