System.register(['react', '@emotion/core', '@builder.io/sdk', '@material-ui/core'], (function (exports) {
  'use strict';
  var React, Fragment, jsx, Builder, Dialog, DialogActions, Button, DialogTitle, DialogContent, TextField, Typography;
  return {
    setters: [function (module) {
      React = module["default"];
      Fragment = module.Fragment;
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
      class CloudinaryMediaLibraryDialog extends React.Component {
          generateNewMediaLibrary() {
              let mediaLibrary;
              const newWindow = window;
              if (newWindow.cloudinary) {
                  mediaLibrary = this.createMediaLibrary(mediaLibrary, newWindow);
              }
              return mediaLibrary;
          }
          openCloudinaryMediaLibrary() {
              const mediaLibrary = this.generateNewMediaLibrary();
              this.showMediaLibrary(mediaLibrary);
          }
          showMediaLibrary(mediaLibrary) {
              if (mediaLibrary) {
                  mediaLibrary.show({
                      multiple: false,
                      max_files: 1,
                  });
              }
          }
          createMediaLibrary(mediaLibrary, newWindow) {
              mediaLibrary = newWindow.cloudinary.createMediaLibrary({
                  cloud_name: this.props.cloudName ? this.props.cloudName : '',
                  api_key: this.props.apiKey ? this.props.apiKey : '',
                  inline_container: '.cloudinaryContainer',
              }, {
                  insertHandler: (data) => {
                      this.selectImage(Object.assign({}, data.assets[0]));
                  },
              });
              return mediaLibrary;
          }
          selectImage(cloudinaryData) {
              this.props.selectImage(cloudinaryData);
              this.props.closeDialog();
          }
          render() {
              return (jsx(Fragment, null,
                  jsx(Dialog, { open: this.props.openDialog, onClose: this.props.closeDialog, fullWidth: true, maxWidth: "lg", onRendered: () => {
                          this.openCloudinaryMediaLibrary();
                      } },
                      jsx("div", { className: "cloudinaryContainer", css: { height: '90vh' } }),
                      jsx(DialogActions, null,
                          jsx(Button, { autoFocus: true, onClick: this.props.closeDialog, color: "primary" }, "Close media library")))));
          }
      }

      /** @jsx jsx */
      class CloudinaryCredentialsDialog extends React.Component {
          constructor(props) {
              super(props);
              this.state = {
                  apiKey: this.props.apiKey ? this.props.apiKey : '',
                  cloudName: this.props.cloudName ? this.props.cloudName : '',
              };
          }
          render() {
              return (jsx("div", null,
                  jsx(Dialog, { open: this.props.openDialog, onClose: this.props.closeDialog },
                      jsx(DialogTitle, null, "Cloudinary credentials setup"),
                      jsx(DialogContent, null,
                          jsx(TextField, { value: this.state.apiKey, onChange: (e) => this.setState({ apiKey: e.target.value }), id: "apiKey", label: "API key", helperText: "You just have to setup the API key once and it will be linked to your organization", margin: "normal", autoComplete: "off" }),
                          jsx(TextField, { value: this.state.cloudName, onChange: (e) => this.setState({ cloudName: e.target.value }), id: "cloudName", label: "Cloud name", helperText: "You just have to setup the cloud name once and it will be linked to your organization", margin: "normal", autoComplete: "off" })),
                      jsx(DialogActions, null,
                          jsx(Button, { onClick: this.props.closeDialog, color: "primary" }, "Close"),
                          jsx(Button, { onClick: () => {
                                  this.props.updateCloudinaryCredentials(this.state.apiKey, this.state.cloudName);
                                  this.props.closeDialog();
                              }, color: "primary", variant: "contained" }, "Save")))));
          }
      }

      /** @jsx jsx */
      class CloudinaryImageEditor extends React.Component {
          get organization() {
              return this.props.context.user.organization;
          }
          get cloudinaryCloud() {
              return this.organization.value.settings.plugins.get('cloudinaryCloud');
          }
          set cloudinaryCloud(cloud) {
              this.organization.value.settings.plugins.set('cloudinaryCloud', cloud);
              this.organization.save();
          }
          get cloudinaryKey() {
              return this.organization.value.settings.plugins.get('cloudinaryKey');
          }
          set cloudinaryKey(key) {
              this.organization.value.settings.plugins.set('cloudinaryKey', key);
              this.organization.save();
          }
          constructor(props) {
              super(props);
              this.state = {
                  requestCredentials: false,
                  showDialog: false,
                  apiKey: this.cloudinaryKey ? this.cloudinaryKey : '',
                  cloudName: this.cloudinaryCloud ? this.cloudinaryCloud : '',
                  selectedImagePublicId: props.value && props.value.get && props.value.get('public_id')
                      ? props.value.get('public_id')
                      : '',
              };
          }
          closeDialog() {
              this.setState({
                  requestCredentials: false,
                  showDialog: false,
              });
          }
          appendMediaLibraryScriptToPlugin() {
              const previousScript = document.getElementById('cloudinaryScript');
              if (!previousScript) {
                  const script = document.createElement('script');
                  script.async = true;
                  script.src = `https://media-library.cloudinary.com/global/all.js`;
                  script.id = 'cloudinaryScript';
                  document.head.appendChild(script);
              }
          }
          areCloudinaryCredentialsNotSet() {
              return (this.state.apiKey === '' ||
                  this.state.cloudName === '' ||
                  this.state.apiKey === undefined ||
                  this.state.cloudName === undefined);
          }
          shouldRequestCloudinaryCredentials() {
              return this.state.requestCredentials || this.areCloudinaryCredentialsNotSet();
          }
          updateCloudinaryCredentials(apiKey, cloudName) {
              this.cloudinaryKey = apiKey;
              this.cloudinaryCloud = cloudName;
              this.setState({
                  apiKey: this.cloudinaryKey,
                  cloudName: this.cloudinaryCloud,
              });
          }
          calculateChooseImageButtonVariant() {
              return this.areCloudinaryCredentialsNotSet() ? 'contained' : 'text';
          }
          selectImage(image) {
              this.props.onChange(image);
              this.setState({ selectedImagePublicId: image.public_id });
          }
          buildSelectedIdMessage() {
              if (this.state.selectedImagePublicId) {
                  return `Public id: ${this.state.selectedImagePublicId}`;
              }
              return 'Please choose an image';
          }
          buildChooseImageText() {
              if (this.state.selectedImagePublicId) {
                  return `UPDATE IMAGE`;
              }
              return 'CHOOSE IMAGE';
          }
          setCredentialsButtonText() {
              return this.areCloudinaryCredentialsNotSet() ? 'Set credentials' : '...';
          }
          componentDidMount() {
              this.appendMediaLibraryScriptToPlugin();
          }
          render() {
              const shouldRequestCloudinarySettings = this.shouldRequestCloudinaryCredentials();
              const setCredentialsButtonVariant = this.calculateChooseImageButtonVariant();
              const selectedPublicIdMessage = this.buildSelectedIdMessage();
              const chooseImageButtonText = this.buildChooseImageText();
              const setCredentialsButtonText = this.setCredentialsButtonText();
              const buttonContainerStyle = {
                  display: 'grid',
                  gap: '10px',
                  gridTemplateColumns: '1fr max-content',
                  marginTop: '5px',
                  marginBottom: '5px',
              };
              return (jsx("div", { css: { padding: '15px 0' } },
                  jsx(Typography, { variant: "caption" }, "Cloudinary image picker"),
                  shouldRequestCloudinarySettings && (jsx(CloudinaryCredentialsDialog, { openDialog: this.state.showDialog, closeDialog: this.closeDialog.bind(this), updateCloudinaryCredentials: this.updateCloudinaryCredentials.bind(this), apiKey: this.state.apiKey, cloudName: this.state.cloudName })),
                  !shouldRequestCloudinarySettings && (jsx(CloudinaryMediaLibraryDialog, { openDialog: this.state.showDialog, closeDialog: this.closeDialog.bind(this), selectImage: this.selectImage.bind(this), apiKey: this.state.apiKey, cloudName: this.state.cloudName })),
                  jsx("div", { css: buttonContainerStyle },
                      jsx(Button, { disabled: this.areCloudinaryCredentialsNotSet(), color: "primary", variant: "contained", onClick: () => {
                              this.setState({
                                  showDialog: !this.state.showDialog,
                              });
                          } }, chooseImageButtonText),
                      jsx(Button, { variant: setCredentialsButtonVariant, color: "primary", onClick: () => {
                              this.setState({
                                  requestCredentials: true,
                                  showDialog: !this.state.showDialog,
                              });
                          } }, setCredentialsButtonText)),
                  jsx("div", null,
                      jsx(Typography, { css: { margin: '5px' }, variant: "caption" }, selectedPublicIdMessage))));
          }
      } exports('default', CloudinaryImageEditor);
      Builder.registerEditor({
          name: 'learnosityEditor',
          component: CloudinaryImageEditor,
      });

    })
  };
}));
//# sourceMappingURL=plugin-learnosity.system.js.map
