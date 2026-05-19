import { IVerdict } from "@custom-types/data/atomic";

export const VerdictValues: IVerdict[] = [
  {
    spec: 0,
    fullText: "Accepted",
    shortText: "OK",
  },
  {
    spec: 1,
    fullText: "Time Limit",
    shortText: "TL",
  },
  {
    spec: 2,
    fullText: "Wrong Answer",
    shortText: "WA",
  },
  {
    spec: 3,
    fullText: "Compilation Error",
    shortText: "CE",
  },
  {
    spec: 4,
    fullText: "Runtime Error",
    shortText: "RE",
  },
  {
    spec: 5,
    fullText: "Server Error",
    shortText: "SE",
  },
  {
    spec: 6,
    fullText: "Not Tested",
    shortText: "NT",
  },
  {
    spec: 7,
    fullText: "Memory Limit Exceeded",
    shortText: "ML",
  },
  {
    spec: 8,
    fullText: "Checker Error",
    shortText: "CH",
  },
];
