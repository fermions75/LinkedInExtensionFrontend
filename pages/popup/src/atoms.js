import { atom } from "recoil";

export const PAGES={
    HOME: "HOME",
    LOGIN: "LOGIN",
    LOADING: "LOADING",
}

export const navigationAtom = atom({
    key: "navigationState",
    default: PAGES.LOADING
});

