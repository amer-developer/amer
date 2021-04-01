/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/tslint/config */
import 'source-map-support/register';

import { compact, map } from 'lodash';
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

import { AbstractEntity } from './common/abstract.entity';
import { AbstractDto } from './common/dto/AbstractDto';
import { PageDto } from './common/dto/PageDto';
import { PageMetaDto } from './common/dto/PageMetaDto';
import { PageOptionsDto } from './common/dto/PageOptionsDto';
import { VIRTUAL_COLUMN_KEY } from './decorators/virtual-column.decorator';

declare global {
    interface Array<T> {
        toDtos<T extends AbstractEntity<Dto>, Dto extends AbstractDto>(
            this: T[],
            options?: any,
        ): Dto[];

        toPageDto<T extends AbstractEntity<Dto>, Dto extends AbstractDto>(
            this: T[],
            pageMetaDto: PageMetaDto,
        ): PageDto<Dto>;
    }
}

declare module 'typeorm' {
    interface QueryBuilder<Entity> {
        searchByString(q: string, columnNames: string[]): this;
    }

    interface SelectQueryBuilder<Entity> {
        paginate(
            this: SelectQueryBuilder<Entity>,
            pageOptionsDto: PageOptionsDto,
        ): Promise<{ items: Entity[]; pageMetaDto: PageMetaDto }>;
    }
}

Array.prototype.toDtos = function <
    T extends AbstractEntity<Dto>,
    Dto extends AbstractDto
>(options?: any): Dto[] {
    return compact(
        map<T, Dto>(this, (item) => item.toDto(options)),
    );
};

Array.prototype.toPageDto = function (pageMetaDto: PageMetaDto) {
    return new PageDto(this.toDtos(), pageMetaDto);
};

QueryBuilder.prototype.searchByString = function (q, columnNames) {
    if (!q) {
        return this;
    }
    this.andWhere(
        new Brackets((qb) => {
            for (const item of columnNames) {
                qb.orWhere(`${item} ILIKE :q`);
            }
        }),
    );

    this.setParameter('q', `%${q}%`);

    return this;
};

SelectQueryBuilder.prototype.paginate = async function (
    pageOptionsDto: PageOptionsDto,
) {
    let selectQueryBuilder = this.skip(pageOptionsDto.skip).take(
        pageOptionsDto.take,
    );

    for (const includable of pageOptionsDto.includes) {
        selectQueryBuilder = this.leftJoinAndSelect(
            `${this.alias}.${includable}`,
            includable,
        );
    }

    for (const filter of pageOptionsDto.filters) {
        selectQueryBuilder = this.andWhere(
            `${this.alias}.${snakeCase(filter.name)} = '${String(
                filter.value,
            )}'`,
        );
    }

    if (!pageOptionsDto.include) {
        const column = pageOptionsDto.sort
            ? `${snakeCase(pageOptionsDto.sort)}`
            : 'created_at';

        selectQueryBuilder = this.addOrderBy(column, pageOptionsDto.order);
    }

    const itemCount = await selectQueryBuilder.getCount();

    const { entities, raw } = await selectQueryBuilder.getRawAndEntities();

    const items = entities.map((entitiy, index) => {
        const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
        const item = raw[index];

        for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
            entitiy[propertyKey] = item[name];
        }
        return entitiy;
    });

    const pageMetaDto = new PageMetaDto({
        itemCount,
        pageOptionsDto,
    });

    return { items, pageMetaDto };
};
