export function setTeam(teamId) {
  return {
    type: 'PRESHOW_SET_OVERLAY',
    data: {
      type: 'team',
      teamId,
    }
  };
}

export function setWR(teamId) {
  return {
    type: 'PRESHOW_SET_OVERLAY',
    data: {
      type: 'wr',
      year: 'old'
    }
  };
}

export function clearActiveOverlay() {
  return {
    type: 'PRESHOW_SET_OVERLAY',
    data: {
      type: null,
      year: null,
      teamId: null,
    }
  };
}
