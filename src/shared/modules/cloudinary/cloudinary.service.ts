import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import toStream = require('buffer-to-stream');
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

import { IFile } from '../../../interfaces/IFile';
@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: IFile,
        name?: string,
        type?: string,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream(
                { folder: type, public_id: name },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                },
            );
            toStream(file.buffer).pipe(upload);
        });
    }
}
