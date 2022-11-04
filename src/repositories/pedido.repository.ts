import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {PedidosDbDataSource} from '../datasources';
import {Pedido, PedidoRelations, Persona, Producto} from '../models';
import {PersonaRepository} from './persona.repository';
import {ProductoRepository} from './producto.repository';

export class PedidoRepository extends DefaultCrudRepository<
  Pedido,
  typeof Pedido.prototype.id,
  PedidoRelations
> {

  public readonly PEDIDO_PERSONA: BelongsToAccessor<Persona, typeof Pedido.prototype.id>;

  public readonly PERSONAS_PEDIDOS: HasManyRepositoryFactory<Persona, typeof Pedido.prototype.id>;

  public readonly persona: BelongsToAccessor<Persona, typeof Pedido.prototype.id>;

  public readonly producto: HasOneRepositoryFactory<Producto, typeof Pedido.prototype.id>;

  constructor(
    @inject('datasources.PedidosDB') dataSource: PedidosDbDataSource, @repository.getter('PersonaRepository') protected personaRepositoryGetter: Getter<PersonaRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(Pedido, dataSource);
    this.producto = this.createHasOneRepositoryFactoryFor('producto', productoRepositoryGetter);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.persona = this.createBelongsToAccessorFor('persona', personaRepositoryGetter,);
    this.registerInclusionResolver('persona', this.persona.inclusionResolver);
    this.PERSONAS_PEDIDOS = this.createHasManyRepositoryFactoryFor('PERSONAS_PEDIDOS', personaRepositoryGetter,);
    this.registerInclusionResolver('PERSONAS_PEDIDOS', this.PERSONAS_PEDIDOS.inclusionResolver);
    this.PEDIDO_PERSONA = this.createBelongsToAccessorFor('PEDIDO_PERSONA', personaRepositoryGetter,);
    this.registerInclusionResolver('PEDIDO_PERSONA', this.PEDIDO_PERSONA.inclusionResolver);
  }
}
