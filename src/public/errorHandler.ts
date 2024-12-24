export const renderHtmlError = (err: Error): string => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const stackTraceString = err.stack?.replace(/\n/g, `<br>${softTab}`);
  const stackTraceStyle =
    'color: rgb(256, 128, 128); background-color: rgb(41, 0, 0); border: solid 1px rgb(92, 0, 0);';
  const errTrace = stackTraceString
    ? `<br><br><pre style="${stackTraceStyle}">${softTab}${stackTraceString}</pre>`
    : '';
  return `
    <!doctype html>
    <html lang="en">
        <head>
          <title>An error has occured</title>
        </head>
        <body style="color: white; background-color: rgb(31, 31, 31)">
            <h1>${err.message}</h1>
            ${errTrace}
        </body>
    </html>`;
};
