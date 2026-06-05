# 火柴人格斗游戏 - 产品需求文档

## Overview
- **Summary**: 开发一个高动作幅度、强打击感的火柴人格斗游戏，支持人机对战、双人对战和AI对战三种模式
- **Purpose**: 解决现有游戏动作幅度小、打击感弱、卡通化的问题，打造更具冲击力的格斗体验
- **Target Users**: 格斗游戏爱好者、休闲玩家

## Goals
- [x] 打造高动作幅度的火柴人战斗系统
- [x] 增强打击感和视觉反馈
- [x] 支持三种游戏模式（人机、双人、AI）
- [x] 实现流畅的动作动画

## Non-Goals (Out of Scope)
- [ ] 3D渲染（保持2D火柴人风格）
- [ ] 复杂剧情模式
- [ ] 多人在线对战

## Background & Context
用户反馈现有火柴人游戏动作幅度小、视觉冲击力不足，需要：
- 更大的肢体动作范围
- 明显的攻击动作轨迹
- 强烈的打击反馈效果
- 夸张的受伤反应

## Functional Requirements
- **FR-1**: 火柴人角色具有大尺度肢体动画（手臂、腿部摆动幅度≥45°）
- **FR-2**: 攻击动作具有明显的视觉轨迹和残影效果
- **FR-3**: 受击时角色有夸张的击退和身体变形效果
- **FR-4**: 支持WASD/方向键控制，响应灵敏
- **FR-5**: 三种游戏模式（人机、双人、AI）
- **FR-6**: 血量和能量系统

## Non-Functional Requirements
- **NFR-1**: 游戏帧率≥60fps
- **NFR-2**: 动作响应延迟<100ms
- **NFR-3**: 视觉效果具有冲击力，不卡通化

## Constraints
- **Technical**: React + TypeScript + Canvas API
- **Business**: 单页面应用，无需后端
- **Dependencies**: Vite、TailwindCSS

## Assumptions
- 用户使用键盘进行操作
- 用户具备基本的格斗游戏操作经验

## Acceptance Criteria

### AC-1: 大尺度攻击动作
- **Given**: 玩家控制火柴人角色
- **When**: 按下攻击键
- **Then**: 手臂摆动幅度≥60°，带有明显的攻击轨迹和残影
- **Verification**: `human-judgment`
- **Notes**: 攻击动作应具有视觉冲击力

### AC-2: 夸张受击效果
- **Given**: 角色受到攻击
- **When**: 攻击命中
- **Then**: 角色被击退≥50px，身体出现拉伸变形，屏幕轻微震动
- **Verification**: `human-judgment`
- **Notes**: 受击反馈应明显可见

### AC-3: 流畅的移动动画
- **Given**: 玩家按住移动键
- **When**: 角色移动
- **Then**: 腿部呈现快速交替摆动动画，身体有轻微上下起伏
- **Verification**: `human-judgment`
- **Notes**: 移动时应有明显的动作感

### AC-4: 三种游戏模式
- **Given**: 游戏处于首页
- **When**: 选择游戏模式
- **Then**: 对应模式正常启动，玩家可进行战斗
- **Verification**: `programmatic`

### AC-5: 游戏结束判定
- **Given**: 战斗进行中
- **When**: 一方血量归零或时间结束
- **Then**: 正确判定胜负，显示结算界面
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要添加武器系统？
- [ ] 是否需要技能系统？

---

**文档已创建**，接下来将生成实现计划和验证清单。