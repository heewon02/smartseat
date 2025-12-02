"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = saveAdminToken;
const messaging_1 = require("@react-native-firebase/messaging");
const app_1 = require("@react-native-firebase/app");
const firestore_1 = __importDefault(require("@react-native-firebase/firestore"));
// export default async function saveAdminToken(userId) {
//   const token = await messaging().getToken();
//   await firestore()
//     .collection('users')
//     .doc(userId)
//     .update({
//       fcmToken: token,
//       isadmin: true,
//     });
//   console.log("관리자 토큰 저장 완료:", token);
// }
async function saveAdminToken(userId) {
    const app = (0, app_1.getApp)();
    const messaging = (0, messaging_1.getMessaging)(app);
    const token = await (0, messaging_1.getToken)(messaging);
    await (0, firestore_1.default)()
        .collection('users')
        .doc(userId)
        .update({
        fcmToken: token,
        isadmin: true,
    });
    console.log("관리자 토큰 저장 완료:", token);
}
//# sourceMappingURL=saveAdminToken.js.map