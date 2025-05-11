export const attempt = {
  date: 'Date',
  task: 'Task',
  language: 'Language',
  result: 'Result',
  aiProbability: 'AI probability',
  verdict: 'Verdict',
  status: 'Status',
  banReason: 'Ban reason',
  author: 'User',
  notAllowed: 'You not allowed to see this attempt',
  constraints: {
    time: 'Time constraint',
    memory: 'Memory constraint',
  },
  time: 'Time',
  memory: 'Memory',
  test: 'Test',
  statuses: ['Pending', 'Testing', 'Finished', 'Banned'],
  pages: {
    info: 'Information',
    code: 'Payload',
  },
  ban: {
    title: 'Ban attempt',
    action: 'Ban',
    reason: 'Ban reason',
    request: {
      loading: 'Loading...',
      success: 'Attempt was successfully banned',
      error: 'Error during attempt ban',
    },
    validation: {
      reason: {
        tooShort: 'Reason is too short',
      },
    },
  },
  unban: {
    title: 'Unban attempt',
    action: 'Unban',
    previousBanDate: 'Ban date:',
    previousBanRequester: 'Initiator:',
    previousBanReason: 'Reason:',
    request: {
      loading: 'Loading...',
      success: 'Attempt was successfully unbanned',
      error: 'Error during attempt unban',
    },
  },
  aiGenerated: {
    markAsAIGenerated: 'Mark as AI generated',
    markAsNotAIGenerated: 'Mark as not AI generated',
    modalConfirmAction: 'Confirm action',
    banConfirmation:
      'Are you sure you want to mark this attempt as AI generated?',
    unbanConfirmation:
      'Are you sure you want to mark this attempt as not AI generated?',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
};
