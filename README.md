# Mongoose Translation Plugin Demo

This is a demo of the Mongoose Translation Plugin running on [StackBlitz](https://stackblitz.com/edit/stackblitz-starters-gyh8zv).

## License

This project is licensed under the [AGPL-3.0 License](LICENSE.md).

## Usage

The project requires you to setup a MongoDB database and a Google Cloud Translation API key.

In your Stackblitz profile, setup the following environment variables:

- `MONGODB_HOST`
- `MONGODB_USER`
- `MONGODB_PWD`
- `MONGODB_BASE`
- `GOOGLE_API_KEY` or/and `DEEPL_API_KEY`

If you run localy, you can setup the environment variables in your `.env` file.
You can also set the `PORT` environment variable to the port you want to run the server on (default is `3000`).
