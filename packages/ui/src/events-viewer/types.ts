export interface CriticalEvent {
  id: string | number;
  time: string;
  coordinates: string;
  type: string;
  city: string;
  count: number;
  severity: string;
  description?: string;
  expectedEndTime?: string;
  affectedDirection?: string;
  dataSourceId?: string;
}

export interface TableColumn {
  key: keyof CriticalEvent;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, event: CriticalEvent) => React.ReactNode;
}

export interface CriticalEventsTableConfig {
  columns: TableColumn[];
  title?: string;
  emptyMessage?: string;
  onRowClick?: (event: CriticalEvent) => void;
}

