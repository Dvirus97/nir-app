import { selectArgs } from './select/select.component';

export function enumForSelect(data: any): selectArgs<number>[] {
  return Object.entries(data)
    .filter((x) => !isNaN(+x[0]))
    .map(([value, label]) => {
      return { value: +value, label: `${label}` };
    });
}
