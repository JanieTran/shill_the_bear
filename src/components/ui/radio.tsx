import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';

import { cn } from '@/lib/utils';

function RadioRoot({
  className,
  ...props
}: Radio.Root.Props) {
  return (
    <Radio.Root
      data-slot="radio"
      className={cn(
        'peer relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary',
        className
      )}
      {...props}
    />
  );
}

function RadioIndicator({
  className,
  ...props
}: Radio.Indicator.Props) {
  return (
    <Radio.Indicator
      data-slot="radio-indicator"
      className={cn(
        'grid place-content-center text-current transition-none after:block after:size-2 after:rounded-full after:bg-primary',
        className
      )}
      {...props}
    />
  );
}

export { RadioRoot, RadioIndicator, RadioGroup };
