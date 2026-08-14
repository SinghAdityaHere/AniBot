export interface MetricEvent {
  metric: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: string;
}

export class MetricsService {
  private static metrics: MetricEvent[] = [];

  public static track(metric: string, value = 1, tags?: Record<string, string>): void {
    const event: MetricEvent = {
      metric,
      value,
      tags,
      timestamp: new Date().toISOString(),
    };
    this.metrics.push(event);

    if (this.metrics.length > 500) {
      this.metrics.shift();
    }

    console.log(`[Metric] ${metric}=${value}`, tags ? JSON.stringify(tags) : '');
  }

  public static getMetrics(): MetricEvent[] {
    return [...this.metrics];
  }
}
