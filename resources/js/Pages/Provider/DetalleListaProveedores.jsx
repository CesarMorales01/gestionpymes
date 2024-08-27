import React from 'react'
import GlobalFunctions from '../services/GlobalFunctions';
import PrimaryButton from '@/Components/PrimaryButton'

const DetalleListaProveedores = (params) => {
    const glob = new GlobalFunctions()

    function validarListaProductosVendidos(){
        let mostrar='none'
        if(params.datos!=undefined){
            if(params.datos.productosVendidos.length > 0){
                mostrar=''
            }
        }
        return mostrar
    }
    return (
        <div className="modal fade" id='dialogoDetalleListaProveedores' tabIndex="-1" >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 style={{ fontWeight: 'bold', fontSize: '1.2em' }} className="modal-title" id="exampleModalLabel">Detalle productos proveedor: {params.datos!=undefined ? params.datos.nombre : ''} </h5>
                    </div>
                    <div className="modal-body">
                        <div className='container table-responsive'>
                            <h3 style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.2em' }}>Productos en inventario</h3>
                            <table className="table">
                                <thead>
                                    <tr className='align-middle'>
                                        <th scope="col">Producto</th>
                                        <th scope="col">Cantidad</th>
                                        <th scope="col">Costo unidad</th>
                                        <th scope="col">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {params.datos!=undefined ?  params.datos.productosEnInventario.map((item, index) => {
                                        const subt = parseInt(item.costo * item.cantidad)
                                        return (
                                            <tr key={index}>
                                                <th >
                                                    <a href={route('product.edit', item.id)} className='btn btn-outline-info'>
                                                        {item.referencia != undefined ? item.referencia + ": " + item.nombre : item.nombre}
                                                    </a>
                                                </th>
                                                <td>{item.cantidad}</td>
                                                <td>{glob.formatNumber(item.costo)}</td>
                                                <td>{glob.formatNumber(subt)}</td>
                                            </tr>
                                        )
                                    }): ''}
                                </tbody>
                                <thead>
                                    <tr><td style={{ whiteSpace: 'nowrap' }}>Total costo productos en inventario:</td>
                                        <td>{params.datos!=undefined ? glob.formatNumber(params.datos.totalProductosEnInventario): 0}</td>
                                    </tr>
                                </thead>
                            </table>
                            <h3 style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.2em', display: validarListaProductosVendidos() }}>Productos vendidos</h3>
                            {params.datos!=undefined ?  params.datos.productosVendidos.map((item, index) => {
                                return (
                                    <table key={index} className="table">
                                        <thead>
                                            <tr scope="row" key={index}>
                                                <th colSpan={'4'}>
                                                    <a href={route('shopping.edit', item.id)} className='btn btn-outline-info' style={{ fontSize: '1em' }}>Venta del : {item.fecha}</a>
                                                </th>
                                            </tr>
                                            <tr className='align-middle'>
                                                <th scope="col">Producto</th>
                                                <th scope="col">Cantidad</th>
                                                <th scope="col">Costo unidad</th>
                                                <th scope="col">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {item.listaProductos.map((item1, index) => {
                                                const subt = parseInt(item1.costo) * parseInt(item1.cantidad)
                                                return (
                                                    <tr key={index}>
                                                        <th > {item1.producto}</th>
                                                        <th> {item1.cantidad} </th>
                                                        <th> {glob.formatNumber(item1.costo)} </th>
                                                        <th> {glob.formatNumber(subt)} </th>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        <thead>
                                            <tr><td style={{ whiteSpace: 'nowrap' }}>Total costo productos vendidos:</td>
                                                <td>{glob.formatNumber(item.totalProdsEstaVenta)}</td>
                                            </tr>
                                        </thead>
                                    </table>
                                )
                            }): ''}
                            <div className='row'>
                                <div className='col-6'>
                                </div>
                                <div className='col-6'>
                                    <h3 style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.2em' }}>Total proveedor: {params.datos!=undefined ? glob.formatNumber(params.datos.totalProveedor) : 0}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton type="button" data-dismiss="modal">Close</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetalleListaProveedores