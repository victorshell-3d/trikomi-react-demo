import {
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Key,
  type ReactNode
} from 'react';
import { SearchInput } from '../forms/Inputs';

export interface DataTableColumn<T> {
  id: string;
  header: string;
  value: (row: T) => string | number;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'right';
}

export interface DataTableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey?: (row: T, index: number) => Key;
  filterable?: boolean;
  filterPlaceholder?: string;
  label?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  filterable = true,
  filterPlaceholder = 'Filter table rows...',
  label = 'Data table',
  className,
  ...props
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<
    { columnId: string; direction: 'ascending' | 'descending' } | undefined
  >(undefined);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredRows = normalizedQuery
    ? rows.filter((row) => columns.some((column) =>
      String(column.value(row)).toLocaleLowerCase().includes(normalizedQuery)
    ))
    : rows;
  const sortedRows = sort
    ? filteredRows
      .map((row, index) => ({ row, index }))
      .sort((left, right) => {
        const column = columns.find((item) => item.id === sort.columnId);
        if (!column) return left.index - right.index;
        const leftValue = column.value(left.row);
        const rightValue = column.value(right.row);
        const comparison = typeof leftValue === 'number' && typeof rightValue === 'number'
          ? leftValue - rightValue
          : String(leftValue).localeCompare(String(rightValue));
        return (sort.direction === 'ascending' ? comparison : -comparison)
          || left.index - right.index;
      })
      .map(({ row }) => row)
    : filteredRows;

  const toggleSort = (column: DataTableColumn<T>) => {
    if (!column.sortable) return;
    setSort((current) => ({
      columnId: column.id,
      direction: current?.columnId === column.id && current.direction === 'ascending'
        ? 'descending'
        : 'ascending'
    }));
  };

  return (
    <div {...props} className={['vs-data-table', className].filter(Boolean).join(' ')}>
      {filterable && (
        <div className="vs-data-table__toolbar">
          <SearchInput
            aria-label={`Filter ${label.toLocaleLowerCase()}`}
            className="vs-data-table__filter"
            placeholder={filterPlaceholder}
            shortcut={null}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
      )}
      <div className="vs-data-table__scroll">
        <table className="vs-data-table__table" aria-label={label}>
          <thead>
            <tr>
              {columns.map((column) => {
                const activeSort = sort?.columnId === column.id;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={activeSort ? sort.direction : undefined}
                    className={column.align === 'right' ? 'is-align-right' : undefined}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="vs-data-table__sort"
                        aria-label={`Sort by ${column.header}`}
                        onClick={() => toggleSort(column)}
                      >
                        {column.header}
                        <span className="vs-data-table__sort-indicator" aria-hidden="true">
                          {activeSort ? (sort.direction === 'ascending' ? '↑' : '↓') : '↕'}
                        </span>
                      </button>
                    ) : column.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <tr key={getRowKey ? getRowKey(row, index) : index}>
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={column.align === 'right' ? 'is-align-right' : undefined}
                  >
                    {column.render ? column.render(row) : column.value(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface ChecklistItem {
  id: string;
  label: string;
  complete: boolean;
}

export interface DataChecklistProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  items: ChecklistItem[];
}

export function DataChecklist({
  title,
  items,
  className,
  ...props
}: DataChecklistProps) {
  return (
    <section {...props} className={['vs-data-checklist', className].filter(Boolean).join(' ')}>
      <h3 className="vs-data-checklist__title">{title}</h3>
      <ul className="vs-data-checklist__items">
        {items.map((item) => (
          <li key={item.id} className="vs-data-checklist__item">
            <span>{item.label}</span>
            <span
              className={[
                'vs-data-checklist__state',
                item.complete ? 'is-complete' : 'is-incomplete'
              ].join(' ')}
              role="img"
              aria-label={`${item.label}: ${item.complete ? 'Complete' : 'Incomplete'}`}
            >
              {item.complete ? '✓' : '–'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export interface Collaborator {
  id: string;
  label: string;
  initials: string;
  background?: string;
}

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  collaborators: Collaborator[];
  remainingCount?: number;
}

export function AvatarStack({
  label,
  collaborators,
  remainingCount = 0,
  className,
  ...props
}: AvatarStackProps) {
  const visibleCollaborators = collaborators.slice(0, 3);
  return (
    <div {...props} className={['vs-avatar-stack', className].filter(Boolean).join(' ')}>
      <span className="vs-avatar-stack__label">{label}</span>
      <div className="vs-avatar-stack__items" role="list" aria-label={label}>
        {visibleCollaborators.map((collaborator, index) => (
          <span
            key={collaborator.id}
            className={`vs-avatar-stack__avatar vs-avatar-stack__avatar--${index + 1}`}
            style={collaborator.background ? { background: collaborator.background } : undefined}
            role="listitem"
            aria-label={collaborator.label}
            title={collaborator.label}
          >
            {collaborator.initials}
          </span>
        ))}
        {remainingCount > 0 && (
          <span
            className="vs-avatar-stack__overflow"
            role="listitem"
            aria-label={`${remainingCount} more collaborators`}
            title={`${remainingCount} more collaborators`}
          >
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
}

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string;
}

export function Spinner({
  label = 'Loading',
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      {...props}
      className={['vs-spinner', className].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
    />
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  shape?: 'rectangle' | 'circle';
}

export function Skeleton({
  width,
  height,
  shape = 'rectangle',
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <span
      {...props}
      className={[
        'vs-skeleton',
        shape === 'circle' && 'vs-skeleton--circle',
        className
      ].filter(Boolean).join(' ')}
      style={{ ...(width !== undefined ? { width } : {}), ...(height !== undefined ? { height } : {}), ...style }}
      aria-hidden="true"
    />
  );
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  totalPages: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  label?: string;
}

export function Pagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  label = 'Pagination',
  className,
  ...props
}: PaginationProps) {
  const total = Number.isFinite(totalPages) ? Math.max(1, Math.floor(totalPages)) : 1;
  const [uncontrolledPage, setUncontrolledPage] = useState(() => Math.min(total, Math.max(1, defaultPage)));
  const currentPage = Math.min(total, Math.max(1, page ?? uncontrolledPage));
  const pages = Array.from({ length: Math.min(total, 3) }, (_, index) => index + 1);
  if (total > 3) pages.push(total);

  const selectPage = (nextPage: number) => {
    const boundedPage = Math.min(total, Math.max(1, nextPage));
    if (page === undefined) setUncontrolledPage(boundedPage);
    onPageChange?.(boundedPage);
  };

  return (
    <nav
      {...props}
      className={['vs-pagination', className].filter(Boolean).join(' ')}
      aria-label={label}
    >
      <span className="vs-pagination__indicator" aria-live="polite">
        Page <strong>{currentPage}</strong> of {total}
      </span>
      <div className="vs-pagination__pages">
        {pages.map((pageNumber, index) => (
          <span className="vs-pagination__item" key={pageNumber}>
            {total > 4 && index === pages.length - 1 && <span className="vs-pagination__ellipsis" aria-hidden="true">…</span>}
            <button
              type="button"
              className="vs-circle-icon vs-circle-icon--small vs-pagination__page"
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
              onClick={() => selectPage(pageNumber)}
            >
              {pageNumber}
            </button>
          </span>
        ))}
      </div>
    </nav>
  );
}

