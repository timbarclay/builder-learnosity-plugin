/** @jsx jsx */
import React from 'react';
import { LearnosityActivity } from './LearnosityActivityPicker';
interface Props {
    value?: any;
    onChange(newValue: LearnosityActivity): void;
    context: any;
}
interface LearnosityEditorState {
    showDialog: boolean;
    initUrl: string | undefined;
    requestCredentials: boolean;
    selectedActivityReference: string | undefined;
}
export default class LearnosityEditor extends React.Component<Props, LearnosityEditorState> {
    get organization(): any;
    get learnosityInitUrl(): string | undefined;
    set learnosityInitUrl(key: string | undefined);
    constructor(props: any);
    private closeDialog;
    private areLearnosityCredentialsNotSet;
    private shouldRequestLearnosityCredentials;
    private updateLearnosityCredentials;
    private calculateChooseActivityButtonVariant;
    private selectActivity;
    buildSelectedIdMessage(): string;
    buildChooseActivityText(): string;
    setCredentialsButtonText(): string;
    render(): JSX.Element;
}
export {};
