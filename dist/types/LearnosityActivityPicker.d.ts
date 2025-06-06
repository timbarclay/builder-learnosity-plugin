/// <reference types="react" />
interface LearnosityPickerDialogProps {
    openDialog: boolean;
    closeDialog(): void;
    selectActivity(activity: LearnosityActivity): void;
    initUrl: string | undefined;
}
export interface LearnosityActivity {
    reference: string;
}
export declare function LearnosityActivityPickerDialog(props: LearnosityPickerDialogProps): JSX.Element;
export declare function loadJS(url: string, callback: () => void): true | void;
export {};
