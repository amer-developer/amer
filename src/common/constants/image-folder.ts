import { registerEnumType } from '@nestjs/graphql';

export enum ImageFolder {
    PROFILE = 'PROFILE',
    REQUEST = 'REQUEST',
    OFFER = 'OFFER',
}

registerEnumType(ImageFolder, {
    name: 'ImageType',
});
