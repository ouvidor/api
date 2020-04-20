export default (response, file) => {
  // pega a string que estiver depois do "."
  const [extension] = file.extension.match(/[^.]*$/);
  let headerToSet;

  switch (extension) {
    case 'html':
      headerToSet = 'text/html';
      break;
    case 'css':
      headerToSet = 'text/css';
      break;
    case 'gif':
      headerToSet = 'image/gif';
      break;
    case 'jpg':
      headerToSet = 'image/jpeg';
      break;
    case 'png':
      headerToSet = 'image/png';
      break;
    case 'svg':
      headerToSet = 'image/svg+xml';
      break;
    case 'js':
      headerToSet = 'application/javascript';
      break;
    case 'pdf':
      headerToSet = 'application/pdf';
      break;
    case 'ppt':
      headerToSet = 'application/vnd.ms-powerpoint';
      break;
    case 'zip':
      headerToSet = 'application/zip';
      break;
    case 'doc':
      headerToSet = 'application/msword';
      break;
    case '7z':
      headerToSet = 'application/x-7z-compressed';
      break;
    case 'tif':
    case 'tiff':
      headerToSet = 'image/tiff';
      break;

    case 'txt':
    default:
      headerToSet = 'text/plain';
  }

  response.setHeader(
    'Content-Disposition',
    `inline; filename=${file.file_name}`
  );

  response.setHeader('Content-Type', headerToSet);

  return response;
};
