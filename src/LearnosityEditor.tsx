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
});
