export interface ITaskTestPayload {
  test_spec: string;
  task_base_type?: string;
  task_base_spec?: string;
}

export interface ITaskTestsPayload {
  task_base_type: string;
  task_base_spec: string;
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
