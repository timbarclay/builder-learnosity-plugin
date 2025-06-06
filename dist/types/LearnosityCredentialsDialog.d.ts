import React from 'react';
interface LearnosityCredentialsDialogProps {
    openDialog: boolean;
    initUrl: string | undefined;
    closeDialog(): void;
    updateLearnosityCredentials(initUrl: string): void;
}
interface LearnosityCredentialsDialogState {
    initUrl: string;
}
export default class LearnosityCredentialsDialog extends React.Component<LearnosityCredentialsDialogProps, LearnosityCredentialsDialogState> {
    constructor(props: LearnosityCredentialsDialogProps);
    render(): JSX.Element;
}
export {};
