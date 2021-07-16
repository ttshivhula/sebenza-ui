import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const stateKeys = {
  userState: "userState",
};

const userState = atom({
  key: stateKeys.userState,
  default: {
    token: null,
    user: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export { userState, stateKeys };
