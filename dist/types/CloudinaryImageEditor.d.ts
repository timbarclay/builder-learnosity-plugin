/** @jsx jsx */
import React from 'react';
import { CloudinaryImage } from './CloudinaryMediaLibraryDialog';
interface Props {
    value?: any;
    onChange(newValue: CloudinaryImage): void;
    context: any;
}
interface CloudinaryImageEditorState {
    showDialog: boolean;
    apiKey: string | undefined;
    cloudName: string | undefined;
    requestCredentials: boolean;
    selectedImagePublicId: string | undefined;
}
export default class CloudinaryImageEditor extends React.Component<Props, CloudinaryImageEditorState> {
    get organization(): any;
    get cloudinaryCloud(): string | undefined;
    set cloudinaryCloud(cloud: string | undefined);
    get cloudinaryKey(): string | undefined;
    set cloudinaryKey(key: string | undefined);
    constructor(props: any);
    private closeDialog;
    private appendMediaLibraryScriptToPlugin;
    private areCloudinaryCredentialsNotSet;
    private shouldRequestCloudinaryCredentials;
    private updateCloudinaryCredentials;
    private calculateChooseImageButtonVariant;
    private selectImage;
    buildSelectedIdMessage(): string;
    buildChooseImageText(): string;
    setCredentialsButtonText(): string;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
