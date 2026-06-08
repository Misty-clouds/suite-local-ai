# Figma Skill Setup Guide for Claude Code

This guide will help you set up the Figma skill for Claude Code, providing similar capabilities to Kiro's Figma Power.

## What This Skill Provides

✅ **Implement Figma Designs** - Convert Figma designs to production-ready code  
✅ **Code Connect Integration** - Link Figma components to code implementations  
✅ **Design System Rules** - Generate project-specific design guidelines  
✅ **Fast Context Access** - Quick access to design tokens, variables, and metadata  
✅ **Asset Management** - Automatic download and integration of design assets  

## Prerequisites

1. **Figma Account** - You need a Figma account with access to the files you want to work with
2. **Figma MCP Server** - The Figma Model Context Protocol server must be installed
3. **Claude Code** - This skill is designed for Claude Code (Anthropic's IDE integration)

## Installation Steps

### Step 1: Install Figma MCP Server

The Figma MCP server is typically installed via npm or as a standalone package. Check with your Figma MCP server documentation for specific installation instructions.

For most setups, you'll need to configure the MCP server in your Claude Code settings.

### Step 2: Configure MCP Server (If Needed)

If Claude Code requires MCP server configuration, create or update the MCP configuration file. The location varies by setup:

**Option A: Project-level configuration**
Create/update: `.claude/mcp.json`

**Option B: User-level configuration**
Create/update: `~/.claude/mcp.json`

Example configuration:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-token-here"
      }
    }
  }
}
```

**Getting a Figma Access Token:**
1. Go to Figma → Settings → Account
2. Scroll to "Personal access tokens"
3. Click "Generate new token"
4. Copy the token and add it to your MCP configuration

### Step 3: Verify Installation

The skill files have been created in your `.claude` directory:

- ✅ `.claude/figma-skill.md` - Main skill documentation
- ✅ `.claude/settings.json` - Updated with Figma permissions
- ✅ `.claude/FIGMA_SETUP.md` - This setup guide

### Step 4: Test the Integration

Try these commands with Claude Code to verify everything works:

**Test 1: Check Figma Authentication**
```
Can you call the Figma whoami tool to verify authentication?
```

**Test 2: Get Design Context**
```
Get the design context for this Figma component:
https://figma.com/design/YOUR_FILE_KEY/YourFile?node-id=1-2
```

**Test 3: Search Design System**
```
Search for "button" components in the Figma file: YOUR_FILE_KEY
```

## Usage Examples

### Example 1: Implement a Figma Design

```
Implement this Figma button as a Flutter widget:
https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15

Use the project's existing theme system and follow our component patterns.
```

Claude Code will:
1. Extract the fileKey and nodeId from the URL
2. Fetch design context (layout, colors, typography, spacing)
3. Download the screenshot for visual reference
4. Download any assets (icons, images)
5. Adapt the reference code to your Flutter project
6. Create the widget file with proper imports and styling
7. Validate against the screenshot

### Example 2: Code Connect a Component

```
Connect this Figma button to my existing Flutter widget:
https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15

