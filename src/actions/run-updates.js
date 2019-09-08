export function receiveRunUpdate(data) {
  const {
    run_id: runId,
    type,
    id: updateId,
    extra
  } = data;

  return {
    type: 'RECEIVE_RUN_UPDATE',
    data: {
      runId,
      type,
      updateId,
      extra
    }
  };
}

export function runUpdateHandled(updateId) {
  return {
    type: 'RUN_UPDATE_HANDLED',
    data: {
      updateId,
    }
  };
}
