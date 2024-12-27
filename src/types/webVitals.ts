export type MetricType = 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB';

export interface WebVitalsMetric {
  id: string;
  name: MetricType;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}

export type ReportHandler = (metric: WebVitalsMetric) => void;