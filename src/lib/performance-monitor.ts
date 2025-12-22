// Performance monitoring utilities - placeholder for now
export const performanceMonitor = {
  start: () => '',
  end: () => ({ name: '', duration: 0, timestamp: 0 }),
  record: () => ({ name: '', duration: 0, timestamp: 0 }),
};

export function measureRender(_componentName: string, renderFunction: () => any): any {
  return renderFunction();
}

export function measureAPI(_apiName: string, apiFunction: () => Promise<any>): Promise<any> {
  return apiFunction();
}

export function startMeasure(_metricName: string): string {
  return '';
}

export function endMeasure(_id: string, _metadata?: Record<string, any>): any {
  return { name: '', duration: 0, timestamp: 0 };
}