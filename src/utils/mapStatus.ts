const tournamentMapDict = new Map<number, number>([
  [0, 1],
  [1, 0],
  [2, 2],
]);

export const mapTournamentStatus = (spec: number): number => {
  return tournamentMapDict.get(spec) ?? spec;
};

const assignmentMapDict = new Map<number, number>([
  [0, 1],
  [1, 0],
  [2, 2],
]);

export const mapAssignmentStatus = (spec: number): number => {
  return assignmentMapDict.get(spec) ?? spec;
};
