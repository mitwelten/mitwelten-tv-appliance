export interface StackQuery {
  deployment_id: number;
  period: {
    start: string;
    end: string;
  };
  interval: number;
}
