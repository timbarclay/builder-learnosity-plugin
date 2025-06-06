import React from 'react';
interface CloudinaryCredentialsDialogProps {
    openDialog: boolean;
    apiKey: string | undefined;
    cloudName: string | undefined;
    closeDialog(): void;
    updateCloudinaryCredentials(apiKey: string, cloudName: string): void;
}
interface CloudinaryCredentialsDialogState {
    apiKey: string;
    cloudName: string;
}
export default class CloudinaryCredentialsDialog extends React.Component<CloudinaryCredentialsDialogProps, CloudinaryCredentialsDialogState> {
    constructor(props: CloudinaryCredentialsDialogProps);
    render(): JSX.Element;
}
export {};
