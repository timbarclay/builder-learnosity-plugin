/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import {
  Dialog,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
} from '@material-ui/core';

interface LearnosityCredentialsDialogProps {
  openDialog: boolean;
  initUrl: string | undefined;
  closeDialog(): void;
  updateLearnosityCredentials(initUrl: string): void;
}

interface LearnosityCredentialsDialogState {
  initUrl: string;
}

export default class LearnosityCredentialsDialog extends React.Component<
  LearnosityCredentialsDialogProps,
  LearnosityCredentialsDialogState
> {
  constructor(props: LearnosityCredentialsDialogProps) {
    super(props);
    this.state = {
      initUrl: this.props.initUrl ? this.props.initUrl : '',
    };
  }

  render() {
    return (
      <div>
        <Dialog open={this.props.openDialog} onClose={this.props.closeDialog}>
          <DialogTitle>Learnosity credentials setup</DialogTitle>
          <DialogContent>
            <TextField
              value={this.state.initUrl}
              onChange={(e: any) => this.setState({ initUrl: e.target.value })}
              id="apiKey"
              label="Initialisation URL"
              helperText="An API endpoint that will return a Learnosity request JSON object"
              margin="normal"
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.closeDialog} color="primary">
              Close
            </Button>
            <Button
              onClick={() => {
                this.props.updateLearnosityCredentials(this.state.initUrl);
                this.props.closeDialog();
              }}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
