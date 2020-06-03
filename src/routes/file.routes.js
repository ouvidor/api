import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../config/multer';
import authMiddleware from '../middlewares/auth';
import FileValidator from '../middlewares/validators/File';

import setResponseHeaders from '../utils/setResponseHeaders';

import fetchManifestationFiles from '../services/File/fetchManifestationFiles';
import fetchManifestationStatusFiles from '../services/File/fetchManifestationStatusFiles';
import getFile from '../services/File/get';
import saveManifestationFiles from '../services/File/saveManifestationFiles';
import saveManifestationStatusFiles from '../services/File/saveManifestationStatusFiles';
import deleteFile from '../services/File/delete';
import createRemoteFileErrorResolver from '../services/File/createRemoteFileErrorResolver';

const filesRoutes = Router();

// o multer faz as tratativas necessárias para utilizarmos upload
const upload = multer(multerConfig);

filesRoutes.use(authMiddleware);

filesRoutes.get('/manifestation/:id', async (request, response) => {
  const id = Number(request.params.id);

  const files = await fetchManifestationFiles({ manifestationId: id });

  return response.status(200).json(files);
});

filesRoutes.get('/status/:id', async (request, response) => {
  const id = Number(request.params.id);

  const files = await fetchManifestationStatusFiles({
    manifestationStatusId: id,
  });

  return response.status(200).json(files);
});

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
  '/manifestation/:id',
  upload.array('file'),
  FileValidator.save,
  async (request, response) => {
    const id = Number(request.params.id);
    const { files, user_role, user_id } = request;

    const savedFiles = await saveManifestationFiles({
      manifestationId: id,
      files,
      userId: user_id,
      userRoleId: user_role.id,
    });

    return response.status(201).json(savedFiles);
  }
);

filesRoutes.post(
  '/status/:id',
  upload.array('file'),
  FileValidator.save,
  async (request, response) => {
    const id = Number(request.params.id);
    const { files, user_role, user_id } = request;

    const savedFiles = await saveManifestationStatusFiles({
      manifestationStatusId: id,
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
