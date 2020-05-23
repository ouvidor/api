import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../config/multer';
import authMiddleware from '../middlewares/auth';
import FileValidator from '../middlewares/validators/File';

import setResponseHeaders from '../utils/setResponseHeaders';

import fetchFiles from '../services/File/fetch';
import getFile from '../services/File/get';
import saveFiles from '../services/File/save';
import deleteFile from '../services/File/delete';
import createRemoteFileErrorResolver from '../services/File/createRemoteFileErrorResolver';

const filesRoutes = Router();

// o multer faz as tratativas necessárias para utilizarmos upload
const upload = multer(multerConfig);

filesRoutes.use(authMiddleware);

filesRoutes.get(
  '/manifestation/:manifestation_id',
  async (request, response) => {
    const { manifestation_id } = request.params;
    const { user_role, user_id } = request;

    const files = await fetchFiles({
      manifestationId: manifestation_id,
      userId: user_id,
      userRoleId: user_role.id,
    });

    return response.status(200).json(files);
  }
);

filesRoutes.get('/:file_id', FileValidator.show, async (request, response) => {
  const { file_id } = request.params;
  const { user_role, user_id } = request;

  const { remoteFile, localFile } = await getFile({
    fileId: file_id,
    userId: user_id,
    userRoleId: user_role.id,
  });

  const responseWithHeader = setResponseHeaders(response, localFile);
  const remoteFileErrorResolver = createRemoteFileErrorResolver(localFile);

  return remoteFile
    .createReadStream()
    .on('error', remoteFileErrorResolver)
    .pipe(responseWithHeader);
});

filesRoutes.post(
  '/',
  upload.array('file'),
  FileValidator.save,
  async (request, response) => {
    const manifestation_id = Number(request.body.manifestation_id);
    const { files, user_role, user_id } = request;

    const savedFiles = await saveFiles({
      manifestationId: manifestation_id,
      files,
      userId: user_id,
      userRoleId: user_role.id,
    });

    return response.status(201).json(savedFiles);
  }
);

filesRoutes.delete('/:file_id', async (request, response) => {
  const { file_id } = request.params;
  const { user_role, user_id } = request;
  const file = await deleteFile({
    fileId: file_id,
    userId: user_id,
    userRoleId: user_role.id,
  });

  return response.status(200).json(file);
});

export default filesRoutes;
