// 神经网络常用术语速查表
// term: 显示词，aliases: 别名/英文，def: 简短解释，cat: 分类
export const glossary = [
  // 基础概念
  { term: '神经元', aliases: ['neuron'], cat: '基础', def: '神经网络的基本计算单元，接收加权输入求和后经激活函数输出。' },
  { term: '感知机', aliases: ['perceptron'], cat: '基础', def: '最早的二分类神经元模型，单层无法解决非线性问题（如 XOR）。' },
  { term: '权重', aliases: ['weight', 'w'], cat: '基础', def: '控制输入信号强度的可学习参数，是训练的核心对象。' },
  { term: '偏置', aliases: ['bias', 'b'], cat: '基础', def: '加在加权求和上的常数项，让激活函数可以平移，增加灵活性。' },
  { term: '激活函数', aliases: ['activation function'], cat: '基础', def: '引入非线性的函数（如 ReLU、Sigmoid），没有它多层网络等价于单层。' },
  { term: '隐藏层', aliases: ['hidden layer'], cat: '基础', def: '输入与输出之间的网络层，负责特征变换。' },

  // 训练相关
  { term: '梯度', aliases: ['gradient'], cat: '训练', def: '损失对参数的偏导数，指向损失上升最快的方向；负梯度即下降最快方向。' },
  { term: '反向传播', aliases: ['backpropagation', 'BP'], cat: '训练', def: '用链式法则从输出端逐层计算梯度的算法，是训练深度网络的基础。' },
  { term: '链式法则', aliases: ['chain rule'], cat: '训练', def: '复合函数求导法则：(f(g(x)))\' = f\'(g(x))·g\'(x)，反向传播的数学基础。' },
  { term: '学习率', aliases: ['learning rate', 'lr', 'α'], cat: '训练', def: '控制每次参数更新步长的超参数。太大震荡发散，太小收敛缓慢。' },
  { term: '梯度下降', aliases: ['gradient descent', 'GD'], cat: '训练', def: '沿负梯度方向更新参数的优化方法：θ ← θ − η·∇L。' },
  { term: '梯度消失', aliases: ['vanishing gradient'], cat: '训练', def: '深层网络中梯度连乘后趋近于0，浅层几乎学不到东西。Sigmoid 易引发此问题。' },
  { term: '梯度爆炸', aliases: ['exploding gradient'], cat: '训练', def: '梯度连乘后指数增大，参数剧烈震荡甚至 NaN。可用梯度裁剪缓解。' },
  { term: '损失函数', aliases: ['loss function', 'cost function'], cat: '训练', def: '衡量预测与真实标签差距的函数，训练的目标是最小化它。' },
  { term: '交叉熵', aliases: ['cross-entropy'], cat: '训练', def: '分类任务常用损失，衡量预测概率分布与真实分布的差异。配 Softmax 使用。' },

  // 数据与迭代
  { term: 'epoch', aliases: [], cat: '数据', def: '整个训练数据集被完整遍历一次。' },
  { term: 'batch', aliases: ['批', '批次'], cat: '数据', def: '一次前向+反向更新使用的一组样本。' },
  { term: 'batch size', aliases: ['批大小'], cat: '数据', def: '每个 batch 包含的样本数量，影响显存占用与梯度稳定性。' },
  { term: '迭代', aliases: ['iteration', 'step'], cat: '数据', def: '一次参数更新（一个 batch 的前向+反向）。' },
  { term: '小批量', aliases: ['mini-batch'], cat: '数据', def: '介于全量和单样本之间的 batch，兼顾速度与稳定性，是实际最常用的方式。' },

  // 评估与正则化
  { term: '过拟合', aliases: ['overfitting'], cat: '正则化', def: '模型在训练集表现好但泛化差，记住了噪声而非规律。' },
  { term: '欠拟合', aliases: ['underfitting'], cat: '正则化', def: '模型能力不足，连训练集都学不好。' },
  { term: '正则化', aliases: ['regularization'], cat: '正则化', def: '为防止过拟合而加入的约束，如 L1/L2 罚项、Dropout、早停等。' },
  { term: 'Dropout', aliases: ['随机失活'], cat: '正则化', def: '训练时随机将部分神经元置零，迫使网络不过度依赖个别神经元。' },
  { term: '早停', aliases: ['early stopping'], cat: '正则化', def: '验证集性能不再提升时停止训练，防止过拟合。' },
  { term: '泛化', aliases: ['generalization'], cat: '正则化', def: '模型对未见过数据的适应能力，是机器学习的核心目标。' },

  // 网络结构
  { term: '卷积', aliases: ['convolution'], cat: '架构', def: '用小滤波器扫描输入提取局部特征的操作，权重共享且平移等变。' },
  { term: '池化', aliases: ['pooling'], cat: '架构', def: '下采样操作（如取最大值），减小特征图尺寸并带来平移不变性。' },
  { term: '感受野', aliases: ['receptive field'], cat: '架构', def: '某神经元能「看到」的输入区域大小，层越深感受野越大。' },
  { term: '残差连接', aliases: ['residual connection', 'skip connection'], cat: '架构', def: '将输入直接加到输出上（y=F(x)+x），使梯度可直达浅层，支持训练极深网络。' },
  { term: '归一化', aliases: ['normalization'], cat: '架构', def: '将中间特征分布标准化（减均值除标准差），稳定训练、加速收敛。' },

  // 序列与注意力
  { term: '注意力', aliases: ['attention'], cat: '注意力', def: '让模型动态聚焦于输入中相关部分的机制，通过 Q/K/V 计算权重。' },
  { term: '自注意力', aliases: ['self-attention'], cat: '注意力', def: 'Q/K/V 来自同一序列的注意力，让每个位置关注序列中所有位置。' },
  { term: '多头注意力', aliases: ['multi-head attention'], cat: '注意力', def: '并行运行多组注意力再拼接，让模型从不同子空间捕捉不同关系。' },

  // 前沿
  { term: '预训练', aliases: ['pretraining'], cat: '前沿', def: '在大规模无标注数据上自监督学习通用表示，是大模型范式的基础。' },
  { term: '微调', aliases: ['fine-tuning', 'FT'], cat: '前沿', def: '在预训练模型基础上用少量标注数据继续训练，适配下游任务。' },
  { term: 'token', aliases: ['标记', '词元'], cat: '前沿', def: '文本的基本单元（词/子词/字符），大模型以 token 序列为输入输出。' },
  { term: '温度', aliases: ['temperature'], cat: '前沿', def: '采样时控制分布尖锐程度的参数。低温更确定，高温更多样。' },
  { term: '扩散', aliases: ['diffusion'], cat: '前沿', def: '通过逐步加噪破坏数据、再学习逐步去噪来生成样本的模型范式。' },
]

// 按分类分组
export const glossaryByCat = glossary.reduce((acc, item) => {
  if (!acc[item.cat]) acc[item.cat] = []
  acc[item.cat].push(item)
  return acc
}, {})

// 查找术语（支持中英文模糊匹配）
export function lookupTerm(query) {
  const q = query.trim().toLowerCase()
  if (!q) return null
  return glossary.find(
    (g) =>
      g.term === query ||
      g.term.toLowerCase().includes(q) ||
      g.aliases.some((a) => a.toLowerCase() === q || a.toLowerCase().includes(q))
  )
}
