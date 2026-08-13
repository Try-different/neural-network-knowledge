import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ModuleIndex from './components/ModuleIndex'
import Home from './pages/Home'

import Neuron from './pages/basics/Neuron'
import Activation from './pages/basics/Activation'
import ForwardBackprop from './pages/basics/ForwardBackprop'
import Loss from './pages/basics/Loss'

import CNN from './pages/architectures/CNN'
import RNN from './pages/architectures/RNN'
import LSTM from './pages/architectures/LSTM'
import Transformer from './pages/architectures/Transformer'

import GradientDescent from './pages/optimization/GradientDescent'
import Optimizers from './pages/optimization/Optimizers'
import Regularization from './pages/optimization/Regularization'
import BatchNorm from './pages/optimization/BatchNorm'

import Attention from './pages/frontiers/Attention'
import LLM from './pages/frontiers/LLM'
import Diffusion from './pages/frontiers/Diffusion'

import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="/basics" element={<ModuleIndex moduleId="basics" />} />
        <Route path="/basics/neuron" element={<Neuron />} />
        <Route path="/basics/activation" element={<Activation />} />
        <Route path="/basics/forward-backprop" element={<ForwardBackprop />} />
        <Route path="/basics/loss" element={<Loss />} />

        <Route path="/architectures" element={<ModuleIndex moduleId="architectures" />} />
        <Route path="/architectures/cnn" element={<CNN />} />
        <Route path="/architectures/rnn" element={<RNN />} />
        <Route path="/architectures/lstm" element={<LSTM />} />
        <Route path="/architectures/transformer" element={<Transformer />} />

        <Route path="/optimization" element={<ModuleIndex moduleId="optimization" />} />
        <Route path="/optimization/gradient-descent" element={<GradientDescent />} />
        <Route path="/optimization/optimizers" element={<Optimizers />} />
        <Route path="/optimization/regularization" element={<Regularization />} />
        <Route path="/optimization/batchnorm" element={<BatchNorm />} />

        <Route path="/frontiers" element={<ModuleIndex moduleId="frontiers" />} />
        <Route path="/frontiers/attention" element={<Attention />} />
        <Route path="/frontiers/llm" element={<LLM />} />
        <Route path="/frontiers/diffusion" element={<Diffusion />} />

        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
