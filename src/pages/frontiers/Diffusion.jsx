import DocPage from '../../components/DocPage'

export default function Diffusion() {
  return (
    <DocPage
      title="扩散模型 Diffusion"
      meta="通过“加噪—去噪”学习生成的范式 · 当代图像生成的主流"
      refs={[
        <>Ho, J., et al. (2020). <em>Denoising Diffusion Probabilistic Models</em>. NeurIPS. arXiv:2006.11239.</>,
        <>Song, Y., et al. (2021). <em>Score-Based Generative Modeling through Stochastic Differential Equations</em>. ICLR. arXiv:2011.13456.</>,
        <a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/" target="_blank" rel="noreferrer">Lilian Weng：What are Diffusion Models?（综述）</a>,
        <>Luo, C. (2022). <em>Understanding Diffusion Models: A Unified Perspective</em>. arXiv:2208.11970.</>,
      ]}
    >
      <h2>核心思想：破坏再重建</h2>
      <p>
        扩散模型的灵感来自非平衡热力学：定义一个<strong>前向过程</strong>，逐步向数据添加高斯噪声，最终变成纯噪声；再训练一个<strong>反向过程</strong>，学习从噪声逐步“去噪”还原出真实数据。一旦学会去噪，就能从随机噪声出发生成新样本。
      </p>

      <h2>前向过程：逐步加噪</h2>
      <p>
        给定数据 <code>x₀</code>，按方差表 <code>β₁,…,β_T</code> 逐步加噪，每一步：
      </p>
      <div className="math">q(xₜ | xₜ₋₁) = N(√(1−βₜ)·xₜ₋₁, βₜ·I)</div>
      <p>
        一个重要性质是可<strong>直接跳到任意步 t</strong>：
      </p>
      <div className="math">xₜ = √ᾱₜ·x₀ + √(1−ᾱₜ)·ε, &nbsp; ε ~ N(0, I)</div>
      <p>其中 <code>ᾱₜ = Π(1−βᵢ)</code>，这使得训练采样极其高效。</p>

      <h2>反向过程：学习去噪</h2>
      <p>
        真实的反向分布无法解析，故用参数化网络 <code>ε_θ</code> 近似。DDPM（Ho 等，2020）的关键简化是让网络<strong>预测加进去的噪声 ε</strong>，而非直接预测数据，目标函数极简：
      </p>
      <div className="math">L = E[ ‖ ε − ε_θ(xₜ, t) ‖² ]</div>

      <pre><code>{`# DDPM 训练单步
t = randint(0, T)
epsilon = randn_like(x0)               # 采样噪声
x_t = sqrt(alpha_bar[t]) * x0 + sqrt(1 - alpha_bar[t]) * epsilon
pred = model(x_t, t)                  # U-Net 预测噪声
loss = mse(pred, epsilon)             # 简化目标`}
      </code></pre>

      <h2>去噪网络：U-Net</h2>
      <p>
        去噪网络通常采用 <strong>U-Net</strong>：编码器逐级下采样提取多尺度特征，解码器逐级上采样恢复分辨率，并通过跳跃连接保留细节。时间步 <code>t</code> 通过嵌入注入网络，告知模型当前噪声水平。
      </p>

      <h2>统一视角：评分匹配</h2>
      <p>
        Song 等（2021）将扩散过程推广为连续的<strong>随机微分方程（SDE）</strong>，并与<strong>评分匹配（score matching）</strong>统一：去噪目标等价于估计数据分布的对数梯度（即“分数”）。通过求解反向 SDE 或概率流 ODE 即可生成样本，架起了 DDPM 与 score-based 模型的桥梁。
      </p>

      <div className="callout">
        <div className="title">为何成为主流</div>
        相比 GAN，扩散模型训练更稳定、模式覆盖更全、样本多样性强，虽采样速度较慢，但通过 DDIM、一致性模型等加速方法已大幅改善。它已成为 DALL·E、Stable Diffusion、Sora 等生成系统的核心。
      </div>
    </DocPage>
  )
}
