System.register(['react', '@emotion/core', '@builder.io/sdk', '@material-ui/core'], (function (exports) {
  'use strict';
  var useState, useEffect, React, jsx, Builder, Dialog, DialogActions, Button, DialogTitle, DialogContent, TextField, Typography;
  return {
    setters: [function (module) {
      useState = module.useState;
      useEffect = module.useEffect;
      React = module["default"];
    }, function (module) {
      jsx = module.jsx;
    }, function (module) {
      Builder = module.Builder;
    }, function (module) {
      Dialog = module.Dialog;
      DialogActions = module.DialogActions;
      Button = module.Button;
      DialogTitle = module.DialogTitle;
      DialogContent = module.DialogContent;
      TextField = module.TextField;
      Typography = module.Typography;
    }],
    execute: (function () {

      /** @jsx jsx */
      function LearnosityActivityPickerDialog(props) {
          const [libraryLoaded, setLibraryLoaded] = useState(false);
          const [begunLibraryLoad, setBegunLibraryLoad] = useState(false);
          const [learnosityRequest, setLearnosityRequest] = useState(null);
          const [learnosityRequestBegun, setLearnosityRequestBegun] = useState(false);
          const [rendered, setRendered] = useState(false);
          useEffect(() => {
              if (!rendered || begunLibraryLoad)
                  return;
              setBegunLibraryLoad(true);
              loadJS('https://authorapi.learnosity.com?v2025.1.LTS', () => {
                  console.log('Library loaded');
                  setLibraryLoaded(true);
              });
          }, [rendered, begunLibraryLoad]);
          useEffect(() => {
              var _a;
              if (learnosityRequestBegun)
                  return;
              setLearnosityRequestBegun(true);
              fetch((_a = props.initUrl, (_a !== null && _a !== void 0 ? _a : '')), {
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
                  setLearnosityRequest(data.request);
              });
          }, [learnosityRequestBegun]);
          useEffect(() => {
              if (!libraryLoaded || !window.LearnosityAuthor) {
                  console.log('LearnosityAuthor not loaded');
                  return;
              }
              if (!learnosityRequest) {
                  console.log('learnosityRequest not found');
                  return;
              }
              console.debug('Initializing LearnosityItems');
              const authorApi = window.LearnosityAuthor.init(learnosityRequest, {
                  readyListener: () => {
                      console.log('readyListener');
                      authorApi.on('open:activity', (event) => {
                          console.log('open:activity', event.data);
                          props.selectActivity(event.data);
                      });
                      authorApi.on('save:activity:success', (event) => {
                          props.selectActivity(event.data);
                      });
                  },
                  errorListener: (error) => {
                      console.error('errorListener', error);
                  },
              });
          }, [libraryLoaded, learnosityRequest]);
          return (jsx(Dialog, { open: props.openDialog, onClose: props.closeDialog, fullWidth: true, maxWidth: "lg", onRendered: () => {
                  setRendered(true);
              } },
              jsx("div", { id: "learnosity-author", css: { height: '90vh' } }),
              jsx(DialogActions, null,
                  jsx(Button, { autoFocus: true, onClick: props.closeDialog, color: "primary" }, "Close learnosity"))));
      }
      function loadJS(url, callback) {
          const existingScript = document.getElementById('learnosity-library');
          if (!existingScript) {
              const script = document.createElement('script');
              script.src = url;
              script.id = 'learnosity-library';
              document.body.appendChild(script);
              script.onload = () => {
                  if (callback) {
                      return callback();
                  }
                  return true;
              };
          }
          if (existingScript && callback) {
              return callback();
          }
          return true;
      }

      /** @jsx jsx */
      class LearnosityCredentialsDialog extends React.Component {
          constructor(props) {
              super(props);
              this.state = {
                  initUrl: this.props.initUrl ? this.props.initUrl : '',
              };
          }
          render() {
              return (jsx("div", null,
                  jsx(Dialog, { open: this.props.openDialog, onClose: this.props.closeDialog },
                      jsx(DialogTitle, null, "Learnosity credentials setup"),
                      jsx(DialogContent, null,
                          jsx(TextField, { value: this.state.initUrl, onChange: (e) => this.setState({ initUrl: e.target.value }), id: "apiKey", label: "Initialisation URL", helperText: "An API endpoint that will return a Learnosity request JSON object", margin: "normal", autoComplete: "off" })),
                      jsx(DialogActions, null,
                          jsx(Button, { onClick: this.props.closeDialog, color: "primary" }, "Close"),
                          jsx(Button, { onClick: () => {
                                  this.props.updateLearnosityCredentials(this.state.initUrl);
                                  this.props.closeDialog();
                              }, color: "primary", variant: "contained" }, "Save")))));
          }
      }

      /** @jsx jsx */
      class LearnosityEditor extends React.Component {
          get organization() {
              return this.props.context.user.organization;
          }
          get learnosityInitUrl() {
              return this.organization.value.settings.plugins.get('learnosityInitUrl');
          }
          set learnosityInitUrl(key) {
              this.organization.value.settings.plugins.set('learnosityInitUrl', key);
              this.organization.save();
          }
          constructor(props) {
              super(props);
              this.state = {
                  requestCredentials: false,
                  showDialog: false,
                  initUrl: this.learnosityInitUrl ? this.learnosityInitUrl : '',
                  selectedActivityReference: props.value && props.value.get && props.value.get('reference')
                      ? props.value.get('reference')
                      : '',
              };
          }
          closeDialog() {
              this.setState({
                  requestCredentials: false,
                  showDialog: false,
              });
          }
          areLearnosityCredentialsNotSet() {
              return (this.state.initUrl === '' ||
                  this.state.initUrl === undefined);
          }
          shouldRequestLearnosityCredentials() {
              return this.state.requestCredentials || this.areLearnosityCredentialsNotSet();
          }
          updateLearnosityCredentials(initUrl) {
              this.learnosityInitUrl = initUrl;
              this.setState({
                  initUrl: this.learnosityInitUrl,
              });
          }
          calculateChooseActivityButtonVariant() {
              return this.areLearnosityCredentialsNotSet() ? 'contained' : 'text';
          }
          selectActivity(activity) {
              this.props.onChange(activity);
              this.setState({ selectedActivityReference: activity.reference });
          }
          buildSelectedIdMessage() {
              if (this.state.selectedActivityReference) {
                  return `Activity reference: ${this.state.selectedActivityReference}`;
              }
              return 'Please choose an activity';
          }
          buildChooseActivityText() {
              if (this.state.selectedActivityReference) {
                  return `UPDATE ACTIVITY`;
              }
              return 'CHOOSE ACTIVITY';
          }
          setCredentialsButtonText() {
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
              return (jsx("div", { css: { padding: '15px 0' } },
                  jsx(Typography, { variant: "caption" }, "Learnosity activity picker"),
                  shouldRequestLearnositySettings && (jsx(LearnosityCredentialsDialog, { openDialog: this.state.showDialog, closeDialog: this.closeDialog.bind(this), updateLearnosityCredentials: this.updateLearnosityCredentials.bind(this), initUrl: this.state.initUrl })),
                  !shouldRequestLearnositySettings && (jsx(LearnosityActivityPickerDialog, { openDialog: this.state.showDialog, closeDialog: this.closeDialog.bind(this), selectActivity: this.selectActivity.bind(this), initUrl: this.state.initUrl })),
                  jsx("div", { css: buttonContainerStyle },
                      jsx(Button, { disabled: this.areLearnosityCredentialsNotSet(), color: "primary", variant: "contained", onClick: () => {
                              this.setState({
                                  showDialog: !this.state.showDialog,
                              });
                          } }, chooseActivityButtonText),
                      jsx(Button, { variant: setCredentialsButtonVariant, color: "primary", onClick: () => {
                              this.setState({
                                  requestCredentials: true,
                                  showDialog: !this.state.showDialog,
                              });
                          } }, setCredentialsButtonText)),
                  jsx("div", null,
                      jsx(Typography, { css: { margin: '5px' }, variant: "caption" }, selectedActivityReferenceMessage))));
          }
      } exports('default', LearnosityEditor);
      Builder.registerEditor({
          name: 'learnosityEditor',
          component: LearnosityEditor,
      });

    })
  };
}));
//# sourceMappingURL=plugin-learnosity.system.js.map
