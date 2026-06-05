生成# 火柴人格斗游戏 - 详细设计报告

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [角色设计](#3-角色设计)
4. [武器系统](#4-武器系统)
5. [技能系统](#5-技能系统)
6. [战斗系统](#6-战斗系统)
7. [AI系统](#7-ai系统)
8. [游戏界面](#8-游戏界面)
9. [操作指南](#9-操作指南)
10. [技能攻略](#10-技能攻略)

---

## 1. 项目概述

### 1.1 游戏名称
火柴人格斗 (Stickman Fighter)

### 1.2 游戏类型
2D横版格斗游戏

### 1.3 游戏模式
- **人机对战**：玩家 vs AI
- **双人格斗**：玩家1 vs 玩家2
- **机器格斗**：AI vs AI

### 1.4 核心玩法
两个火柴人角色在有限的战斗区域内进行格斗，通过攻击、防御、闪避和技能击败对手。

---

## 2. 技术架构

### 2.1 技术栈
| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 18.x |
| 语言 | TypeScript | 5.x |
| 构建工具 | Vite | 5.x |
| 样式 | TailwindCSS | 3.x |
| 渲染 | Canvas API | - |
| 测试 | Vitest | - |

### 2.2 项目结构
```
src/
├── components/          # React组件
│   ├── pages/          # 页面组件
│   │   ├── Home.tsx    # 主页
│   │   └── Game.tsx    # 游戏页面
│   └── ui/             # UI组件
├── game/               # 游戏核心逻辑
│   ├── Player.ts       # 玩家类
│   ├── AdvancedAI.ts   # AI控制器
│   └── ...
├── config/             # 配置文件
│   └── aiConfig.ts     # AI配置
├── data/               # 游戏数据
│   └── gameData.json   # 角色/武器/技能数据
├── utils/              # 工具函数
│   └── constants.ts    # 常量定义
└── App.tsx             # 主应用
```

### 2.3 游戏循环
```
┌─────────────────────────────────────────────┐
│            requestAnimationFrame            │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              输入处理 (Input)               │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              AI决策 (AI Decision)           │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              状态更新 (Update)              │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            碰撞检测 (Collision)             │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              渲染 (Render)                  │
└─────────────────────────────────────────────┘
```

---

## 3. 角色设计

### 3.1 角色属性定义
| 属性 | 说明 | 范围 |
|------|------|------|
| maxHp | 最大生命值 | 80-150 |
| maxEnergy | 最大能量值 | 80-120 |
| attack | 基础攻击力 | 18-25 |
| defense | 防御力 | 5-25 |
| speed | 移动速度 | 2.5-7 |

### 3.2 角色列表

#### 3.2.1 战士 (Warrior)
```json
{
  "id": "warrior",
  "name": "战士",
  "color": "#4a90d9",
  "stats": {
    "maxHp": 120,
    "maxEnergy": 100,
    "attack": 25,
    "defense": 15,
    "speed": 4
  },
  "skills": ["whirlwind_kick", "ground_smash"]
}
```

**特点**：平衡型角色，攻守兼备  
**优势**：高攻击，中等防御和速度  
**劣势**：没有明显弱点

#### 3.2.2 忍者 (Ninja)
```json
{
  "id": "ninja",
  "name": "忍者",
  "color": "#2ecc71",
  "stats": {
    "maxHp": 80,
    "maxEnergy": 120,
    "attack": 20,
    "defense": 5,
    "speed": 7
  },
  "skills": ["shadow_dash", "shuriken_storm"]
}
```

**特点**：速度型角色，擅长闪避和远程攻击  
**优势**：最快速度，高能量恢复  
**劣势**：低血量，低防御

#### 3.2.3 坦克 (Tank)
```json
{
  "id": "tank",
  "name": "坦克",
  "color": "#e67e22",
  "stats": {
    "maxHp": 150,
    "maxEnergy": 80,
    "attack": 18,
    "defense": 25,
    "speed": 2.5
  },
  "skills": ["iron_wall", "earthquake"]
}
```

**特点**：防御型角色，血量厚  
**优势**：最高血量和防御  
**劣势**：最慢速度

#### 3.2.4 射手 (Archer)
```json
{
  "id": "archer",
  "name": "射手",
  "color": "#9b59b6",
  "stats": {
    "maxHp": 90,
    "maxEnergy": 100,
    "attack": 22,
    "defense": 8,
    "speed": 4.5
  },
  "skills": ["multishot", "snipe"]
}
```

**特点**：远程攻击角色  
**优势**：技能射程远  
**劣势**：近战能力较弱

---

## 4. 武器系统

### 4.1 武器属性
| 属性 | 说明 |
|------|------|
| id | 武器唯一标识 |
| name | 武器名称 |
| type | 武器类型 (melee/ranged) |
| damageMultiplier | 伤害倍率 |
| range | 攻击范围 |
| cooldown | 攻击冷却时间(秒) |

### 4.2 武器列表

| 武器 | 类型 | 伤害倍率 | 攻击范围 | 冷却时间 |
|------|------|----------|----------|----------|
| 拳头 | 近战 | 1.0 | 50 | 0.3s |
| 武士刀 | 近战 | 1.5 | 70 | 0.5s |
| 战斧 | 近战 | 1.8 | 60 | 0.7s |
| 弓箭 | 远程 | 1.2 | 200 | 0.4s |
| 手里剑 | 远程 | 0.8 | 150 | 0.2s |

### 4.3 武器选择策略
- **战士**：推荐战斧或武士刀
- **忍者**：推荐手里剑
- **坦克**：推荐战斧
- **射手**：推荐弓箭

---

## 5. 技能系统

### 5.1 技能属性
| 属性 | 说明 |
|------|------|
| id | 技能唯一标识 |
| name | 技能名称 |
| damage | 技能伤害 |
| energyCost | 能量消耗 |
| cooldown | 冷却时间(秒) |
| range | 攻击范围 |
| duration | 技能持续时间(毫秒) |
| type | 技能类型 (normal/ultimate) |
| effects | 特殊效果列表 |

### 5.2 技能列表

#### 5.2.1 战士技能

| 技能 | 伤害 | 能量消耗 | 冷却 | 范围 | 类型 | 效果 |
|------|------|----------|------|------|------|------|
| 旋风踢 | 35 | 25 | 3s | 100 | 普通 | 范围伤害 |
| 地裂击 | 50 | 40 | 5s | 150 | 终极 | 震屏、击退 |

#### 5.2.2 忍者技能

| 技能 | 伤害 | 能量消耗 | 冷却 | 范围 | 类型 | 效果 |
|------|------|----------|------|------|------|------|
| 影分身 | 30 | 20 | 2.5s | 80 | 普通 | 位移 |
| 手里剑风暴 | 45 | 35 | 4s | 180 | 终极 | 多段伤害 |

#### 5.2.3 坦克技能

| 技能 | 伤害 | 能量消耗 | 冷却 | 范围 | 类型 | 效果 |
|------|------|----------|------|------|------|------|
| 铁壁防御 | 0 | 15 | 4s | 0 | 普通 | 无敌、反弹 |
| 大地震击 | 55 | 45 | 6s | 200 | 终极 | 全屏、震屏 |

#### 5.2.4 射手技能

| 技能 | 伤害 | 能量消耗 | 冷却 | 范围 | 类型 | 效果 |
|------|------|----------|------|------|------|------|
| 多重射击 | 25 | 30 | 3s | 250 | 普通 | 射击 |
| 狙击 | 60 | 50 | 7s | 400 | 终极 | 穿透、高伤害 |

---

## 6. 战斗系统

### 6.1 战斗机制

#### 6.1.1 攻击判定
- 攻击范围：取决于武器类型
- 伤害计算公式：`伤害 = (角色攻击 + 武器加成) × 技能倍率 × 随机因子(0.9-1.1)`
- 防御减伤：`最终伤害 = 伤害 × (1 - 防御/100)`

#### 6.1.2 能量系统
- 初始能量：100%
- 被动恢复：每秒恢复 2 点能量
- 技能消耗：根据技能不同消耗不同能量

#### 6.1.3 状态系统
| 状态 | 说明 | 持续时间 |
|------|------|----------|
| idle | 空闲状态 | - |
| running | 跑步状态 | - |
| attacking | 攻击状态 | 约300ms |
| skill | 技能状态 | 根据技能 |
| blocking | 防御状态 | - |
| dodge | 闪避状态 | 约200ms |
| hurt | 受伤状态 | 约400ms |
| knockback | 击退状态 | 约500ms |
| dead | 死亡状态 | - |

### 6.2 胜负判定
- 一方生命值降为0即判负
- 时间结束时生命值高者获胜
- 生命值相同时判定为平局

---

## 7. AI系统

### 7.1 AI架构设计

#### 7.1.1 整体架构
AI系统采用**三段式决策系统**，包含状态感知层、决策层和执行层：

```
┌──────────────────────────────────────────────────────────────┐
│                    AI 控制器 (AdvancedAI)                    │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  状态感知层  │───▶│   决策层     │───▶│   执行层     │   │
│  │ (Perception) │    │ (Decision)   │    │ (Execution)  │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │                   │                   │            │
│         ▼                   ▼                   ▼            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ 位置/血量/   │    │ 动作评分     │    │ 移动控制     │   │
│  │ 能量/武器    │    │ 概率选择     │    │ 攻击触发     │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

#### 7.1.2 核心组件
| 组件 | 职责 | 更新频率 |
|------|------|----------|
| StatePerceptor | 收集自身和对手状态 | 每帧 |
| DangerEvaluator | 评估危险等级 | 每帧 |
| ActionGenerator | 生成可行动作列表 | 决策间隔 |
| ActionSelector | 选择最优动作 | 决策间隔 |
| ActionExecutor | 执行选中动作 | 每帧 |

---

### 7.2 AI难度等级与配置参数

#### 7.2.1 难度等级参数
| 等级 | 名称 | 决策间隔(帧) | 闪避概率 | 攻击欲望倍率 | 随机扰动 |
|------|------|--------------|----------|--------------|----------|
| 1 | 简单 | 60 | 30% | 0.6 | 0.36 |
| 2 | 普通 | 45 | 50% | 0.8 | 0.24 |
| 3 | 困难 | 30 | 70% | 1.0 | 0.12 |
| 4 | 专家 | 20 | 85% | 1.2 | 0.08 |

#### 7.2.2 全局配置参数
```json
{
  "consecutiveDodgeLimit": 3,
  "safeDistance": 100,
  "emergencyRetreatDistance": 120,
  "emergencyRetreatSpeed": 3,
  "emergencyRetreatHpThreshold": 0.4,
  "aggressiveHpThreshold": 0.8,
  "cautiousHpThreshold": 0.4
}
```

#### 7.2.3 动作权重配置（按血量阶段）
| 血量阶段 | 攻击权重 | 防御权重 | 闪避权重 | 技能权重 |
|----------|----------|----------|----------|----------|
| 高血量 (>80%) | 50 | 15 | 20 | 35 |
| 中血量 (40%-80%) | 35 | 25 | 25 | 30 |
| 低血量 (<40%) | 20 | 35 | 30 | 20 |

---

### 7.3 状态感知算法

#### 7.3.1 状态数据结构
```typescript
interface AIState {
  distance: number;           // 与对手距离
  distanceY: number;          // Y轴距离
  opponentState: string;      // 对手状态
  opponentDirection: string;  // 对手朝向
  ownHp: number;              // 自身血量
  maxHp: number;              // 最大血量
  ownEnergy: number;          // 自身能量
  canAttack: boolean;         // 是否可攻击
  canUseSkill1: boolean;      // 是否可使用技能1
  canUseSkill2: boolean;      // 是否可使用技能2
  positionX: number;          // X坐标
  positionY: number;          // Y坐标
}
```

#### 7.3.2 状态计算伪代码
```python
def perceive_state(self):
    dx = opponent.position.x - self.position.x
    dy = opponent.position.y - self.position.y
    
    return {
        'distance': sqrt(dx*dx + dy*dy),
        'distanceY': abs(dy),
        'opponentState': opponent.state,
        'opponentDirection': opponent.facing,
        'ownHp': self.hp,
        'maxHp': self.maxHp,
        'ownEnergy': self.energy,
        'canAttack': self.state not in ['attacking', 'skill'],
        'canUseSkill1': self.can_use_skill(skill1) and self.skillCooldown == 0,
        'canUseSkill2': self.can_use_skill(skill2) and self.skillCooldown == 0,
        'positionX': self.position.x,
        'positionY': self.position.y
    }
```

---

### 7.4 危险评估算法

#### 7.4.1 危险等级定义
| 等级 | 名称 | 条件 | 响应策略 |
|------|------|------|----------|
| 0 | 安全 | 距离>120且不在角落 | 正常行动 |
| 1 | 警戒 | 距离60-120 | 保持距离 |
| 2 | 危险 | 距离<60或对手攻击中 | 紧急闪避/后退 |
| 3 | 绝境 | 角落+低血量+对手接近 | 绝望反击 |

#### 7.4.2 角落检测算法
```python
def is_in_corner(self, margin=50):
    x = self.position.x
    y = self.position.y
    nearLeft = x < margin
    nearRight = x > CANVAS_WIDTH - margin
    nearTop = y < margin
    nearBottom = y > CANVAS_HEIGHT - margin
    return (nearLeft or nearRight) and (nearTop or nearBottom)

def is_trapped(self, state):
    margin = 50
    x = self.position.x
    y = self.position.y
    nearWall = x < margin or x > CANVAS_WIDTH - margin or \
               y < margin or y > CANVAS_HEIGHT - margin
    lowHp = state['ownHp'] / state['maxHp'] < 0.4
    closeEnemy = state['distance'] < 80
    return nearWall and lowHp and closeEnemy
```

#### 7.4.3 对手攻击检测
```python
def detect_opponent_attack(self, state):
    if state['opponentState'] in ['attacking', 'skill']:
        self.lastOpponentAttackFrame = self.frameCount
    
    framesSinceAttack = self.frameCount - self.lastOpponentAttackFrame
    isInAttackWindow = 5 < framesSinceAttack < 20
    
    return {
        'isAttacking': state['opponentState'] in ['attacking', 'skill'],
        'attackWindow': isInAttackWindow,
        'dangerLevel': 2 if isInAttackWindow and state['distance'] < 85 else 0
    }
```

---

### 7.5 动作生成与选择算法

#### 7.5.1 动作列表
| 动作ID | 动作名称 | 触发条件 | 优先级 |
|--------|----------|----------|--------|
| escape_corner | 角落逃脱 | 在角落且距离<100 | P0(最高) |
| desperate_attack | 绝望反击 | 被困+低血量 | P1 |
| dodge | 紧急闪避 | 对手攻击+距离<100+冷却完毕 | P2 |
| backward | 紧急后退 | 距离<安全距离+低血量 | P3 |
| attack | 普通攻击 | 在攻击范围内+可攻击 | P4 |
| skill1 | 技能1 | 能量足够+冷却完毕 | P5 |
| skill2 | 技能2 | 能量足够+冷却完毕 | P6 |
| move | 移动 | 距离>理想距离 | P7(最低) |

#### 7.5.2 动作评分算法
```python
def evaluate_actions(self, state):
    scores = {}
    
    # 攻击评分
    attackScore = 0
    if state['distance'] < 90 and state['canAttack']:
        attackScore += 40
        if state['opponentState'] == 'hurt': attackScore += 30
        if state['opponentState'] == 'blocking': attackScore -= 15
        if state['distance'] > 40 and state['distance'] < 75: attackScore += 15
        
        hpPercent = state['ownHp'] / state['maxHp']
        if hpPercent > 0.8:
            attackScore += 25 * self.aggressionMultiplier
        elif hpPercent > 0.6:
            attackScore += 15 * self.aggressionMultiplier
    scores['attack'] = attackScore

    # 技能评分
    skill1Score = 0
    if state['canUseSkill1']:
        skill1Score += 45
        if state['ownEnergy'] > 40: skill1Score += 20
        if state['opponentState'] == 'hurt': skill1Score += 30
        if state['distance'] < 80 and state['distance'] > 40: skill1Score += 25
    scores['skill1'] = skill1Score

    # 移动评分
    moveScore = 0
    if state['distance'] > 120:
        moveScore += 30
    elif state['distance'] > 70 and state['distance'] < 120:
        moveScore += 20
    elif state['distance'] < 50:
        moveScore += 15
    scores['move'] = moveScore

    return scores
```

#### 7.5.3 动作选择算法（带随机扰动）
```python
def select_action(self, scores):
    bestAction = 'idle'
    bestScore = -inf
    
    # 随机扰动因子，难度越高扰动越小
    noiseFactor = (5 - self.difficulty) * 0.12
    
    for action, score in scores.items():
        noisyScore = score + (random() - 0.5) * noiseFactor * score
        if noisyScore > bestScore:
            bestScore = noisyScore
            bestAction = action
    
    return bestAction
```

---

### 7.6 武器智能使用逻辑

#### 7.6.1 武器类型与攻击优先级
| 武器类型 | 最佳距离范围 | 攻击优先级加成 | 特殊行为 |
|----------|--------------|----------------|----------|
| 拳头(melee) | 30-50 | 基础30 | 无 |
| 武士刀(sword) | <50 | +15 | 近距离优先 |
| 战斧(axe) | <45 | +20 | 极近距离优先 |
| 弓箭(bow) | >50 | +15 | 远距离优先 |
| 手里剑(shuriken) | 40-150 | +10 | 中距离优先 |

#### 7.6.2 武器攻击优先级计算
```python
def calculate_weapon_priority(self, state, weapon):
    basePriority = 30
    priority = basePriority
    
    if not weapon:
        return priority
    
    # 距离加成
    distanceBonus = max(0, (weapon['range'] - state['distance']) / weapon['range']) * 20
    priority += distanceBonus
    
    # 武器类型加成
    if weapon['type'] == 'bow' and state['distance'] > 50:
        priority += 15
    elif weapon['type'] == 'sword' and state['distance'] < 50:
        priority += 15
    elif weapon['type'] == 'axe' and state['distance'] < 45:
        priority += 20
    elif weapon['type'] == 'spear' and 40 < state['distance'] < 80:
        priority += 18
    
    # 伤害加成
    if weapon['damageMultiplier'] > 1.5:
        priority += 10
    
    # 对手状态加成
    if state['opponentState'] == 'hurt':
        priority += 20
    
    return priority
```

---

### 7.7 边界检测与避障算法

#### 7.7.1 边界检测
```python
def check_boundaries(self, margin=50):
    x = self.position.x
    y = self.position.y
    
    return {
        'canMoveLeft': x > margin,
        'canMoveRight': x < CANVAS_WIDTH - margin,
        'canMoveUp': y > margin,
        'canMoveDown': y < CANVAS_HEIGHT - margin,
        'nearLeftWall': x < margin + 20,
        'nearRightWall': x > CANVAS_WIDTH - margin - 20,
        'nearTopWall': y < margin + 20,
        'nearBottomWall': y > CANVAS_HEIGHT - margin - 20
    }
```

#### 7.7.2 智能避障移动
```python
def execute_smart_move(self, dx, dy):
    boundaries = self.check_boundaries()
    idealDistance = 70
    currentDistance = sqrt(dx*dx + dy*dy)
    
    if currentDistance > idealDistance:
        # Y轴移动
        if dy < -12 and boundaries['canMoveUp']:
            self.input.up = True
        elif dy > 12 and boundaries['canMoveDown']:
            self.input.down = True
        elif dy < -12 and not boundaries['canMoveUp'] and boundaries['canMoveDown']:
            self.input.down = True
        elif dy > 12 and not boundaries['canMoveDown'] and boundaries['canMoveUp']:
            self.input.up = True
        
        # X轴移动
        if dx < 0 and boundaries['canMoveLeft']:
            self.input.left = True
        elif dx > 0 and boundaries['canMoveRight']:
            self.input.right = True
        elif dx < 0 and not boundaries['canMoveLeft'] and boundaries['canMoveRight']:
            self.input.right = True
        elif dx > 0 and not boundaries['canMoveRight'] and boundaries['canMoveLeft']:
            self.input.left = True
```

#### 7.7.3 角落逃脱算法
```python
def execute_escape_corner(self):
    margin = 50
    x = self.position.x
    y = self.position.y
    
    distToLeft = x
    distToRight = CANVAS_WIDTH - x
    distToTop = y
    distToBottom = CANVAS_HEIGHT - y
    
    minDistX = min(distToLeft, distToRight)
    minDistY = min(distToTop, distToBottom)
    
    # 选择空间最大的方向为主逃脱方向
    if minDistX < minDistY:
        escapeX = 1 if distToLeft < distToRight else -1
        escapeY = (1 if random() > 0.5 else -1) * 0.5
    else:
        escapeY = 1 if distToTop < distToBottom else -1
        escapeX = (1 if random() > 0.5 else -1) * 0.5
    
    # 应用逃脱力，距离越近力越大
    escapeForce = 2 + (1 - min(minDistX, minDistY) / margin)
    self.velocity.x += escapeX * escapeForce
    self.velocity.y += escapeY * escapeForce
```

---

### 7.8 紧急后退算法
```python
def execute_emergency_retreat(self, dx, dy):
    boundaries = self.check_boundaries()
    currentDistance = sqrt(dx*dx + dy*dy)
    distanceNeeded = self.emergencyRetreatDistance - currentDistance
    
    if distanceNeeded <= 0:
        return
    
    # 计算后退方向
    direction = {
        'x': -dx / currentDistance,
        'y': -dy / currentDistance
    }
    
    # 检查方向是否被阻挡
    blockedX = (direction['x'] < 0 and not boundaries['canMoveLeft']) or \
               (direction['x'] > 0 and not boundaries['canMoveRight'])
    blockedY = (direction['y'] < 0 and not boundaries['canMoveUp']) or \
               (direction['y'] > 0 and not boundaries['canMoveDown'])
    
    # 智能调整方向
    if blockedX and blockedY:
        if boundaries['canMoveLeft']: direction['x'] = -1
        elif boundaries['canMoveRight']: direction['x'] = 1
        if boundaries['canMoveUp']: direction['y'] = -1
        elif boundaries['canMoveDown']: direction['y'] = 1
    elif blockedX:
        direction['x'] = 0
        direction['y'] *= 1.5
    elif blockedY:
        direction['y'] = 0
        direction['x'] *= 1.5
    
    # 计算后退力（血量越低，后退越快）
    hpPercent = self.hp / self.maxHp
    baseForce = self.emergencyRetreatSpeed
    hpMultiplier = 2.5 if hpPercent < 0.2 else (1.8 if hpPercent < 0.35 else 1.2)
    distanceMultiplier = 1 + (distanceNeeded / self.emergencyRetreatDistance)
    force = baseForce * hpMultiplier * distanceMultiplier
    
    # 应用移动输入
    if direction['y'] < -0.2 and boundaries['canMoveUp']:
        self.input.up = True
    elif direction['y'] > 0.2 and boundaries['canMoveDown']:
        self.input.down = True
    
    if direction['x'] < -0.2 and boundaries['canMoveLeft']:
        self.input.left = True
    elif direction['x'] > 0.2 and boundaries['canMoveRight']:
        self.input.right = True
    
    # 应用速度加成
    self.velocity.x += direction['x'] * force
    self.velocity.y += direction['y'] * force
```

---

### 7.9 反击机制

#### 7.9.1 反击检测
```python
def need_counter_attack(self, state):
    if not state['canAttack']:
        return False
    
    framesSinceAttack = self.frameCount - self.lastOpponentAttackFrame
    isInCounterWindow = 5 < framesSinceAttack < 20
    
    if isInCounterWindow and 40 < state['distance'] < 85:
        counterChance = 0.5 + (self.difficulty * 0.1)
        return random() < counterChance
    
    return False
```

#### 7.9.2 绝望反击（绝境时的最后一搏）
```python
def execute_desperate_attack(self, dx, dy):
    hpPercent = self.hp / self.maxHp
    
    # 低血量时优先使用技能
    if self.can_use_skill(self.skills[0]) and hpPercent < 0.3:
        self.execute_skill(1)
        return
    
    # 否则进行普通攻击
    if self.state not in ['attacking', 'skill']:
        self.input.attack = True
    
    # 同时向前突进
    if dx != 0 or dy != 0:
        length = sqrt(dx*dx + dy*dy)
        normX = dx / length
        normY = dy / length
        self.velocity.x += normX * 1.2
        self.velocity.y += normY * 1.2
```

---

### 7.10 AI执行流程伪代码

```python
class AdvancedAI:
    def __init__(self, player, opponent, difficulty=2):
        self.player = player
        self.opponent = opponent
        self.difficulty = difficulty
        self.decisionTimer = 0
        self.frameCount = 0
        self.dodgeCooldown = 0
        self.skillCooldown = 0
        self.consecutiveDodges = 0
        self.lastOpponentAttackFrame = -100
    
    def update(self):
        self.frameCount += 1
        
        # 更新冷却
        if self.dodgeCooldown > 0: self.dodgeCooldown -= 1
        if self.skillCooldown > 0: self.skillCooldown -= 1
        
        # 检查死亡状态
        hpPercent = self.player.hp / self.player.maxHp
        if hpPercent <= 0:
            self.clear_inputs()
            return
        
        # 更新朝向
        self.update_facing()
        
        # 决策循环
        if self.decisionTimer >= self.get_decision_interval():
            self.make_decision()
            self.decisionTimer = 0
        
        # 执行动作
        self.execute_action()
        
        self.decisionTimer += 1
    
    def make_decision(self):
        state = self.perceive_state()
        
        # 优先级1：角落逃脱
        if self.is_in_corner() and state['distance'] < 100:
            self.currentAction = 'escape_corner'
            return
        
        # 优先级2：绝望反击
        if self.is_trapped(state):
            self.currentAction = 'desperate_attack'
            return
        
        # 优先级3：紧急闪避
        if self.need_emergency_dodge(state):
            self.currentAction = 'dodge'
            return
        
        # 优先级4：紧急后退
        if self.need_emergency_retreat(state):
            self.currentAction = 'backward'
            return
        
        # 优先级5：武器攻击决策
        if self.should_use_weapon_based_decision(state):
            return
        
        # 优先级6：评分选择
        scores = self.evaluate_actions(state)
        self.currentAction = self.select_action(scores)
    
    def execute_action(self):
        self.clear_inputs()
        
        dx = self.opponent.position.x - self.player.position.x
        dy = self.opponent.position.y - self.player.position.y
        
        actions = {
            'escape_corner': lambda: self.execute_escape_corner(),
            'desperate_attack': lambda: self.execute_desperate_attack(dx, dy),
            'dodge': lambda: self.execute_smart_dodge(dx, dy),
            'backward': lambda: self.execute_emergency_retreat(dx, dy),
            'attack': lambda: self.execute_attack(),
            'skill1': lambda: self.execute_skill(1),
            'skill2': lambda: self.execute_skill(2),
            'move': lambda: self.execute_smart_move(dx, dy)
        }
        
        if self.currentAction in actions:
            actions[self.currentAction]()
```

---

## 8. 游戏界面

### 8.1 界面布局
```
┌─────────────────────────────────────────────────────┐
│                    游戏标题栏                        │
│  ┌─────────────────┬─────────────────┐             │
│  │   玩家1血量     │     玩家2血量    │             │
│  │  ████████████   │   ████████████  │             │
│  │   120/120      │    120/120     │             │
│  └─────────────────┴─────────────────┘             │
│                     ↓ 连击数                        │
├─────────────────────────────────────────────────────┤
│                                                    │
│                   战斗区域                          │
│                                                    │
│      [玩家1]                    [玩家2]             │
│                                                    │
├─────────────────────────────────────────────────────┤
│  玩家1操作提示              玩家2操作提示            │
│  W/A/S/D 移动              ↑/←/↓/→ 移动            │
│  F 攻击                    / 攻击                  │
│  Q/E 技能                  Enter 闪避               │
│  S/空格 防御/闪避          / 防御                   │
└─────────────────────────────────────────────────────┘
```

### 8.2 画布尺寸
- 宽度：900像素
- 高度：600像素

---

## 9. 操作指南

### 9.1 玩家1操作 (左侧)

| 按键 | 功能 |
|------|------|
| W | 向上移动 |
| A | 向左移动 |
| S | 向下移动/防御 |
| D | 向右移动 |
| F | 普通攻击 |
| Q | 技能1 |
| E | 技能2 |
| Space | 闪避 |

### 9.2 玩家2操作 (右侧)

| 按键 | 功能 |
|------|------|
| ↑ | 向上移动 |
| ← | 向左移动 |
| ↓ | 向下移动 |
| → | 向右移动 |
| / | 普通攻击 |
| Enter | 闪避 |
| . | 防御 |

### 9.3 游戏控制

| 按键 | 功能 |
|------|------|
| Enter | 开始/确认 |
| Escape | 返回主菜单 |

---

## 10. 技能攻略

### 10.1 战士攻略

**连招推荐**：
1. 普通攻击 → 旋风踢 → 地裂击
2. 地裂击(击退) → 追击 → 旋风踢

**战斗技巧**：
- 利用高攻击力快速压制对手
- 地裂击可以打断对手攻击
- 注意能量管理，避免技能放空

### 10.2 忍者攻略

**连招推荐**：
1. 影分身(接近) → 普通攻击 → 手里剑风暴
2. 手里剑风暴 → 影分身(撤离)

**战斗技巧**：
- 利用高速度进行游击战
- 影分身可以快速接近或逃离
- 手里剑风暴适合远距离消耗

### 10.3 坦克攻略

**连招推荐**：
1. 铁壁防御(吸收伤害) → 大地震击
2. 普通攻击 → 大地震击

**战斗技巧**：
- 铁壁防御期间无敌，可以硬抗伤害
- 大地震击范围大，适合清场
- 利用高血量优势进行消耗战

### 10.4 射手攻略

**连招推荐**：
1. 多重射击(压制) → 狙击
2. 狙击 → 多重射击

**战斗技巧**：
- 保持距离，利用远程优势
- 狙击伤害高但冷却长，谨慎使用
- 多重射击可以快速消耗对手

### 10.5 通用技巧

| 技巧 | 说明 |
|------|------|
| 防御取消 | 在攻击间隙按S键防御 |
| 闪避取消 | 在攻击后摇时闪避取消 |
| 技能取消 | 利用技能取消攻击后摇 |
| 墙壁反弹 | 利用墙壁进行反弹攻击 |

---

## 附录：数据文件格式

### A.1 角色数据格式
```json
{
  "id": "角色ID",
  "name": "角色名称",
  "color": "角色颜色",
  "stats": {
    "maxHp": 数值,
    "maxEnergy": 数值,
    "attack": 数值,
    "defense": 数值,
    "speed": 数值
  },
  "skills": ["技能ID1", "技能ID2"]
}
```

### A.2 武器数据格式
```json
{
  "id": "武器ID",
  "name": "武器名称",
  "type": "melee|ranged",
  "damageMultiplier": 数值,
  "range": 数值,
  "cooldown": 数值
}
```

### A.3 技能数据格式
```json
{
  "id": "技能ID",
  "name": "技能名称",
  "damage": 数值,
  "energyCost": 数值,
  "cooldown": 数值,
  "range": 数值,
  "duration": 数值,
  "type": "normal|ultimate",
  "effects": ["效果1", "效果2"]
}
```

---

**版本**: 1.0  
**日期**: 2026年  
**作者**: 火柴人格斗开发团队