The code component is at: lib/widgets/custom_button.dart
Component name: CustomButton
```

Claude Code will:
1. Get Code Connect suggestions from Figma
2. Scan your codebase for the component
3. Create the Code Connect mapping
4. Verify the mapping in Figma Dev Mode

### Example 3: Generate Design System Rules

```
Create design system rules for this project based on our Flutter codebase.
```

Claude Code will:
1. Analyze your codebase structure
2. Identify component patterns and conventions
3. Generate specific, actionable rules
4. Save rules to your project documentation

### Example 4: Get Design Variables

```
Get all color and spacing variables from this Figma file:
https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=0-1
```

Claude Code will:
1. Fetch variable definitions
2. Format them for your project (e.g., Flutter theme, CSS variables)
3. Suggest how to integrate them into your codebase

## Available Workflows

### 🎨 Design Implementation Workflow
1. User provides Figma URL
2. Claude fetches design context + screenshot
3. Downloads assets
4. Adapts reference code to project conventions
5. Implements component
6. Validates against screenshot

### 🔗 Code Connect Workflow
1. User provides Figma URL + code component location
2. Claude gets Code Connect suggestions
3. Scans codebase for matching components
4. Presents mapping options
5. Creates Code Connect mappings
6. Verifies in Figma Dev Mode

### 📋 Design System Rules Workflow
1. User requests design system rules
2. Claude analyzes codebase patterns
3. Generates project-specific rules
4. Saves to documentation
5. Validates with sample implementation

## Figma Tools Reference

### Core Tools
- `get_design_context` - Primary tool for design-to-code (includes screenshot, code, metadata)
- `get_screenshot` - Get high-quality screenshots of Figma nodes
- `get_metadata` - Get structural overview (XML format)
- `get_variable_defs` - Get design tokens (colors, spacing, typography)

### Code Connect Tools
- `get_code_connect_suggestions` - AI-suggested component mappings
- `send_code_connect_mappings` - Save multiple mappings at once
- `get_code_connect_map` - Get existing mappings
- `add_code_connect_map` - Create individual mapping

### Design System Tools
- `create_design_system_rules` - Generate project-specific rules
- `search_design_system` - Search for components, variables, styles
- `get_libraries` - Get available design libraries

### Advanced Tools
- `use_figma` - Run JavaScript via Figma Plugin API
- `create_new_file` - Create new Figma files
- `upload_assets` - Upload images to Figma
- `generate_figma_design` - Capture web pages to Figma
- `generate_diagram` - Create FigJam diagrams from Mermaid

## Permissions Explained

The `.claude/settings.json` file includes these permissions:

```json
{
  "permissions": {
    "allow": [
      // Core Figma tools
      "mcp__plugin_figma_figma__get_design_context",
      "mcp__plugin_figma_figma__get_screenshot",
      "mcp__plugin_figma_figma__get_metadata",
      "mcp__plugin_figma_figma__get_variable_defs",
      
      // Code Connect tools
      "mcp__plugin_figma_figma__get_code_connect_suggestions",
      "mcp__plugin_figma_figma__send_code_connect_mappings",
      
      // Design system tools
      "mcp__plugin_figma_figma__create_design_system_rules",
      "mcp__plugin_figma_figma__search_design_system",
      
      // Asset download permissions
      "Bash(curl -s -o /tmp/figma_*.png \"https://www.figma.com/api/mcp/asset/*\")",
      "Bash(curl -s -o */assets/* \"https://www.figma.com/api/mcp/asset/*\")"
    ]
  }
}
```

These permissions allow Claude Code to:
- Call Figma MCP tools
- Download screenshots and assets
- Save files to your project

## Troubleshooting

### Issue: "Figma MCP server not found"

**Solution:**
1. Verify the Figma MCP server is installed
2. Check your MCP configuration file
3. Restart Claude Code
4. Try calling `whoami` tool to test connection

### Issue: "Permission denied" when calling Figma tools

**Solution:**
1. Check `.claude/settings.json` includes Figma permissions
2. Verify your Figma access token is valid
3. Ensure you have access to the Figma file

### Issue: "Cannot download assets"

**Solution:**
1. Check bash permissions in `.claude/settings.json`
2. Verify asset URLs are accessible
3. Check network connectivity
4. Try downloading manually with curl to test

### Issue: "Design context is truncated"

**Solution:**
The design is too complex for a single response.
1. Use `get_metadata` to see the structure
2. Fetch specific nodes individually
3. Break down the implementation into smaller components

### Issue: "Code Connect not working"

**Solution:**
1. Verify component is published in Figma
2. Check you have Organization/Enterprise plan (required for Code Connect)
3. Ensure component is in a team library
4. Try getting suggestions first before creating mappings

### Issue: "Screenshot quality is poor"

**Solution:**
Increase the `maxDimension` parameter:
```
Get a high-resolution screenshot with maxDimension: 4096
```

## Best Practices

### ✅ DO:
- Always fetch design context before implementing
- Download screenshots for visual reference
- Match existing project conventions
- Use design tokens from your project
- Validate implementations against screenshots
- Document Code Connect mappings
- Keep design system rules specific and actionable

### ❌ DON'T:
- Don't hardcode colors/spacing (use design tokens)
- Don't skip accessibility considerations
- Don't create new icon libraries (use Figma assets)
- Don't ignore existing component patterns
- Don't implement without visual validation
- Don't create Code Connect mappings for unpublished components

## Advanced Usage

### Custom Design System Integration

Create a project-specific design system file:

`.claude/design-system.md`:
```markdown
# Project Design System

## Color Tokens
- Primary: #2563EB (from Figma variable: color/primary)
- Secondary: #7C3AED (from Figma variable: color/secondary)

## Spacing Scale
- xs: 4px (from Figma variable: spacing/xs)
- sm: 8px (from Figma variable: spacing/sm)
- md: 16px (from Figma variable: spacing/md)

## Typography
- Heading: Inter Semi Bold 24px
- Body: Inter Regular 16px

## Component Patterns
- All buttons use ElevatedButton with theme colors
- All cards use Card widget with 8px border radius
- All spacing uses theme spacing tokens
```

Then reference it in your prompts:
```
Implement this Figma component following our design system rules in .claude/design-system.md
```

### Batch Processing

Process multiple components at once:
```
Implement these Figma components as Flutter widgets:
1. https://figma.com/design/ABC/File?node-id=1-2 (Button)
2. https://figma.com/design/ABC/File?node-id=3-4 (Card)
3. https://figma.com/design/ABC/File?node-id=5-6 (Input)

Create them in lib/widgets/ following our component patterns.
```

### Automated Asset Management

Set up automatic asset downloads:
```
For all Figma designs I implement, automatically:
1. Download screenshots to /tmp/figma_screenshots/
2. Download assets to assets/images/figma/
3. Update asset references in pubspec.yaml
4. Generate asset constants in lib/constants/assets.dart
```

## Integration with CI/CD

You can integrate Figma checks into your CI/CD pipeline:

```yaml
# .github/workflows/figma-sync.yml
name: Figma Sync Check

on:
  pull_request:
    paths:
      - 'lib/widgets/**'
      - 'lib/screens/**'

jobs:
  check-figma-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Code Connect mappings
        run: |
          # Add script to verify Code Connect mappings are up to date
          echo "Checking Figma Code Connect mappings..."
```

## Resources

- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/)
- [Code Connect Documentation](https://www.figma.com/developers/code-connect)
- [Figma Variables Guide](https://help.figma.com/hc/en-us/articles/15339657135383)
- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/15023124644247)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)

## Support

If you encounter issues:

1. Check this setup guide
2. Review the main skill file: `.claude/figma-skill.md`
3. Verify permissions in `.claude/settings.json`
4. Test with simple commands first
5. Check Figma MCP server logs

## Updates

This skill is designed to match Kiro's Figma Power capabilities. As new features are added to the Figma MCP server, update the skill documentation accordingly.

**Current Version:** 1.0.0  
**Last Updated:** May 13, 2026  
**Compatible with:** Claude Code, Figma MCP Server

---

**Quick Start Checklist:**

- [ ] Figma MCP server installed
- [ ] Figma access token configured
- [ ] `.claude/figma-skill.md` created
- [ ] `.claude/settings.json` updated with permissions
- [ ] Tested with `whoami` tool
- [ ] Tested with sample Figma URL
- [ ] Ready to implement designs! 🎉
