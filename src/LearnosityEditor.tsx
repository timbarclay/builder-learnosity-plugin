/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { Builder } from '@builder.io/sdk';
import { Typography, Button } from '@material-ui/core';
import { LearnosityActivityPickerDialog, LearnosityActivity } from './LearnosityActivityPicker';
import LearnosityCredentialsDialog from './LearnosityCredentialsDialog';

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

type ButtonVariant = 'text' | 'contained';

export default class LearnosityEditor extends React.Component<
  Props,
  LearnosityEditorState
> {
  get organization() {
    return this.props.context.user.organization;
  }

  get learnosityInitUrl(): string | undefined {
    return this.organization.value.settings.plugins.get('learnosityInitUrl');
  }

  set learnosityInitUrl(key: string | undefined) {
    this.organization.value.settings.plugins.set('learnosityInitUrl', key);
    this.organization.save();
  }

  constructor(props: any) {
    super(props);

    this.state = {
      requestCredentials: false,
      showDialog: false,
      initUrl: this.learnosityInitUrl ? this.learnosityInitUrl : '',
      selectedActivityReference:
        props.value && props.value.get && props.value.get('reference')
          ? props.value.get('reference')
          : '',
    };
  }

  private closeDialog() {
    this.setState({
      requestCredentials: false,
      showDialog: false,
    });
  }

  private areLearnosityCredentialsNotSet(): boolean {
    return (
      this.state.initUrl === '' ||
      this.state.initUrl === undefined
    );
  }

  private shouldRequestLearnosityCredentials() {
    return this.state.requestCredentials || this.areLearnosityCredentialsNotSet();
  }

  private updateLearnosityCredentials(initUrl: string) {
    this.learnosityInitUrl = initUrl;
    this.setState({
      initUrl: this.learnosityInitUrl,
    });
  }

  private calculateChooseActivityButtonVariant(): ButtonVariant {
    return this.areLearnosityCredentialsNotSet() ? 'contained' : 'text';
  }

  private selectActivity(activity: LearnosityActivity) {
    this.props.onChange(activity);
    this.setState({ selectedActivityReference: activity.reference });
  }

  buildSelectedIdMessage(): string {
    if (this.state.selectedActivityReference) {
      return `Activity reference: ${this.state.selectedActivityReference}`;
    }

    return 'Please choose an activity';
  }

  buildChooseActivityText(): string {
    if (this.state.selectedActivityReference) {
      return `UPDATE ACTIVITY`;
    }

    return 'CHOOSE ACTIVITY';
  }

  setCredentialsButtonText(): string {
    return this.areLearnosityCredentialsNotSet() ? 'Set credentials' : '...';
  }

  render() {
    const shouldRequestLearnositySettings = this.shouldRequestLearnosityCredentials();
    const setCredentialsButtonVariant = this.calculateChooseActivityButtonVariant();
    const selectedActivityReferenceMessage = this.buildSelectedIdMessage();
    const chooseActivityButtonText = this.buildChooseActivityText();
    const setCredentialsButtonText = this.setCredentialsButtonText();
    const buttonContainerStyle = {
      display: 'grid',
      gap: '10px',
      gridTemplateColumns: '1fr max-content',
      marginTop: '5px',
      marginBottom: '5px',
    };
    return (
      <div css={{ padding: '15px 0' }}>
        <Typography variant="caption">Learnosity activity picker</Typography>
        {shouldRequestLearnositySettings && (
          <LearnosityCredentialsDialog
            openDialog={this.state.showDialog}
            closeDialog={this.closeDialog.bind(this)}
            updateLearnosityCredentials={this.updateLearnosityCredentials.bind(this)}
            initUrl={this.state.initUrl}
          />
        )}
        {!shouldRequestLearnositySettings && (
          <LearnosityActivityPickerDialog
            openDialog={this.state.showDialog}
            closeDialog={this.closeDialog.bind(this)}
            selectActivity={this.selectActivity.bind(this)}
            initUrl={this.state.initUrl}
          />
        )}

        <div css={buttonContainerStyle}>
          <Button
            disabled={this.areLearnosityCredentialsNotSet()}
            color="primary"
            variant="contained"
            onClick={() => {
              this.setState({
                showDialog: !this.state.showDialog,
              });
            }}
          >
            {chooseActivityButtonText}
          </Button>

          <Button
            variant={setCredentialsButtonVariant}
            color="primary"
            onClick={() => {
              this.setState({
                requestCredentials: true,
                showDialog: !this.state.showDialog,
              });
            }}
          >
            {setCredentialsButtonText}
          </Button>
        </div>
        <div>
          <Typography css={{ margin: '5px' }} variant="caption">
            {selectedActivityReferenceMessage}
          </Typography>
        </div>
      </div>
    );
  }
}

Builder.registerEditor({
  name: 'learnosityEditor',
  component: LearnosityEditor,
  icon: 'data:image/png;base64,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'
});
