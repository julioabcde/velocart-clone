// ActionPill.tsx
import { Eye, Pencil, Trash2, Printer } from "lucide-react";
import { ReactNode } from "react";

type Variant = "indigo" | "emerald" | "rose" | "cyan";
const VARIANT: Record<Variant, string> = {
    indigo: "bg-indigo-50  text-indigo-700  hover:bg-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    rose: "bg-rose-50    text-rose-700    hover:bg-rose-100",
    cyan: "bg-cyan-50    text-cyan-700    hover:bg-cyan-100",
};

function Pill({
    children,
    color = "indigo",
    icon,
    onClick,
    className = "",
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
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={typeof children === "string" ? (children as string) : undefined}
            className={`
        group inline-flex items-center rounded-full text-xs font-semibold transition
        ${VARIANT[color]}
        disabled:opacity-50 disabled:cursor-not-allowed
        h-8 px-2 hover:px-3   
        ${className}
      `}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            <span
                className="
          overflow-hidden whitespace-nowrap
          max-w-0 opacity-0 -translate-x-1
          group-hover:max-w-[200px] group-hover:opacity-100 group-hover:translate-x-0 group-hover:ml-1
        "
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
    confirmDelete = true,
    className = "",
}: {
    item: T;
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onPrint?: (row: T) => void;
    confirmDelete?: boolean;
    className?: string;
}) {
    const handleDelete = () => {
        if (!onDelete) return;
        if (!confirmDelete || window.confirm("Yakin hapus item ini?")) onDelete(item);
    };

    return (
        <div className={`inline-flex items-center justify-end gap-2 ${className}`}>
            {onView && (
                <Pill color="emerald" icon={<Eye className="h-4 w-4" />} onClick={() => onView(item)}>
                    View
                </Pill>
            )}
            {onEdit && (
                <Pill color="indigo" icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(item)}>
                    Edit
                </Pill>
            )}
            {onDelete && (
                <Pill color="rose" icon={<Trash2 className="h-4 w-4" />} onClick={handleDelete}>
                    Delete
                </Pill>
            )}
            {onPrint && (
                <Pill color="cyan" icon={<Printer className="h-4 w-4" />} onClick={() => onPrint(item)}>
                    Print
                </Pill>
            )}
        </div>
    );
}
