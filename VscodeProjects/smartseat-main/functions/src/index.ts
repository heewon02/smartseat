import * as admin from "firebase-admin";
admin.initializeApp();

// 랭킹 / 통계
// export { dailyStats } from "./ranking/dailyStats";
// export { monthlyStats } from "./ranking/monthlyStats";
// export { studyLogUpdate } from "./ranking/studyLogUpdate";
// export { updateRankings } from "./ranking/updateRankings";

// 예약 관련
//export { reserveEnd } from "./reservation/reserveEnd";
// export { reserveStart } from "./reservation/reserveStart";

// // 착석, 이탈 관련
export { seatIdle_anomalyCheck } from "./seating/seatIdle_anomalyCheck";
//export { seatStatusChange } from "./seating/seatStatusChange";
export { syncSensorToSeat } from "./seating/syncSensorToSeat";