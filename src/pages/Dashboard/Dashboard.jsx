import React, { useState, useEffect } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Data } from '../../utils/Data';
import DoughnutChart from '../../components/DoughnutChart';
import { useAuthContext } from '../../context/AuthProvider';
import useFetch from '../../hooks/useFetch'
import { CircularProgress } from '@mui/material';
import { GeneralError } from '../../components/GeneralError';
import Modal from '../../components/Modal';




const Dashboard = () => {
  const { usuario } = useAuthContext()
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuario.p_e_id) {
      async function fetchData() {
        const [data, error] = await useFetch(`/balance/GetBalanceByPEId/${usuario.p_e_id}`, 'GET', null, true)
        if (data) {
          setBalance(data)
          setLoading(false)
        } else {
          setError(error)
          setLoading(false)
        }
      }
      fetchData();
    }
  }, [usuario]);

  Chart.register(CategoryScale);
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.category),
    datasets: [
      {
        labels: "",
        data: Data.map((data) => data.monto),
        backgroundColor: [
          "violet",
          "green",
          "purple",
          "red",
          "purple"
        ],
        borderColor: "none",
        borderWidth: 0,
        hoverOffset: 5,
      }
    ],
  });
  //---------- Fin de Conexiones JWT y Auth ----------


  if (loading) return <CircularProgress />
  if (error) return <GeneralError error={error} />

  return (
    <div>
      <h1
        className='text-violet-800 font-bold uppercase mx-5 mt-6'
      >
        Bienvenido: {usuario.nombre}
      </h1>
      {/* Cabecera */}
      <div className=" bg-inherit rounded p-2 m-4 mb-0 flex justify-between">
        {/* TODO: Cambiar por ternario, copiar y pegar todo pero solo modificar el boton perfil económico por nueva transacción */}
        <div className="bg-gray-200 p-4 rounded-lg shadow-sm w-full mr-1">
          {balance ?
            <div className='flex justify-around'>
              <h2 className='p-1 mb-4 text-violet-600'>
                <span className='font-bold'>
                  Saldo Inicial: <br />
                  ${parseFloat(balance.data.saldo_Inicial).toFixed(2)}
                </span>
              </h2>
              <h2 className='p-1 mb-4 text-violet-600'>
                <span className='font-bold'>
                  Saldo Total: <br />
                  ${parseFloat(balance.data.saldo_Total).toFixed(2)}
                </span>
              </h2>
            </div> :
            <div className='flex justify-center'>
              <h3>Informacion de Saldos no disponible, empiece a crear transacciones...</h3>
            </div>}

          {
            !modal ?
              <div className='p-2 pt-8 flex justify-around bottom-1'>

                <button
                  type="button"
                  className='text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold'
                  onClick={handlePerfilEcon}
                >
                  Perfil Económico
                </button>

              </div>

              :
              <div className='p-2 pt-8 flex justify-around bottom-1' >
                <button
                  type="button"
                  className='text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold p-absolute'
                  onClick={handlePerfilEcon}
                >
                  Agregar Transacción
                </button>

                {modal &&
                  <Modal
                    setModal={setModal}
                    animarModal={animarModal}
                    setAnimarModal={setAnimarModal}
                  />
                }


              </div>

          }

        </div>
        <div className="bg-gray-200  p-4 rounded-lg shadow-sm w-full ml-1 w-min-6 flex">
          <h2 className='p-1 text-violet-600 justify-around mb-4 font-bold'>
            Transacciones:
          </h2>
          <div className='min-h-[5rem]'>
            {/* <img
                  src={graficoPrueba}
                  className=' w-90 h-[11rem] rounded'
                /> */}
            <DoughnutChart chartData={chartData} />
          </div>
        </div>
      </div>

      {/* fin Cabecera */}

      {/* Lista de gastos */}

      <div className="bg-inherit p-10">
        <div className="bg-inherit p-4 rounded-lg shadow-md border">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 font-semibold text-violet-600">Transacción</th>
                <th className="text-left py-2 px-4 font-semibold text-violet-600">Monto</th>
                <th className="text-left py-2 px-4 font-semibold text-violet-600">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4">Panaderia</td>
                <td className="py-2 px-4">$ 700</td>
                <td className="py-2 px-4">05/06/2023</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-4">Alquiler</td>
                <td className="py-2 px-4">$ 75000</td>
                <td className="py-2 px-4">10/06/2023</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fin de lista de gastos */}

      {/* Balance */}

      <div className=" bg-inherit rounded p-4 m-1 mx-8 mb-0 flex justify-between">
        {/* TODO: Cambiar por ternario, copiar y pegar todo pero solo modificar el boton perfil económico por nueva transacción */}
        <div className="bg-gray-200 p-4  rounded-lg shadow-sm w-full  mx-1 ">
          <div>
            <h2 className='p-1 justify-around text-violet-600'>
              Activos:
            </h2>
            <div className="bg-inherit rounded-lg  border">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold text-violet-600">Transacción</th>
                    <th className="text-left py-2 px-4 font-semibold text-violet-600">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-4">Salario</td>
                    <td className="py-2 px-4">$ 400000</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-4">Alquiler</td>
                    <td className="py-2 px-4">$ 75000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-gray-200  p-4 rounded-lg shadow-sm w-full mx-1 w-min-6 ">
          <div>
            <h2 className='p-1 justify-around text-violet-600'>
              Pasivos:
            </h2>
            <div className="bg-inherit rounded-lg  border">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold text-violet-600">Transascción</th>
                    <th className="text-left py-2 px-4 font-semibold text-violet-600">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-4">Salario</td>
                    <td className="py-2 px-4">$ 400000</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 px-4">Alquiler</td>
                    <td className="py-2 px-4">$ 75000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 p-4 mx-40 rounded-lg shadow-sm ">
        <div>
          <h2 className='p-1 justify-around mb-4 text-violet-600 text-center'>
            Patrimonio Neto:
          </h2>
          {balance
            ?
            <div className='flex justify-center'>
              <h1 className='p-1 justify-around text-violet-800 font-bold uppercase'>
                ${parseFloat(balance.data.saldo_Total).toFixed(2)}
              </h1>
            </div>
            :
            <div></div>
          }
        </div>
      </div>

      {/* Fin de balance */}

    </div>
  )
}

export default Dashboard

