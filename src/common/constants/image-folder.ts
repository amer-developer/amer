import { registerEnumType } from '@nestjs/graphql';

export enum ImageFolder {
    PROFILE = 'PROFILE',
    POST = 'POST',
    OFFER = 'OFFER',
}

registerEnumType(ImageFolder, {
    name: 'ImageType',
});
