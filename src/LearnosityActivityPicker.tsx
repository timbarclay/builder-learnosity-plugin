/** @jsx jsx */
import React, { Fragment, useEffect, useState } from 'react';
import { jsx } from '@emotion/core';
import { Dialog, Button, DialogActions } from '@material-ui/core';

interface LearnosityPickerDialogProps {
  openDialog: boolean;
  closeDialog(): void;
  selectActivity(activity: LearnosityActivity): void;
  initUrl: string | undefined;
}

export interface LearnosityActivity {
  reference: string;
}

export function LearnosityActivityPickerDialog(props: LearnosityPickerDialogProps) {
  const [libraryLoaded, setLibraryLoaded] = useState(false)
  const [begunLibraryLoad, setBegunLibraryLoad] = useState(false)
  const [learnosityRequest, setLearnosityRequest] = useState<any>(null)
  const [learnosityRequestBegun, setLearnosityRequestBegun] = useState(false)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (!rendered || begunLibraryLoad) return
    setBegunLibraryLoad(true)

    loadJS('https://authorapi.learnosity.com?v2025.1.LTS', () => {
      console.log('Library loaded')
      setLibraryLoaded(true)
    })
  }, [rendered, begunLibraryLoad])

  useEffect(() => {
    if (learnosityRequestBegun) return
    setLearnosityRequestBegun(true)

    fetch(props.initUrl ?? '', {
      method: 'POST',
      body: JSON.stringify({
        domain: location.hostname,
        request: {
          mode: 'activity_list',
          user: {
            id: 'demos-site',
            firstname: 'Demos',
            lastname: 'User',
            email: 'demos@learnosity.com',
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLearnosityRequest(data.request)
      })
  }, [learnosityRequestBegun])

  useEffect(() => {
    if (!libraryLoaded || !window.LearnosityAuthor) {
      console.log('LearnosityAuthor not loaded')
      return
    }
    if (!learnosityRequest) {
      console.log('learnosityRequest not found')
      return
    }

    console.debug('Initializing LearnosityItems')
    const authorApi = window.LearnosityAuthor.init(learnosityRequest, {
      readyListener: () => {
        console.log('readyListener')

        authorApi.on('open:activity', (event: any) => {
          console.log('open:activity', event.data)
          props.selectActivity(event.data)
        })

        authorApi.on('save:activity:success', (event: any) => {
          props.selectActivity(event.data)
        })
      },
      errorListener: (error: any) => {
        console.error('errorListener', error)
      },
    })
  }, [libraryLoaded, learnosityRequest])
  
  return (
    <Dialog
      open={props.openDialog}
      onClose={props.closeDialog}
      fullWidth={true}
      maxWidth="lg"
      onRendered={() => {
        setRendered(true)
      }}
    >
      <div id="learnosity-author" css={{ height: '90vh' }} />
      <DialogActions>
        <Button autoFocus onClick={props.closeDialog} color="primary">
          Close learnosity
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function loadJS(url: string, callback: () => void) {
  const existingScript = document.getElementById('learnosity-library')
  if (!existingScript) {
    const script = document.createElement('script')
    script.src = url
    script.id = 'learnosity-library'
    document.body.appendChild(script)
    script.onload = () => {
      if (callback) {
        return callback()
      }
      return true
    }
  }
  if (existingScript && callback) {
    return callback()
  }
  return true
}