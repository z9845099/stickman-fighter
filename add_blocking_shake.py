# 修改防御时的站姿，添加轻微晃动效果

# 读取文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换防御状态的代码
old_blocking = '''    } else if (this.state.state === 'blocking') {
      // 防御时的踢腿 - 稳固站姿
      leftLegAngle = 0.5;
      rightLegAngle = -0.5;
    }'''

new_blocking = '''    } else if (this.state.state === 'blocking') {
      // 防御时的站姿 - 稳固但带轻微晃动
      const blockPhase = now / 200;
      leftLegAngle = 0.5 + Math.sin(blockPhase) * 0.08;
      rightLegAngle = -0.5 - Math.sin(blockPhase) * 0.08;
    }'''

content = content.replace(old_blocking, new_blocking)

# 写回文件
with open('d:/CODE/python/huochairen/src/game/Player.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ 防御时的站姿已添加轻微晃动效果！")
print("✓ 火柴人现在在防御时会轻微摇摆，更有生气")
