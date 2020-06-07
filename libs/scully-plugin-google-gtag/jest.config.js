module.exports = {
  name: 'scully-plugin-google-gtag',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/scully-plugin-google-gtag',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
