import { CSSProperties, RefObject, Dispatch, SetStateAction } from "react";

type StateRestorer = {
    referenceValue: string;
    restore: (referenceValue: string) => void;
}


export type OverlayPageWrapperProps = {
    children?: React.ReactNode;
    visible: boolean;
    backHeaderText: string;
    onClose: () => void;
    stateRestorers: StateRestorer[];
    storageName: string;
    backHeaderClassName?: string;
    backHeaderStyle?: CSSProperties;
    backHeaderTextClassName?: string;
    backHeaderTextStyle?: CSSProperties;
    arrowClassName?: string;
    arrowColor?: string;
    transition?: boolean;
}


export type UseNavigationSyncOptions = {
    visible: boolean,
    overlayVisible: boolean,
    closeOverlayProperly: () => void,
    stateRestorers: StateRestorer[],
    storageName: string,
    ignoreNextTransitionRef: RefObject<boolean>,
    setForceVisible: Dispatch<SetStateAction<boolean>>,
    windowScrollRef: RefObject<Number>,
}



export type UseUrlChangeRestoreOptions = {
    visible: boolean,
    stateRestorers: StateRestorer[],
    storageName: string,
    updatedStateRestorersRef: RefObject<boolean>,
    setForceVisible: Dispatch<SetStateAction<boolean>>
    pushedDummyEntryRef: RefObject<boolean>,
    ignoreNextTransitionRef: RefObject<boolean>,
    windowScrollRef: RefObject<Number>,
}