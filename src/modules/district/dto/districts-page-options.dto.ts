import { ArgsType } from '@nestjs/graphql';

import { PageOptionsDto } from '../../../common/dto/PageOptionsDto';

@ArgsType()
export class DistrictsPageOptionsDto extends PageOptionsDto {}
