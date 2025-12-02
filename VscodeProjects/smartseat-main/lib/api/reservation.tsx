import functions from '@react-native-firebase/functions';

export function reserveSeat({ userUid, seatId, subject, seatLabel }) {
  return functions()
    .httpsCallable('reserveSeat')({
      userUid,
      seatId,
      subject,
      seatLabel,
    })
    .then(res => res.data)
    .catch(err => {
      throw new Error(err.message);
    });
}
