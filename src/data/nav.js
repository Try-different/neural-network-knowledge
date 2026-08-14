// 全站导航配置：侧边栏、路由、首页卡片、模块索引页共用
// level: 1=入门, 2=进阶, 3=高级
export const nav = [
  {
    id: 'basics',
    title: '基础概念',
    desc: '神经网络的基石：从单个神经元到完整的训练循环。',
    icon: '◇',
    path: '/basics',
    children: [
      { title: '神经元与感知机', path: '/basics/neuron', dsc: 'MP 神经元、感知机与权重、偏置、加权的含义。', level: 1 },
      { title: '激活函数', path: '/basics/activation', dsc: 'Sigmoid、Tanh、ReLU、GELU 等非线性变换对比。', level: 1 },
      { title: '前向与反向传播', path: '/basics/forward-backprop', dsc: '计算图、链式法则与梯度如何反向流动。', level: 1 },
      { title: '损失函数', path: '/basics/loss', dsc: 'MSE、交叉熵及其与任务类型的对应关系。', level: 1 },
    ],
  },
  {
    id: 'architectures',
    title: '经典网络架构',
    desc: '塑造深度学习历史的里程碑式模型结构。',
    icon: '◈',
    path: '/architectures',
    children: [
      { title: '卷积神经网络 CNN', path: '/architectures/cnn', dsc: '卷积、池化与感受野，从 LeNet 到 ResNet。', level: 2 },
      { title: '循环神经网络 RNN', path: '/architectures/rnn', dsc: '处理序列的隐状态传递与梯度消失问题。', level: 2 },
      { title: '长短期记忆 LSTM', path: '/architectures/lstm', dsc: '门控机制如何缓解长程依赖。', level: 2 },
      { title: 'Transformer', path: '/architectures/transformer', dsc: '自注意力构筑的并行序列模型。', level: 2 },
    ],
  },
  {
    id: 'optimization',
    title: '训练优化',
    desc: '让模型收敛更快、泛化更好的关键技巧。',
    icon: '◉',
    path: '/optimization',
    children: [
      { title: '梯度下降', path: '/optimization/gradient-descent', dsc: 'BGD / SGD / Mini-batch 与学习率的作用。', level: 1 },
      { title: '优化器家族', path: '/optimization/optimizers', dsc: 'Momentum、AdaGrad、RMSProp、Adam 演进。', level: 2 },
      { title: '正则化', path: '/optimization/regularization', dsc: 'L1/L2、Dropout、早停与数据增强。', level: 2 },
      { title: '批归一化 BatchNorm', path: '/optimization/batchnorm', dsc: '内部协变量偏移假设与实际作用。', level: 2 },
    ],
  },
  {
    id: 'frontiers',
    title: '前沿进展',
    desc: '推动当代大模型与生成式 AI 的核心机制。',
    icon: '✦',
    path: '/frontiers',
    children: [
      { title: '注意力机制 Attention', path: '/frontiers/attention', dsc: '从 Bahdanau 到自注意力的 Q/K/V。', level: 2 },
      { title: '大语言模型 LLM', path: '/frontiers/llm', dsc: '预训练、Scaling Law 与对齐技术。', level: 3 },
      { title: '扩散模型 Diffusion', path: '/frontiers/diffusion', dsc: '前向加噪与反向去噪的生成范式。', level: 3 },
    ],
  },
]

// 扁平化所有叶子节点，便于上下页导航与搜索
export const flatTopics = nav.flatMap((g) => g.children)

// 难度等级映射
export const LEVELS = {
  1: { label: '入门', color: 'var(--accent)', desc: '零基础可学，无需预备知识' },
  2: { label: '进阶', color: 'var(--accent-2)', desc: '需先掌握基础概念' },
  3: { label: '高级', color: 'var(--warn)', desc: '涉及前沿研究，建议最后学习' },
}
