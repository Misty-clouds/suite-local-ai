# Figma Skill Quick Reference

## 🚀 Quick Commands

### Implement Design
```
Implement this Figma design:
https://figma.com/design/FILE_KEY/FileName?node-id=1-2
```

### Code Connect
```
Connect this Figma component to code:
https://figma.com/design/FILE_KEY/FileName?node-id=1-2
Code location: lib/widgets/button.dart
Component name: CustomButton
```

### Get Variables
```
Get design tokens from:
https://figma.com/design/FILE_KEY/FileName?node-id=0-1
```

### Search Components
```
Search for "button" components in Figma file: FILE_KEY
```

### Generate Rules
```
Create design system rules for this Flutter project
```

## 📋 URL Format

```
https://figma.com/design/:fileKey/:fileName?node-id=1-2
                         ^^^^^^^^              ^^^
                         fileKey              nodeId (1:2)
```

**Extract:**
- fileKey: `ABC123`
- nodeId: `1:2` (convert hyphen to colon)

## 🛠️ Core Tools

| Tool | Use Case | Key Parameters |
|------|----------|----------------|
| `get_design_context` | **PRIMARY** - Get design + code + screenshot | `nodeId`, `fileKey` |
| `get_screenshot` | High-quality screenshots | `nodeId`, `fileKey`, `maxDimension` |
| `get_variable_defs` | Design tokens (colors, spacing) | `nodeId`, `fileKey` |
| `get_code_connect_suggestions` | AI-suggested mappings | `nodeId`, `fileKey` |
| `create_design_system_rules` | Generate project rules | `clientLanguages`, `clientFrameworks` |
| `search_design_system` | Find components/variables | `query`, `fileKey` |

## 🎯 Common Workflows

### 1. Implement Button from Figma
```
1. Provide Figma URL
2. Claude fetches design context
3. Downloads screenshot + assets
4. Implements Flutter/React component
5. Validates against screenshot
```

### 2. Connect Component
```
1. Provide Figma URL + code location
2. Claude gets suggestions
3. Creates Code Connect mapping
4. Verifies in Figma Dev Mode
```

### 3. Extract Design Tokens
```
1. Provide Figma URL (root node)
2. Claude gets variable definitions
3. Formats for your project
4. Suggests integration approach
```

## 🔧 Framework-Specific

### Flutter
```dart
// Example implementation
class FigmaButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Theme.of(context).colorScheme.primary,
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
      child: Text(label),
    );
  }
}
```

### React/Next.js
```typescript
// Example implementation
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const FigmaButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick} className="figma-button">
      {label}
    </button>
  );
};
```

## 🎨 Design Token Mapping

### Figma → Flutter
```
Figma Variable          Flutter Theme
--------------          -------------
color/primary       →   colorScheme.primary
color/secondary     →   colorScheme.secondary
spacing/md          →   spacing.md (custom)
typography/heading  →   textTheme.headlineMedium
```

### Figma → CSS
```
Figma Variable          CSS Variable
--------------          ------------
color/primary       →   --color-primary
spacing/md          →   --spacing-md
typography/heading  →   --font-heading
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Design truncated | Use `get_metadata` first, then fetch nodes individually |
| Assets not loading | Check permissions, verify URLs, use curl to test |
| No Code Connect | Ensure component is published, need Org/Enterprise plan |
| Poor screenshot | Increase `maxDimension` (default: 1024, max: 65536) |
| Token mismatch | Prefer project tokens, adjust spacing for visual fidelity |

## ✅ Best Practices

**DO:**
- ✅ Fetch design context first
- ✅ Download screenshots for reference
- ✅ Match project conventions
- ✅ Use design tokens
- ✅ Validate against screenshots
- ✅ Document mappings

**DON'T:**
- ❌ Hardcode colors/spacing
- ❌ Skip accessibility
- ❌ Create new icon libraries
- ❌ Ignore existing patterns
- ❌ Skip visual validation

## 📦 Asset Download

```bash
# Screenshots
curl -s -o /tmp/figma_design.png "SCREENSHOT_URL"

# Assets
curl -s -o assets/images/icon.png "ASSET_URL"
```

## 🔐 Permissions Required

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_figma_figma__get_design_context",
      "mcp__plugin_figma_figma__get_screenshot",
      "mcp__plugin_figma_figma__get_variable_defs",
      "mcp__plugin_figma_figma__get_code_connect_suggestions",
      "mcp__plugin_figma_figma__create_design_system_rules",
      "Bash(curl -s -o /tmp/figma_*.png \"https://www.figma.com/api/mcp/asset/*\")",
      "Bash(curl -s -o */assets/* \"https://www.figma.com/api/mcp/asset/*\")"
    ]
  }
}
```

## 🎓 Example Prompts

### Basic Implementation
```
Implement this Figma button as a Flutter widget:
https://figma.com/design/ABC123/MyFile?node-id=42-15
```

### With Context
```
Implement this Figma card component:
https://figma.com/design/ABC123/MyFile?node-id=10-20

Requirements:
- Use our existing theme system
- Follow Material Design 3 guidelines
- Include proper accessibility labels
- Match our component naming conventions
```

### Batch Processing
```
Implement these Figma components:
1. Button: https://figma.com/design/ABC/File?node-id=1-2
2. Card: https://figma.com/design/ABC/File?node-id=3-4
3. Input: https://figma.com/design/ABC/File?node-id=5-6

Create them in lib/widgets/ following our patterns.
```

### Design System Setup
```
1. Get all design tokens from: https://figma.com/design/ABC/File?node-id=0-1
2. Create a Flutter theme file with these tokens
3. Generate design system rules for the project
4. Document the token mapping in README.md
```

### Code Connect Workflow
```
1. Get Code Connect suggestions for: https://figma.com/design/ABC/File?node-id=1-2
2. Review the suggestions
3. Map to lib/widgets/custom_button.dart (CustomButton)
4. Verify the mapping works in Figma Dev Mode
```

## 📚 Files Created

- `.claude/figma-skill.md` - Main skill documentation
- `.claude/FIGMA_SETUP.md` - Setup guide
- `.claude/FIGMA_QUICK_REFERENCE.md` - This file
- `.claude/settings.json` - Permissions configuration

## 🔗 Resources

- [Full Skill Documentation](.claude/figma-skill.md)
- [Setup Guide](.claude/FIGMA_SETUP.md)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Code Connect Docs](https://www.figma.com/developers/code-connect)

---

**Version:** 1.0.0 | **Updated:** May 13, 2026
