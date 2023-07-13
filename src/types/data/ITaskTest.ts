export interface TaskTestPayload {
  test_spec: string;
  task_base_type?: string;
  task_base_spec?: string;
}

export interface TaskTestsPayload {
  task_base_type?: string;
  task_base_spec?: string;
}

export interface ITruncatedTaskTest {
  spec: string;
  origin: string;
  creationDate: Date;
  inputData: string;
  outputData: string;
  inputLength: number;
  outputLength: number;
  truncate: number;
  isInputTruncated: boolean;
  isOutputTruncated: boolean;
}
