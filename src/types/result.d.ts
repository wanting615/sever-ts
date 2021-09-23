export interface Result {
  message: string;
  status: boolean;
  data: any;
  [propName: string]: any;
}