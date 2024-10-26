import React from 'react'
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import '../../../css/general.css'
import GlobalFunctions from '../services/GlobalFunctions'
import newLogo from '../../../../public/Images/Config/plus.png'
import Swal from 'sweetalert2'
import NewProvider from './NewProvider';
import TablaProveedores from './TablaProveedores';


const Providers = (params) => {

  const glob = new GlobalFunctions()
  const [proveedores, setProveedores] = useState(params.proveedores.proveedores)
  const [totalProveedores, setTotalProveedores] = useState(params.proveedores.totalProveedores)
  const [cargar, setCargar] = useState(false)
  const [fechas, setFechas] = useState({
    fechaInicio: '',
    fechaFinal: ''
  })
  const [noProviders, setNoProviders] = useState(false)
  const [editarProveedor, setEditarProveedor] = useState({})

  useEffect(() => {
    if (cargar) {
      cargarDatos()
    }
  }, [fechas])

  useEffect(() => {
    if (proveedores.length == 0) {
      setNoProviders(true)
    } else {
      setNoProviders(false)
    }
  }, [proveedores])

  useEffect(() => {
    cargarFechas()
    if (params.estado != '') {
      sweetAlert(params.estado)
    }
  }, [])

  function goEditarProveedor(item) {
    setEditarProveedor(item)
    setTimeout(() => {
      document.getElementById('btnDialogoNewProvider').click()
    }, 100);
  }

  function limpiarListaProveedores() {
    const array = []
    setProveedores(array)
    setTotalProveedores(0)
  }

  function cargarDatos() {
    const url = params.globalVars.myUrl + 'provider/list/bydate/' + fechas.fechaInicio + '/' + fechas.fechaFinal
    fetch(url)
      .then((response) => {
        return response.json()
      }).then((json) => {
        limpiarListaProveedores()
        setCargar(false)
        setProveedores(json.proveedores)
        setTotalProveedores(json.totalProveedores)
      })
  }

  function sweetAlert(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: params.estado.includes('elimin') ? 'warning' : 'success',
      timer: params.estado.includes('elimin') ? 1500 : 1000
    })
  }

  function cargarFechas() {
    const fechaHoy = glob.getFecha().split("-")
    // Para obtener ultimo dia del mes.
    const date = new Date(fechaHoy[0], fechaHoy[1], 0).toLocaleDateString("en-US")
    const ultimoDia = date.split('/')
    setFechas({
      fechaInicio: fechaHoy[0] + "-" + fechaHoy[1] + "-01",
      fechaFinal: fechaHoy[0] + "-" + fechaHoy[1] + "-" + ultimoDia[1]
    })
  }

  function goNewProvider() {
    setEditarProveedor((valores) => ({
      ...valores,
      id: '',
      nombre: '',
      descripcion: '',
      direccion: '',
      telefono: '',
      email: ''
    }))
    setTimeout(() => {
      document.getElementById('btnDialogoNewProvider').click()
    }, 100);
  }

  function cambioFechaInicio(e) {
    setCargar(true)
    setFechas((valores) => ({
      ...valores,
      fechaInicio: e.target.value
    }))
  }

  function cambioFechaFinal(e) {
    setCargar(true)
    setFechas((valores) => ({
      ...valores,
      fechaFinal: e.target.value
    }))
  }

  function mesAnterior() {
    setCargar(true)
    let fechaHoy = fechas.fechaInicio.split("-")
    let iMesMenos = fechaHoy[1] - 1

    let ano = fechaHoy[0]
    if (fechaHoy[1] == 1) {
      iMesMenos = 12
      ano = fechaHoy[0] - 1
    }
    if (iMesMenos < 10) {
      iMesMenos = '0' + iMesMenos
    }
    const nuevaFechaInicial = ano + "-" + iMesMenos + "-" + fechaHoy[2]
    //Restar fecha final
    const date = new Date(ano, iMesMenos, 0).toLocaleDateString("en-US")
    const ultimoDia = date.split('/')
    const nuevaFechaFinal = ano + "-" + iMesMenos + "-" + ultimoDia[1]
    setFechas((valores) => ({
      ...valores,
      fechaInicio: nuevaFechaInicial,
      fechaFinal: nuevaFechaFinal
    }))
  }

  function mesSiguiente() {
    setCargar(true)
    let fechaHoy = fechas.fechaFinal.split("-")
    let FMesMas = parseInt(fechaHoy[1]) + parseInt(1)
    let ano = fechaHoy[0]
    if (fechaHoy[1] == 12) {
      FMesMas = 1
      ano = parseInt(fechaHoy[0]) + parseInt(1)
    }
    if (FMesMas < 10) {
      FMesMas = '0' + FMesMas
    }
    const date = new Date(ano, FMesMas, 0).toLocaleDateString("en-US")
    const ultimoDia = date.split('/')
    const nuevaFechaFinal = ano + "-" + FMesMas + "-" + ultimoDia[1]
    setFechas((valores) => ({
      ...valores,
      fechaInicio: ano + "-" + FMesMas + "-01",
      fechaFinal: nuevaFechaFinal
    }))
  }

  return (
    <AuthenticatedLayout
      user={params.auth} globalVars={params.globalVars}
    >
      <Head title="Proveedores" />
      <div className='container'>
        <div style={{ marginTop: '0.2em' }} align="center" className="row justify-content-center">
          <div style={{ marginTop: '0.8em' }} className="row">
            <div onClick={goNewProvider} className="col-lg-4 col-md-4 col-sm-6 col-6"  >
              <div className="card border border-primary card-flyer pointer">
                <img style={{ width: '8em', height: '4em', marginTop: '1em' }} src={newLogo} className="card-img-top img-fluid centerImg" alt="" />
                <h2 style={{ marginTop: '0.2em' }} className="card-title titulo">Nuevo proveedor</h2>
              </div>
            </div>
            <div style={{ marginTop: window.screen.width > 600 ? '' : '0.5em' }} className="col-lg-8 col-md- col-sm-12 col-12"  >
              <div style={{ textAlign: 'center' }} className='row'>
                <label className='titulo' style={{ textAlign: 'center', marginBottom: '0.2em' }}><strong>Proveedores entre</strong></label>
                <div className="col-2">
                  <button onClick={mesAnterior} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                    </svg>
                  </button>
                </div>
                <div className="col-4">
                  <input type="date" className='form-control rounded' value={fechas.fechaInicio} onChange={cambioFechaInicio} name="fecha_prest" id="inputDate" />
                </div>
                <div className="col-4" >
                  <input type="date" className='form-control rounded' value={fechas.fechaFinal} onChange={cambioFechaFinal} name="fecha_prest" id="inputDate" />
                </div>
                <div className="col-2">
                  <button onClick={mesSiguiente} className='border border-dark rounded cursorPointer' style={{ marginTop: '0.2em', marginLeft: '0.2em', padding: '0.5em', backgroundColor: '#00722e' }} id="btn_buscar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '0.5em', textAlign: 'center' }} className="col-12" >
          <span style={{ display: cargar ? '' : 'none' }} className="spinner-border text-primary" role="status" aria-hidden="true"></span>
        </div>
        <div style={{ marginTop: '0.5em' }} className="row justify-content-center">

        </div>
        <div style={{ marginTop: '1em' }} className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Total proveedores</th>
                <th scope="col">$ {totalProveedores != undefined ? glob.formatNumber(totalProveedores) : 0}</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <h1 style={{ fontSize: '1.5em' }} id="titulo" className="text-center">Lista de proveedores</h1>
      <div className='container'>
        <TablaProveedores goEditarProveedor={goEditarProveedor} noProviders={noProviders} datos={proveedores}></TablaProveedores>
      </div>
      <NewProvider editarProveedor={editarProveedor} token={params.token} ></NewProvider>
      <button id='btnDialogoNewProvider' style={{ display: 'none' }} type="button" data-toggle="modal" data-target="#dialogoNewProvider"></button>

    </AuthenticatedLayout>
  )
}

export default Providers