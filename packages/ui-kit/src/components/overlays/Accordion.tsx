import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../foundation/Icon';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: AccordionItem[];
  label?: string;
  openItemIds?: string[];
  defaultOpenItemIds?: string[];
  onOpenChange?: (openItemIds: string[]) => void;
}

export function Accordion({
  items,
  label = 'Accordion',
  openItemIds,
  defaultOpenItemIds,
  onOpenChange,
  className,
  ...props
}: AccordionProps) {
  const [uncontrolledOpenIds, setUncontrolledOpenIds] = useState<string[]>(
    () => defaultOpenItemIds ?? (items[0] ? [items[0].id] : [])
  );
  const generatedId = useId();
  const currentOpenIds = openItemIds ?? uncontrolledOpenIds;

  const toggleItem = (itemId: string) => {
    const nextOpenIds = currentOpenIds.includes(itemId)
      ? currentOpenIds.filter((openId) => openId !== itemId)
      : [...currentOpenIds, itemId];

    if (openItemIds === undefined) setUncontrolledOpenIds(nextOpenIds);
    onOpenChange?.(nextOpenIds);
  };

  return (
    <div
      {...props}
      className={['vs-accordion', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
    >
      {items.map((item, index) => {
        const isOpen = currentOpenIds.includes(item.id);
        const triggerId = `vs-accordion-${generatedId}-trigger-${index}`;
        const panelId = `vs-accordion-${generatedId}-panel-${index}`;
        return (
          <section
            className={['vs-accordion__item', isOpen && 'is-open'].filter(Boolean).join(' ')}
            key={item.id}
          >
            <h3 className="vs-accordion__heading">
              <button
                type="button"
                id={triggerId}
                className="vs-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
              >
                <span>{item.title}</span>
                <Icon className="vs-accordion__arrow" size={16}>
                  <polyline points="6 9 12 15 18 9" />
                </Icon>
              </button>
            </h3>
            <div
              id={panelId}
              className="vs-accordion__panel"
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              inert={!isOpen}
            >
              <div className="vs-accordion__content">{item.content}</div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
