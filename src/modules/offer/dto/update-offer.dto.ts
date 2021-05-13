/* eslint-disable max-classes-per-file */
import { ArgsType, PartialType as GLPartialType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/swagger';

import { CreateOfferDto } from './create-offer.dto';

@ArgsType()
export class UpdateOfferInput extends GLPartialType(CreateOfferDto) {}

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
