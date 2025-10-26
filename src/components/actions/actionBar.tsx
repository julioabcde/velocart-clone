// ActionPill.tsx
import { Eye, Pencil, Trash2, Printer } from 'lucide-react';
import { ReactNode } from 'react';

type Variant = 'indigo' | 'emerald' | 'rose' | 'cyan';
const VARIANT: Record<Variant, string> = {
  indigo: 'bg-indigo-50  text-indigo-700  hover:bg-indigo-100',
  emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  rose: 'bg-rose-50    text-rose-700    hover:bg-rose-100',
  cyan: 'bg-cyan-50    text-cyan-700    hover:bg-cyan-100',
};

function Pill({
  children,
  color = 'indigo',
  icon,
  onClick,
  className = '',
  disabled,
}: {
  children: ReactNode;
  color?: Variant;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={typeof children === 'string' ? (children as string) : undefined}
      className={`group inline-flex items-center rounded-full text-xs font-semibold transition ${VARIANT[color]} h-8 px-2 hover:px-3 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:px-2 ${className} `}
    >
      {icon && <span className='shrink-0'>{icon}</span>}
      <span
        className='max-w-0 -translate-x-1 overflow-hidden whitespace-nowrap opacity-0 group-hover:ml-1 group-hover:max-w-[200px] group-hover:translate-x-0 group-hover:opacity-100 group-disabled:ml-0 group-disabled:max-w-0 group-disabled:translate-x-0 group-disabled:opacity-0'
        style={{
          transitionDelay: '0ms',
          transitionProperty: 'all',
        }}
      >
        {children}
      </span>
    </button>
  );
}

export function RowActions<T>({
  item,
  onView,
  onEdit,
  onDelete,
  onPrint,
  className = '',
  disableView,
  disableEdit,
  disableDelete,
  disablePrint,
}: {
  item: T;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onPrint?: (row: T) => void;
  className?: string;
  disableView?: (row: T) => boolean;
  disableEdit?: (row: T) => boolean;
  disableDelete?: (row: T) => boolean;
  disablePrint?: (row: T) => boolean;
}) {
  return (
    <div className={`inline-flex items-center justify-end gap-2 ${className}`}>
      {onView && (
        <Pill
          color='emerald'
          icon={<Eye className='h-4 w-4' />}
          onClick={() => onView(item)}
          disabled={disableView?.(item)}
        >
          View
        </Pill>
      )}
      {onEdit && (
        <Pill
          color='indigo'
          icon={<Pencil className='h-4 w-4' />}
          onClick={() => onEdit(item)}
          disabled={disableEdit?.(item)}
        >
          Edit
        </Pill>
      )}
      {onDelete && (
        <Pill
          color='rose'
          icon={<Trash2 className='h-4 w-4' />}
          onClick={() => onDelete(item)}
          disabled={disableDelete?.(item)}
        >
          Delete
        </Pill>
      )}
      {onPrint && (
        <Pill
          color='cyan'
          icon={<Printer className='h-4 w-4' />}
          onClick={() => onPrint(item)}
          disabled={disablePrint?.(item)}
        >
          Print
        </Pill>
      )}
    </div>
  );
}
