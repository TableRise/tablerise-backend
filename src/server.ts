/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import app from './app';
import ConnectMongoInstance from './support/helpers/ConnectMongoInstance';

const port = process.env.PORT || 3001;

ConnectMongoInstance.connect()
  .then(() => {})
  .catch((e) => e);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
