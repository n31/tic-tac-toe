import React from 'react';

const HTML = (props) => (
  <html lang="en">
    <head>
      <title>TicTacToe-Tiles</title>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossorigin="anonymous"
      />
      <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <div
        id="root"
        dangerouslySetInnerHTML={{ __html: props.html }}
      />
      <script dangerouslySetInnerHTML={{
          __html:
            `window.__SERIALIZED_STATE__ =
              JSON.stringify(${props.serverState})`
        }}
      />
    <script type="application/javascript" src="/main.bundle.js" />
    </body>
  </html>
);

export default HTML;