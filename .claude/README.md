# Claude Code Configuration

This directory contains custom skills and configurations for Claude Code.

## 📁 Files

### Core Configuration
- **`settings.json`** - Main configuration file with permissions and custom instructions
- **`settings.local.json`** - Local overrides (gitignored)

### Figma Skill
- **`figma-skill.md`** - Complete Figma integration skill (similar to Kiro's Figma Power)
- **`FIGMA_SETUP.md`** - Detailed setup guide for Figma integration
- **`FIGMA_QUICK_REFERENCE.md`** - Quick reference card for common Figma commands

## 🚀 Quick Start

### Using the Figma Skill

The Figma skill is automatically loaded via `settings.json`. To use it:

```
Implement this Figma design:
https://figma.com/design/YOUR_FILE_KEY/YourFile?node-id=1-2
```

Claude Code will:
1. Extract the design context from Figma
2. Download screenshots and assets
3. Implement the component following your project conventions
4. Validate against the visual design

### Available Workflows

1. **Implement Design** - Convert Figma designs to code
2. **Code Connect** - Link Figma components to code implementations
3. **Design System Rules** - Generate project-specific guidelines
4. **Extract Design Tokens** - Get colors, spacing, typography from Figma
5. **Search Components** - Find design system components

## 📖 Documentation

- **New to Figma integration?** → Start with [`FIGMA_SETUP.md`](FIGMA_SETUP.md)
- **Need quick commands?** → Check [`FIGMA_QUICK_REFERENCE.md`](FIGMA_QUICK_REFERENCE.md)
- **Want full details?** → Read [`figma-skill.md`](figma-skill.md)

## 🔧 Configuration

### Permissions

The `settings.json` file includes permissions for:
- All Figma MCP tools (design context, screenshots, variables, Code Connect)
- Asset downloads (curl commands for Figma assets)
- Python scripts (for image processing)

### Custom Instructions

The Figma skill is loaded automatically via:
```json
{
  "customInstructions": [
    {
      "type": "file",
      "path": ".claude/figma-skill.md",
      "description": "Figma integration skill"
    }
  ]
}
```

## 🎯 Example Use Cases

### 1. Implement a Button from Figma
```
Implement this Figma button as a Flutter widget:
https://figma.com/design/ABC123/DesignSystem?node-id=42-15

Use our existing theme and follow Material Design 3.
```

### 2. Connect Component to Code
```
Connect this Figma component to my code:
https://figma.com/design/ABC123/DesignSystem?node-id=42-15

Code location: lib/widgets/custom_button.dart
Component name: CustomButton
```

### 3. Extract Design Tokens
```
Get all design tokens (colors, spacing, typography) from:
https://figma.com/design/ABC123/DesignSystem?node-id=0-1

Format them for Flutter theme system.
```

### 4. Generate Design System Rules
```
Create design system rules for this Flutter project based on our codebase patterns.
```

## 🛠️ Troubleshooting

### Figma MCP Server Not Found
1. Verify Figma MCP server is installed
2. Check MCP configuration (`.claude/mcp.json` or `~/.claude/mcp.json`)
3. Restart Claude Code

### Permission Denied
1. Check `settings.json` includes Figma permissions
2. Verify Figma access token is valid
3. Ensure you have access to the Figma file

### Assets Not Downloading
1. Check bash permissions in `settings.json`
2. Verify network connectivity
3. Test with manual curl command

See [`FIGMA_SETUP.md`](FIGMA_SETUP.md) for more troubleshooting tips.

## 📦 Project Structure

```
.claude/
├── README.md                      # This file
├── settings.json                  # Main configuration
├── settings.local.json            # Local overrides
├── figma-skill.md                 # Figma skill documentation
├── FIGMA_SETUP.md                 # Setup guide
└── FIGMA_QUICK_REFERENCE.md       # Quick reference
```

## 🔄 Updates

To update the Figma skill:
1. Edit `figma-skill.md` with new capabilities
2. Update permissions in `settings.json` if needed
3. Restart Claude Code to reload configuration

## 🤝 Contributing

To add new skills or configurations:
1. Create a new `.md` file in `.claude/`
2. Add it to `customInstructions` in `settings.json`
3. Add necessary permissions
4. Document in this README

## 📚 Resources

- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Code Connect Documentation](https://www.figma.com/developers/code-connect)
- [Figma Variables Guide](https://help.figma.com/hc/en-us/articles/15339657135383)
- [MCP Protocol](https://modelcontextprotocol.io/)

---

**Last Updated:** May 13, 2026  
**Version:** 1.0.0
