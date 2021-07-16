import { atom } from "recoil";

const stateKeys = {
  sessionState: "sessionState",
};

const sessionState = atom({
  key: stateKeys.sessionState,
  default: {
    toast: null,
  },
});

export { sessionState, stateKeys };
