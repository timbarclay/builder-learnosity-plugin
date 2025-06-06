/** @jsx jsx */
import React from 'react';
interface CloudinaryMediaLibraryDialogProps {
    openDialog: boolean;
    closeDialog(): void;
    selectImage(image: CloudinaryImage): void;
    apiKey: string | undefined;
    cloudName: string | undefined;
}
export interface CloudinaryImage {
    context: any;
    public_id: string;
    url: string;
    tags: any[];
    derived: any[];
}
export declare class CloudinaryMediaLibraryDialog extends React.Component<CloudinaryMediaLibraryDialogProps> {
    private generateNewMediaLibrary;
    private openCloudinaryMediaLibrary;
    private showMediaLibrary;
    private createMediaLibrary;
    private selectImage;
    render(): JSX.Element;
}
export {};
