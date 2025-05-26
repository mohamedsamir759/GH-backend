const { emitter } = require('./emitter');
const {
  CONSTANTS,
} = require('src/common/data');
const {
  logsService,
  dLogsService,
} = require('src/modules/services');

const {
  EVENT_TYPES,
} = CONSTANTS;

emitter.on(EVENT_TYPES.EVENT_LOG, (eventData) => {
  // eslint-disable-next-line no-console
  const {
    type,
    data,
    demo = false,
  } = eventData;
  const {
    customerId,
    userId,
    triggeredBy,
    level,
    userLog,
    details,
    content,
  } = data;
  if (demo) {
    dLogsService.addLog(
      type,
      customerId,
      userId,
      triggeredBy,
      userLog,
      level,
      details,
      content,
    );
  } else {
    logsService.addLog(
      type,
      customerId,
      userId,
      triggeredBy,
      userLog,
      level,
      details,
      content,
    );
  }
});
