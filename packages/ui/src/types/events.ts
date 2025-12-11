export type EventSeverity = 'Critical' | 'Warning' | 'Info';
export type EventType = 'Work Zone' | 'Road Closure' | 'Construction' | 'Accident' | 'Weather';

export interface CriticalEvent {
  id: string;
  time: string;
  coordinates: string;
  type: EventType;
  city: string;
  count: number;
  severity: EventSeverity;
  description?: string;
  expectedEndTime?: string;
  affectedDirection?: string;
  dataSourceId?: string;
}

export interface CriticalEventsTableConfig {
  columns: TableColumn[];
  title?: string;
  emptyMessage?: string;
  onRowClick?: (event: CriticalEvent) => void;
}

export interface TableColumn {
  key: keyof CriticalEvent;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, event: CriticalEvent) => React.ReactNode;
}

export interface CollapsiblePanelConfig {
  title: string;
  initialExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  maxHeight?: string;
  collapsedHeight?: string;
}
